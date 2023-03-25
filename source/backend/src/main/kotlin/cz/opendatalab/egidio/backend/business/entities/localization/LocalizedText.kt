package cz.opendatalab.egidio.backend.business.entities.localization

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

@Entity(name = "LocalizedText")
@Table(name = "localized_text")
class LocalizedText(
    /**
     * Actual text value in [language]
     */
    @field:NotNull
    @field:Column(name = "text")
    var text: String,

    /**
     * Language of [text]
     */
    @field:NotNull
    @field:ManyToOne(
        cascade = [CascadeType.REFRESH, CascadeType.DETACH],
        fetch = FetchType.LAZY
    )
    @field:JoinColumn(
        name = "language_id",
        referencedColumnName = Language.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_localized_text_language_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    var language: Language,

    @field:NotNull
    @field:ManyToOne(
        cascade = [CascadeType.REFRESH, CascadeType.DETACH],
        fetch = FetchType.LAZY
    )
    @field:JoinColumn(
        name = "multingual_text_id",
        referencedColumnName = MultilingualText.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_localized_text_multilingual_text_id")
    )
    @field:OnDelete(action = OnDeleteAction.CASCADE)
    var multilingualText: MultilingualText,

    /**
     * Internal identifier of text
     */
    @field:SequenceGenerator(name = ID_SEQUENCE_GENERATOR_NAME, sequenceName = "localized_text_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_SEQUENCE_GENERATOR_NAME)
    @field:Id
    @field:Column(name = ID_COLUMN_NAME)
    var id: Long? = null

) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "localized_text_id_seq_gen"
        const val ID_COLUMN_NAME = "id"
        const val MULTILINGUAL_TEXT_FIELD_NAME = "multilingualText"
    }
}
