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

    private fun sendHtmlMessage(mailTo : String, subject : String, html : String) {
        val mimeMessage = mailSender.createMimeMessage()
        MimeMessageHelper(mimeMessage).apply {
            setTo(mailTo)
            setSubject(subject)
            setText(html, true)
        }
        mailSender.send(mimeMessage)
    }

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
                    setVariable(
                        "advertisementTitleCs",
                        data.advertisementTitle.getTextForLanguageCodeOrDefault("cs").text
                    )
                    setVariable(
                        "advertisementTitleEn",
                        data.advertisementTitle.getTextForLanguageCodeOrDefault("en").text
                    )
                })
    }

    override fun sendAdvertisementCreatedToAdvertiser(data : AdvertisementCreatedAdvertiserMessageData) {
        sendHtmlMessage(
            mailTo = data.advertiserEmail,
            subject = "Egidio: Inzerát vytvořen | Advertisement created",
            html = createAdvertisementCreatedAdvertiserMessage(data)
        )
    }

    private fun createAdvertisementApprovedAdvertiserMessage(
        data : AdvertisementPublishedAdvertiserMessageData
    ) : String {
        return templateEngine.process(
            ADVERTISEMENT_APPROVED_TO_ADVERTISER_TEMPLATE,
            Context()
                .apply {
                    setVariable(
                        "advertisementUrl",
                        advertisementFrontendUrlFactory.createAdvertisementDetailUrl(data.advertisementSlug)
                    )
                    setVariable(
                        "advertisementTitleCs",
                        data.advertisementTitle.getTextForLanguageCodeOrDefault("cs").text
                    )
                    setVariable(
                        "advertisementTitleEn",
                        data.advertisementTitle.getTextForLanguageCodeOrDefault("en").text
                    )
                })
    }

    override fun sendAdvertisementPublishedToAdvertiser(data : AdvertisementPublishedAdvertiserMessageData) {
        sendHtmlMessage(
            mailTo = data.advertiserEmail,
            subject = "Egidio: Inzerát schválen | Advertisement approved",
            html = createAdvertisementApprovedAdvertiserMessage(data)
        )
    }

    companion object {
        const val ADVERTISEMENT_CREATED_TO_ADVERTISER_TEMPLATE = "advertisement/advertiser/advertisement_created.html"
        const val ADVERTISEMENT_APPROVED_TO_ADVERTISER_TEMPLATE = "advertisement/advertiser/advertisement_approved.html"
    }
}