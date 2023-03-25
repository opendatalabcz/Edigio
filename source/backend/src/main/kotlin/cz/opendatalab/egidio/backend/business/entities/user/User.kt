package cz.opendatalab.egidio.backend.business.entities.user

import cz.opendatalab.egidio.backend.business.entities.localization.Language
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationPatterns
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import java.time.LocalDateTime
import java.util.*


/**
 * Entity representing a user
 *
 * <p>
 *     User is either registered or unregistered
 *     For simplicity both are stored in the same entity,
 *     as they both share the same properties.
 *     Only difference is uniqueness of their email.
 *     Emails must be unique among registered users
 * </p>
 */
@Entity(name = "user")
@Table(
    name = "user",
    uniqueConstraints = [
        UniqueConstraint(name = "user_public_id_unique_constraint", columnNames = ["public_id"]),
    ]
)
class User(
    /**
     * Firstname of user
     */
    @field:NotNull
    @field:Pattern(regexp = UserValidationPatterns.NAME_PART)
    @field:Column(name = "firstname")
    var firstname: String,

    /**
     * Lastname of user
     */
    @field:NotNull
    @field:Pattern(regexp = UserValidationPatterns.NAME_PART)
    @field:Column(name = "lastname")
    var lastname: String,

    /**
     * Phone number of user.
     */
    @field:Nullable
    @field:Pattern(regexp = UserValidationPatterns.PHONE_NUMBER)
    @field:Column(name = "phone_number")
    var phoneNumber: String?,

    @field:NotNull
    @field:Email
    @field:Column(name = "email")
    var email: String?,

    @field:NotNull
    @field:ManyToMany
    @field:JoinTable(
        name = "user_spoken_languages",
        joinColumns = [
            JoinColumn(name = "user_id", referencedColumnName = User.ID_COLUMN_NAME)
        ],
        inverseJoinColumns = [
            JoinColumn(name = "language_id", referencedColumnName = Language.ID_COLUMN_NAME)
        ]
    )
    var spokenLanguages: MutableList<Language>,

    @field:NotNull
    @field:Column(name = "registered_at")
    val registeredAt: LocalDateTime,

    @field:NotNull
    @field:Column(name = "contact_confirmed")
    val emailConfirmed: Boolean = false,

    @field:Nullable
    @field:Column(name = "confirmation_token")
    val emailConfirmationToken: String?,

    @field:NotNull
    @field:Column(name = "registered")
    val registered: Boolean,

    @field:NotNull
    @field:Column(name = "role")
    val role: Role = Role.USER,

    /**
     * ID that should be used to reference the User outside the application
     */
    @field:Column(
        name = "public_id"
    )
    val publicId: UUID? = null,

    /**
     * Internal identifier of an User
     *
     * <p>Shouldn't be used to identify the object outside the application. Use [publicId] instead.</p>
     */
    @field:SequenceGenerator(name = ID_SEQUENCE_GENERATOR_NAME, sequenceName = "user_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_SEQUENCE_GENERATOR_NAME)
    @field:Id
    @field:Column(
        name = ID_COLUMN_NAME
    )
    var id: Long? = null,
) {

    companion object {
        private const val ID_SEQUENCE_GENERATOR_NAME = "user_id_seq_gen"
        const val ID_COLUMN_NAME = "id"
    }
}
