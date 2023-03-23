package cz.opendatalab.egidio.backend.business.shared

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import jakarta.persistence.*
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull

/**
 * Texts are mapped by their language
 *
 * <p>More than one text for language is not allowed</p>
 */
@Entity(name = "MultilingualText")
@Table(name = "multilingual_text")
data class MultilingualText(
    @field:SequenceGenerator(name = idSequenceGeneratorName, sequenceName = "multilingual_text_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = Advertisement.idSequenceGeneratorName)
    @field:Id
    @field:Column(
        name = "id"
    )
    val id: Long,
    @NotNull
    @OneToOne
    @JoinColumn(name = "description_id")
    val defaultText: LocalizedText,
    @NotNull
    @NotEmpty
    @OneToMany(mappedBy = "localized_text_id")
    val texts: List<LocalizedText>
) {
    init {
        require(
            texts.contains(defaultText),
            {"Multilingual text not valid! Missing default language text!"}
        )
    }
    companion object {
        const val idSequenceGeneratorName = "multilingual_text_id_seq_gen"
    }
}