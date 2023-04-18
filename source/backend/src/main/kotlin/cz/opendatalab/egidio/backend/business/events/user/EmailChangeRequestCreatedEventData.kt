package cz.opendatalab.egidio.backend.business.events.user

/**
 * Event dispatched when a user has registered
 */
class EmailChangeRequestCreatedEventData(
    val currentEmail: String,
    val newEmail: String,
    val rawCurrentEmailConfirmationToken: String,
    val rawNewEmailConfirmationToken: String,
    val username: String
)
