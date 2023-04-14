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
    private fun sendHtmlMessage(emailTo : String, subject : String, html : String) {
        val mimeMessage = mailSender.createMimeMessage()
        MimeMessageHelper(mimeMessage).apply {
            setTo(emailTo)
            setSubject(subject)
            setText(html, true)
        }
        mailSender.send(mimeMessage)
    }

    private fun createAdvertisementResponseAvailableAdvertiserMessage(
        data : AdvertisementResponseAvailableAdvertiserMessageData
    ) : String {
        return templateEngine.process(
            ADVERTISEMENT_RESPONSE_AVAILABLE_TO_ADVERTISER_TEMPLATE,
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
        sendHtmlMessage(
            emailTo = data.advertiserEmail,
            subject = "Egidio: Odpověď na Váš inzerát | Response to your Advertisement ",
            html = createAdvertisementResponseAvailableAdvertiserMessage(data)
        )
    }


    private fun createAdvertisementResponseAvailableResponderMessage(
        data : AdvertisementResponseAvailableResponderMessageData
    ) : String {
        return templateEngine.process(
            ADVERTISEMENT_RESPONSE_AVAILABLE_TO_RESPONDER_TEMPLATE,
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
        sendHtmlMessage(
            emailTo = data.responderEmail,
            subject = "Egidio: Vaše odpoveď zpřístupněna | Your response accessible ",
            html = createAdvertisementResponseAvailableResponderMessage(data)
        )
    }

    private fun createAdvertisementResponseResolvedMessage(
        templatePath : String,
        data : AdvertisementResponseResolvedMessageData
    ) : String {
        return templateEngine.process(
            templatePath,
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
                            data.responsePreviewToken
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

    private fun getResponseResolvedToAdvertiserTemplatePath(isAccepted : Boolean) =
        if (isAccepted) {
            ADVERTISEMENT_RESPONSE_ACCEPTED_TO_ADVERTISER_TEMPLATE
        } else {
            ADVERTISEMENT_RESPONSE_REJECTED_TO_ADVERTISER_TEMPLATE
        }

    private fun getResponseResolvedToResponderTemplatePath(isAccepted : Boolean) =
        if (isAccepted) {
            ADVERTISEMENT_RESPONSE_ACCEPTED_TO_RESPONDER_TEMPLATE
        } else {
            ADVERTISEMENT_RESPONSE_REJECTED_TO_RESPONDER_TEMPLATE
        }

    override fun sendAdvertisementResponseResolvedToAdvertiser(data : AdvertisementResponseResolvedMessageData) {
        val subjectLastWordEn = if (data.isAccepted) "accepted" else "rejected"
        val subjectLastWordCs = if (data.isAccepted) "přijata" else "odmítnuta"
        sendHtmlMessage(
            emailTo = data.advertiserEmail,
            subject = "Egidio: Odpověď na Váš inzerát ${subjectLastWordCs} | Response to your advertisement ${subjectLastWordEn}",
            html = createAdvertisementResponseResolvedMessage(
                getResponseResolvedToAdvertiserTemplatePath(data.isAccepted),
                data
            )
        )
    }

    override fun sendAdvertisementResponseResolvedToResponder(data : AdvertisementResponseResolvedMessageData) {
        val subjectLastWordEn = if (data.isAccepted) "accepted" else "rejected"
        val subjectLastWordCs = if (data.isAccepted) "přijata" else "odmítnuta"
        sendHtmlMessage(
            emailTo = data.responderEmail,
            subject = "Egidio: Vaše odpoveď na inzerát ${subjectLastWordCs}  | Your response to advertisement ${subjectLastWordEn}",
            html = createAdvertisementResponseResolvedMessage(
                getResponseResolvedToResponderTemplatePath(data.isAccepted),
                data
            )
        )
    }

    companion object {
        const val ADVERTISEMENT_RESPONSE_AVAILABLE_TO_ADVERTISER_TEMPLATE =
            "advertisement_response/advertiser/response_available"
        const val ADVERTISEMENT_RESPONSE_AVAILABLE_TO_RESPONDER_TEMPLATE =
            "advertisement_response/responder/response_available"
        const val ADVERTISEMENT_RESPONSE_ACCEPTED_TO_RESPONDER_TEMPLATE =
            "advertisement_response/responder/response_accepted"
        const val ADVERTISEMENT_RESPONSE_REJECTED_TO_RESPONDER_TEMPLATE =
            "advertisement_response/responder/response_rejected"
        const val ADVERTISEMENT_RESPONSE_ACCEPTED_TO_ADVERTISER_TEMPLATE =
            "advertisement_response/advertiser/response_accepted"
        const val ADVERTISEMENT_RESPONSE_REJECTED_TO_ADVERTISER_TEMPLATE =
            "advertisement_response/advertiser/response_rejected"
    }
}