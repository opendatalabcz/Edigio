package cz.opendatalab.egidio.backend.business.entities.advertisement

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.business.entities.user.User
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
    var title: MultilingualText,

    @field:Nullable
    @field:OneToOne
    @field:JoinColumn(name = "description_id")
    var description: MultilingualText?,

    @field:NotNull
    @field:Column(name = "created_at")
    var createdAt: LocalDateTime,

    @field:NotNull
    @ManyToOne
    @field:JoinColumn(name = "created_by_id", referencedColumnName = "id")
    var createdBy: User,

    @field:Nullable
    @field:Column(name = "resolved_at")
    var resolvedAt: LocalDateTime?,

    @field:Nullable
    @field:Column(name = "last_approved_at")
    var lastApprovedAt: LocalDateTime?,

    @field:NotNull
    @ManyToOne
    @field:JoinColumn(name = "approved_by_id", referencedColumnName = "id")
    var lastApprovedBy: User,

    @field:NotNull
    @field:Column(name = "last_edited_at")
    var lastEditedAt: LocalDateTime,

    @field:NotNull
    @field:Column(name = "status")
    var status: AdvertisementStatus,

    @field:NotNull
    var helpType: AdvertisementHelpType,

    @field:NotNull
    var type: AdvertisementType,

    @field:SequenceGenerator(name = idSequenceGeneratorName, sequenceName = "advertisement_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = idSequenceGeneratorName)
    @field:Id
    @field:Column(name = "id")
    var id: Long? = null,

    @field:OneToMany(mappedBy = "advertisement_id")
    var advertisementItems: MutableList<AdvertisementItem>
) {
    companion object {
        const val idSequenceGeneratorName = "advertisement_id_seq_gen"
    }
}