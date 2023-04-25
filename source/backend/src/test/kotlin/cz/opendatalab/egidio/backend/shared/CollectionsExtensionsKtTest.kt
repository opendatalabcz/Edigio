package cz.opendatalab.egidio.backend.shared

import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*

class CollectionsExtensionsKtTest {
    @Test
    fun isSubsetOf_empty_collection_subset_of_empty_collection() {
        assertTrue(listOf<Int>().isSubsetOf(listOf()))
    }

    @Test
    fun isSubsetOf_empty_collection_subset_of_not_empty_collection() {
        assertTrue(listOf<Int>().isSubsetOf(listOf(1,2,3)))
    }

    @Test
    fun isSubsetOf_subset_is_subset() {
        assertTrue(listOf(2,3,4,8).isSubsetOf(List(10) { 1 + it }))
    }

    @Test
    fun isSubsetOf_superset_is_not_subset() {
        //6 is missing from list
        assertFalse(List(10) { 1 + it }.isSubsetOf(listOf(1,2,3,4,5,7,8,9,10)))
    }

    @Test
    fun isSubsetOf_subset_to_itself() {
        val list = listOf("x","y","z")
        assertTrue(list.isSubsetOf(list))
    }

}