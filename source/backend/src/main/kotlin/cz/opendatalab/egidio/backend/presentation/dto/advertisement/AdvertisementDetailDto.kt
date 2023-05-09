package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementHelpType
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime
import java.util.UUID

@Schema(description = "Detail page data for advertisement")
data class AdvertisementDetailDto(
    @Schema(
        description = "Title of advertisement. Should be something short and concise.",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val title: MultilingualTextDto,

    @Schema(
        description = "Description of advertisement",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
    )
    val description: MultilingualTextDto?,

    @Schema(
        description = "Type of advertisement",
        example = "request, response"
    )
    val type: AdvertisementType,

    @Schema(
        description = "Type of help in advertisement",
        example = "request, response"
    )
    val helpType: AdvertisementHelpType,

    @Schema(
        description = "Current status of the advertisement"
    )
    val status: AdvertisementStatus,

    @Schema(
        description = "Items that are offered or requested in advertisement"
    )
    val listedItems: List<AdvertisementItemDto>,

    @Schema(
        description = "ID of user who created the advertisement"
    )
    val author: UUID,

    @Schema(
        description = "Time of advertisement creation"
    )
    val createdAt: OffsetDateTime,

    @Schema(
        description = "The last time advertisement was approved"
    )
    val lastApprovedAt: OffsetDateTime?,

    @Schema(
        description = "Coordinator or Admin, who approved the last change of advertisement"
    )
    val lastApprovedBy: UUID?,

    @Schema(
        description = "The last time advertisement was edited"
    )
    val lastEditedAt: OffsetDateTime?,

    @Schema(
        description = "User who was the last one to edit the advertisement"
    )
    val lastEditedBy: UUID?,

    /**
     * Right now we only bind advertisement to single project,
     * but later it's expected to have advertisements, that might be bound to multiple projects
     * (so resources reusability is improved). That's the reason why array of slugs (which work as an IDss) is kept.
     */
    @Schema(
        description = "Projects to which advertisement is bound",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val projectsSlugs: Set<String>,

    @Schema(
        description = "Slug which can be used to reference the advertisement"
    )
    val slug: String,
)
