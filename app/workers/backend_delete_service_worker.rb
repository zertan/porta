# frozen_string_literal: true

class BackendDeleteServiceWorker
  include Sidekiq::Worker

  def self.enqueue(event)
    perform_async(event.event_id)
  end

  def perform(event_id)
    event = EventStore::Repository.find_event!(event_id)
    BackendDeleteStatsWorker.perform_async(event_id)
  rescue ActiveRecord::RecordNotFound => exception
    System::ErrorReporting.report_error(exception, parameters: {event_id: event_id})
  end
end
