package cz.opendatalab.egidio.backend.business.entities.user

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import cz.opendatalab.egidio.backend.business.entities.localization.Language
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants.NAME_PART
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants.PASSWORD_MAX_LENGTH
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants.PASSWORD_MIN_LENGTH
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants.PASSWORD_REGEX
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants.USERNAME_MAX_LENGTH
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants.USERNAME_MIN_LENGTH
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants.USERNAME_REGEX
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
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
    name = "user_account",
    uniqueConstraints = [
        UniqueConstraint(name = "user_public_id_unique_constraint", columnNames = ["public_id"]),
        UniqueConstraint(name = "user_username_unique_constraint", columnNames = ["username"]),
    ]
)
class User(
    @field:Nullable
    @field:Size(
        min = USERNAME_MIN_LENGTH,
        message = "is too short (min length is $USERNAME_MIN_LENGTH)"
    )
    @field:Size(
        max = USERNAME_MAX_LENGTH,
        message = "is too long (max length is $USERNAME_MAX_LENGTH)"
    )
    @field:Pattern(
        regexp = USERNAME_REGEX,
        message = "contains chars that are not valid for username"
    )
    @field:Column(name = "username")
    val username: String?,

    /**
     * Firstname of user
     */
    @field:NotNull
    @field:Pattern(
        regexp = NAME_PART,
        message = "must be valid firstname"
    )
    @field:Column(name = "firstname")
    var firstname: String,

    /**
     * Lastname of user
     */
    @field:NotNull
    @field:Pattern(
        regexp = NAME_PART,
        message = "must be valid lastname"
    )
    @field:Column(name = "lastname")
    var lastname: String,

    @field:Nullable
    @field:Size(
        min = PASSWORD_MIN_LENGTH,
        message = "Password is too short (min length is $PASSWORD_MIN_LENGTH)"
    )
    @field:Size(
        max = PASSWORD_MAX_LENGTH,
        message = "Password is too long $PASSWORD_MAX_LENGTH"
    )
    //Pattern that allows alphanumeric chars and special chars as described here
    // https://owasp.org/www-community/password-special-characters
    @field:Pattern(
        regexp = PASSWORD_REGEX,
        message = "must contain only valid password characters!"
    )
    val password: String?,

    /**
     * Phone number of user.
     */
    @field:Nullable
    @field:Pattern(
        regexp = UserValidationConstants.PHONE_NUMBER,
        message = "must be valid phone number"
    )
    @field:Column(name = "phone_number")
    var phoneNumber: String?,

    /**
     * Email address of user
     */
    @field:NotNull
    @field:Email
    @field:Column(name = "email")
    var email: String,

    /**
     * Languages that user knows
     */
    @field:NotNull
    @field:ManyToMany
    @field:JoinTable(
        name = "user_spoken_languages",
        joinColumns = [
            JoinColumn(name = "user_id", referencedColumnName = ID_COLUMN_NAME)
        ],
        inverseJoinColumns = [
            JoinColumn(name = "language_id", referencedColumnName = Language.ID_COLUMN_NAME)
        ],
        foreignKey = ForeignKey(name = "fk_language_spoken_by_user"),
        inverseForeignKey = ForeignKey(name = "fk_user_speaking_language"),
    )
    var spokenLanguages: MutableList<Language>,

    @field:Embedded
    @field:AttributeOverrides(
        AttributeOverride(
            name = PublishedContactDetailSettings.FIRSTNAME_ATTRIBUTE_NAME,
            column = Column(
                name = "published_contact_detail_settings_firstname",
                nullable = false
            )
        ),
        AttributeOverride(
            name = PublishedContactDetailSettings.LASTNAME_ATTRIBUTE_NAME,
            column = Column(
                name = "published_contact_detail_settings_lastname",
                nullable = false
            )
        ),
        AttributeOverride(
            name = PublishedContactDetailSettings.EMAIL_ATTRIBUTE_NAME,
            column = Column(
                name = "published_contact_detail_settings_email",
                nullable = false
            )
        ),
        AttributeOverride(
            name = PublishedContactDetailSettings.TELEPHONE_NUMBER_ATTRIBUTE_NAME,
            column = Column(
                name = "published_contact_detail_settings_telephone_number",
                nullable = false
            )
        )
    )
    var publishedContactDetailSettings: PublishedContactDetailSettings,

    /**
     * Time when user has registered.
     * If user is not registered, this date represents creation date
     */
    @field:NotNull
    @field:Column(name = "registered_at")
    val registeredAt: LocalDateTime,

    /**
     * Indicator saying whether the email was confirmed after registration
     */
    @field:NotNull
    @field:Column(name = "email_confirmed")
    var emailConfirmed: Boolean,

    /**
     * Token used to verify user email after first registration
     */
    @field:Nullable
    @field:Column(name = "email_confirmation_token")
    var emailConfirmationToken: EmbeddableExpiringToken<UUID>?,

    /**
     * Indicator saying whether user is registered or whether he's an anonymous user
     *
     * <p>
     *     Non-registered user is most likely created during creation of advertisement,
     *     responding to advertisement or contacting us using contact form.
     * </p>
     */
    @field:NotNull
    @field:Column(name = "registered")
    val registered: Boolean,

    /**
     * Role assigned to user
     */
    @field:NotNull
    @field:Column(name = "role")
    var role: Role = Role.USER,

    /**
     * ID that should be used to reference the User outside the application
     */
    @field:Column(
        name = "public_id"
    )
    val publicId: UUID?,

    /**
     * Users accound is locked.
     *
     * Might be either because of not confirmed email or it might've been blocked by admin
     */
    @field:NotNull
    @field:Column(name = "locked")
    var locked: Boolean,

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
    val isAtLeastCoordinator: Boolean
        get() = role in setOf(Role.COORDINATOR, Role.ADMIN)

    companion object {
        private const val ID_SEQUENCE_GENERATOR_NAME = "user_id_seq_gen"
        const val ID_COLUMN_NAME = "id"
    }
}
