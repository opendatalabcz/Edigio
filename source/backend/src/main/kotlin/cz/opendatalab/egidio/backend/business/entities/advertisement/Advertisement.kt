package cz.opendatalab.egidio.backend.business.entities.advertisement

import cz.opendatalab.egidio.backend.business.shared.MultilingualText
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

@Entity(name = "Advertisement")
@Table(name = "advertisement")
data class Advertisement(
    @field:SequenceGenerator(name = idSequenceGeneratorName, sequenceName = "advertisement_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = idSequenceGeneratorName)
    @field:Id
    @field:Column(
        name = "id"
    )
    val id: Long = 0,
    @field:NotNull
    @OneToOne
    @JoinColumn(name = "description_id")
    val title: MultilingualText,
    @field:Nullable
    @OneToOne
    @JoinColumn(name = "description_id")
    val description: MultilingualText?,
    @field:NotNull
    val createdAt: LocalDateTime,
    @field:Nullable
    val resolvedAt: LocalDateTime?,
    @field:Nullable
    val lastApprovedAt: LocalDateTime?,
    @field:NotNull
    val lastEditedAt: LocalDateTime,
    @field:NotNull
    val status: AdvertisementStatus,
    @field:NotNull
    val advertisementHelpType: AdvertisementHelpType,
) {
    companion object {
        const val idSequenceGeneratorName = "advertisement_id_seq_gen"
    }
}