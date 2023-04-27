package cz.opendatalab.egidio.backend.shared.converters.advertisement_template

import cz.opendatalab.egidio.backend.advertisement_template.TestAdvertisementTemplate
import cz.opendatalab.egidio.backend.shared.converters.multilingual_text.MultilingualTextConverterImpl
import cz.opendatalab.egidio.backend.utils.MultilingualTextTestUtils
import cz.opendatalab.egidio.backend.utils.MultilingualTextTestUtils.Companion.assertMultilingualTextEqualToActualDto
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*

class AdvertisementTemplateConverterImplTest {

    private val converter = AdvertisementTemplateConverterImpl(MultilingualTextConverterImpl())

    @Test
    fun entityToShortDto() {
        val template = TestAdvertisementTemplate.RIDE_TEMPLATE
        val actualDto = converter.entityToShortDto(template)
        assertMultilingualTextEqualToActualDto(template.name, actualDto.name)
        assertEquals(template.slug, actualDto.slug)
    }

    @Test
    fun entityToPreviewDto() {
        val template = TestAdvertisementTemplate.RIDE_TEMPLATE
        val actualDto = converter.entityToPreviewDto(template)
        assertMultilingualTextEqualToActualDto(template.name, actualDto.name)
        assertEquals(template.slug, actualDto.slug)
        //In case of missing description, either data or test should be changed to make sure that the description
        // is also assigned
        assertMultilingualTextEqualToActualDto(
            requireNotNull(template.description),
            requireNotNull(actualDto.description)
        )
    }
}