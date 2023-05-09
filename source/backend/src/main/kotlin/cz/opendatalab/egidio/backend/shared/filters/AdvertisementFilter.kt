package cz.opendatalab.egidio.backend.shared.filters

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementHelpType
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.annotation.Nullable
import java.time.OffsetDateTime

@Schema(description = "Filter for advertisements.")
data class AdvertisementFilter(
    @field:Nullable
    @Schema(description = "Text to search for in text")
    val text: MultilingualTextFilter? = null,
    @field:Nullable
    @Schema(description = "Type of advertisement")
    val type: Set<AdvertisementType>? = null,
    @field:Nullable
    @Schema(description = "Current advertisement status")
    val status: Set<AdvertisementStatus>? = null,
    @field:Nullable
    @Schema(description = "Type of help offered in advertisement")
    val helpType: Set<AdvertisementHelpType>? = null,
    @field:Nullable
    @Schema(description = "Slug of project to which advertisement belongs")
    val projectSlug: String? = null,
    @field:Nullable
    @Schema(description = "The earliest acceptable date of advertisement publishing")
    val publishedAfter: OffsetDateTime? = null,
    @field:Nullable
    @Schema(description = "The latest acceptable date of advertisement publishing")
    val publishedBefore: OffsetDateTime? = null,
    @field:Nullable
    @Schema(
        description = "Whether only advertisements with confirmed user contact should be included",
        defaultValue = "true"
    )
    val withConfirmedContactOnly: Boolean = true
)
