package cz.opendatalab.egidio.backend.presentation.controllers.advertisement_response

import cz.opendatalab.egidio.backend.business.services.advertisement_response.AdvertisementResponseService
import cz.opendatalab.egidio.backend.presentation.controllers.advertisement.AdvertisementResponseController
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponsePreviewDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseResolveDataDto
import cz.opendatalab.egidio.backend.shared.converters.advertisement_response.AdvertisementResponseConverter
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping(
    name = "AdvertisementResponse",
    path = ["/advertisement-response"]
)
class AdvertisementResponseControllerImpl(
    val advertisementResponseService : AdvertisementResponseService,
    val responseConverter : AdvertisementResponseConverter
) : AdvertisementResponseController {
    override fun getDetail(slug : UUID) : ResponseEntity<AdvertisementResponseDto> {
        TODO()
    }

    @GetMapping(
        name = "getPreview",
        path = ["/{publicId}/preview", "/{publicId}/preview/{token}"]
    )
    override fun getPreview(
        @PathVariable("publicId") publicId : UUID,
        @PathVariable("token", required = false) token: String?
    ) : AdvertisementResponsePreviewDto {
        return advertisementResponseService.getPreviewByPublicIdAndWithOptionalToken(
            publicId = publicId,
            token = token
        ).let ( responseConverter::previewToPreviewDto )
    }

    @PostMapping(
        name = "create",
        path = [""]
    )
    override fun create(@RequestBody createDto : AdvertisementResponseCreateDto) : ResponseEntity<UUID> {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(this.advertisementResponseService.createResponse(createDto).publicId)
    }

    @PostMapping(
        name = "accept",
        path = ["{publicId}/accept"]
    )
    @ResponseStatus(HttpStatus.NO_CONTENT)
    override fun accept(
        @PathVariable publicId : UUID,
        @RequestBody resolveDataDto : AdvertisementResponseResolveDataDto
    ) {
        this.advertisementResponseService.acceptResponse(
            publicId = publicId,
            resolveDataDto = resolveDataDto
        )
    }

    @PostMapping(
        name = "reject",
        path = ["{publicId}/reject"]
    )
    @ResponseStatus(HttpStatus.NO_CONTENT)
    override fun reject(
        @PathVariable publicId : UUID,
        @RequestBody resolveDataDto : AdvertisementResponseResolveDataDto
    ) {
        this.advertisementResponseService.rejectResponse(
            publicId = publicId,
            resolveDataDto = resolveDataDto
        )
    }
}