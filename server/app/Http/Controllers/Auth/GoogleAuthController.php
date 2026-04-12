<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Google\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class GoogleAuthController extends Controller
{
    /**
     * Get Google OAuth client
     */
    private function getGoogleClient()
    {
        $client = new Client();
        $client->setClientId(config('google.google.client_id'));
        $client->setClientSecret(config('google.google.client_secret'));
        $client->setRedirectUri(config('google.google.redirect_uri'));
        
        return $client;
    }

    /**
     * OAuth callback - validate JWT token from Google
     */
    public function callback(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        try {
            $client = $this->getGoogleClient();
            
            // The 'code' parameter is actually the JWT token from Google's frontend SDK
            $idToken = $request->input('code');
            
            // Verify the JWT token with Google
            $ticket = $client->verifyIdToken($idToken);
            
            if (!$ticket) {
                throw new \Exception('Invalid token');
            }
            
            $googleUser = $ticket;
            
            // Extract user data from JWT payload
            $sub = $googleUser['sub']; // Google User ID
            $email = $googleUser['email'];
            $name = $googleUser['name'] ?? 'User';
            $givenName = $googleUser['given_name'] ?? 'User';
            $familyName = $googleUser['family_name'] ?? '';

            // Find or create user
            $user = User::where('google_id', $sub)->first();

            if (!$user) {
                // Check if email already exists
                $existingUser = User::where('email', $email)->first();

                if ($existingUser) {
                    // Link Google ID to existing account
                    $existingUser->update(['google_id' => $sub]);
                    $user = $existingUser;
                } else {
                    // Create new user
                    $user = User::create([
                        'first_name' => $givenName,
                        'last_name' => $familyName,
                        'email' => $email,
                        'google_id' => $sub,
                        'password' => Hash::make('google-oauth-' . time()), // Random password
                        'role' => 'Citizen',
                    ]);
                }
            }

            // Create token
            $user->tokens()->delete();
            $accessToken = $user->createToken('google-login')->plainTextToken;

            return response()->json([
                'user' => new UserResource($user),
                'token' => $accessToken,
                'message' => 'Successfully authenticated with Google',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Authentication failed: ' . $e->getMessage(),
            ], 401);
        }
    }

    /**
     * Get Google authorization URL
     */
    public function getAuthUrl(Request $request)
    {
        $client = $this->getGoogleClient();
        
        $client->addScope([
            'email',
            'profile',
        ]);
        
        $authUrl = $client->createAuthUrl();

        return response()->json(['auth_url' => $authUrl]);
    }
}
