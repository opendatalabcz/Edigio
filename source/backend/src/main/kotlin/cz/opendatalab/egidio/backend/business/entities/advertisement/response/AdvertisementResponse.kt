package cz.opendatalab.egidio.backend.business.entities.advertisement.response

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.springframework.data.annotation.CreatedDate
import java.time.LocalDateTime
import java.util.*

/**
 * Response to an advertisement
 */
@Entity(name = "advertisement_response")
@Table(name = "date_of_creation")
class AdvertisementResponse(
    /**
     * Note written by responder during submission of response
     */
    @field:Nullable
    @field:Column(name = "responder_note")
    val responderNote: String?,

    /**
     * Note written byl advertiser while he was resolving (accepting/rejecting) the response
     */
    @field:Nullable
    @field:Column(name = "advertiser_note")
    val advertiserNote: String?,

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
    @field:OneToMany(
        mappedBy = ResponseItem.RESPONSE_FIELD,
        cascade = [CascadeType.ALL]
    )
    var responseItems: MutableList<ResponseItem>,

    @field:NotNull
    @field:ManyToOne(cascade = [CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH])
    @field:JoinColumn(
        name = Advertisement.ID_COLUMN_NAME,
        referencedColumnName = Advertisement.PROJECTS_FIELD_NAME,
        foreignKey = ForeignKey(name = "fk_advertisement_response_advertisement_id")
    )
    var advertisement: Advertisement,

    @field:Nullable
    @field:Column(name = "resolved_at")
    val resolvedAt: LocalDateTime?,

    @field:NotNull
    @field:CreatedDate
    @field:Column(name = "created_at")
    val createdAt: LocalDateTime,

    var responseStatus: ResponseStatus,

    @field:Column(name = "public_id")
    var publicId: UUID? = null,

    @field:Id
    @field:NotNull
    @field:SequenceGenerator(name = ID_GENERATOR_NAME, sequenceName = "advertisement_response_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_GENERATOR_NAME)
    @field:Column(name = "id")
    var id: Long?
) {
    companion object {
        const val ID_GENERATOR_NAME = "advertisement_response_id_gen"
        const val ID_COLUMN_NAME = "id"
        const val ADVERTISEMENT_FIELD_NAME = "advertisement"
    }
}