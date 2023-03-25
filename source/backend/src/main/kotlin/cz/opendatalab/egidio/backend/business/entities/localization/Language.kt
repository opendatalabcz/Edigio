package cz.opendatalab.egidio.backend.business.entities.localization

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import org.hibernate.annotations.Immutable

@Entity(name = "Language")
@Table(
    name = "language",
    uniqueConstraints = [
        UniqueConstraint(name = "language_code_unique_constraint", columnNames = ["code"])
    ],
)
class Language(
    @field:NotNull
    @field:Pattern(regexp = "^[a-zA-Z]+(-[a-zA-Z]+)?$")
    @field:Column(name = "code")
    val code: String,

    @field:NotNull
    @field:Column(name = "allowed_for_multilingual_texts")
    val allowedForMultilingualTexts: Boolean,

    @field:SequenceGenerator(name = Advertisement.ID_SEQUENCE_GENERATOR_NAME, sequenceName = "advertisement_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = Advertisement.ID_SEQUENCE_GENERATOR_NAME)
    @field:Id
    @field:Column(
        name = ID_COLUMN_NAME
    )
    val id: Long? = null,
) {
    companion object {
        const val ID_COLUMN_NAME = "id"
    }
}
