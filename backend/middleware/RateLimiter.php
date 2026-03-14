<?php
/**
 * RateLimiter - Simple file-based rate limiting
 * 
 * SECURITY FIX: Prevents brute force attacks on authentication endpoints
 */
class RateLimiter {
    private static $cacheDir = __DIR__ . '/../cache/rate_limits/';
    
    /**
     * Check if request is rate limited
     * @param string $key Unique identifier (e.g., IP address, email)
     * @param int $maxAttempts Maximum attempts allowed
     * @param int $decayMinutes Time window in minutes
     * @return bool True if rate limit exceeded
     */
    public static function tooManyAttempts(string $key, int $maxAttempts = 5, int $decayMinutes = 15): bool {
        if (!file_exists(self::$cacheDir)) {
            mkdir(self::$cacheDir, 0755, true);
        }
        
        $file = self::$cacheDir . md5($key) . '.json';
        $now = time();
        
        $data = file_exists($file) ? json_decode(file_get_contents($file), true) : null;
        
        if (!$data || $now > $data['expires_at']) {
            // Reset counter
            $data = [
                'attempts' => 1,
                'expires_at' => $now + ($decayMinutes * 60),
                'first_attempt' => $now
            ];
            file_put_contents($file, json_encode($data));
            return false;
        }
        
        if ($data['attempts'] >= $maxAttempts) {
            return true;
        }
        
        // Increment attempts
        $data['attempts']++;
        file_put_contents($file, json_encode($data));
        
        return false;
    }
    
    /**
     * Clear rate limit for a key (call on successful login)
     */
    public static function clear(string $key): void {
        $file = self::$cacheDir . md5($key) . '.json';
        if (file_exists($file)) {
            unlink($file);
        }
    }
    
    /**
     * Get remaining attempts before rate limit
     */
    public static function attemptsLeft(string $key, int $maxAttempts = 5): int {
        $file = self::$cacheDir . md5($key) . '.json';
        
        if (!file_exists($file)) {
            return $maxAttempts;
        }
        
        $data = json_decode(file_get_contents($file), true);
        $now = time();
        
        if ($now > $data['expires_at']) {
            return $maxAttempts;
        }
        
        return max(0, $maxAttempts - $data['attempts']);
    }
    
    /**
     * Get time until rate limit expires (in seconds)
     */
    public static function availableIn(string $key): int {
        $file = self::$cacheDir . md5($key) . '.json';
        
        if (!file_exists($file)) {
            return 0;
        }
        
        $data = json_decode(file_get_contents($file), true);
        $now = time();
        
        if ($now > $data['expires_at']) {
            return 0;
        }
        
        return max(0, $data['expires_at'] - $now);
    }
    
    /**
     * Clean up old rate limit files (call periodically)
     */
    public static function cleanup(): void {
        if (!file_exists(self::$cacheDir)) {
            return;
        }
        
        $now = time();
        $files = glob(self::$cacheDir . '*.json');
        
        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file), true);
            if ($data && $now > $data['expires_at']) {
                unlink($file);
            }
        }
    }
}
