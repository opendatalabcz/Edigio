package cz.opendatalab.egidio.backend

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
interface AdvertisementController {
    //@PathVariable(name = "slug", required = true) slug: String
    @GetMapping("/abc")
    fun getAdvertisementDetail(): ResponseEntity<*>
}