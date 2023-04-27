package cz.opendatalab.egidio.backend.shared.converters.project

import cz.opendatalab.egidio.backend.data.project.TestProject
import cz.opendatalab.egidio.backend.shared.converters.multilingual_text.MultilingualTextConverterImpl
import cz.opendatalab.egidio.backend.utils.MultilingualTextTestUtils.Companion.assertMultilingualTextEqualToActualDto
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class ProjectConverterImplTest {

    lateinit var converter : ProjectConverter

    @BeforeEach
    fun beforeEach() {
        converter = ProjectConverterImpl(MultilingualTextConverterImpl())
    }

    @Test
    fun projectToShortDto() {
        val project = TestProject.UKRAINE
        val actual = converter.projectToShortDto(project)
        assertThat(actual.slug).isEqualTo(project.slug)
        assertThat(actual.status).isEqualTo(project.status)
        assertMultilingualTextEqualToActualDto(project.title, actual.title)
        assertMultilingualTextEqualToActualDto(project.description, actual.description)
    }

    @Test
    fun projectToDetailPageDto() {
        val project = TestProject.UKRAINE
        val actual = converter.projectToDetailPageDto(project)
        assertMultilingualTextEqualToActualDto(project.title, actual.title)
        assertMultilingualTextEqualToActualDto(project.description, actual.description)
    }
}