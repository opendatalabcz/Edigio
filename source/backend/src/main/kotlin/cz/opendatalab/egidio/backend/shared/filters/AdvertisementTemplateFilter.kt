package cz.opendatalab.egidio.backend.shared.filters

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementHelpType
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import cz.opendatalab.egidio.backend.business.entities.project.CatastropheType
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.annotation.Nullable

@Schema(description = "Filter for advertisements.")
data class AdvertisementTemplateFilter(
    @field:Nullable
    @field:Schema(description = "Part of advertisement template name")
    val name: MultilingualTextFilter? = null,
    @field:Nullable
    @field:Schema(description = "Types of advertisement for which template is suitable")
    val advertisementTypes: Set<AdvertisementType>? = null,
    @field:Nullable
    @field:Schema(description = "Type of help offered in advertisements for which template is suitable")
    val helpTypes: Set<AdvertisementHelpType>? = null,
    @field:Nullable
    @field:Schema(description = "Type of help offered in advertisements for which template is suitable")
    val catastropheTypes: Set<CatastropheType>? = null,
    @field:Nullable
    @field:Schema(description = "Project for which template was specifically designed")
    val projectsSlugs: List<String>? = null,
)
