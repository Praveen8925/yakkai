<?php
/**
 * ErrorHandler - Centralized error handling
 * 
 * SECURITY FIX: Prevents database structure disclosure through error messages
 */
class ErrorHandler {
    /**
     * Handle database errors securely
     * @param PDOException $e The exception
     * @param string $context Context description for logging
     */
    public static function handleDatabaseError(PDOException $e, string $context = ''): void {
        // Log the detailed error for debugging (never shown to user)
        error_log("Database Error [$context]: " . $e->getMessage());
        error_log("Stack trace: " . $e->getTraceAsString());
        
        // Return generic message to user
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'An error occurred while processing your request. Please try again later.'
        ]);
    }
    
    /**
     * Handle general exceptions
     */
    public static function handleException(Exception $e, string $context = ''): void {
        error_log("Exception [$context]: " . $e->getMessage());
        error_log("Stack trace: " . $e->getTraceAsString());
        
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'An unexpected error occurred. Please try again later.'
        ]);
    }
    
    /**
     * Handle validation errors (safe to show to users)
     */
    public static function handleValidationError(string $message, int $code = 400): void {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'error' => $message
        ]);
    }
    
    /**
     * Log security event
     */
    public static function logSecurityEvent(string $event, array $context = []): void {
        $logData = [
            'timestamp' => date('Y-m-d H:i:s'),
            'event' => $event,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            'context' => $context
        ];
        
        error_log('SECURITY EVENT: ' . json_encode($logData));
    }
}
