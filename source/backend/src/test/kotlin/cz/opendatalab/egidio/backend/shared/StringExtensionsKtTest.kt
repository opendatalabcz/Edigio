package cz.opendatalab.egidio.backend.shared

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.assertThrows
import java.lang.IllegalArgumentException

class StringExtensionsKtTest {
    @Test
    fun testTrimToMaxLength_maxLengthGreaterThanOriginalLength() {
        val testedValue = "Hello there!"
        assertEquals(testedValue, testedValue.trimToMaxLength(testedValue.length + 1))
    }

    @Test
    fun testTrimToMaxLength_maxLengthSameAsOriginalLength() {
        val testedValue = "Suprise to be sure, but welcome one!"
        assertEquals(testedValue, testedValue.trimToMaxLength(testedValue.length))
    }

    @Test
    fun testTrimToMaxLength_maxLengthLessThanOriginalLength() {
        val testedValue = "High ground"
        assertEquals("High gro", testedValue.trimToMaxLength(testedValue.length - 3))
    }

    @Test
    fun testTrimToMaxLength_zero_length() {
        val testedValue = "There's always a bigger fish"
        assertThrows(
            IllegalArgumentException::class.java,
            { testedValue.trimToMaxLength(0) }
        )
    }

    @Test
    fun testTrimToMaxLength_negative_length() {
        val testedValue = "There's always a bigger fish"
        assertThrows(
            IllegalArgumentException::class.java,
            { testedValue.trimToMaxLength(-2) }
        )
    }
}