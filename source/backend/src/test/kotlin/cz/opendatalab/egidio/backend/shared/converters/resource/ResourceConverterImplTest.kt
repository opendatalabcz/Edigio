package cz.opendatalab.egidio.backend.shared.converters.resource

import cz.opendatalab.egidio.backend.data.resource.TestResource
import cz.opendatalab.egidio.backend.shared.converters.multilingual_text.MultilingualTextConverterImpl
import cz.opendatalab.egidio.backend.utils.MultilingualTextTestUtils.Companion.assertMultilingualTextEqualToActualDto
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class ResourceConverterImplTest {

    val multilingualTextConverter = MultilingualTextConverterImpl()
    val resourceConverter = ResourceConverterImpl(multilingualTextConverter)

    @Test
    fun convertToDto() {
        val resource = TestResource.BOTTLED_WATER_RESOURCE
        val actual = resourceConverter.convertToDto(resource)
        assertThat(actual.slug).isEqualTo(resource.slug)
        assertMultilingualTextEqualToActualDto(resource.name, actual.name)
        assertMultilingualTextEqualToActualDto(resource.description, actual.description)
    }

    @Test
    fun convertToShortDto() {
        val resource = TestResource.BOTTLED_WATER_RESOURCE
        val actual = resourceConverter.convertToShortDto(resource)
        assertThat(actual.slug).isEqualTo(resource.slug)
        assertMultilingualTextEqualToActualDto(resource.name, actual.name)
    }
}