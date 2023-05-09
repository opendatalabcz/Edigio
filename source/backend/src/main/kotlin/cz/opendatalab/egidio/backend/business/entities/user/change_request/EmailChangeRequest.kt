package cz.opendatalab.egidio.backend.business.entities.user.change_request

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import cz.opendatalab.egidio.backend.business.entities.user.User
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotNull
import java.time.OffsetDateTime

@Entity(name = "EmailChangeRequest")
@Table(name = "email_change_request")
class EmailChangeRequest(
    @field:NotNull
    @field:ManyToOne
    @field:JoinColumn(
        name = "user_id",
        referencedColumnName = User.ID_COLUMN_NAME
    )
    val user: User,

    @field:NotNull
    @field:Email
    @field:Column(name = "new_email")
    val newEmail: String,

    @field:Nullable
    @field:Embedded
    @field:AttributeOverrides(
        AttributeOverride(
            name = EmbeddableExpiringToken.TOKEN_ATTRIBUTE_NAME,
            column = Column(name = "current_email_token")
        ),
        AttributeOverride(
            name = EmbeddableExpiringToken.EXPIRES_AT_ATTRIBUTE_NAME,
            column = Column(name = "current_email_token_expires_at")
        ),
    )
    var currentEmailToken : EmbeddableExpiringToken<String>?,

    @field:Nullable
    @field:Embedded
    @field:AttributeOverrides(
        AttributeOverride(
            name = EmbeddableExpiringToken.TOKEN_ATTRIBUTE_NAME,
            column = Column(name = "new_email_token")
        ),
        AttributeOverride(
            name = EmbeddableExpiringToken.EXPIRES_AT_ATTRIBUTE_NAME,
            column = Column(name = "new_email_token_expires_at")
        ),
    )
    var newEmailToken : EmbeddableExpiringToken<String>?,

    @field:NotNull
    @field:Column(name = "created_at")
    var createdAt: OffsetDateTime,

    @field:Nullable
    @field:Column(name = "closed_at")
    var closedAt: OffsetDateTime?,

    @field:NotNull
    @field:Column(name = "status")
    var status: ChangeRequestStatus,

    @field:Id
    @field:SequenceGenerator(
        name = ID_SEQUENCE_GENERATOR_NAME,
        sequenceName = "email_change_request_id_seq"
    )
    @field:GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = ID_SEQUENCE_GENERATOR_NAME
    )
    @field:Column(name = "id")
    var id: Long? = null,
) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "email_change_request_id_seq_gen"
    }
}