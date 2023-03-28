package cz.opendatalab.egidio.backend.shared

import com.github.slugify.Slugify
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

/**
 * Slug related utility
 *
 *
 * Implementation is based around [Slugify library](https://github.com/slugify/slugify).
 *
 */
@Component
class SlugifySlugUtility : SlugUtility {
    private val slugify: Slugify = Slugify.builder().build()
    override fun createLocalDateTimeSlug(localDateTime: LocalDateTime) : String {
        return localDateTime
            .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"))


    }
    override fun createSlug(first: String, vararg rest: String): String {
        return slugify.slugify(listOf(first, *rest).joinToString(WORDS_SEPARATOR))
    }
    companion object {
        const val WORDS_SEPARATOR = "-"
    }
}