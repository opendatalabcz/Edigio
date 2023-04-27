package cz.opendatalab.egidio.backend.shared.converters.page

import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import cz.opendatalab.egidio.backend.shared.pagination.CustomPageRequest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest

class PageConverterImplTest {

    val converter : PageConverter = PageConverterImpl()

    @Test
    fun pageToCustomPage() {
        // create a Java Page
        val javaPage: Page<Int> = PageImpl(listOf(1, 2, 3), PageRequest.of(0, 3), 6)

        // convert to CustomPage using the converter function
        val customPage: CustomPage<Int> = converter.pageToCustomPage(javaPage)

        // assert that the CustomPage has the correct values
        assertEquals(3, customPage.size)
        assertEquals(0, customPage.idx)
        assertEquals(6, customPage.totalItemsAvailable)
        assertEquals(listOf(1, 2, 3), customPage.items)
    }

    @Test
    fun customPageRequestToPageRequest() {
        val customPageRequest = CustomPageRequest(
            size = 15,
            idx = 2
        )
        val actual = converter.customPageRequestToPageRequest(customPageRequest)
        assertThat(actual.pageNumber).isEqualTo(2)
        assertThat(actual.pageSize).isEqualTo(15)

    }
}