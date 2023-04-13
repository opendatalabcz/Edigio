package cz.opendatalab.egidio.backend.business.services.user.email

import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.AnonymousUserEmailConfirmationRequestMessageData
import cz.opendatalab.egidio.backend.presentation.frontend_services.url.factory.UserFrontendUrlFactory
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import org.thymeleaf.TemplateEngine
import org.thymeleaf.context.Context

@Service
class UserEmailServiceImpl(
    val mailSender : JavaMailSender,
    val templateEngine : TemplateEngine,
    val userFrontendUrlFactory : UserFrontendUrlFactory,
) : UserEmailService {
    private fun createAnonymousUserEmailConfirmationRequestMessage(
        data : AnonymousUserEmailConfirmationRequestMessageData,
    ) : String {
        return templateEngine.process(
            ANONYMOUS_USER_EMAIL_CONFIRMATION_REQUEST_MESSAGE_TEMPLATE,
            Context()
                .apply {
                    setVariable(
                        "emailConfirmationUrl",
                        userFrontendUrlFactory.createEmailConfirmationUrl(
                            data.publicId,
                            data.rawEmailConfirmationTokenValue
                        )
                    )
                })
    }

    override fun sendAnonymousUserEmailConfirmationRequestMessage(
        data : AnonymousUserEmailConfirmationRequestMessageData
    ) {
        val mimeMessage = mailSender.createMimeMessage()
        MimeMessageHelper(mimeMessage).apply {
            setTo(data.email)
            setSubject("Egidio: Potvrzení emailové adresy | Email address confirmation ")
            setText(createAnonymousUserEmailConfirmationRequestMessage(data), true)
        }
        mailSender.send(mimeMessage)
    }

    companion object {
        const val ANONYMOUS_USER_EMAIL_CONFIRMATION_REQUEST_MESSAGE_TEMPLATE = "user/anonymous/email_confirmation"
    }
}