package cz.opendatalab.egidio.backend.business.entities.localization

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

/**
 * Texts are mapped by their language
 *
 * More than one text for language is not allowed
 */
@Entity(name = "MultilingualText")
@Table(name = "multilingual_text")
class MultilingualText(
    /**
     * Language of [text]
     */
    @field:NotNull
    @field:ManyToOne(
        cascade = [CascadeType.REFRESH, CascadeType.DETACH],
        fetch = FetchType.LAZY
    )
    @field:JoinColumn(
        name = DEFAULT_TEXT_LANGUAGE_ID_COLUMN_NAME,
        referencedColumnName = Language.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_localized_text_language_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    var defaultTextLanguage : Language,

    @field:ElementCollection
    @field:CollectionTable(
        name = "multilingual_text_localized_texts",
        uniqueConstraints = [
            UniqueConstraint(
                name = "language_unique_for_text",
                columnNames = [LOCALIZED_TEXTS_FK_COLUMN_NAME, LocalizedText.LANGUAGE_ID_COLUMN_NAME]
            )
        ]
    )
    @field:Column(name = "multilingual_text_id")
    var texts : MutableList<LocalizedText>,

    @field:Version
    @field:Column(name = "version")
    val version : Long? = null,

    @field:SequenceGenerator(
        name = ID_SEQUENCE_GENERATOR_NAME,
        sequenceName = "multilingual_text_id_seq",
        initialValue = 10000,
        allocationSize = 20
    )
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = Advertisement.ID_SEQUENCE_GENERATOR_NAME)
    @field:Id
    @field:Column(
        name = "id"
    )
    var id : Long? = null,
) {
    fun findTextForLanguageCode(languageCode : String) : LocalizedText? =
        texts.find { it.language.code == languageCode }

    fun getDefaultLanguageText() : LocalizedText =
        findTextForLanguageCode(requireNotNull(defaultTextLanguage.code) { "No default language set!" })
            ?: throw IllegalStateException("Text for default language not found!")


    fun getTextForLanguageCodeOrDefault(languageCode : String) : LocalizedText =
        findTextForLanguageCode(languageCode)
            ?: when (languageCode) {
                defaultTextLanguage.code -> throw IllegalStateException("Text for default language not found!")
                else -> getDefaultLanguageText()
            }


    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "multilingual_text_id_seq_gen"
        const val ID_COLUMN_NAME = "id"
        const val DEFAULT_TEXT_LANGUAGE_ID_COLUMN_NAME = "default_text_language_id"
        const val LOCALIZED_TEXTS_FK_COLUMN_NAME = "multilingual_text_id"
    }
}