package cz.opendatalab.egidio.backend.business.services.advertisement.email

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
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

    private fun createAdvertisementStatusChangedAdvertiserMessage(
        template: String,
        advertisementSlug: String,
        advertisementTitle: MultilingualText,
    ) : String {
        return templateEngine.process(
            template,
            Context()
                .apply {
                    setVariable(
                        "advertisementUrl",
                        advertisementFrontendUrlFactory.createAdvertisementDetailUrl(advertisementSlug)
                    )
                    setVariable(
                        "advertisementTitleCs",
                        advertisementTitle.getTextForLanguageCodeOrDefault("cs").text
                    )
                    setVariable(
                        "advertisementTitleEn",
                        advertisementTitle.getTextForLanguageCodeOrDefault("en").text
                    )
                })
    }

    override fun sendAdvertisementPublishedToAdvertiser(data : AdvertisementPublishedAdvertiserMessageData) {
        sendHtmlMessage(
            mailTo = data.advertiserEmail,
            subject = "Egidio: Inzerát zveřejněn | Advertisement published",
            html = createAdvertisementStatusChangedAdvertiserMessage(
                template = ADVERTISEMENT_PUBLISHED_TO_ADVERTISER_TEMPLATE,
                advertisementTitle = data.advertisementTitle,
                advertisementSlug = data.advertisementSlug
            )
        )
    }

    override fun sendAdvertisementResolvedToAdvertiser(data : AdvertisementResolvedAdvertiserMessageData) {
        sendHtmlMessage(
            mailTo = data.advertiserEmail,
            subject = "Egidio: Inzerát vyřešen | Advertisement resolved",
            html = createAdvertisementStatusChangedAdvertiserMessage(
                template = ADVERTISEMENT_RESOLVED_TO_ADVERTISER_TEMPLATE,
                advertisementTitle = data.advertisementTitle,
                advertisementSlug = data.advertisementSlug
            )
        )
    }

    override fun sendAdvertisementCanceledToAdvertiser(data : AdvertisementCanceledAdvertiserMessageData) {
        sendHtmlMessage(
            mailTo = data.advertiserEmail,
            subject = "Egidio: Inzerát zrušen | Advertisement canceled",
            html = createAdvertisementStatusChangedAdvertiserMessage(
                template = ADVERTISEMENT_CANCELED_TO_ADVERTISER_TEMPLATE,
                advertisementTitle = data.advertisementTitle,
                advertisementSlug = data.advertisementSlug
            )
        )
    }

    companion object {
        const val ADVERTISEMENT_CREATED_TO_ADVERTISER_TEMPLATE = "advertisement/advertiser/advertisement_created.html"
        const val ADVERTISEMENT_PUBLISHED_TO_ADVERTISER_TEMPLATE = "advertisement/advertiser/advertisement_published.html"
        const val ADVERTISEMENT_CANCELED_TO_ADVERTISER_TEMPLATE = "advertisement/advertiser/advertisement_canceled.html"
        const val ADVERTISEMENT_RESOLVED_TO_ADVERTISER_TEMPLATE = "advertisement/advertiser/advertisement_resolved.html"
    }
}