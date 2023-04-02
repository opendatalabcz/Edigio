package cz.opendatalab.egidio.backend.shared.converters.page

import cz.opendatalab.egidio.backend.shared.annotations.custom_components.ConverterComponent
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import cz.opendatalab.egidio.backend.shared.pagination.CustomPageRequest
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest

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

    override fun customPageRequestToPageRequest(pageRequest: CustomPageRequest): PageRequest {
        return PageRequest.of(pageRequest.idx, pageRequest.size)
    }
}