package cz.opendatalab.egidio.backend.business.entities.project

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.business.entities.user.User
import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.springframework.data.annotation.CreatedDate
import java.time.LocalDateTime

@Entity(name = "Project")
class Project(
    @field:NotNull
    @JoinColumn(name = "title_id", referencedColumnName = "id")
    @OneToOne
    val title: MultilingualText,

    @field:NotNull
    @JoinColumn(name = "description_id", referencedColumnName = "id")
    @OneToOne
    val description: MultilingualText,

    @field:NotNull
    @field:CreatedDate
    val creationDate: LocalDateTime,

    @field:NotNull
    @field:ManyToOne
    @field:JoinColumn(name = "created_by_id", referencedColumnName = "id")
    val createdBy: User,

    @field:Nullable
    var updateDate: LocalDateTime,

    @field:Nullable
    @field:ManyToOne
    @field:JoinColumn(name = "updated_by_id", referencedColumnName = "id")
    var updatedBy: User,

    @field:SequenceGenerator(name = idSequenceGeneratorName, sequenceName = "project_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = idSequenceGeneratorName)
    @field:Id
    var id: Long? = null,
) {
    companion object {
        const val idSequenceGeneratorName = "project_id_seq_gen"
    }
}
