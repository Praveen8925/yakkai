<?php
class AuthMiddleware {

    /**
     * Attempt to authenticate the current request.
     * Returns the decoded JWT payload on success.
     * Throws an Exception on failure (caller decides whether to abort).
     */
    public static function authenticate(): array {
        $token = self::extractToken();

        if (!$token) {
            throw new Exception('No token provided', 401);
        }

        return self::decodeJWT($token);
    }

    /**
     * Authenticate and abort with 401 if not authenticated.
     */
    public static function requireAuth(): array {
        try {
            return self::authenticate();
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized: ' . $e->getMessage()]);
            exit;
        }
    }

    /**
     * Authenticate and abort with 403 if the user is not an admin.
     */
    public static function requireAdmin(): array {
        $user = self::requireAuth();

        if (($user['role'] ?? '') !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden: Admin access required']);
            exit;
        }

        return $user;
    }

    // ── JWT helpers ────────────────────────────────────────────────────────

    public static function generateJWT(array $payload): string {
        $secret  = $_ENV['JWT_SECRET'] ?? 'yakkai_neri_secret_key_2024';
        $expiry  = (int)($_ENV['JWT_EXPIRY'] ?? 86400);

        $header  = self::b64url(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload['exp'] = time() + $expiry;
        $payload['iat'] = time();
        $body    = self::b64url(json_encode($payload));

        $sig     = self::b64url(hash_hmac('sha256', "$header.$body", $secret, true));
        return "$header.$body.$sig";
    }

    private static function decodeJWT(string $token): array {
        $secret = $_ENV['JWT_SECRET'] ?? 'yakkai_neri_secret_key_2024';
        $parts  = explode('.', $token);

        if (count($parts) !== 3) {
            throw new Exception('Invalid token format', 401);
        }

        [$header, $body, $sig] = $parts;

        $expectedSig = self::b64url(hash_hmac('sha256', "$header.$body", $secret, true));
        if (!hash_equals($expectedSig, $sig)) {
            throw new Exception('Invalid token signature', 401);
        }

        $payload = json_decode(self::b64urlDecode($body), true);

        if (!$payload) {
            throw new Exception('Invalid token payload', 401);
        }

        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token has expired', 401);
        }

        return $payload;
    }

    private static function extractToken(): ?string {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (preg_match('/^Bearer\s+(.+)$/i', $authHeader, $m)) {
            return $m[1];
        }

        // Fallback: some servers put it in REDIRECT_HTTP_AUTHORIZATION
        $redirect = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/^Bearer\s+(.+)$/i', $redirect, $m)) {
            return $m[1];
        }

        return null;
    }

    private static function b64url(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function b64urlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }
}
