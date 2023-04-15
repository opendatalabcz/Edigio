package cz.opendatalab.egidio.backend.persistence.repositories

import cz.opendatalab.egidio.backend.business.entities.user.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.*

interface UserRepository : JpaRepository<User, Long> {
    fun findByUsernameAndRegisteredIsTrue(email : String) : User?
    fun findUserByPublicIdAndRegistered(publicId : UUID, registered : Boolean) : User?
    @Query("""
        SELECT count(distinct user.id) > 0
        FROM User user
        WHERE user.registered = true AND (
            lower(:email) = lower(user.email) OR :username = user.username
        )
    """)
    fun existsRegisteredWithEmailOrUsername(email : String, username: String) : Boolean
}