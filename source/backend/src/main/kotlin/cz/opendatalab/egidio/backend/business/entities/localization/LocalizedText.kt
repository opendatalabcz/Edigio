package cz.opendatalab.egidio.backend.business.entities.localization

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction


@Embeddable
class LocalizedText(
    /**
     * Actual text value in [language]
     *
     * Designed to store text of any length
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
        name = LANGUAGE_ID_COLUMN_NAME,
        referencedColumnName = Language.ID_COLUMN_NAME,
        foreignKey = ForeignKey(name = "fk_localized_text_language_id")
    )
    @field:OnDelete(action = OnDeleteAction.NO_ACTION)
    var language: Language,

    ) {
    companion object {
        const val LANGUAGE_ID_COLUMN_NAME = "language_id"
    }
}
