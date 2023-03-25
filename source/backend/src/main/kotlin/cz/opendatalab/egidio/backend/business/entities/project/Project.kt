package cz.opendatalab.egidio.backend.business.entities.project

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.business.entities.user.User
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import java.time.LocalDateTime
import kotlin.math.acos

@Entity(name = "Project")
@Table(
    name = "project",
    uniqueConstraints = [
        UniqueConstraint(
            name = "project_slug_unique_constraint",
            columnNames = ["slug"]
        )
    ]
)
class Project(
    @field:NotNull
    @field:OneToOne(cascade = [CascadeType.ALL], orphanRemoval = true)
    @field:JoinColumn(
        name = "title_id",
        referencedColumnName = MultilingualText.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_project_title_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    val title: MultilingualText,

    @field:NotNull
    @field:OneToOne(cascade = [CascadeType.ALL], orphanRemoval = true)
    @field:JoinColumn(
        name = "description_id",
        referencedColumnName = MultilingualText.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_project_description_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    val description: MultilingualText,

    @field:NotNull
    @field:Enumerated(EnumType.STRING)
    @field:Column(name = "catastrophe_type")
    var catastropheType: CatastropheType,

    @field:NotNull
    @field:ManyToMany(
        mappedBy = Advertisement.PROJECTS_FIELD_NAME,
        cascade = [CascadeType.ALL]
    )
    var advertisements: MutableList<Advertisement>,

    @field:NotNull
    @field:CreatedDate
    @field:Column(name = "created_at")
    val createdAt: LocalDateTime,

    @field:NotNull
    @field:ManyToOne(cascade = [CascadeType.REFRESH, CascadeType.DETACH])
    @field:CreatedBy
    @field:JoinColumn(
        name = "created_by_id",
        referencedColumnName = User.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_project_created_by_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    val createdBy: User,

    @field:Nullable
    @field:Column(name = "updated_at")
    var updatedAt: LocalDateTime,

    @field:Nullable
    @field:ManyToOne(cascade = [CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = "updated_by_id",
        referencedColumnName = User.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_project_updated_by_id")
    )
    @field:OnDelete(action =  OnDeleteAction.NO_ACTION)
    var updatedBy: User,

    @field:NotBlank
    @field:Column(name = "slug")
    var slug: String? = null,

    @field:SequenceGenerator(name = ID_SEQUENCE_GENERATOR_NAME, sequenceName = "project_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_SEQUENCE_GENERATOR_NAME)
    @field:Id
    @field:Column(name = ID_COLUMN_NAME)
    var id: Long? = null,
) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "project_id_seq_gen"
        const val ID_COLUMN_NAME = "id"
    }
}
