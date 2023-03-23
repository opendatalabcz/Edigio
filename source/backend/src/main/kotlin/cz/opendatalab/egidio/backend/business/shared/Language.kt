package cz.opendatalab.egidio.backend.business.shared

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import jakarta.persistence.*
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern

@Entity(name = "Language")
@Table(name = "language")
data class Language(
    @field:SequenceGenerator(name = Advertisement.idSequenceGeneratorName, sequenceName = "advertisement_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = Advertisement.idSequenceGeneratorName)
    @field:Id
    @field:Column(
        name = "id"
    )
    val id: Long = 0,

    @field:NotNull
    @field:Pattern(regexp = "^[a-zA-Z]+(-[a-zA-Z]+)?$")
    val code: String
)
