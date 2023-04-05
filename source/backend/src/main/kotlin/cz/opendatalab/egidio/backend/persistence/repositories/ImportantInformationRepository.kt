package cz.opendatalab.egidio.backend.persistence.repositories

import cz.opendatalab.egidio.backend.business.entities.important_information.ImportantInformation
import org.springframework.data.jpa.repository.JpaRepository

interface ImportantInformationRepository : JpaRepository<ImportantInformation, Long> {
    fun findAllBySlugIn(slug: List<String>) : List<ImportantInformation>
}