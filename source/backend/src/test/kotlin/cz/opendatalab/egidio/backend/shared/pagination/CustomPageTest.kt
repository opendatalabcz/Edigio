package cz.opendatalab.egidio.backend.shared.pagination

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.testcontainers.shaded.org.apache.commons.lang3.Range

class CustomPageTest {

    @Test
    fun map() {
        assertThat(
            CustomPage(
                size = 12,
                idx = 1,
                totalItemsAvailable = 22,
                items = (1 .. 10).toList()
            ).map { it + 5 },
        ).usingRecursiveComparison()
            .isEqualTo(
                CustomPage(
                    size = 12,
                    idx = 1,
                    totalItemsAvailable = 22,
                    items = (6 .. 15).toList()
                )
            )
    }
}