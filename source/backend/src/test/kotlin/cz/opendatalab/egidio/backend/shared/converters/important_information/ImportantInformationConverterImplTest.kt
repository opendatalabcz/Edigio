package cz.opendatalab.egidio.backend.shared.converters.important_information

import cz.opendatalab.egidio.backend.business.entities.important_information.ImportantInformationLink
import cz.opendatalab.egidio.backend.data.important_information.TestImportantInformation
import cz.opendatalab.egidio.backend.presentation.dto.important_information.ImportantInformationLinkDto
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.LocalizedTextDto
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import cz.opendatalab.egidio.backend.shared.converters.multilingual_text.MultilingualTextConverter
import cz.opendatalab.egidio.backend.shared.converters.multilingual_text.MultilingualTextConverterImpl
import cz.opendatalab.egidio.backend.utils.MultilingualTextTestUtils
import cz.opendatalab.egidio.backend.utils.MultilingualTextTestUtils.Companion.assertMultilingualTextEqualToActualDto
import io.mockk.every
import io.mockk.impl.annotations.MockK
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.`in`
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.MockitoAnnotations

class ImportantInformationConverterImplTest {


    var converter: ImportantInformationConverter = ImportantInformationConverterImpl(MultilingualTextConverterImpl())


    @Test
    fun convertImportantInformationLinkToDto() {
        val link = TestImportantInformation.SEZNAM_CZ.links.first()
        val actualDto = converter.convertImportantInformationLinkToDto(link)
        assertMultilingualTextEqualToActualDto(link.title, actualDto.title)
        assertThat(link.location.toExternalForm()).isEqualTo(actualDto.location)
    }

    @Test
    fun convertImportantInformationToDto() {
        val information = TestImportantInformation.SEZNAM_CZ
        val actualDto = converter.convertImportantInformationToDto(information)

        assertMultilingualTextEqualToActualDto(information.title, actualDto.title)
        assertMultilingualTextEqualToActualDto(information.text, actualDto.text)
        assertThat(actualDto.slug).isEqualTo(information.slug)
        assertThat(actualDto.links).hasSameSizeAs(information.links)

        val expectedLinks = information.links.map(converter::convertImportantInformationLinkToDto)
        assertThat(actualDto.links).containsExactlyInAnyOrderElementsOf(expectedLinks)
    }
}