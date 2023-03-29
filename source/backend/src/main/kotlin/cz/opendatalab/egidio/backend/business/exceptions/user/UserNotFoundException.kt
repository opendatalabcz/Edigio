package cz.opendatalab.egidio.backend.business.exceptions.user

import cz.opendatalab.egidio.backend.business.exceptions.EntityNotFoundException

class UserNotFoundException : EntityNotFoundException("User")