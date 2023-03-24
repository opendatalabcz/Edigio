package cz.opendatalab.egidio.backend.business.entities.response

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
    @field:Nullable
    @field:Column(name = "responder_note")
    val responderNote: String?,

    @field:Nullable
    @field:Column(name = "advertiser_note")
    val advertiserNote: String?,

    @field:NotNull
    @field:OneToMany(mappedBy = "advertisement_response_id")
    var responseItems: MutableList<ResponseItem>,

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
    @field:SequenceGenerator(name = idGeneratorName, sequenceName = "advertisement_response_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = idGeneratorName)
    @field:Column(name = "id")
    var id: Long?
) {
    companion object {
        const val idGeneratorName = "advertisement_response_id_gen"
    }
}