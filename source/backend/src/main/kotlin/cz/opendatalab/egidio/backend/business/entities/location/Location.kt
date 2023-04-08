package cz.opendatalab.egidio.backend.business.entities.location

import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank

@Entity(name = "Location")
@Table(name = "location")
class Location(
    @field:Nullable
    @field:NotBlank
    @field:Column(name = "country")
    var country: String? = null,

    @field:Nullable
    @field:NotBlank
    @field:Column(name = "region")
    var region: String? = null,

    @field:Nullable
    @field:NotBlank
    @field:Column(name = "city")
    var city: String? = null,

    @field:Nullable
    @field:NotBlank
    @field:Column(name = "street")
    var street: String? = null,

    @field:Nullable
    @field:NotBlank
    @field:Column(name = "houseNumber")
    var houseNumber: String? = null,

    @field:Nullable
    @field:NotBlank
    @field:Column(name = "postalCode")
    var postalCode: String? = null,

    @field:SequenceGenerator(
        name = ID_SEQUENCE_GENERATOR_NAME,
        sequenceName = "location_id_seq",
        initialValue = 10000,
        allocationSize = 10
    )
    @field:GeneratedValue(strategy = GenerationType.SEQUENCE, generator = ID_SEQUENCE_GENERATOR_NAME)
    @field:Id
    @field:Column(name = ID_COLUMN_NAME)
    var id: Long? = null
) {
    companion object {
        const val ID_SEQUENCE_GENERATOR_NAME = "location_id_seq_gen"
        const val ID_COLUMN_NAME = "id"
    }
}
