package cz.opendatalab.egidio.backend.business.entities.localization

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern

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

    @field:SequenceGenerator(
        name = ID_SEQUENCE_GENERATOR_NAME,
        sequenceName = "language_id_seq",
        allocationSize = 1
    )
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_SEQUENCE_GENERATOR_NAME)
    @field:Id
    @field:Column(
        name = ID_COLUMN_NAME
    )
    val id: Long? = null,
) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "language_id_seq_gen"
        const val ID_COLUMN_NAME = "id"
    }
}
