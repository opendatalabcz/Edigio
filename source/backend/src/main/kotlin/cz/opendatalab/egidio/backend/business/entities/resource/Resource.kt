package cz.opendatalab.egidio.backend.business.entities.resource

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.business.shared.MultilingualText
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull

@Entity(name = "Resource")
@Table(name = "resource")
class Resource(
    /**
     * Name of resource
     */
    @NotNull
    @OneToOne
    @JoinColumn(name = "name_id", referencedColumnName = "id")
    val name: MultilingualText?,

    /**
     * Description of resource
     */
    @NotNull
    @OneToOne
    @JoinColumn(name = "name_id", referencedColumnName = "id")
    val description: MultilingualText?,

    /**
     * Identifier of resource
     */
    @field:SequenceGenerator(name = Advertisement.idSequenceGeneratorName, sequenceName = "resource_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = Advertisement.idSequenceGeneratorName)
    @field:Id
    @field:Column(
        name = "id"
    )
    val id: Long? = null
)
