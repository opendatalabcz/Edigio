package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementHelpType
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime
import java.util.UUID

@Schema(description = "Detail page data for advertisement")
data class AdvertisementDetailDto(
    @field:Schema(
        description = "Title of advertisement. Should be something short and concise.",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val title: MultilingualTextDto,

    @field:Schema(
        description = "Description of advertisement",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
    )
    val description: MultilingualTextDto?,

    @field:Schema(
        description = "Type of advertisement",
        example = "request, response"
    )
    val type: AdvertisementType,

    @field:Schema(
        description = "Type of help in advertisement",
        example = "request, response"
    )
    val helpType: AdvertisementHelpType,

    @field:Schema(
        description = "Current status of the advertisement"
    )
    val status: AdvertisementStatus,

    @field:Schema(
        description = "Items that are offered or requested in advertisement"
    )
    val listedItems: List<AdvertisementItemDto>,

    @field:Schema(
        description = "ID of user who created the advertisement"
    )
    val author: UUID,

    @field:Schema(
        description = "Time of advertisement creation"
    )
    val createdAt: LocalDateTime,

    @field:Schema(
        description = "The last time advertisement was approved"
    )
    val lastApprovedAt: LocalDateTime?,

    @field:Schema(
        description = "Coordinator or Admin, who approved the last change of advertisement"
    )
    val lastApprovedBy: UUID?,

    @field:Schema(
        description = "The last time advertisement was edited"
    )
    val lastEditedAt: LocalDateTime?,

    @field:Schema(
        description = "User who was the last one to edit the advertisement"
    )
    val lastEditedBy: UUID?,

    /**
     * Right now we only bind advertisement to single project,
     * but later it's expected to have advertisements, that might be bound to multiple projects
     * (so resources reusability is improved). That's the reason why array of slugs (which work as an IDss) is kept.
     */
    @field:Schema(
        description = "Projects to which advertisement is bound",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val projectsSlugs: Set<String>,

    @field:Schema(
        description = "Slug which can be used to reference the advertisement"
    )
    val slug: String,
)
