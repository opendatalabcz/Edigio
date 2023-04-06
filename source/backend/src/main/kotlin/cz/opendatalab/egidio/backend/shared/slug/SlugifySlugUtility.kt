package cz.opendatalab.egidio.backend.shared.slug

import com.github.slugify.Slugify
import cz.opendatalab.egidio.backend.business.custom_component_types.UtilityComponent
import cz.opendatalab.egidio.backend.shared.trimToMaxLength
import java.time.LocalDateTime
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

    override fun createLocalDateTimeSlug(localDateTime: LocalDateTime): String {
        return localDateTime
            .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"))
    }

    override fun createSlugWithLocalDateTimePrepended(
        localDateTime: LocalDateTime,
        vararg rest: String
    ): String = createSlug(createLocalDateTimeSlug(localDateTime), *rest)

    companion object {
        const val WORDS_SEPARATOR = "-"
        const val MAX_SLUG_LENGTH = 255
    }
}