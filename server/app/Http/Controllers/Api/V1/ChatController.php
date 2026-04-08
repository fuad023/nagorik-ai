<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    /**
     * Handle the AI chat request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $apiKey = config('services.gemini.key') ?? env('GEMINI_API_KEY');
        $userInput = $request->input('message');

        if (!$apiKey) {
            return response()->json([
                'error' => 'Gemini API key not configured.',
            ], 500);
        }

        try {
            // Google Gemini API endpoint (Gemini 2.5 Flash-Lite - Stable 2026)
            $url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=" . $apiKey;

            Log::debug('Sending message to Gemini API', ['url' => 'https://generativelanguage.googleapis.com/v1/models/...', 'message' => $userInput]);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($url, [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => "You are a friendly and helpful AI assistant on the Nagorik-AI platform. You can talk normally with users about any topic (hobbies, science, general chat), but also help them with reporting local civic issues (like garbage, potholes, or broken streetlights) if they bring it up. Keep your responses engaging, polite, and human-like. User says: " . $userInput]
                        ]
                    ]
                ]
            ]);

            if ($response->failed()) {
                Log::error('Gemini API Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                
                return response()->json([
                    'error' => 'Failed to get response from AI.',
                    'details' => $response->json()
                ], $response->status());
            }

            $data = $response->json();
            $aiResponse = $data['candidates'][0]['content']['parts'][0]['text'] ?? "I'm sorry, I couldn't process that request.";

            Log::debug('Received response from Gemini API', ['response' => substr($aiResponse, 0, 100) . '...']);

            return response()->json([
                'message' => $aiResponse,
            ]);

        } catch (\Exception $e) {
            Log::error('Chat Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred while processing your request.',
            ], 500);
        }
    }
}
