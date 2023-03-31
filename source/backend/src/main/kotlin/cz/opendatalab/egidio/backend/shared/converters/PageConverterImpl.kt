package cz.opendatalab.egidio.backend.shared.converters

import cz.opendatalab.egidio.backend.shared.annotations.custom_components.ConverterComponent
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import org.springframework.data.domain.Page

@ConverterComponent
class PageConverterImpl : PageConverter {
    override fun <T> pageToCustomPage(page: Page<T>): CustomPage<T> {
        return CustomPage(
            idx = page.number,
            size = page.size,
            totalItemsAvailable = page.totalElements,
            items = page.content
        )
    }
}