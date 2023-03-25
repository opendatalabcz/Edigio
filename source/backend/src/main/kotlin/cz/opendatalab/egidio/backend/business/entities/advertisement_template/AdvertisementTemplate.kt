package cz.opendatalab.egidio.backend.business.entities.advertisement_template

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementHelpType
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.business.entities.project.CatastropheType
import cz.opendatalab.egidio.backend.business.entities.project.Project
import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

/**
 * Template for common type of advertisement
 */
@Entity(name = "AdvertisementTemplate")
@Table(name = "advertisement_template")
class AdvertisementTemplate(
    @field:SequenceGenerator(name = ID_SEQUENCE_GENERATOR_NAME, sequenceName = "advertisement_template_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_SEQUENCE_GENERATOR_NAME)
    @field:Id
    var id: Long? = null,

    /**
     * Name of template
     */
    @field:NotNull
    @field:OneToOne(cascade = [CascadeType.ALL], orphanRemoval = true)
    @field:JoinColumn(
        name = "name_id",
        referencedColumnName = MultilingualText.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_template_name_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    var name: MultilingualText,

    /**
     * Template description
     */
    @field:Nullable
    @field:OneToOne(cascade = [CascadeType.ALL], orphanRemoval = true)
    @field:JoinColumn(
        name = "description_id",
        referencedColumnName = MultilingualText.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_template_description_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    var description: MultilingualText?,

    /**
     * Resources recommended by item
     */
    @field:NotNull
    @field:ManyToMany(cascade = [CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinTable(
        name = "recommended_resources",
        joinColumns = [
            JoinColumn(
                name = "advertisement_template_id",
                referencedColumnName = AdvertisementTemplate.ID_COLUMN_NAME
            )
        ],
        inverseJoinColumns = [
            JoinColumn(
                name = "resource_id",
                referencedColumnName = Resource.ID_COLUMN_NAME
            )
        ],
        foreignKey = ForeignKey(name = "fk_advertisement_template_recommended_resource_id"),
        inverseForeignKey = ForeignKey(name = "fk_resource_recommending_template_id"),
        uniqueConstraints = [
            UniqueConstraint(
                name = "resource_once_per_template_constraint",
                columnNames = ["advertisement_template_id", "resource_id"]
            )
        ],
    )
    var recommendedResources: MutableList<Resource>,

    @field:NotNull
    @field:ManyToMany(cascade = [CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinTable(
        name = "advertisement_template_projects",
        joinColumns = [
            JoinColumn(
                name = "advertisement_template_id",
                referencedColumnName = AdvertisementTemplate.ID_COLUMN_NAME
            )
        ],
        inverseJoinColumns = [
            JoinColumn(
                name = "project_id",
                referencedColumnName = Project.ID_COLUMN_NAME
            )
        ],
        foreignKey = ForeignKey(name = "fk_advertisement_template_project_id"),
        inverseForeignKey = ForeignKey(name = "fk_project_advertisement_template_id"),
        uniqueConstraints = [
            UniqueConstraint(
                name = "advertisement_template_unique_per_project",
                columnNames = ["advertisement_template_id", "project_id"]
            )
        ]
    )
    var projects: MutableSet<Project>,

    /**
     * Type of catastrophes for which template is suitable
     */
    @field:NotNull
    @field:ElementCollection
    @field:CollectionTable(
        name = "advertisement_template_catastrophe_types",
        joinColumns = [
            JoinColumn(name = "advertisement_template_id", referencedColumnName = ID_COLUMN_NAME)
        ],
        foreignKey = ForeignKey(name = "fk_catastrophe_type_advertisement_template_id"),
        uniqueConstraints = [
            UniqueConstraint(name = "advertisement_template_catastrophe_type_unique", columnNames = [
                "advertisement_template_id",
                "catastrophe_type"
            ])
        ]
    )
    @field:Column(name = "catastrophe_type")
    @field:Enumerated(value = EnumType.STRING)
    var catastropheTypes: MutableList<CatastropheType>,

    @field:NotNull
    @field:ElementCollection
    @field:CollectionTable(
        name = "advertisement_template_advertisement_types",
        joinColumns = [
            JoinColumn(name = "advertisement_template_id", referencedColumnName = ID_COLUMN_NAME)
        ],
        foreignKey = ForeignKey(name = "fk_advertisement_type_advertisement_template_id"),
        uniqueConstraints = [
            UniqueConstraint(name = "advertisement_template_advertisement_type_unique", columnNames = [
                "advertisement_template_id",
                "advertisement_type"
            ])
        ]
    )
    @field:Column(name = "advertisement_type")
    @field:Enumerated(value = EnumType.STRING)
    var advertisementTypes: MutableList<AdvertisementType>,

    @field:NotNull
    @field:ElementCollection
    @field:CollectionTable(
        name = "advertisement_template_advertisement_help_types",
        joinColumns = [
            JoinColumn(name = "advertisement_template_id", referencedColumnName = ID_COLUMN_NAME)
        ],
        foreignKey = ForeignKey(name = "fk_help_type_advertisement_template_id"),
        uniqueConstraints = [
            UniqueConstraint(name = "advertisement_template_help_type_unique", columnNames = [
                "advertisement_template_id",
                "help_type"
            ])
        ]
    )
    @field:Column(name = "help_type")
    @field:Enumerated(value = EnumType.STRING)
    var helpTypes: MutableList<AdvertisementHelpType>
) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "advertisement_template_id_seq_gen"
        const val ID_COLUMN_NAME = "id"
    }
}