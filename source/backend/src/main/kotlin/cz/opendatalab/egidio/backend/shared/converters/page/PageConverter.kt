package cz.opendatalab.egidio.backend.shared.converters.page

import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import cz.opendatalab.egidio.backend.shared.pagination.CustomPageRequest
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest

interface PageConverter {
    fun <T> pageToCustomPage(page: Page<T>): CustomPage<T>
    fun customPageRequestToPageRequest(pageRequest: CustomPageRequest) : PageRequest
}