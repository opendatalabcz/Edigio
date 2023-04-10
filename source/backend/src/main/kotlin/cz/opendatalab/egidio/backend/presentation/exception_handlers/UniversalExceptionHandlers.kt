package cz.opendatalab.egidio.backend.presentation.exception_handlers

import jakarta.persistence.OptimisticLockException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class UniversalExceptionHandlers {
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(ex : MethodArgumentNotValidException) : ResponseEntity<*> {
        return ResponseEntity
            .badRequest()
            .body(ex.fieldErrors.associate { it.field to it.defaultMessage })
    }

    @ExceptionHandler(OptimisticLockException::class)
    fun handleOptimisticLockException(ex : OptimisticLockException) : ResponseEntity<*> {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body("Concurrent modification")
    }
}