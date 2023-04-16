package cz.opendatalab.egidio.backend.business.events.user

import cz.opendatalab.egidio.backend.business.entities.user.User

data class PublishedContactDetailSettingsChangedEventData(val email : String) {
    companion object {
        fun of(user : User) = PublishedContactDetailSettingsChangedEventData(user.email)
    }
}
