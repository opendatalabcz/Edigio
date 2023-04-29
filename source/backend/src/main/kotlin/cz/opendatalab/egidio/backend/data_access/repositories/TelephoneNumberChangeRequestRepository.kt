package cz.opendatalab.egidio.backend.data_access.repositories

import cz.opendatalab.egidio.backend.business.entities.user.change_request.TelephoneNumberChangeRequest
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.*

interface TelephoneNumberChangeRequestRepository : JpaRepository<TelephoneNumberChangeRequest, Long> {
    @Query(
        """
        SELECT request
        FROM TelephoneNuberChangeRequest request
        WHERE request.user.publicId = :publicId
        ORDER BY request.createdAt DESC
        LIMIT 1
    """
    )
    fun findLatestActiveByPublicId(publicId : UUID) : TelephoneNumberChangeRequest?
}