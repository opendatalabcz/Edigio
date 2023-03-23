package cz.opendatalab.egidio.backend.business.entities.advertisement

import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.PositiveOrZero
import java.util.*

/**
 * Class that represents item listed in Advertisement.
 *
 * <p>
 *     It may represent more than one item, when all of them are the same kind.
 *     In that case, amount is greater than zero
 * </p>
 *
 */
@Entity(name = "AdvertisementItem")
@Table(
    name = "advertisement_item",
    uniqueConstraints = [
        UniqueConstraint(name = "advertisement_item_public_id_unique", columnNames = ["public_id"])
    ]
)
class AdvertisementItem(
    /**
     * Resource which entity extends
     */
    @field:Nullable
    @field:ManyToOne
    @field:JoinColumn(name = "resource_id", referencedColumnName = "id")
    val resource: Resource,

    /**
     * Description of an item
     */
    @field:Nullable
    @field:OneToOne
    @field:JoinColumn(name = "description_id", referencedColumnName = "id")
    val description: MultilingualText?,

    /**
     * Total amount offered/requested
     */
    @field:NotNull
    @field:PositiveOrZero
    @field:Column(name = "amount")
    val amount: Int?,

    /**
     * Advertisement to which item belongs
     */
    @field:NotNull
    @ManyToOne
    @field:JoinColumn(name = "advertisement_id", referencedColumnName = "id")
    val advertisement: Advertisement,

    /**
     * ID meant to be used for representation of the item outside the app
     */
    @field:Column(name = "public_id")
    var publicId: UUID? = null,

    /**
     * Internal identifier of an item
     */
    @field:SequenceGenerator(name = idSequenceGeneratorName, sequenceName = "advertisement_item_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = idSequenceGeneratorName)
    @field:Id
    @field:Column(
        name = "id"
    )
    var id: Long? = null
) {
    companion object {
        const val idSequenceGeneratorName = "advertisement_item_id_seq_gen"
    }
}
