package cz.opendatalab.egidio.backend.presentation.controllers.advertisement_response

import cz.opendatalab.egidio.backend.business.services.advertisement_response.AdvertisementResponseService
import cz.opendatalab.egidio.backend.presentation.controllers.advertisement.AdvertisementResponseController
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseResolveDataDto
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
) : AdvertisementResponseController {
    override fun getDetail(slug : UUID) : ResponseEntity<AdvertisementResponseDto> {
        TODO()
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

    @ResponseStatus(HttpStatus.NO_CONTENT)
    override fun reject(publicId : UUID, resolveDataDto : AdvertisementResponseResolveDataDto) {
        this.advertisementResponseService.acceptResponse(
            publicId = publicId,
            resolveDataDto = resolveDataDto
        )
    }
}