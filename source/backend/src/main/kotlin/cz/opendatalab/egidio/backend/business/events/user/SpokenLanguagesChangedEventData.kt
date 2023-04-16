package cz.opendatalab.egidio.backend.business.events.user

import cz.opendatalab.egidio.backend.business.entities.user.User

data class SpokenLanguagesChangedEventData(val email : String) {
    companion object {
        fun of(user : User) = SpokenLanguagesChangedEventData(user.email)
    }
}
