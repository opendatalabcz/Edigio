package cz.opendatalab.egidio.backend.shared.hasher

import java.security.MessageDigest
import java.util.*

/**
 * Provides hash for strings
 */
class StringHasher : Hasher<String> {
    override fun hash(value: String): String =
        HexFormat.of().formatHex(MessageDigest.getInstance("SHA3-256").digest(value.encodeToByteArray()))
}