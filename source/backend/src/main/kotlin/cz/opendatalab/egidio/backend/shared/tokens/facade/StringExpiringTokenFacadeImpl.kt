package cz.opendatalab.egidio.backend.shared.tokens.facade

import cz.opendatalab.egidio.backend.shared.annotations.custom_components.Facade
import cz.opendatalab.egidio.backend.shared.tokens.checker.ExpiringTokenChecker
import cz.opendatalab.egidio.backend.shared.tokens.factory.ExpiringTokenFactory

@Facade
class StringExpiringTokenFacadeImpl(
    val stringExpiringTokenFactory : ExpiringTokenFactory<String>,
    val stringExpiringTokenChecker : ExpiringTokenChecker<String>
) : ExpiringTokenFacade<String>,
    ExpiringTokenFactory<String> by stringExpiringTokenFactory,
    ExpiringTokenChecker<String> by stringExpiringTokenChecker