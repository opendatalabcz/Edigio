package cz.opendatalab.egidio.backend.shared.slug

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.assertEquals
import java.math.BigDecimal
import java.math.BigInteger
import java.time.LocalDateTime

public class SlugifySlugUtilityTest {
    val slugifySlugUtility: SlugifySlugUtility = SlugifySlugUtility()

    @Test
    fun testSlugifyLocalDateTime() {
        assertEquals(
            "20210102030405006",
            slugifySlugUtility.createLocalDateTimeSlug(
                LocalDateTime.of(2021, 1, 2, 3, 4, 5, BigInteger.valueOf(6).times(BigInteger.TEN.pow(6)).toInt())
            )
        )
    }

    @Test
    fun testSlugifySingleString() {
        assertEquals(
            "hello-there",
            slugifySlugUtility.createSlug("hello there")
        )
    }

    @Test
    fun testSlugifyTwoStrings() {
        assertEquals(
            "hello-there-general-kenobi-now-this-is-podracing",
            slugifySlugUtility.createSlug("hello there", "general kenobi", "now", "this-is", "podracing"),
        )
    }
}