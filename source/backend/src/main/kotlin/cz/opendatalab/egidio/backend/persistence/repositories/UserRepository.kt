package cz.opendatalab.egidio.backend.persistence.repositories

import cz.opendatalab.egidio.backend.business.entities.user.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface UserRepository : JpaRepository<User, Long> {
    fun findByUsernameAndRegisteredIsTrue(email: String): User?
    fun findUserByPublicIdAndRegisteredIsTrue(publicId: UUID): User?
    fun existsUserByEmail(email: String) : Boolean
    fun existsUserByEmailAndIdNot(email: String, id: Long) : Boolean
}