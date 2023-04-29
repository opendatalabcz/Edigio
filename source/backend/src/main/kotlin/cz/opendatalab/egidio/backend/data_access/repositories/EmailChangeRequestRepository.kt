package cz.opendatalab.egidio.backend.data_access.repositories

import cz.opendatalab.egidio.backend.business.entities.user.change_request.EmailChangeRequest
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.*

interface EmailChangeRequestRepository : JpaRepository<EmailChangeRequest, Long> {
    @Query(
        """
        SELECT request
        FROM EmailChangeRequest request
        WHERE request.user.publicId = :publicId
        ORDER BY request.createdAt DESC
        LIMIT 1
    """
    )
    fun findLatestActiveByPublicId(publicId : UUID) : EmailChangeRequest?
}