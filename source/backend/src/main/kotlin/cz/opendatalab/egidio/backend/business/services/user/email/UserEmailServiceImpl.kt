package cz.opendatalab.egidio.backend.business.services.user.email

import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.*
import cz.opendatalab.egidio.backend.presentation.frontend_services.url.factory.UserFrontendUrlFactory
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import org.thymeleaf.TemplateEngine
import org.thymeleaf.context.Context
import java.util.UUID

@Service
class UserEmailServiceImpl(
    val mailSender : JavaMailSender,
    val templateEngine : TemplateEngine,
    val userFrontendUrlFactory : UserFrontendUrlFactory,
) : UserEmailService {

    private fun sendHtmlMessage(mailTo: String, subject: String, html: String) {
        val mimeMessage = mailSender.createMimeMessage()
        MimeMessageHelper(mimeMessage).apply {
            setTo(mailTo)
            setSubject(subject)
            setText(html, true)
        }
        mailSender.send(mimeMessage)
    }

    private fun createUserEmailConfirmationRequestMessage(
        template: String,
        publicId: UUID,
        rawEmailConfirmationToken: String,
    ) : String {
        return templateEngine.process(
            template,
            Context()
                .apply {
                    setVariable(
                        "emailConfirmationUrl",
                        userFrontendUrlFactory.createEmailConfirmationUrl(
                            publicId = publicId,
                            rawToken = rawEmailConfirmationToken
                        )
                    )
                })
    }


    override fun sendNonRegisteredUserEmailConfirmationRequestMessage(
        data : NonRegisteredUserEmailConfirmationRequestMessageData
    ) {
        sendHtmlMessage(
            mailTo = data.email,
            subject = "Egidio: Potvrzení emailové adresy | Email address confirmation ",
            html = createUserEmailConfirmationRequestMessage(
                template = NON_REGISTERED_USER_EMAIL_CONFIRMATION_REQUEST_MESSAGE_TEMPLATE,
                publicId = data.publicId,
                rawEmailConfirmationToken = data.rawEmailConfirmationTokenValue
            )
        )
    }

    override fun sendUserRegisteredEmailConfirmationRequestMessage(data : RegisteredUserEmailConfirmationRequestMessageData) {
        sendHtmlMessage(
            mailTo = data.email,
            subject = "Egidio: Potvrzení emailové adresy | Email address confirmation ",
            html = createUserEmailConfirmationRequestMessage(
                template = REGISTERED_USER_EMAIL_CONFIRMATION_REQUEST_MESSAGE_TEMPLATE,
                publicId = data.publicId,
                rawEmailConfirmationToken = data.rawEmailConfirmationTokenValue
            )
        )
    }

    override fun sendRegisteredUserEmailAddressConfirmedMessage(data: RegisteredUserContactConfirmedMessageData) {
        sendHtmlMessage(
            mailTo = data.email,
            subject = "Egidio: Emailová adresa potvrzena | Email address confirmed",
            html = templateEngine.process(REGISTERED_USER_EMAIL_ADDRESS_CONFIRMED, Context())
        )
    }

    override fun sendPublishedContactDetailSettingsChanged(data : PublishedContactDetailSettingsChangedMessageData) {
        sendHtmlMessage(
            mailTo = data.email,
            subject = "Egidio: Změna úrovně zveřejněných detailů | Published contact detail level changed",
            html = templateEngine.process(PUBLISHED_CONTACT_DETAIL_LEVEL_CHANGED, Context())
        )
    }

    override fun sendSpokenLanguagesSettingsChanged(data : SpokenLanguagesChangedMessageData) {
        sendHtmlMessage(
            mailTo = data.email,
            subject = "Egidio: Změna jazyků ovládaných uživatelem | Languages known by user changed",
            html = templateEngine.process(SPOKEN_LANGUAGES_CHANGED, Context())
        )
    }

    override fun sendEmailAddressChangeRequestCreatedToCurrentAddress(
        data: EmailAddressChangeRequestCreatedCurrentAddressMessageData
    ) {
        sendHtmlMessage(
            mailTo = data.currentAddress,
            subject = "Egidio: Žádost o změnu emailové adresy | Email address change request",
            html = templateEngine.process(
                EMAIL_ADDRESS_CHANGE_REQUEST_CREATED_TO_CURRENT_ADDRESS,
                Context().apply {
                    setVariables(mapOf(
                        ("username" to data.username),
                        ("code" to data.rawConfirmationToken)
                    ))
                }
            )
        )
    }

    override fun sendEmailAddressChangeRequestCreatedToNewAddress(
        data: EmailAddressChangeRequestCreatedNewAddressMessageData
    ) {
        sendHtmlMessage(
            mailTo = data.newAddress,
            subject = "Egidio: Žádost o změnu emailové adresy | Email address change request",
            html = templateEngine.process(
                EMAIL_ADDRESS_CHANGE_REQUEST_CREATED_TO_NEW_ADDRESS,
                Context().apply {
                    setVariables(mapOf(
                        ("username" to data.username),
                        ("code" to data.rawConfirmationToken)
                    ))
                }
            )
        )
    }

    override fun sendEmailAddressChangeRequestConfirmedToOldAddress(
        data : EmailAddressChangeRequestConfirmedOldAddressMessageData
    ) {
        sendHtmlMessage(
            mailTo = data.oldAddress,
            subject = "Egidio: Změna adresy úspěšná | Email changed successfully",
            html = templateEngine.process(EMAIL_ADDRESS_CHANGED_TO_OLD_ADDRESS, Context())
        )
    }

    override fun sendEmailAddressChangeRequestConfirmedToNewAddress(
        data : EmailAddressChangeRequestConfirmedNewAddressMessageData
    ) {
        sendHtmlMessage(
            mailTo = data.newAddress,
            subject = "Egidio: Změna adresy úspěšná | Email changed successfully",
            html = templateEngine.process(EMAIL_ADDRESS_CHANGED_TO_NEW_ADDRESS, Context())
        )
    }

    override fun sendTelephoneNumberChangeRequestCreated(
        data: TelephoneNumberChangeRequestCreatedMessageData
    ) {
        sendHtmlMessage(
            mailTo = data.email,
            subject = "Egidio: Potvrzení změny telefonního čísla | Email change requested confirmation",
            html = templateEngine.process(
                TELEPHONE_NUMBER_CHANGE_REQUEST_CREATED,
                Context().apply {
                    setVariables(mapOf(
                        "confirmationToken" to data.rawConfirmationToken
                    ))
                }
            )
        )
    }

    override fun sendTelephoneNumberChangeRequestConfirmed(data : TelephoneNumberChangeRequestConfirmedMessageData) {
        sendHtmlMessage(
            mailTo = data.email,
            subject = "Egidio: Potvrzení změny telefonního čísla | Email change requested confirmation",
            html = templateEngine.process(
                TELEPHONE_NUMBER_CHANGED,
                Context()
            )
        )
    }

    companion object {
        const val NON_REGISTERED_USER_EMAIL_CONFIRMATION_REQUEST_MESSAGE_TEMPLATE = "user/non_registered/email_confirmation"
        const val REGISTERED_USER_EMAIL_CONFIRMATION_REQUEST_MESSAGE_TEMPLATE = "user/registered/email_confirmation"
        const val REGISTERED_USER_EMAIL_ADDRESS_CONFIRMED = "user/registered/email_confirmed"
        const val PUBLISHED_CONTACT_DETAIL_LEVEL_CHANGED = "user/registered/published_contact_detail_level_changed"
        const val SPOKEN_LANGUAGES_CHANGED = "user/registered/spoken_languages_changed"
        const val EMAIL_ADDRESS_CHANGE_REQUEST_CREATED_TO_CURRENT_ADDRESS =
            "user/registered/change_request/email_address_change_requested_current_address"
        const val EMAIL_ADDRESS_CHANGE_REQUEST_CREATED_TO_NEW_ADDRESS =
            "user/registered/change_request/email_address_change_requested_new_address"
        const val EMAIL_ADDRESS_CHANGED_TO_OLD_ADDRESS =
            "user/registered/change_request/email_address_changed_old_address"
        const val EMAIL_ADDRESS_CHANGED_TO_NEW_ADDRESS =
            "user/registered/change_request/email_address_changed_new_address"
        const val TELEPHONE_NUMBER_CHANGE_REQUEST_CREATED =
            "user/registered/change_request/telephone_number_change_requested"
        const val TELEPHONE_NUMBER_CHANGED =
            "user/registered/change_request/telephone_number_changed"
    }
}