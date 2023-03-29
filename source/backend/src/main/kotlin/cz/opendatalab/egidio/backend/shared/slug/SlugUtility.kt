package cz.opendatalab.egidio.backend.shared.slug

import java.time.LocalDateTime

/**
 * Slug related utilities
 */
interface SlugUtility {
    fun createSlug(first: String, vararg rest: String): String
    fun createLocalDateTimeSlug(localDateTime: LocalDateTime) : String
}