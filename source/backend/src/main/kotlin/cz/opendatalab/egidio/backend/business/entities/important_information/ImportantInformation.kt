package cz.opendatalab.egidio.backend.business.entities.important_information

import cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text.MultilingualTextValid
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import org.springframework.lang.NonNull

@Entity(name = "ImportantInformation")
@Table(name = "important_information")
class ImportantInformation(
    /**
     * Title that concisely describes the information
     */
    @field:NotNull
    @field:MultilingualTextValid
    @field:ManyToOne()
    @field:JoinColumn(
        name = "title_id",
        referencedColumnName = MultilingualText.ID_COLUMN_NAME
    )
    val title: MultilingualText,

    /**
     * Text that describes the information
     */
    @field:NotNull
    @field:MultilingualTextValid
    @field:ManyToOne
    @field:JoinColumn(
        name = "description_id",
        referencedColumnName = MultilingualText.ID_COLUMN_NAME
    )
    val text: MultilingualText,

    /**
     * Links related to the information (e.g. subpages of site)
     */
    @field:NonNull
    @field:NotEmpty
    @field:ElementCollection
    @field:CollectionTable(
        name = "important_information_link",
        joinColumns = [
            JoinColumn(name = "important_information_id", referencedColumnName = ID_COLUMN_NAME)
        ]
    )
    val links: List<ImportantInformationLink>,

    @field:Version
    @field:Column(name = "version")
    val version: Long? = null,

    @field:NotNull
    @field:NotBlank
    val slug: String,

    /**
     * Internal identifier of information
     */
    @field:SequenceGenerator(
        name = ID_SEQUENCE_GENERATOR_NAME,
        sequenceName = "important_information_id_seq_gen_name",
        initialValue = 10000,
        allocationSize = 1
    )
    @field:GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = ID_SEQUENCE_GENERATOR_NAME
    )
    @field:Id
    @field:Column(name = ID_COLUMN_NAME)
    val id: Long?,
) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "important_information_id_seq_name"
        const val ID_COLUMN_NAME = "id"
    }
}