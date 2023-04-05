package cz.opendatalab.egidio.backend.shared.hasher

/**
 * Hash provider for the type [T]
 */
interface Hasher<T> {
    fun hash(value: T) : String
}
