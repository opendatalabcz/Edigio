package cz.opendatalab.egidio.backend.business.entities.advertisement.response

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text.UniqueResponseItemsResources
import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import cz.opendatalab.egidio.backend.business.entities.user.User
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.Valid
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import java.time.LocalDateTime
import java.util.*

/**
 * Response to an advertisement
 */
@Entity(name = "advertisementResponse")
@Table(name = "advertisement_response")
class AdvertisementResponse(
    /**
     * Note written by responder during submission of response
     */
    @field:Nullable
    @field:Column(name = "responder_note")
    var responderNote : String?,

    /**
     * Note written byl advertiser while he was resolving (accepting/rejecting) the response
     */
    @field:Nullable
    @field:Column(name = "advertiser_note")
    var advertiserNote : String?,

    /**
     * Items include in response
     *
     * <p>
     *     Items are not required to be in check with items listed in advertisement.
     *     It's possible that items that are not even listed in advertisement will be listed in response.
     *     It's also possible for items listed in advertisement not to be included in response.
     *     Amount may also vary.
     * </p>
     */
    @field:NotNull
    @field:UniqueResponseItemsResources
    @field:OneToMany(
        mappedBy = ResponseItem.RESPONSE_FIELD,
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    var responseItems : MutableList<ResponseItem>,

    @field:NotNull
    @field:ManyToOne(cascade = [CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = "advertisement_id",
        referencedColumnName = Advertisement.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_response_advertisement_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    var advertisement : Advertisement,

    @field:Nullable
    @field:Column(name = "resolved_at")
    var resolvedAt : LocalDateTime?,

    @field:Valid
    @field:NotNull
    @field:ManyToOne(cascade = [CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = "created_by_id",
        referencedColumnName = User.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_created_by_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    val createdBy : User,

    @field:NotNull
    @field:Column(name = "created_at")
    val createdAt : LocalDateTime,

    @field:NotNull
    @field:Enumerated(EnumType.STRING)
    @field:Column(name = "response_status")
    var responseStatus : AdvertisementResponseStatus,

    @field:Nullable
    @field:Embedded
    @field:AttributeOverrides(
        AttributeOverride(
            name = EmbeddableExpiringToken.TOKEN_ATTRIBUTE_NAME,
            column = Column(name = "resolve_token")
        ),
        AttributeOverride(
            name = EmbeddableExpiringToken.EXPIRES_AT_ATTRIBUTE_NAME,
            column = Column(name = "resolve_token_expires_at")
        ),
    )
    var resolveToken : EmbeddableExpiringToken<String>?,

    @field:Nullable
    @field:Embedded
    @field:AttributeOverrides(
        AttributeOverride(
            name = EmbeddableExpiringToken.TOKEN_ATTRIBUTE_NAME,
            column = Column(name = "preview_token")
        ),
        AttributeOverride(
            name = EmbeddableExpiringToken.EXPIRES_AT_ATTRIBUTE_NAME,
            column = Column(name = "preview_token_expires_at")
        ),
    )
    var previewToken : EmbeddableExpiringToken<String>?,

    @field:Version
    @field:Column(name = "version")
    val version : Long? = null,

    @field:Column(name = "public_id")
    var publicId : UUID,

    @field:Id
    @field:NotNull
    @field:SequenceGenerator(
        name = ID_GENERATOR_NAME,
        sequenceName = "advertisement_response_id_seq",
        initialValue = 10000,
        allocationSize = 1
    )
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_GENERATOR_NAME)
    @field:Column(name = "id")
    var id : Long?
) {
    fun isUserAdvertiser(user : User) = advertisement.isOwnedByUser(user)

    fun isUserResponder(user : User) = createdBy.id == user.id

    /**
     * Indicator saying whether response was somehow resolved (accepted or rejected)
     */
    val isResolved : Boolean
        get() = responseStatus !in setOf(
            AdvertisementResponseStatus.WAITING_FOR_RESOLVE,
            AdvertisementResponseStatus.WAITING_FOR_CONTACT_CONFIRMATION
        )

    companion object {
        const val ID_GENERATOR_NAME = "advertisement_response_id_gen"
        const val ID_COLUMN_NAME = "id"
        const val ADVERTISEMENT_FIELD_NAME = "advertisement"
    }
}