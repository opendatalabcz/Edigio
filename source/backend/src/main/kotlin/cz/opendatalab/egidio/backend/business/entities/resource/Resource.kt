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
        UniqueConstraint(name="resource_slug_unique_constraint", columnNames = ["slug"])
    ]
)
class Resource(
    /**
     * Name of resource
     */
    @field:NotNull
    @field:OneToOne
    @field:JoinColumn(
        name = "name_id",
        referencedColumnName = "id",
        foreignKey = ForeignKey(name = "fk_resource_name_id")
    )
    val name: MultilingualText?,

    /**
     * Description of resource
     */
    @field:NotNull
    @field:OneToOne
    @field:JoinColumn(
        name = "description_id",
        referencedColumnName = "id",
        foreignKey = ForeignKey(name = "fk_resource_description_id")
    )
    val description: MultilingualText?,

    /**
     * Slug of the resource
     */
    @field:NotNull
    @field:Column(name = "slug")
    val slug: String,

    /**
     * Identifier of resource
     */
    @field:SequenceGenerator(name = Advertisement.ID_SEQUENCE_GENERATOR_NAME, sequenceName = "resource_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = Advertisement.ID_SEQUENCE_GENERATOR_NAME)
    @field:Id
    @field:Column(
        name = "id"
    )
    var id: Long? = null
)
