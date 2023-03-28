package cz.opendatalab.egidio.backend.business.services

import cz.opendatalab.egidio.backend.business.entities.project.Project

interface ProjectService {
    fun getBySlug(slug: String): Project
}