package cz.opendatalab.egidio.backend.business.entities.location

import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank

@Entity(name = "Location")
@Table(name = "location")
class Location(
    @field:Nullable
    @field:NotBlank
    var country: String? = null,

    @field:Nullable
    @field:NotBlank
    var region: String? = null,

    @field:Nullable
    @field:NotBlank
    var city: String? = null,

    @field:Nullable
    @field:NotBlank
    var street: String? = null,

    @field:Nullable
    @field:NotBlank
    var houseNumber: String? = null,

    @field:Nullable
    @field:NotBlank
    var postalCode: String? = null,

    @SequenceGenerator(name = idSequenceGeneratorName, sequenceName = "location_id_seq")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = idSequenceGeneratorName)
    @Id
    var id: Long? = null
) {
    companion object {
        const val idSequenceGeneratorName = "location_id_seq_gen"
    }
}
