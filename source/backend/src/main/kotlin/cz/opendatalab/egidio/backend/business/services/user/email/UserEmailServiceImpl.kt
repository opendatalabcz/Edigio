package cz.opendatalab.egidio.backend.business.services.user.email

import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.AnonymousUserEmailConfirmationRequestMessageData
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.RegisteredUserEmailConfirmationRequestMessageData
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.RegisteredUserContactConfirmedMessageData
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


    override fun sendAnonymousUserEmailConfirmationRequestMessage(
        data : AnonymousUserEmailConfirmationRequestMessageData
    ) {
        sendHtmlMessage(
            mailTo = data.email,
            subject = "Egidio: Potvrzení emailové adresy | Email address confirmation ",
            html = createUserEmailConfirmationRequestMessage(
                template = ANONYMOUS_USER_EMAIL_CONFIRMATION_REQUEST_MESSAGE_TEMPLATE,
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

    companion object {
        const val ANONYMOUS_USER_EMAIL_CONFIRMATION_REQUEST_MESSAGE_TEMPLATE = "user/anonymous/email_confirmation"
        const val REGISTERED_USER_EMAIL_CONFIRMATION_REQUEST_MESSAGE_TEMPLATE = "user/registered/email_confirmation"
        const val REGISTERED_USER_EMAIL_ADDRESS_CONFIRMED = "user/registered/email_confirmed"
    }
}