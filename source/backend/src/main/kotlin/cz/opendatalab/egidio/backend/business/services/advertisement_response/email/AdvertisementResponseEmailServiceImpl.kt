package cz.opendatalab.egidio.backend.business.services.advertisement_response.email

import cz.opendatalab.egidio.backend.presentation.frontend_services.url.factory.AdvertisementFrontendUrlFactory
import cz.opendatalab.egidio.backend.presentation.frontend_services.url.factory.AdvertisementResponseFrontendUrlFactory
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import org.thymeleaf.TemplateEngine
import org.thymeleaf.context.Context

@Service
class AdvertisementResponseEmailServiceImpl(
    val mailSender : JavaMailSender,
    val templateEngine : TemplateEngine,
    val advertisementResponseFrontendUrlFactory : AdvertisementResponseFrontendUrlFactory,
    val advertisementFrontendUrlFactory : AdvertisementFrontendUrlFactory
) : AdvertisementResponseEmailService {
    private fun createAdvertisementResponseAvailableAdvertiserMessage(
        data : AdvertisementResponseAvailableAdvertiserMessageData
    ) : String {
        return templateEngine.process(
            ADVERTISEMENT_CREATED_TO_ADVERTISER_TEMPLATE,
            Context()
                .apply {
                    setVariable(
                        "advertisementDetailUrl",
                        advertisementFrontendUrlFactory.createAdvertisementDetailUrl(data.advertisementSlug)
                    )
                    setVariable(
                        "responsePreviewUrl",
                        //Url with access token that allows to view the response, but not resolve it
                        advertisementResponseFrontendUrlFactory.createAdvertisementResponsePreviewUrl(
                            data.responsePublicId,
                            data.rawPreviewToken
                        )
                    )
                    setVariable(
                        "responseResolveUrl",
                        //Url with access token that also allows resolving the response
                        advertisementResponseFrontendUrlFactory.createAdvertisementResponsePreviewUrl(
                            data.responsePublicId,
                            data.rawResolveToken
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

    override fun sendAdvertisementResponseAvailableToAdvertiser(
        data : AdvertisementResponseAvailableAdvertiserMessageData
    ) {
        val mimeMessage = mailSender.createMimeMessage()
        MimeMessageHelper(mimeMessage).apply {
            setTo(data.advertiserEmail)
            setSubject("Egidio: Odpověď na Váš inzerát | Response to your Advertisement ")
            setText(createAdvertisementResponseAvailableAdvertiserMessage(data), true)
        }
        mailSender.send(mimeMessage)
    }


    private fun createAdvertisementResponseAvailableResponderMessage(
        data : AdvertisementResponseAvailableResponderMessageData
    ) : String {
        return templateEngine.process(
            ADVERTISEMENT_CREATED_TO_RESPONDER_TEMPLATE,
            Context()
                .apply {
                    setVariable(
                        "advertisementDetailUrl",
                        advertisementFrontendUrlFactory.createAdvertisementDetailUrl(data.advertisementSlug)
                    )
                    setVariable(
                        "responsePreviewUrl",
                        //Url with access token that allows to view the response, but not resolve it
                        advertisementResponseFrontendUrlFactory.createAdvertisementResponsePreviewUrl(
                            data.responsePublicId,
                            data.rawPreviewToken
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

    override fun sendAdvertisementResponseAvailableToResponder(
        data : AdvertisementResponseAvailableResponderMessageData
    ) {
        val mimeMessage = mailSender.createMimeMessage()
        MimeMessageHelper(mimeMessage).apply {
            setTo(data.responderEmail)
            setSubject("Egidio: Vaše odpoveď zpřístupněna | Your response accessible ")
            setText(createAdvertisementResponseAvailableResponderMessage(data), true)
        }
        mailSender.send(mimeMessage)
    }

    companion object {
        const val ADVERTISEMENT_CREATED_TO_ADVERTISER_TEMPLATE = "advertisement_response/advertiser/response_available"
        const val ADVERTISEMENT_CREATED_TO_RESPONDER_TEMPLATE = "advertisement_response/responder/response_available"
    }
}