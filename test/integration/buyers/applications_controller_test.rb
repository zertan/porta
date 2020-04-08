require 'test_helper'

class Buyers::ApplicationsTest < ActionDispatch::IntegrationTest
  class MasterLoggedInTest < Buyers::ApplicationsTest
    setup do
      login! master_account
      FactoryBot.create(:cinstance, service: master_account.default_service)
    end

    attr_reader :service

    test 'index retrieves all master\'s provided cinstances except those whose buyer is master' do
      get admin_buyers_applications_path

      assert_response :ok
      expected_cinstances_ids = master_account.provided_cinstances.not_bought_by(master_account).pluck(:id)
      assert_same_elements expected_cinstances_ids, assigns(:cinstances).map(&:id)
    end
  end

  class ProviderLoggedInTest < Buyers::ApplicationsTest
    def setup
      @provider = FactoryBot.create(:provider_account)

      host! @provider.admin_domain
      provider_login_with @provider.admins.first.username, "supersecret"

      #TODO: dry with @ignore-backend tag on cucumber
      stub_backend_get_keys
      stub_backend_referrer_filters
      stub_backend_utilization
    end

    attr_reader :provider

    test 'index shows the services column when the provider is multiservice' do
      provider.services.create!(name: '2nd-service')
      assert provider.reload.multiservice?
      get admin_buyers_applications_path
      page = Nokogiri::HTML::Document.parse(response.body)
      assert page.xpath("//tr").text.match /Service/
    end

    test 'index does not show the services column when the provider is not multiservice' do
      refute provider.reload.multiservice?
      get admin_buyers_applications_path
      page = Nokogiri::HTML::Document.parse(response.body)
      refute page.xpath("//tr").text.match /Service/
    end

    test 'member cannot create an application when lacking access to a service' do
      forbidden_service = FactoryBot.create(:service, account: provider)
      forbidden_plan = FactoryBot.create(:application_plan, issuer: forbidden_service)
      forbidden_service_plan = FactoryBot.create(:service_plan, issuer: forbidden_service)

      authorized_service = FactoryBot.create(:service, account: provider)
      authorized_plan = FactoryBot.create(:application_plan, issuer: authorized_service)
      authorized_service_plan = FactoryBot.create(:service_plan, issuer: authorized_service)

      buyer = FactoryBot.create(:buyer_account, provider_account: provider)

      member = FactoryBot.create(:member, account: provider,
                                          member_permission_ids: [:partners])
      member.activate!
      FactoryBot.create(:member_permission, user: member,
                                            admin_section: :services,
                                            service_ids: [authorized_service.id])

      login_provider provider, user: member

      post admin_buyers_account_applications_path(account_id: buyer.id), cinstance: {
        plan_id: forbidden_plan.id,
        name: 'Not Allowed!',
        service_plan_id: forbidden_service_plan.id
      }

      assert_response :not_found

      post admin_buyers_account_applications_path(account_id: buyer.id), cinstance: {
        plan_id: authorized_plan.id,
        name: 'Allowed',
        service_plan_id: authorized_service_plan.id
      }

      assert_response :found
    end
  end
end
