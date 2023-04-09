package cz.opendatalab.egidio.backend.business.entities.advertisement.response

import cz.opendatalab.egidio.backend.business.entities.resource.Resource
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
@Entity(name = "ResponseItem")
@Table(
    name = "response_item",
    uniqueConstraints = [
        UniqueConstraint(name = "response_item_public_id_unique_constraint", columnNames = ["public_id"])
    ]
)
class ResponseItem(
    /**
     * Resource which entity extends
     */
    @field:NotNull
    @field:ManyToOne(cascade = [CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = "resource_id",
        referencedColumnName = Resource.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_response_item_resource_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    val resource: Resource,

    /**
     * Description of an item
     */
    @field:Nullable
    @field:Lob
    @field:Column(name = "description")
    val description: String?,

    /**
     * Total amount offered/requested
     */
    @field:NotNull
    @field:PositiveOrZero
    @field:Column(name = "amount")
    val amount: Int,

    /**
     * Response to which item belongs
     */
    @field:NotNull
    @field:ManyToOne(cascade = [CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = "response_id",
        referencedColumnName = AdvertisementResponse.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_response_item_advertisement_id")
    )
    @field:OnDelete(action = OnDeleteAction.CASCADE)
    val response: AdvertisementResponse,

    /**
     * ID meant to be used for representation of the item outside the app
     */
    @field:Column(name = "public_id")
    var publicId: UUID? = null,

    /**
     * Internal identifier of an item
     */
    @field:SequenceGenerator(
        name = ID_SEQUENCE_GENERATOR_NAME,
        sequenceName = "response_item_id_seq",
        initialValue = 10000,
        allocationSize = 10,
    )
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_SEQUENCE_GENERATOR_NAME)
    @field:Id
    @field:Column(
        name = ID_COLUMN_NAME
    )
    var id: Long? = null,
) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "response_item_id_seq_gen"
        const val ID_COLUMN_NAME = "id"
        const val RESPONSE_FIELD = "response"
    }
}
