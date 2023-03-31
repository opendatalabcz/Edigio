package cz.opendatalab.egidio.backend.presentation.exception_handlers

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class UniversalExceptionHandlers {
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(ex: MethodArgumentNotValidException): ResponseEntity<*> {
        return ResponseEntity
            .badRequest()
            .body(ex.fieldErrors.associate { it.field to it.defaultMessage })
    }
}