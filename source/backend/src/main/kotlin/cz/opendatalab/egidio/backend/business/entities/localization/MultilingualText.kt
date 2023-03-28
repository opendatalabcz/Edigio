package cz.opendatalab.egidio.backend.business.entities.localization

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import jakarta.persistence.*
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

/**
 * Texts are mapped by their language
 *
 * <p>More than one text for language is not allowed</p>
 */
@Entity(name = "MultilingualText")
@Table(name = "multilingual_text")
class MultilingualText(
    @field:NotNull
    @field:OneToOne(
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    @field:JoinColumn(
        name = "default_text_id",
        referencedColumnName = LocalizedText.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_multilingual_text_default_text_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    var defaultText: LocalizedText,

    @field:NotNull
    @field:OneToMany(
        mappedBy = LocalizedText.MULTILINGUAL_TEXT_FIELD_NAME,
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    var texts: MutableList<LocalizedText>,

    @field:SequenceGenerator(name = ID_SEQUENCE_GENERATOR_NAME, sequenceName = "multilingual_text_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = Advertisement.ID_SEQUENCE_GENERATOR_NAME)
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
        const val ID_SEQUENCE_GENERATOR_NAME = "multilingual_text_id_seq_gen"
        const val ID_COLUMN_NAME = "id"
    }
}