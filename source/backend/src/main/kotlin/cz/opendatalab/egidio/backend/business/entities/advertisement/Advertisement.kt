package cz.opendatalab.egidio.backend.business.entities.advertisement

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.business.entities.location.Location
import cz.opendatalab.egidio.backend.business.entities.project.Project
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponse
import cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text.MultilingualTextValid
import cz.opendatalab.egidio.backend.business.entities.user.User
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
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
    @field:OneToOne(cascade = [CascadeType.ALL])
    @field:JoinColumn(
        name = "title_id",
        referencedColumnName = MultilingualText.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_title_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    @field:MultilingualTextValid
    val title: MultilingualText,

    @field:Nullable
    @field:OneToOne(cascade = [CascadeType.ALL])
    @field:JoinColumn(
        name = "description_id",
        referencedColumnName = MultilingualText.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_description_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    @field:MultilingualTextValid
    val description: MultilingualText?,

    @field:NotNull
    @field:OneToMany(
        mappedBy = AdvertisementItem.ADVERTISEMENT_FIELD_NAME,
        cascade = [CascadeType.ALL]
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    var advertisementItems: MutableList<AdvertisementItem>,

    @field:NotNull
    @field:Enumerated(EnumType.STRING)
    @field:Column(name = "type")
    val type: AdvertisementType,

    @field:NotNull
    @field:OneToMany(
        mappedBy = AdvertisementResponse.ADVERTISEMENT_FIELD_NAME,
        cascade = [CascadeType.ALL]
    )
    val responses: MutableList<AdvertisementResponse>,

    @field:NotNull
    @field:ManyToOne
    @field:JoinColumn(
        name = "location_id",
        referencedColumnName = Location.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_location_id")
    )
    var location: Location,

    @field:NotNull
    @field:CreatedDate
    @field:Column(name = "created_at")
    val createdAt: LocalDateTime,

    @field:NotNull
    @field:ManyToOne(cascade = [CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = "created_by_id",
        referencedColumnName = User.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_created_by_id")
    )
    @field:CreatedBy
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    val createdBy: User,

    @field:Nullable
    @field:Column(name = "resolved_at")
    var resolvedAt: LocalDateTime?,

    @field:Nullable
    @field:Column(name = "last_approved_at")
    var lastApprovedAt: LocalDateTime?,

    @field:Nullable
    @field:ManyToOne(cascade = [CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = "last_approved_by_id",
        referencedColumnName = User.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_last_approved_by_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    var lastApprovedBy: User?,

    @field:Nullable
    @field:Column(name = "last_edited_at")
    var lastEditedAt: LocalDateTime,

    @field:Nullable
    @field:ManyToOne(cascade = [CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = "last_edited_by_id",
        referencedColumnName = User.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_last_edited_by_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    var lastEditedBy: User,

    @field:NotNull
    @field:Column(name = "status")
    var status: AdvertisementStatus,

    @field:NotNull
    @field:Enumerated(value = EnumType.STRING)
    @field:Column(name = "help_type")
    val helpType: AdvertisementHelpType,

    @field:NotNull
    @field:NotEmpty
    @field:ManyToMany(cascade = [CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinTable(
        name = "advertisements_projects",
        joinColumns = [JoinColumn(
            name = "advertisement_id",
            referencedColumnName = Advertisement.ID_COLUMN_NAME
        )],
        inverseJoinColumns = [JoinColumn(
            name = "project_id",
            referencedColumnName = Project.ID_COLUMN_NAME
        )],
        foreignKey = ForeignKey(name = "fk_advertisement_to_projects"),
        inverseForeignKey = ForeignKey(name = "fk_projects_to_advertisement"),
        uniqueConstraints = [
            UniqueConstraint(
                name = "advertisement_once_per_project_constraint",
                columnNames = ["advertisement_id", "project_id"]
            )
        ]
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    val projects: MutableList<Project>,

    @field:NotNull
    @field:NotBlank
    @field:Column(name = "slug")
    val slug: String,

    @field:Id
    @field:SequenceGenerator(name = ID_SEQUENCE_GENERATOR_NAME, sequenceName = "advertisement_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_SEQUENCE_GENERATOR_NAME)
    @field:Column(name = ID_COLUMN_NAME)
    var id: Long? = null
) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "advertisement_id_seq_gen"
        const val ID_COLUMN_NAME = "id"
        const val PROJECTS_FIELD_NAME = "projects"
    }
}