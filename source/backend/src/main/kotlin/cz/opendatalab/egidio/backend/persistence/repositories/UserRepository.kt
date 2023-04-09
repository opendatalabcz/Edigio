package cz.opendatalab.egidio.backend.persistence.repositories

import cz.opendatalab.egidio.backend.business.entities.user.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface UserRepository : JpaRepository<User, Long> {
    fun findByUsernameAndRegisteredIsTrue(email: String): User?
    fun findUserByPublicIdAndRegistered(publicId: UUID, registered: Boolean): User?
    fun existsUserByEmailOrUsername(email: String, username: String) : Boolean
    fun existsUserByEmailAndIdNot(email: String, id: Long) : Boolean
}