package cz.opendatalab.egidio.backend.business.validation.validators

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementItem
import cz.opendatalab.egidio.backend.business.validation.annotations.UniqueAdvertisementItemsResources
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
        return value == null || value.distinctBy { item -> item.resource.id }.count() == value.count()
    }
}