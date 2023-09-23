package cz.opendatalab.egidio.backend.business.validation

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementItem
import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.business.validation.validators.UniqueAdvertisementItemsResourcesValidator
import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class UniqueAdvertisementItemsResourcesValidatorTest {
    @Test
    fun isValid_emptyCollection() {
        assertThat(UniqueAdvertisementItemsResourcesValidator().isValid(emptyList(), null)).isTrue()
    }

    @Test
    fun isValid_nullCollection() {
        assertThat(UniqueAdvertisementItemsResourcesValidator().isValid(null, null)).isTrue()
    }

    @Test
    fun isValid_singleItem() {
        assertThat(
            UniqueAdvertisementItemsResourcesValidator().isValid(listOf(
            createMockedAdvertisementItem(1L),
        ), null)).isTrue()
    }

    @Test
    fun isValid_uniqueItems() {
        assertThat(
            UniqueAdvertisementItemsResourcesValidator().isValid(listOf(
            createMockedAdvertisementItem(1L),
            createMockedAdvertisementItem(2L),
            createMockedAdvertisementItem(3L),
        ), null)).isTrue()
    }

    @Test
    fun isValid_duplicatedItem() {
        assertThat(
            UniqueAdvertisementItemsResourcesValidator().isValid(listOf(
            createMockedAdvertisementItem(1L),
            createMockedAdvertisementItem(2L),
            createMockedAdvertisementItem(2L),
            createMockedAdvertisementItem(3L),
        ), null)).isFalse()
    }

    private fun createMockedAdvertisementItem(resourceId: Long) : AdvertisementItem {
        val resource = mockk<Resource>()
        every { resource.id } returns resourceId
        val item = mockk<AdvertisementItem>()
        every { item.resource } returns resource
        return item
    }
}