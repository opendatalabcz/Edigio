package cz.opendatalab.egidio.backend.business.services.advertisement.email

import cz.opendatalab.egidio.backend.presentation.frontend_services.url.factory.AdvertisementFrontendUrlFactory
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import org.thymeleaf.TemplateEngine
import org.thymeleaf.context.Context

@Service
class AdvertisementEmailServiceImpl(
    val mailSender : JavaMailSender,
    val templateEngine : TemplateEngine,
    val advertisementFrontendUrlFactory : AdvertisementFrontendUrlFactory,
) : AdvertisementEmailService {

    private fun createAdvertisementCreatedAdvertiserMessage(data : AdvertisementCreatedAdvertiserMessageData) : String {
        return templateEngine.process(
            ADVERTISEMENT_CREATED_TO_ADVERTISER_TEMPLATE,
            Context()
                .apply {
                    setVariable(
                        "advertisementUrl",
                        advertisementFrontendUrlFactory.createAdvertisementDetailUrl(data.advertisementSlug)
                    )
                    setVariable(
                        "advertisementCancelUrl",
                        advertisementFrontendUrlFactory.createAdvertisementCancelUrl(
                            data.advertisementSlug,
                            data.cancelToken
                        )
                    )
                    setVariable(
                        "advertisementResolveUrl",
                        advertisementFrontendUrlFactory.createAdvertisementResolveUrl(
                            data.advertisementSlug,
                            data.resolveToken
                        )
                    )
                })
    }

    override fun sendAdvertisementCreatedToAdvertiser(data : AdvertisementCreatedAdvertiserMessageData) {
        val mimeMessage = mailSender.createMimeMessage()
        MimeMessageHelper(mimeMessage).apply {
            setTo(data.advertiserEmail)
            setSubject("Egidio: Inzerát vytvořen | Advertisement created")
            setText(createAdvertisementCreatedAdvertiserMessage(data))
        }
        mailSender.send(mimeMessage)
    }

    companion object {
        const val ADVERTISEMENT_CREATED_TO_ADVERTISER_TEMPLATE = "email/user/advertisement_created_advertiser"
    }
}