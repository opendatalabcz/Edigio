package cz.opendatalab.egidio.backend.shared.hasher

interface Hasher<T> {
    fun hash(value: T) : String
}
