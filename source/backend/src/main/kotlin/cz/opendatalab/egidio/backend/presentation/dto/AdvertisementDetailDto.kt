package cz.opendatalab.egidio.backend.presentation.dto

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementItem
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime
import java.util.UUID

@Schema(
    name = "AdvertisementDetail",
    description = "Detail page data for advertisement"
)
data class AdvertisementDetailDto(
    @Schema(
        name = "id",
        description = "Id which can be used to reference the advertisement"
    )
    val id: String,

    /**
     * User who created the advertisement
     */
    val authorId: UUID,

    /**
     * Coordinator or Admin, who approved the last change of advertisement
     */
    val approverId: UUID?,

    /**
     * The last time advertisement was edited
     */
    val lastEditDate: LocalDateTime,

    /**
     * User who was the last one to edit the advertisement
     */
    val editorId: UUID?,

    /**
     * Current status of the advertisement
     */
    val status: AdvertisementStatus,

    /**
     * Projects to which advertisement is bound
     *
     * Right now we only bind advertisement to single project,
     * but later it's expected to have advertisements, that might be bound to multiple projects
     * (so resources reusability is improved). That's the reason why array of slugs (which work as an IDss) is kept.
     */
    val projectsSlugs: Set<String>,

    /**
     * Items that are offered or requested by advertisement
     */
    val listedItems: List<AdvertisementItem>
)
