<?php
/**
 * JWTHandler — thin wrapper around AuthMiddleware's JWT helpers.
 * This class exists for backward compatibility with hr_users.php login route.
 */
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class JWTHandler {
    /**
     * Encode a payload into a signed JWT string.
     *
     * @param array $payload  Key/value pairs to embed in the token.
     * @return string         Signed JWT string.
     */
    public function encode(array $payload): string {
        return AuthMiddleware::generateJWT($payload);
    }

    /**
     * Decode and verify a JWT string, returning its payload.
     *
     * @param string $token
     * @return array
     * @throws Exception on invalid/expired token
     */
    public function decode(string $token): array {
        $secret = $_ENV['JWT_SECRET'] ?? 'yakkai_neri_secret_key_2024';
        $parts  = explode('.', $token);

        if (count($parts) !== 3) {
            throw new Exception('Invalid token format', 401);
        }

        [$header, $body, $sig] = $parts;

        $expectedSig = rtrim(
            strtr(base64_encode(hash_hmac('sha256', "$header.$body", $secret, true)), '+/', '-_'),
            '='
        );
        if (!hash_equals($expectedSig, $sig)) {
            throw new Exception('Invalid token signature', 401);
        }

        $payload = json_decode(
            base64_decode(strtr($body, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($body)) % 4)),
            true
        );

        if (!$payload) {
            throw new Exception('Invalid token payload', 401);
        }

        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token has expired', 401);
        }

        return $payload;
    }
}
