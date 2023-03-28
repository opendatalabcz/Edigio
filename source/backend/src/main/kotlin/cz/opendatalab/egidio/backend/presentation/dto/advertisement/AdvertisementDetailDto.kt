package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementItem
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime
import java.util.UUID

@Schema(description = "Detail page data for advertisement")
data class AdvertisementDetailDto(
    @Schema(description = "Id which can be used to reference the advertisement")
    val id: String,

    @Schema(description = "ID of user who created the advertisement")
    val authorId: UUID,

    @Schema(description = "Coordinator or Admin, who approved the last change of advertisement")
    val approverId: UUID?,

    @Schema(description = "The last time advertisement was edited")
    val lastEditDate: LocalDateTime,

    @Schema(description = "User who was the last one to edit the advertisement")
    val editorId: UUID?,

    @Schema(description = "Current status of the advertisement")
    val status: AdvertisementStatus,

    /**
     * Right now we only bind advertisement to single project,
     * but later it's expected to have advertisements, that might be bound to multiple projects
     * (so resources reusability is improved). That's the reason why array of slugs (which work as an IDss) is kept.
     */
    @Schema(description = "Projects to which advertisement is bound")
    val projectsSlugs: Set<String>,

    @Schema(description = "Items that are offered or requested by advertisement")
    val listedItems: List<AdvertisementItem>
)
