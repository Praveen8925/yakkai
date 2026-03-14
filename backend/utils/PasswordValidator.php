<?php
/**
 * PasswordValidator - Password strength validation
 * 
 * SECURITY FIX: Enforce password complexity requirements
 */
class PasswordValidator {
    /**
     * Validate password strength
     * @param string $password The password to validate
     * @return array ['valid' => bool, 'errors' => array]
     */
    public static function validate(string $password): array {
        $errors = [];
        
        if (strlen($password) < 8) {
            $errors[] = 'Password must be at least 8 characters long';
        }
        
        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = 'Password must contain at least one uppercase letter';
        }
        
        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = 'Password must contain at least one lowercase letter';
        }
        
        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = 'Password must contain at least one number';
        }
        
        if (!preg_match('/[^A-Za-z0-9]/', $password)) {
            $errors[] = 'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)';
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
    
    /**
     * Get a friendly error message for all validation errors
     */
    public static function getErrorMessage(array $errors): string {
        if (empty($errors)) {
            return '';
        }
        
        return implode('. ', $errors) . '.';
    }
    
    /**
     * Quick validation that throws exception on failure
     * @throws Exception with validation error message
     */
    public static function validateOrThrow(string $password): void {
        $result = self::validate($password);
        
        if (!$result['valid']) {
            throw new Exception(self::getErrorMessage($result['errors']), 400);
        }
    }
}
