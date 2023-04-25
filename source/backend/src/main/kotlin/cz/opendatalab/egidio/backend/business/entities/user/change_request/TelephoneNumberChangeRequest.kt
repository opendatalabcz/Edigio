package cz.opendatalab.egidio.backend.business.entities.user.change_request

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import java.time.LocalDateTime

@Entity(name = "TelephoneNuberChangeRequest")
@Table(name = "telephone_number_change_request")
class TelephoneNumberChangeRequest(
    @field:NotNull
    @field:ManyToOne
    @field:JoinColumn(
        name = "user_id",
        referencedColumnName = User.ID_COLUMN_NAME
    )
    val user : User,

    @field:NotNull
    @field:Pattern(regexp = UserValidationConstants.PHONE_NUMBER, message = "must be valid phone number.")
    @field:Column(name = "new_telephone_number")
    val newTelephoneNumber : String,

    @field:NotNull
    @field:Column(name = "created_at")
    var createdAt : LocalDateTime,

    @field:Nullable
    @field:Column(name = "closed_at")
    var closedAt : LocalDateTime?,

    @field:NotNull
    @field:Column(name = "status")
    var status : ChangeRequestStatus,

    @field:Nullable
    @field:Embedded
    @field:AttributeOverrides(
        AttributeOverride(
            name = EmbeddableExpiringToken.TOKEN_ATTRIBUTE_NAME,
            column = Column(name = "token")
        ),
        AttributeOverride(
            name = EmbeddableExpiringToken.EXPIRES_AT_ATTRIBUTE_NAME,
            column = Column(name = "token_expires_at")
        ),
    )
    var confirmationToken : EmbeddableExpiringToken<String>?,

    @field:Id
    @field:SequenceGenerator(
        name = ID_SEQUENCE_GENERATOR_NAME,
        sequenceName = "telephone_number_change_request_id_seq"
    )
    @field:GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = ID_SEQUENCE_GENERATOR_NAME
    )
    @field:Column(name = "id")
    var id : Long? = null,
) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "telephone_number_change_request_id_seq_gen"
    }
}