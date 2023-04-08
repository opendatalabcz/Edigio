package cz.opendatalab.egidio.backend.business.entities.advertisement

import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.PositiveOrZero
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
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
        UniqueConstraint(name = "advertisement_item_public_id_unique_constraint", columnNames = ["public_id"])
    ]
)
class AdvertisementItem(
    /**
     * Resource which entity extends
     */
    @field:NotNull
    @field:ManyToOne(cascade = [CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = "resource_id",
        referencedColumnName = Resource.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_item_resource_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    val resource: Resource,

    /**
     * Description of an item
     */
    @field:Nullable
    @field:OneToOne(
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    @field:JoinColumn(
        name = "description_id",
        referencedColumnName = MultilingualText.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_item_description_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    val description: MultilingualText?,

    /**
     * Total amount offered/requested
     */
    @field:NotNull
    @field:PositiveOrZero
    @field:Column(name = "amount")
    val amount: Int,

    /**
     * Advertisement to which item belongs
     */
    @field:NotNull
    @field:ManyToOne(cascade = [CascadeType.DETACH, CascadeType.REFRESH])
    @field:JoinColumn(
        name = "advertisement_id",
        referencedColumnName = Advertisement.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_item_advertisement_id")
    )
    @field:OnDelete(action =  OnDeleteAction.CASCADE)
    val advertisement: Advertisement,

    /**
     * ID meant to be used for representation of the item outside the app
     */
    @field:Column(name = "public_id")
    var publicId: UUID? = null,

    /**
     * Internal identifier of an item
     */
    @field:Id
    @field:SequenceGenerator(
        name = ID_SEQUENCE_GENERATOR_NAME,
        sequenceName = "advertisement_item_id_seq",
        initialValue = 10000,
        allocationSize = 10
    )
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_SEQUENCE_GENERATOR_NAME)
    @field:Column(
        name = "id"
    )
    var id: Long? = null
) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "advertisement_item_id_seq_gen"
        const val ADVERTISEMENT_FIELD_NAME = "advertisement"
    }
}
