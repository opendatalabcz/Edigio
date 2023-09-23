package cz.opendatalab.egidio.backend.business.validation.validators

import cz.opendatalab.egidio.backend.business.entities.advertisement.response.ResponseItem
import cz.opendatalab.egidio.backend.business.validation.annotations.UniqueResponseItemsResources
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

/**
 * Validator that checks whether each response item in collection has unique resource.
 */
class UniqueResponseItemsResourcesValidator :
    ConstraintValidator<UniqueResponseItemsResources, Collection<ResponseItem>> {
    /**
     * Check whether collection of response items is null
     * or whether each response item in collection has unique resource.
     */
    override fun isValid(value : Collection<ResponseItem>?, context : ConstraintValidatorContext?) : Boolean {
        return value == null || value.distinctBy { item -> item.resource.id }.count() == value.count() 
    }
}