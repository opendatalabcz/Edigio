package cz.opendatalab.egidio.backend.business.entities.localization

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern

@Entity(name = "Language")
@Table(
    name = "language",
    uniqueConstraints = [
        UniqueConstraint(name = "language_code_unique_constraint", columnNames = ["code"])
    ]
)
class Language(
    @field:NotNull
    @field:Pattern(regexp = "^[a-zA-Z]+(-[a-zA-Z]+)?$")
    var code: String,

    @field:NotNull
    @field:Column(name = "allowed_for_multilingual_texts")
    var allowedForMultilingualTexts: Boolean,

    @field:SequenceGenerator(name = Advertisement.ID_SEQUENCE_GENERATOR_NAME, sequenceName = "advertisement_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = Advertisement.ID_SEQUENCE_GENERATOR_NAME)
    @field:Id
    @field:Column(
        name = "id"
    )
    var id: Long? = null,
)
