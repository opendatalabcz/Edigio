package cz.opendatalab.egidio.backend.shared.hasher

import org.springframework.stereotype.Component
import java.security.MessageDigest
import java.util.HexFormat

class StringHasher : Hasher<String> {
    override fun hash(value: String) : String
    = HexFormat.of().formatHex(MessageDigest.getInstance("SHA3-256").digest(value.encodeToByteArray()))
}