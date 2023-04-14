package cz.opendatalab.egidio.backend.business.events.advertisement

/**
 * Event dispatched when advertisement was created, but not necessarily published yet
 */
class AdvertisementCreatedEvent(val data : AdvertisementCreatedEventData)