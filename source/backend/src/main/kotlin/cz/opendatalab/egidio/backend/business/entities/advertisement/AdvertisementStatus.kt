package cz.opendatalab.egidio.backend.business.entities.advertisement

import com.fasterxml.jackson.annotation.JsonValue

enum class AdvertisementStatus(@JsonValue val value: String) {
    /**
     * Advertisement was newly created and wasn't approved yet
     *
     * Might not be used when editor is someone who also has right to approve
     */
    CREATED("created"),

    /**
     * Advertisement was approved and is accessible to desired range of users (everyone, approved agencies...)
     */
    PUBLISHED("published"),

    /**
     * Advertisement was edited, and now waits to approve.
     *
     * Might not be used when editor is someone who also has right to approve
     */
    EDITED("edited"),

    /**
     * Advertisement was cancelled - approver might have decided that the advertisement is not publishable
     * or author might have decided that there's no chance for others to react,
     * so he doesn't want to keep it published anymore.
     *
     */
    CANCELED("cancelled"),

    /**
     * Everything required/offered by advertisement was fulfilled
     */
    RESOLVED("resolved")
}
