package cz.opendatalab.egidio.backend.shared.converters

import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import org.springframework.data.domain.Page

interface PageConverter {
    fun <T> pageToCustomPage(page: Page<T>): CustomPage<T>
}