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

    @field:SequenceGenerator(name = ID_SEQUENCE_GENERATOR_NAME, sequenceName = "location_id_seq")
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_SEQUENCE_GENERATOR_NAME)
    @field:Id
    var id: Long? = null
) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "location_id_seq_gen"
    }
}
