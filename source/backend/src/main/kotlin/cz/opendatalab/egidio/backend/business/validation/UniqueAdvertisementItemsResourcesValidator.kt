package cz.opendatalab.egidio.backend.business.validation

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementItem
import cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text.UniqueAdvertisementItemsResources
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

/**
 * Validator that checks whether each advertisement item in collection has unique resource.
 */
class UniqueAdvertisementItemsResourcesValidator :
    ConstraintValidator<UniqueAdvertisementItemsResources, Collection<AdvertisementItem>> {
    /**
     * Check whether collection of advertisement items is null
     * or whether each advertisement item in collection has unique resource.
     */
    override fun isValid(value : Collection<AdvertisementItem>?, context : ConstraintValidatorContext?) : Boolean {
        return value?.let { it.distinctBy { item -> item.resource.id }.count() == it.count() } == true
    }
}