package cz.opendatalab.egidio.backend.business.entities.resource

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import java.util.UUID

@Entity(name = "Resource")
@Table(
    name = "resource",
    uniqueConstraints = [
        UniqueConstraint(name="resource_slug_unique_constraint", columnNames = [Resource.SLUG_COLUMN_NAME])
    ]
)
class Resource(
    /**
     * Name of resource
     */
    @field:NotNull
    @field:OneToOne(cascade = [CascadeType.ALL], orphanRemoval = true)
    @field:JoinColumn(
        name = "name_id",
        referencedColumnName = MultilingualText.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_resource_name_id")
    )
    val name: MultilingualText,

    /**
     * Description of resource
     */
    @field:NotNull
    @field:OneToOne(cascade = [CascadeType.ALL], orphanRemoval = true)
    @field:JoinColumn(
        name = "description_id",
        referencedColumnName = MultilingualText.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_resource_description_id")
    )
    val description: MultilingualText,

    /**
     * Slug of the resource
     */
    @field:NotNull
    @field:Column(name = SLUG_COLUMN_NAME)
    val slug: String,

    /**
     * Identifier of resource
     */
    @field:SequenceGenerator(name = ID_SEQUENCE_GENERATOR_NAME, sequenceName = "resource_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_SEQUENCE_GENERATOR_NAME)
    @field:Id
    @field:Column(
        name = ID_COLUMN_NAME
    )
    var id: Long? = null
) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "resource_id_seq_gen"
        const val ID_COLUMN_NAME = "id"
        const val SLUG_COLUMN_NAME = "slug"
    }
}
