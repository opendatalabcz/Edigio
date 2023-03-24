package cz.opendatalab.egidio.backend.business.entities.response

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
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
    name = "response_item",
    uniqueConstraints = [
        UniqueConstraint(name = "response_item_public_id_unique_constraint", columnNames = ["public_id"])
    ]
)
class ResponseItem(
    /**
     * Resource which entity extends
     */
    @field:Nullable
    @field:ManyToOne
    @field:JoinColumn(
        name = "resource_id",
        referencedColumnName = "id",
        foreignKey = ForeignKey(name = "fk_response_item_resource_id")
    )
    val resource: Resource,

    /**
     * Description of an item
     */
    @field:Nullable
    @field:Column(name = "description")
    val description: String?,

    /**
     * Total amount offered/requested
     */
    @field:NotNull
    @field:PositiveOrZero
    @field:Column(name = "amount")
    val amount: Int?,

    /**
     * Response to which item belongs
     */
    @field:NotNull
    @field:ManyToOne
    @field:JoinColumn(
        name = "response_id",
        referencedColumnName = "id",
        foreignKey = ForeignKey(name = "fk_response_item_advertisement_id")
    )
    val response: AdvertisementResponse,

    /**
     * ID meant to be used for representation of the item outside the app
     */
    @field:Column(name = "public_id")
    var publicId: UUID? = null,

    /**
     * Internal identifier of an item
     */
    @field:SequenceGenerator(name = ID_SEQUENCE_GENERATOR_NAME, sequenceName = "advertisement_item_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_SEQUENCE_GENERATOR_NAME)
    @field:Id
    @field:Column(
        name = "id"
    )
    var id: Long? = null,

    @field:Embedded
    @field:AttributeOverrides(
        AttributeOverride(
            name = EmbeddableExpiringToken.TOKEN_ATTRIBUTE_NAME,
            column = Column(name = "access_token")
        ),
        AttributeOverride(
            name = EmbeddableExpiringToken.EXPIRES_AT_ATTRIBUTE_NAME,
            column = Column(name = "access_token_expires_at")
        ),
    )
    var accessToken: EmbeddableExpiringToken<String>,
) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "advertisement_item_id_seq_gen"
    }
}
