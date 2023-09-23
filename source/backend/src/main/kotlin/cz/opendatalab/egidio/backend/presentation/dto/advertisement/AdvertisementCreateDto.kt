package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementHelpType
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import cz.opendatalab.egidio.backend.presentation.dto.user.NonRegisteredUserInfoCreateDto
import cz.opendatalab.egidio.backend.shared.validation.annotations.MultilingualTextLength
import cz.opendatalab.egidio.backend.shared.validation.annotations.MultilingualTextValid
import cz.opendatalab.egidio.backend.shared.validation.constants.AdvertisementValidationConstants.ADVERTISEMENT_DESCRIPTION_MAX_LENGTH
import cz.opendatalab.egidio.backend.shared.validation.constants.AdvertisementValidationConstants.ADVERTISEMENT_TITLE_MAX_LENGTH
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.Valid

@Schema(
    description = "Structure used to create new advertisement by either logged or not-logged user"
)
data class AdvertisementCreateDto(
    @field:MultilingualTextValid
    @field:MultilingualTextLength(max = ADVERTISEMENT_TITLE_MAX_LENGTH)
    @Schema(
        description = "Title of advertisement. Should be something short and concise.",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val title : MultilingualTextDto,
    @field:MultilingualTextValid
    @field:MultilingualTextLength(max = ADVERTISEMENT_DESCRIPTION_MAX_LENGTH)
    @Schema(
        description = "Description of advertisement",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
    )
    val description : MultilingualTextDto?,
    @field:Valid
    @Schema(
        description = "Location to which advertisement is created",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val location : AdvertisementLocationCreateDto,
    @field:Valid
    @Schema(
        description = "Information used to create non-registered user. Omitted when user is logged in.",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val nonRegisteredUserInfo : NonRegisteredUserInfoCreateDto?,
    @Schema(
        description = "Slug of project to which advertisement belongs.",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val projectSlug : String,
    @Schema(
        description = "Type of advertisement",
        example = "order,authentication",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val type : AdvertisementType,
    @Schema(
        description = "Type of help contained in advertisement",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val helpType : AdvertisementHelpType,
    @Schema(
        description = "Items contained in advertisement",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        nullable = false
    )
    val items : List<AdvertisementItemCreateDto>
)