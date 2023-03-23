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
    @field:JoinColumn(name = "title_id", referencedColumnName = "id")
    @field:OneToOne
    val title: MultilingualText,

    @field:NotNull
    @field:JoinColumn(name = "description_id", referencedColumnName = "id")
    @field:OneToOne
    val description: MultilingualText,

    @field:NotNull
    @field:Column(name = "catastrophe_type")
    var catastropheType: CatastropheType,

    @field:NotNull
    @field:CreatedDate
    @field:Column(name = "created_at")
    val createdAt: LocalDateTime,

    @field:NotNull
    @field:ManyToOne
    @field:JoinColumn(name = "created_by_id", referencedColumnName = "id")
    val createdBy: User,

    @field:Nullable
    @field:Column(name = "updated_at")
    val updatedAt: LocalDateTime,

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
