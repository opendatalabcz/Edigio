package cz.opendatalab.egidio.backend.persistence.repositories

import cz.opendatalab.egidio.backend.business.entities.project.Project
import cz.opendatalab.egidio.backend.shared.filters.ProjectFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ProjectRepository : JpaRepository<Project, Long> {
    fun findBySlug(slug: String): Project?
    @Query("""
        SELECT project 
        FROM Project project
        JOIN project.title.texts project_title_translations
        WHERE 
            ( :#{#filter.title == null} = true OR project_title_translations.language = :#{#filter.title} )
            AND ( :#{#filter.catastropheTypes == null} = true OR project.catastropheType IN :#{#filter.catastropheTypes} )
            AND ( :#{#filter.publishedAfter == null} = true OR (
                    project.publishedAt IS NOT NULL
                    AND project.publishedAt >= :#{#filter.publishedAfter}
                ) 
            )
            AND ( :#{#filter.publishedBefore == null} = true OR (
                    project.publishedAt IS NOT NULL
                    AND project.publishedAt <= :#{#filter.publishedBefore}
                ) 
            )
    """)
    fun getByFilter(@Param("filter") filter: ProjectFilter, pageable: Pageable) : Page<Project>
    fun existsBySlug(slug: String) : Boolean
}