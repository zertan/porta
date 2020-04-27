# frozen_string_literal: true

require 'test_helper'

class IntegrationsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @provider = FactoryBot.create(:provider_account)

    stub_apicast_registry

    login! provider

    rolling_updates_off
  end

  attr_reader :provider

  test 'member user should have access only if it has admin_section "plans"' do
    Service.any_instance.stubs(proxiable?: false) # Stub not related with the test, just to skip a render view error

    member = FactoryBot.create(:member, account: provider)
    member.activate!
    login! provider, user: member

    get edit_admin_service_integration_path(service_id: service.id)
    assert_response 403

    member.member_permissions.create!(admin_section: 'plans')
    get edit_admin_service_integration_path(service_id: service.id)
    assert_response 200
  end

  def test_index
    get admin_service_integration_path(service_id: service.id)
    assert_response :success
    assert assigns(:show_presenter)
  end

  def test_promote_to_production_success
    ProxyDeploymentService.any_instance.expects(:deploy_production).returns(true).once
    patch promote_to_production_admin_service_integration_path(service_id: service.id)
    assert_response :redirect
    assert_not_nil flash[:notice]
    assert_nil flash[:error]
  end

  def test_promote_to_production_error
    ProxyDeploymentService.any_instance.expects(:deploy_production).returns(false).once
    patch promote_to_production_admin_service_integration_path(service_id: service.id)
    assert_response :redirect
    assert_nil flash[:notice]
    assert_not_nil flash[:error]
  end

  def test_update
    ProxyDeploymentService.any_instance.stubs(:deploy).returns(true)
    Proxy.any_instance.stubs(:send_api_test_request!).returns(true)
    proxy_rule_1 = FactoryBot.create(:proxy_rule, proxy: service.proxy, last: false)

    refute proxy_rule_1.last
    proxy_rules_attributes = {
      proxy_rules_attributes: {
        proxy_rule_1.id => { id: proxy_rule_1.id, last: true }
      }
    }
    put admin_service_integration_path(service_id: service.id), proxy: proxy_rules_attributes
    assert_response :redirect
    assert proxy_rule_1.reload.last
  end

  test 'update custom public endpoint with proxy_pro enabled' do
    Proxy.any_instance.stubs(deploy: true)
    ProxyTestService.any_instance.stubs(:disabled?).returns(true)

    service.proxy.update_column(:endpoint, 'https://endpoint.com:8443')

    Service.any_instance.expects(:using_proxy_pro?).returns(true).at_least_once
    # call update as proxy_pro updates endpoint through staging section
    put admin_service_integration_path(service_id: service.id), proxy: {endpoint: 'http://example.com:80'}
    assert_equal 'http://example.com:80', service.proxy.reload.endpoint
  end

  def test_update_proxy_rule_position
    ProxyDeploymentService.any_instance.expects(:deploy_v2).returns(true).times(3)
    Proxy.any_instance.stubs(:send_api_test_request!).returns(true)

    service.proxy.proxy_rules.destroy_all
    proxy_rule_1 = FactoryBot.create(:proxy_rule, proxy: service.proxy)
    proxy_rule_2 = FactoryBot.create(:proxy_rule, proxy: service.proxy)

    # sending both proxy rules
    assert_not_equal 1, proxy_rule_2.position
    proxy_rules_attributes = {
      proxy_rules_attributes: {
        proxy_rule_1.id => { id: proxy_rule_1.id, position: 2 },
        proxy_rule_2.id => { id: proxy_rule_2.id, position: 1 }
      }
    }
    put admin_service_integration_path(service_id: service.id), proxy: proxy_rules_attributes
    assert_response :redirect

    proxy_rule_1.reload
    proxy_rule_2.reload
    assert_equal 1, proxy_rule_2.position
    assert_equal 2, proxy_rule_1.position

    # sending just one proxy rule
    proxy_rules_attributes = {
      proxy_rules_attributes: {
        proxy_rule_1.id => { id: proxy_rule_1.id, position: 1 }
      }
    }
    put admin_service_integration_path(service_id: service.id), proxy: proxy_rules_attributes
    assert_response :redirect

    proxy_rule_1.reload
    proxy_rule_2.reload
    assert_equal 2, proxy_rule_2.position
    assert_equal 1, proxy_rule_1.position

    # creating new proxy rules
    proxy_rules_attributes = {
      proxy_rules_attributes: {
        '1550572218071' => { id: '', http_method: 'PUT', pattern: '/put1', delta: '1', metric_id: proxy_rule_1.metric_id, position: '1' },
        proxy_rule_2.id => { id: proxy_rule_2.id, position: 2 },
        '1550572218070' => { id: '', http_method: 'PUT', pattern: '/put2', delta: '1', metric_id: proxy_rule_1.metric_id, position: '3' },
        proxy_rule_1.id => { id: proxy_rule_1.id, position: 4 }
      }
    }
    put admin_service_integration_path(service_id: service.id), proxy: proxy_rules_attributes
    assert_response :redirect

    proxy_rule_1.reload
    proxy_rule_2.reload
    assert_equal 1, service.reload.proxy.proxy_rules.find_by_pattern('/put1').position
    assert_equal 2, proxy_rule_2.position
    assert_equal 3, service.reload.proxy.proxy_rules.find_by_pattern('/put2').position
    assert_equal 4, proxy_rule_1.position
  end

  test 'deploy is called when saving proxy info' do
    Proxy.any_instance.expects(:save_and_deploy).once

    put admin_service_integration_path(service_id: service.id), proxy: {api_backend: '1'}
  end

  test 'deploy is never called when saving proxy info for proxy pro users' do
    rolling_updates_on
    Account.any_instance.stubs(:provider_can_use?).with(:api_as_product).returns(false)
    Account.any_instance.stubs(:provider_can_use?).with(:proxy_pro).returns(true)

    Proxy.any_instance.expects(:save_and_deploy).never
    Proxy.any_instance.expects(:update_attributes).once
    ProxyTestService.expects(:new).never
    ProxyTestService.any_instance.expects(:perform).never
    Policies::PoliciesListService.expects(:call!)

    service.update_column(:deployment_option, 'self_managed')
    service.proxy.update_column(:apicast_configuration_driven, false)

    put admin_service_integration_path(service_id: service.id), proxy: {api_backend: '1'}
  end

  def test_edit
    get edit_admin_service_integration_path(service_id: 'no-such-service')
    assert_response :not_found

    get edit_admin_service_integration_path(service_id: service.id)
    assert_response :success
  end

  test 'update OIDC Authorization flows' do
    service = FactoryBot.create(:simple_service, account: provider)
    ProxyTestService.any_instance.stubs(disabled?: true)
    put admin_service_integration_path(service_id: service.id, proxy: {oidc_configuration_attributes: {standard_flow_enabled: false, direct_access_grants_enabled: true}})
    assert_response :redirect

    service.reload
    refute service.proxy.oidc_configuration.standard_flow_enabled
    assert service.proxy.oidc_configuration.direct_access_grants_enabled
  end

  test 'edit not found for apiap' do
    rolling_updates_on
    Account.any_instance.expects(:provider_can_use?).with(:api_as_product).returns(true)

    service = FactoryBot.create(:simple_service, account: provider)
    get edit_admin_service_integration_path(service_id: service.id)
    assert_response :not_found
  end

  def test_example_curl
    FactoryBot.create(:service_token, service: service)
    FactoryBot.create(:proxy_config, proxy: service.proxy, environment: 'sandbox')
    Api::IntegrationsShowPresenter.any_instance.expects(:apicast_config_ready?).returns(true).at_least_once
    Api::IntegrationsShowPresenter.any_instance.expects(:any_sandbox_configs?).returns(true).at_least_once

    Service.any_instance.expects(:oauth?).returns(true).at_least_once
    get admin_service_integration_path(service_id: service.id)
    assert_response :success
    assert_not_match 'Example curl for testing', response.body

    Service.any_instance.expects(:oauth?).returns(false).at_least_once
    get admin_service_integration_path(service_id: service.id)
    assert_response :success
    assert_match 'Example curl for testing', response.body
  end

  test 'update should change api bubble state to done' do
    provider.create_onboarding
    FactoryBot.create(:service_token, service: service)

    rolling_updates_on
    Account.any_instance.expects(:provider_can_use?).returns(false).at_least_once
    ProxyTestService.any_instance.stubs(:disabled?).returns(true)
    Proxy.any_instance.stubs(:deploy).returns(true)

    put admin_service_integration_path proxy: {api_backend: 'http://some-api.example.com:443'}, service_id: service.id
    assert_response :redirect

    assert_equal 'api_done', provider.reload.onboarding.bubble_api_state
  end

  test 'update production should change deployment bubble state to done' do
    skip 'TODO WIP'

    provider.create_onboarding
    FactoryBot.create(:service_token, service: service)

    rolling_updates_on
    service.proxy.update_column :api_backend, 'http://some-api.example.com'

    put :update_production, proxy: { api_backend: 'http://some-api.example.com:443'}, service_id: service.id
    assert_response :redirect

    assert_equal 'deployment_done', provider.reload.onboarding.bubble_deployment_state
  end

  test 'download nginx config' do
    skip 'TODO WIP'

    get admin_service_integration_path(service_id: service.id, format: :zip)

    assert_response :success
    assert_equal 'application/zip', response.content_type
    assert_includes response.headers, 'Content-Transfer-Encoding', 'Content-Disposition'
    assert_equal 'attachment; filename="proxy_configs.zip"', response['Content-Disposition']
    assert_equal 'binary', response['Content-Transfer-Encoding']

    Zip::InputStream.open(StringIO.new(response.body)) do |zip|
      assert zip.get_next_entry
    end

    assert_equal 'deployment_done', provider.reload.onboarding.bubble_deployment_state
  end

  private

  def service
    @service ||= provider.default_service
  end
end
