package cz.opendatalab.egidio.backend.business.entities.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponse
import cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text.MultilingualTextValid
import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.business.entities.location.Location
import cz.opendatalab.egidio.backend.business.entities.project.Project
import cz.opendatalab.egidio.backend.business.entities.user.User
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import java.time.LocalDateTime

@Entity(name = "Advertisement")
@Table(
    name = "advertisement",
    uniqueConstraints = [
        UniqueConstraint(name = "advertisement_slug_unique_constraint", columnNames = ["slug"]),
        UniqueConstraint(name = "canceling_token_unique", columnNames = [Advertisement.CANCELING_TOKEN_COLUMN_NAME]),
        UniqueConstraint(name = "approval_token_unique", columnNames = [Advertisement.RESOLVE_TOKEN_COLUMN_NAME])
    ]
)
class Advertisement(
    /**
     * Title of the advertisement in multiple languages.
     * Should be short and concise.
     */
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

    /**
     * Multilingual text that describes what the advertisement is about, and gives more info.
     */
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

    /**
     * Items that are listed in advertisement.
     * Resource should be unique.
     */
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
    @field:ManyToOne(cascade = [CascadeType.ALL])
    @field:JoinColumn(
        name = "location_id",
        referencedColumnName = Location.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_location_id")
    )
    @field:Valid
    var location: Location,

    @field:NotNull
    @field:Column(name = "created_at")
    val createdAt: LocalDateTime,

    @field:NotNull
    @field:ManyToOne(cascade = [CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = "created_by_id",
        referencedColumnName = User.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_created_by_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    @field:Valid
    val createdBy: User,

    @field:NotNull
    @field:Column(name = "status")
    @field:Enumerated(EnumType.STRING)
    var status: AdvertisementStatus,

    @field:NotNull
    @field:Column(name = "help_type")
    @field:Enumerated(value = EnumType.STRING)
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
    @field:Valid
    val projects: MutableList<Project>,

    @field:Nullable
    @field:Column(name = "resolved_at")
    var resolvedAt: LocalDateTime? = null,

    @field:Nullable
    @field:ManyToOne(cascade = [CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = "resolved_by_id",
        referencedColumnName = User.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_resolved_by_user_id")
    )
    @field:Valid
    var resolvedBy: User? = null,

    @field:Nullable
    @field:Embedded
    @field:AttributeOverrides(
        AttributeOverride(
            name = EmbeddableExpiringToken.TOKEN_ATTRIBUTE_NAME,
            column = Column(name = RESOLVE_TOKEN_COLUMN_NAME, unique = true)
        ),
        AttributeOverride(
            name = EmbeddableExpiringToken.EXPIRES_AT_ATTRIBUTE_NAME,
            column = Column(name = "${RESOLVE_TOKEN_COLUMN_NAME}_expires_at", unique = true)
        )
    )
    @field:Valid
    var resolveToken: EmbeddableExpiringToken<String>?,

    @field:Nullable
    @field:Column(name = "last_approved_at")
    var lastApprovedAt: LocalDateTime? = null,

    @field:Nullable
    @field:ManyToOne(cascade = [CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = "last_approved_by_id",
        referencedColumnName = User.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_last_approved_by_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    @field:Valid
    var lastApprovedBy: User? = null,

    @field:Nullable
    @field:Column(name = "canceled_at")
    var canceledAt: LocalDateTime? = null,

    @field:Nullable
    @field:ManyToOne(cascade = [CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = "canceled_by",
        referencedColumnName = User.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_canceled_by_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    @field:Valid
    var canceledBy: User? = null,

    @field:Nullable
    @field:Embedded
    @field:AttributeOverrides(
        AttributeOverride(
            name = EmbeddableExpiringToken.TOKEN_ATTRIBUTE_NAME,
            column = Column(name = CANCELING_TOKEN_COLUMN_NAME, unique = true)
        ),
        AttributeOverride(
            name = EmbeddableExpiringToken.EXPIRES_AT_ATTRIBUTE_NAME,
            column = Column(name = "${CANCELING_TOKEN_COLUMN_NAME}_expires_at", unique = true)
        )
    )
    var cancelingToken: EmbeddableExpiringToken<String>?,

    @field:Nullable
    @field:Column(name = "last_edited_at")
    var lastEditedAt: LocalDateTime? = null,

    @field:Nullable
    @field:ManyToOne(cascade = [CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = "last_edited_by_id",
        referencedColumnName = User.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_last_edited_by_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    @field:Valid
    var lastEditedBy: User? = null,

    @field:Version
    @field:Column(name = "version")
    val version: Long? = null,

    @field:NotNull
    @field:NotBlank
    @field:Column(name = "slug")
    val slug: String,

    @field:Id
    @field:SequenceGenerator(
        name = ID_SEQUENCE_GENERATOR_NAME,
        sequenceName = "advertisement_id_seq",
        initialValue = 10000,
        allocationSize = 5
    )
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_SEQUENCE_GENERATOR_NAME)
    @field:Column(name = ID_COLUMN_NAME)
    var id: Long? = null
) {
    /**
     * Check whether user is the one who owns the advertisement, and therefor has full control of it.
     *
     * Right now owner is the user who created the advertisement.
     * This may change in the future.
     *
     */
    fun isOwnedByUser(user: User): Boolean = createdBy.id == user.id

    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "advertisement_id_seq_gen"
        const val ID_COLUMN_NAME = "id"
        const val PROJECTS_FIELD_NAME = "projects"
        const val CANCELING_TOKEN_COLUMN_NAME = "canceling_token"
        const val RESOLVE_TOKEN_COLUMN_NAME = "resolve_token"
    }
}