package cz.opendatalab.egidio.backend.business.entities.important_information

import cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text.MultilingualTextValid
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.net.URL

@Embeddable
class ImportantInformationLink(
    /**
     * Text that concisely describes where the link leads
     */
    @NotNull
    @MultilingualTextValid
    @ManyToOne
    @JoinColumn(
        name = "title_id",
        referencedColumnName = MultilingualText.ID_COLUMN_NAME
    )
    var title: MultilingualText,

    /**
     * Location to which link leads (URL)
     */
    @field:NotNull
    @field:NotBlank
    @field:Column(name = "location")
    var location: URL,
)