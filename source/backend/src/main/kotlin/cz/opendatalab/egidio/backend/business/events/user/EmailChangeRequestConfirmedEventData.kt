package cz.opendatalab.egidio.backend.business.events.user

/**
 * Event dispatched when a user has registered
 */
class EmailChangeRequestConfirmedEventData(
    val oldEmail: String,
    val newEmail: String,
)
