package cz.opendatalab.egidio.backend.shared.hasher

/**
 * Hash provider for the type [T]
 */
fun interface Hasher<T> {
    /**
     * Create hash for value
     */
    fun hash(value: T) : String
}
