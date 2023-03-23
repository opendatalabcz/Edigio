package cz.opendatalab.egidio.backend.business.entities.localization

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
class MultilingualText(
    @field:NotNull
    @field:OneToOne
    @field:JoinColumn(name = "description_id")
    var defaultText: LocalizedText,

    @field:NotNull
    @field:NotEmpty
    @field:OneToMany(mappedBy = "localized_text_id")
    var texts: MutableList<LocalizedText>,

    @field:SequenceGenerator(name = idSequenceGeneratorName, sequenceName = "multilingual_text_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = Advertisement.idSequenceGeneratorName)
    @field:Id
    @field:Column(
        name = "id"
    )
    var id: Long? = null,
) {
    init {
        require(
            texts.contains(defaultText),
            { "Multilingual text not valid! Missing default language text!" }
        )
        require(
            texts.all({ it.language.allowedForMultilingualTexts }),
            { "One of texts languages is not allowed for multilingual text!" }
        )
        require(
            texts.distinctBy({ it.language.code }).size == texts.size,
            { "Two or more texts in share the same language!" }
        )
    }

    companion object {
        const val idSequenceGeneratorName = "multilingual_text_id_seq_gen"
    }
}