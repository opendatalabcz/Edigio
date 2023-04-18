package cz.opendatalab.egidio.backend.business.services.user.email

import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.*

interface UserEmailService {
    fun sendAnonymousUserEmailConfirmationRequestMessage(
        data: AnonymousUserEmailConfirmationRequestMessageData
    )

    fun sendUserRegisteredEmailConfirmationRequestMessage(
        data : RegisteredUserEmailConfirmationRequestMessageData
    )

    fun sendRegisteredUserEmailAddressConfirmedMessage(data : RegisteredUserContactConfirmedMessageData)

    fun sendPublishedContactDetailSettingsChanged(data: PublishedContactDetailSettingsChangedMessageData)
    fun sendSpokenLanguagesSettingsChanged(data : SpokenLanguagesChangedMessageData)
    fun sendEmailAddressChangeRequestCreatedToCurrentAddress(data : EmailAddressChangeRequestCreatedCurrentAddressMessageData)
    fun sendEmailAddressChangeRequestCreatedToNewAddress(data : EmailAddressChangeRequestCreatedNewAddressMessageData)
    fun sendEmailAddressChangeRequestConfirmedToOldAddress(data : EmailAddressChangeRequestConfirmedOldAddressMessageData)
    fun sendEmailAddressChangeRequestConfirmedToNewAddress(data : EmailAddressChangeRequestConfirmedNewAddressMessageData)
}