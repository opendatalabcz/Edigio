package cz.opendatalab.egidio.backend.business.entities.location

import jakarta.annotation.Nullable
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank

@Entity(name = "Location")
@Table(name = "location")
class Location(
    @Nullable
    @NotBlank
    var country: String? = null,

    @Nullable
    @NotBlank
    var region: String? = null,

    @Nullable
    @NotBlank
    var city: String? = null,

    @Nullable
    @NotBlank
    var street: String? = null,

    @Nullable
    @NotBlank
    var houseNumber: String? = null,

    @Nullable
    @NotBlank
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
