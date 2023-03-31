package cz.opendatalab.egidio.backend.business.entities.project

import com.fasterxml.jackson.annotation.JsonValue


enum class ProjectStatus(@field:JsonValue() val value: String) {
    PREPARED("prepared"),
    PUBLISHED("published"),
    ARCHIVED("archived")
}
