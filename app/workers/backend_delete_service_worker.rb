# frozen_string_literal: true

class BackendDeleteServiceWorker
  include Sidekiq::Worker

  def self.enqueue(event)
    perform_async(event.event_id)
  end

  def perform(event_id)
    event = EventStore::Repository.find_event!(event_id)
    ThreeScale::Core::Service.delete_stats(event.service_id, {})
    service = Service.new({id: event.service_id}, without_protection: true)
    service.delete_backend_service
  rescue ActiveRecord::RecordNotFound => exception
    System::ErrorReporting.report_error(exception, parameters: {event_id: event_id})
  end
end
