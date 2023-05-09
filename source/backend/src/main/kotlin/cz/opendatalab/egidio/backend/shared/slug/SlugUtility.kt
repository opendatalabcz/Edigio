package cz.opendatalab.egidio.backend.shared.slug

import java.time.OffsetDateTime

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
     * Create slug for [offsetDateTime]
     *
     * @param offsetDateTime DateTime for which the slug should be created
     */
    fun createOffsetDateTimeSlug(offsetDateTime: OffsetDateTime) : String

    /**
     * Create slug with prepended OffsetDateTime slug
     *
     * @param offsetDateTime DateTime for which the slug should be created
     */
    fun createSlugWithOffsetDateTimePrepended(
        offsetDateTime: OffsetDateTime,
        vararg rest: String
    ) : String
}