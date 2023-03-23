package cz.opendatalab.egidio.backend.business.entities.advertisement

import cz.opendatalab.egidio.backend.business.shared.MultilingualText
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

@Entity(name = "Advertisement")
@Table(name = "advertisement")
class Advertisement(
    @field:NotNull
    @field:OneToOne
    @field:JoinColumn(name = "title_id")
    val title: MultilingualText,

    @field:Nullable
    @field:OneToOne
    @field:JoinColumn(name = "description_id")
    val description: MultilingualText?,

    @field:NotNull
    @field:Column(name = "created_at")
    val createdAt: LocalDateTime,

    @field:Nullable
    @field:Column(name = "resolved_at")
    val resolvedAt: LocalDateTime?,

    @field:Nullable
    @field:Column(name = "last_approved_at")
    val lastApprovedAt: LocalDateTime?,

    @field:NotNull
    @field:Column(name = "last_edited_at")
    val lastEditedAt: LocalDateTime,

    @field:NotNull
    @field:Column(name = "status")
    val status: AdvertisementStatus,
    @field:NotNull
    val advertisementHelpType: AdvertisementHelpType,

    @field:SequenceGenerator(name = idSequenceGeneratorName, sequenceName = "advertisement_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = idSequenceGeneratorName)
    @field:Id
    @field:Column(name = "id")
    val id: Long? = null,
) {
    companion object {
        const val idSequenceGeneratorName = "advertisement_id_seq_gen"
    }
}