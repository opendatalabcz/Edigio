package cz.opendatalab.egidio.backend.controllers

import cz.opendatalab.egidio.backend.business.services.AdvertisementService
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
open class AdvertisementControllerImpl @Autowired constructor(
    val advertisementService: AdvertisementService
) {
    @PostConstruct
    fun postConstruct(): Unit {
        println("Hello There! General Kenobi!")
    }

    @GetMapping("/advertisement")
    open fun getAdvertisementDetail(): ResponseEntity<*> {
        val advertisement = this.advertisementService.getBySlug("abc")
        return ResponseEntity.ok(advertisement)
    }
}