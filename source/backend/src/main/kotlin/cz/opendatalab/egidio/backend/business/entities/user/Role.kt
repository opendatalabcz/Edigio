package cz.opendatalab.egidio.backend.business.entities.user

import com.fasterxml.jackson.annotation.JsonValue

/**
 * Role of user in system
 */
enum class Role(@JsonValue val value: String) {
    NON_REGISTERED_USER("non_registered_user"),
    USER("user"),
    COORDINATOR("coordinator"),
    ADMIN("admin")
}
