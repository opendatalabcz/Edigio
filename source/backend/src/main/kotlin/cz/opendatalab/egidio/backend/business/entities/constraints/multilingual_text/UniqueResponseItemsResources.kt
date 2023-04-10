package cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text

import cz.opendatalab.egidio.backend.business.validation.UniqueAdvertisementItemsResourcesValidator
import cz.opendatalab.egidio.backend.business.validation.UniqueResponseItemsResourcesValidator
import jakarta.validation.Constraint
import jakarta.validation.Payload
import kotlin.reflect.KClass

@Constraint(validatedBy = [UniqueResponseItemsResourcesValidator::class])
annotation class UniqueResponseItemsResources(
    val message : String = "two or more response items share the same resource!",
    val groups : Array<KClass<*>> = [],
    val payload : Array<KClass<out Payload>> = []
)
