package cz.opendatalab.egidio.backend.business.entities.advertisement

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.business.entities.location.Location
import cz.opendatalab.egidio.backend.business.entities.project.Project
import cz.opendatalab.egidio.backend.business.entities.response.AdvertisementResponse
import cz.opendatalab.egidio.backend.business.entities.user.User
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Null
import org.springframework.data.annotation.CreatedBy
import java.time.LocalDateTime

@Entity(name = "Advertisement")
@Table(
    name = "advertisement",
    uniqueConstraints = [
        UniqueConstraint(name = "advertisement_slug_unique_constraint", columnNames = ["slug"])
    ]
)
class Advertisement(
    @field:NotNull
    @field:OneToOne
    @field:JoinColumn(
        name = "title_id",
        referencedColumnName = "id",
        foreignKey = ForeignKey(name = "fk_advertisement_title_id")
    )
    val title: MultilingualText,

    @field:Nullable
    @field:OneToOne
    @field:JoinColumn(
        name = "description_id",
        referencedColumnName = "id",
        foreignKey = ForeignKey(name = "fk_advertisement_description_id")
    )
    val description: MultilingualText?,

    @field:NotNull
    @field:OneToMany(mappedBy = "advertisement_id")
    var advertisementItems: MutableList<AdvertisementItem>,

    @field:NotNull
    @field:Column(name = "type")
    val type: AdvertisementType,

    @field:NotNull
    @field:OneToMany(mappedBy = "advertisement_id")
    val responses: MutableList<AdvertisementResponse>,

    @field:NotNull
    @field:ManyToOne
    @field:JoinColumn(
        name = "location_id",
        referencedColumnName = "id",
        foreignKey = ForeignKey(name = "fk_advertisement_location_id")
    )
    var location: Location,

    @field:NotNull
    @field:Column(name = "created_at")
    val createdAt: LocalDateTime,

    @field:NotNull
    @field:ManyToOne
    @field:JoinColumn(
        name = "created_by_id",
        referencedColumnName = "id",
        foreignKey = ForeignKey(name = "fk_advertisement_created_by_id")
    )
    @field:CreatedBy
    val createdBy: User,

    @field:Nullable
    @field:Column(name = "resolved_at")
    var resolvedAt: LocalDateTime?,

    @field:Nullable
    @field:Column(name = "last_approved_at")
    var lastApprovedAt: LocalDateTime?,

    @field:Nullable
    @field:ManyToOne
    @field:JoinColumn(
        name = "last_approved_by_id",
        referencedColumnName = "id",
        foreignKey = ForeignKey(name = "fk_advertisement_last_approved_by_id")
    )
    var lastApprovedBy: User?,

    @field:Nullable
    @field:Column(name = "last_edited_at")
    var lastEditedAt: LocalDateTime,

    @field:Nullable
    @field:ManyToOne
    @field:JoinColumn(
        name = "last_edited_by_id",
        referencedColumnName = "id",
        foreignKey = ForeignKey(name = "fk_advertisement_last_edited_by_id")
    )
    var lastEditedBy: User,

    @field:NotNull
    @field:Column(name = "status")
    var status: AdvertisementStatus,

    @field:NotNull
    val helpType: AdvertisementHelpType,

    @field:NotNull
    @field:NotEmpty
    @field:ManyToMany
    @field:JoinTable(
        name = "advertisements_projects",
        joinColumns = [JoinColumn(
            name = "advertisement_id",
            referencedColumnName = "id"
        )],
        inverseJoinColumns = [JoinColumn(
            name = "project_id",
            referencedColumnName = "id"
        )],
        foreignKey = ForeignKey(name = "fk_advertisement_to_projects"),
        inverseForeignKey = ForeignKey(name = "fk_projects_to_advertisement")
    )
    val projects: MutableList<Project>,

    @field:NotNull
    @field:NotBlank
    @field:Column(name = "slug")
    val slug: String,

    @field:Id
    @field:SequenceGenerator(name = ID_SEQUENCE_GENERATOR_NAME, sequenceName = "advertisement_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_SEQUENCE_GENERATOR_NAME)
    @field:Column(name = "id")
    var id: Long? = null
) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "advertisement_id_seq_gen"
    }
}