package cz.opendatalab.egidio.backend.business.shared

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull

@Entity(name = "LocalizedText")
@Table(name = "localized_text")
data class LocalizedText(
    @field:SequenceGenerator(name = idSequenceGeneratorName, sequenceName = "localized_text_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = idSequenceGeneratorName)
    @field:Id
    @field:Column(
        name = "id"
    )
    val id: Long,
    val text: String,

    @field:NotNull
    @field:ManyToOne(cascade = [CascadeType.ALL])
    @field:JoinColumn(name="language_id", referencedColumnName = "id")
    val language: Language
){
    companion object {
        const val idSequenceGeneratorName = "localized_text_id_seq_gen"
    }
}
