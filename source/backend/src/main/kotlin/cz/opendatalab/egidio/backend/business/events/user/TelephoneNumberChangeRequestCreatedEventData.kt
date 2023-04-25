package cz.opendatalab.egidio.backend.business.events.user

/**
 * Event dispatched when a user asked for telephone number change
 */
class TelephoneNumberChangeRequestCreatedEventData(
    val email : String,
    val rawConfirmationToken : String
)
