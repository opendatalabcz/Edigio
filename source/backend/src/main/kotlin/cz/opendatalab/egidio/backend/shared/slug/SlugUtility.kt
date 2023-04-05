package cz.opendatalab.egidio.backend.shared.slug

import java.time.LocalDateTime

/**
 * Slug related utilities
 */
interface SlugUtility {
    /**
     * Create slug from given string parts.
     * Given parts are appended in order they are given.
     *
     * @param first the leftmost string
     * @param rest strings to be appended
     *
     * @return slug created from given string parts
     *
     */
    fun createSlug(first: String, vararg rest: String): String

    /**
     * Create slug for [localDateTime]
     *
     * @param localDateTime DateTime for which the slug should be created
     */
    fun createLocalDateTimeSlug(localDateTime: LocalDateTime) : String
}