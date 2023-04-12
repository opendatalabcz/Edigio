package cz.opendatalab.egidio.backend.shared.tokens.facade

import cz.opendatalab.egidio.backend.shared.tokens.checker.ExpiringTokenChecker
import cz.opendatalab.egidio.backend.shared.tokens.factory.ExpiringTokenFactory

interface ExpiringTokenFacade<T> : ExpiringTokenChecker<T>, ExpiringTokenFactory<T>