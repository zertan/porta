module Api::IntegrationsHelper

  class CurlCommandBuilder
    def initialize(proxy)
      @proxy = proxy
    end

    attr_reader :proxy

    def command
      credentials = proxy.authentication_params_for_proxy
      extheaders = ''

      uri = URI(base_endpoint)
      uri.path = path

      case proxy.credentials_location
      when 'headers'
        credentials.each { |k, v| extheaders += " -H'#{k}: #{v}'" }
      when 'query'
        uri.query = credentials.to_query
      when 'authorization'
        uri.user, uri.password = proxy.authorization_credentials
      end

      "curl \"#{uri.to_s}\" #{extheaders}"
    end

    def base_endpoint
      raise NoMethodError, __method__
    end

    def path
      apiap? ? proxy.service.backend_api_configs.first.path : proxy.api_test_path
    end

    def apiap?
      proxy.provider_can_use?(:api_as_product)
    end

    class Staging < self
      def base_endpoint
        proxy.sandbox_endpoint
      end
    end

    class Production < self
      def base_endpoint
        proxy.default_production_endpoint
      end
    end

    # It quacks like a Proxy but it's actually a json proxy config
    class ProxyFromConfig
      def initialize(config)
        @config = config
      end

      attr_reader :config

      delegate :sandbox_endpoint, :credentials_location, :api_test_path, to: :proxy

      def default_production_endpoint
        proxy.endpoint
      end

      def authentication_params_for_proxy(opts = {})
        params = service.plugin_authentication_params
        keys_to_proxy_args = { app_key: :auth_app_key, app_id: :auth_app_id, user_key: :auth_user_key }
        params.keys.map do |key|
          param_name = opts[:original_names] ? key.to_s : proxy.send(keys_to_proxy_args[key])
          [param_name, params[key]]
        end.to_h
      end

      def authorization_credentials
        params = authentication_params_for_proxy.symbolize_keys
        params.values_at(:user_key).compact.presence || params.values_at(:app_id, :app_key)
      end

      class ServiceFromConfig < Service
        attr_writer :backend_api_configs

        def backend_api_configs
          @backend_api_configs || [Struct.new(:path).new('/')]
        end
      end

      def service
        @service ||= begin
          object = ServiceFromConfig.find(proxy.service_id)

          routing_policy = proxy.policy_chain.find { |policy| policy[:name] == 'routing' }.try(:dig, :configuration, :rules).try(:first)
          if routing_policy.present?
            path_pattern = (routing_policy.dig(:condition, :operations) || []).first.try(:dig, :value)
            object.backend_api_configs = [Struct.new(:path).new(path_pattern.split('.*').first)] if path_pattern
          end

          object
        end
      end

      delegate :provider_can_use?, to: 'service.account'

      protected

      def proxy
        @proxy ||= ActiveSupport::OrderedOptions.new.merge(config[:proxy])
      end
    end
  end

  def api_test_curl(proxy, production = false)
    command = test_curl_command(proxy, enviroment: production ? :production : :staging)
    credentials = proxy.authentication_params_for_proxy(original_names: true)
    tag_id = production ? 'api-production-curl' : 'api-test-curl'
    content_tag :code, id: tag_id, 'data-credentials' => credentials.to_json do
      command
    end
  end

  def test_curl_command(proxy, enviroment: :staging)
    builder = case enviroment
              when :staging, :sandbox
                CurlCommandBuilder::Staging
              when
                CurlCommandBuilder::Production
              end.new(proxy)
    builder.command
  end

  def config_based_test_curl_command(proxy, enviroment: :staging)
    proxy_configs = proxy.proxy_configs.by_environment(enviroment.to_s).current_versions.to_a
    return if proxy_configs.empty?
    proxy_from_config = CurlCommandBuilder::ProxyFromConfig.new(proxy_configs.first.send(:parsed_content))
    test_curl_command(proxy_from_config, enviroment: :staging)
  end

  def is_https?(url)
    begin
      uri = URI.parse(url)
      uri.is_a? URI::HTTPS
    rescue URI::InvalidURIError
      false
    end
  end

  def api_backend_hint(api_backend)
    scheme = is_https?(api_backend) ? 'https' : 'http'
    t("formtastic.hints.proxy.api_backend_#{scheme}")
  end

  def different_from_current?
    true #TODO: implement method
  end

  def currently_deploying?(proxy)
    @deploying
  end

  def deployed?(proxy)
    @ever_deployed_hosted
  end

  def apicast_configuration_driven?
    # this should be driven by a boolean attribute on the service
    @service.proxy.apicast_configuration_driven
  end

  def can_toggle_apicast_version?
    current_account.provider_can_use?(:apicast_v2) && current_account.provider_can_use?(:apicast_v1)
  end

  def apicast_custom_urls?
    # should always return true on prem (deployment option 'hosted') and only return true when self managed in saas (deployment option 'self_managed')
    # so the idea would be to keep this rolling update disabled for saas
    Rails.application.config.three_scale.apicast_custom_url || @service.proxy.self_managed?
  end

  def custom_backend?
    # this should probably be its own config
    Rails.configuration.three_scale.active_docs_proxy_disabled
  end

  def apicast_endpoint_input_hint(service, environment:)
    openshift = Rails.application.config.three_scale.apicast_custom_url && service.proxy.hosted?
    t( "formtastic.hints.proxy.endpoint_apicast_2#{'_openshift' if openshift}_html", environment_name: environment)
  end

  def deployment_option_is_service_mesh?(service)
    service.deployment_option =~ /^service_mesh/
  end

  def edit_deployment_option_title(service)
    title = deployment_option_is_service_mesh?(service) ? 'Service Mesh' : 'APIcast'
    t(:edit_deployment_configuration, scope: :api_integrations_controller, deployment: title )
  end

  def promote_to_staging_button_options(proxy)
    return disabled_promote_button_options if proxy.any_sandbox_configs? && !proxy.pending_affecting_changes?

    label = deployment_option_is_service_mesh?(proxy.service) ? 'Update Configuration' : "Promote v. #{proxy.next_sandbox_config_version} to Staging"
    promote_button_options(label)
  end

  def promote_to_production_button_options(proxy)
    return disabled_promote_button_options if proxy.environments_have_same_config?

    label = "Promote v. #{proxy.next_production_config_version} to Production"
    promote_button_options(label)
  end

  PROMOTE_BUTTON_COMMON_OPTIONS = { button_html: { class: 'PromoteButton', data: { disable_with: 'promoting…' } } }.freeze

  def promote_button_options(label = 'Promote')
    options = PROMOTE_BUTTON_COMMON_OPTIONS.deep_merge(button_html: { class: 'PromoteButton important-button' })
    [label, options]
  end

  def disabled_promote_button_options
    options = PROMOTE_BUTTON_COMMON_OPTIONS.deep_merge(button_html: { class: 'PromoteButton disabled-button', disabled: true })
    ['Nothing to promote', options]
  end

  def backend_routing_rule(backend_api_config)
    path = StringUtils::StripSlash.strip_slash(backend_api_config.path.presence)
    code = content_tag :code do
      "/#{path} => "
    end
    endpoint = backend_api_config.backend_api.private_endpoint
    code + endpoint
  end
end
