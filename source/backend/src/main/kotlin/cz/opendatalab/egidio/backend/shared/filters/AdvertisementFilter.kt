package cz.opendatalab.egidio.backend.shared.filters

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementHelpType
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.annotation.Nullable
import java.time.LocalDateTime

@Schema(description = "Filter for advertisements.")
data class AdvertisementFilter(
    @field:Nullable
    @field:Schema(description = "Text to search for in text")
    val text: MultilingualTextFilter? = null,
    @field:Nullable
    @field:Schema(description = "Type of advertisement")
    val type: Set<AdvertisementType>? = null,
    @field:Nullable
    @field:Schema(description = "Current advertisement status")
    val status: Set<AdvertisementStatus>? = null,
    @field:Nullable
    @field:Schema(description = "Type of help offered in advertisement")
    val helpType: Set<AdvertisementHelpType>? = null,
    @field:Nullable
    @field:Schema(description = "Slug of project to which advertisement belongs")
    val projectSlug: String? = null,
    @field:Nullable
    @field:Schema(description = "The earliest acceptable date of advertisement publishing")
    val publishedAfter: LocalDateTime? = null,
    @field:Nullable
    @field:Schema(description = "The latest acceptable date of advertisement publishing")
    val publishedBefore: LocalDateTime? = null
)
