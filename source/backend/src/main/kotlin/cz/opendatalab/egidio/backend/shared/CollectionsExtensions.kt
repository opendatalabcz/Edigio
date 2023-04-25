package cz.opendatalab.egidio.backend.shared

fun <T> Collection<T>.isSubsetOf(other: Collection<T>) : Boolean
= other.containsAll(this)

