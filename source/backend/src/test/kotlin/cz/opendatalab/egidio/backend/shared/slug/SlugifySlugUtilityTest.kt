package cz.opendatalab.egidio.backend.shared.slug

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.math.BigInteger
import java.time.OffsetDateTime
import java.time.ZoneOffset

public class SlugifySlugUtilityTest {
    val slugifySlugUtility : SlugifySlugUtility = SlugifySlugUtility()

    @Test
    fun testSlugifyOffsetDateTime() {
        assertEquals(
            "20210102030405006",
            slugifySlugUtility.createOffsetDateTimeSlug(
                OffsetDateTime.of(
                    2021,
                    1,
                    2,
                    3,
                    4,
                    5,
                    BigInteger.valueOf(6).times(BigInteger.TEN.pow(6)).toInt(),
                    ZoneOffset.UTC
                )
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

    @Test
    fun testSlugifySingleStringWithPrependedOffsetDateTime() {
        assertEquals(
            "20210102030405006-suprise-to-be-sure",
            slugifySlugUtility.createSlugWithOffsetDateTimePrepended(
                OffsetDateTime.of(
                    2021,
                    1,
                    2,
                    3,
                    4,
                    5,
                    BigInteger.valueOf(6).times(BigInteger.TEN.pow(6)).toInt(),
                    ZoneOffset.UTC
                ),
                "suprise to be sure"
            )
        )
    }


    @Test
    fun testTooLongStringAfterSlugificationIsTrimmed() {
        assertEquals(
            "lorem-ipsum-dolor-sit-amet-consectetuer-adipiscing-elit-lorem-ipsum-dolor-sit-amet-consectetuer-adipiscing-elit-lorem-ipsum-dolor-sit-amet-consectetuer-adipiscing-elit-lorem-ipsum-dolor-sit-amet-consectetuer-adipiscing-elit-lorem-ipsum-dolor-sit-amet-cons",
            slugifySlugUtility.createSlug(
                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
            )
        )
    }
}