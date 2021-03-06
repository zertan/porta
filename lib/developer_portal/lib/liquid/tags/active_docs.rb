module Liquid
  module Tags
    class ActiveDocs < Liquid::Tags::Base

      # http://rubular.com/r/pMLFK7lpjK
      Syntax = /version:\s?"([0-9]\.+.)"(?:\s?services?:\s?"([\w \-,]+.)")?/i

      # {% active_docs version: "2.0" %}                      => loads version 2.0 of swagger-ui, it defaults to first published service. spec can be 1.2 or 2.0
      # {% active_docs version: "2.0" services: "foo" %}      => loads version 2.0 of swagger-ui for specified service. spec can be 1.2 or 2.0
      # {% active_docs version: "2.0" services: "foo, bar" %} => loads version 2.0 of swagger-ui for foo service. spec can be 1.2 or 2.0
      # {% active_docs version: "1.2" %}                      => loads swagger-ui for all 1.2 and 1.1 active docs
      # {% active_docs version: "1.2" services: "foo, bar" %} => same as above but limit to listed services
      # {% active_docs version: "1.0" %}                      => same as above but limited to 1.0 active docs using active docs ui
      # {% active_docs version: "1.0" services: "foo, bar" %} => same as above but filter on services
      def initialize(tag_name, params, tokens)
        super
        if params =~ Syntax
          @version  = $1.strip
          @services = $2.nil? ? [] : $2.split(",").map(&:strip)
        end
      end

      def render context
        if @services.empty? && @version > "1.2"
          @services =
            context.registers[:controller].send(:site_account)
            .api_docs_services.published
            .select{|e| e.specification.swagger_2_0?}.map(&:system_name)
        end

        render_erb context, "shared/#{version}", {services: @services}
      end

      # version can be 1.0, 1.2 or 2.0, defaults to 2.0
      def version
        case @version
        when "1.0"
          "active_docs"
        when "1.2"
          "swagger"
        else
          "swagger_2_0"
        end
      end

    end
  end
end
