package cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text

import cz.opendatalab.egidio.backend.business.validation.UniqueAdvertisementItemsResourcesValidator
import jakarta.validation.Constraint
import jakarta.validation.Payload
import kotlin.reflect.KClass

@Constraint(validatedBy = [UniqueAdvertisementItemsResourcesValidator::class])
annotation class UniqueAdvertisementItemsResources(
    val message : String = "two or more advertisement items share the same resource!",
    val groups : Array<KClass<*>> = [],
    val payload : Array<KClass<out Payload>> = []
)
