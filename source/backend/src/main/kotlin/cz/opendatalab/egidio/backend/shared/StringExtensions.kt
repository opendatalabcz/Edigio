package cz.opendatalab.egidio.backend.shared

fun String.trimToMaxLength(maxLength: Int): String {
    require(maxLength > 0, { "maxLength of trimmed string must be positive!" })
    //text length is at most the same as max length, so there's no need to trim anything
    return if (length <= maxLength) this
    //text length is greater than maxLength, so everything from idx [maxLength] to the end must be removed
    else this.removeRange(maxLength, length)
}