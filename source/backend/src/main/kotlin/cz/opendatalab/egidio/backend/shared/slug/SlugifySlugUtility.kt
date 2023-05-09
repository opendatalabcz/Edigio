package cz.opendatalab.egidio.backend.shared.slug

import com.github.slugify.Slugify
import cz.opendatalab.egidio.backend.business.custom_component_types.UtilityComponent
import cz.opendatalab.egidio.backend.shared.trimToMaxLength
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter

/**
 * Slug related utility
 *
 *
 * Implementation is based around [Slugify library](https://github.com/slugify/slugify).
 *
 */
@UtilityComponent
class SlugifySlugUtility : SlugUtility {

    private val slugify: Slugify = Slugify.builder().build()

    override fun createSlug(first: String, vararg rest: String): String {
        return slugify.slugify(
            listOf(first, *rest)
                .joinToString(WORDS_SEPARATOR)
        ).trimToMaxLength(MAX_SLUG_LENGTH)
    }

    override fun createOffsetDateTimeSlug(offsetDateTime: OffsetDateTime): String {
        return offsetDateTime
            .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"))
    }

    override fun createSlugWithOffsetDateTimePrepended(
        offsetDateTime: OffsetDateTime,
        vararg rest: String
    ): String = createSlug(createOffsetDateTimeSlug(offsetDateTime), *rest)

    companion object {
        const val WORDS_SEPARATOR = "-"
        const val MAX_SLUG_LENGTH = 255
    }
}