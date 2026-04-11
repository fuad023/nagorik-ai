<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Report;

class ChatbotController extends Controller
{
    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'image' => 'nullable|string' // base64 string including data URI prefix
        ]);

        $user = $request->user();
        
        // Context Injection: Fetch the user's actual database reports
        $recentReports = Report::where('reporter_id', $user->id)
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'description'])
            ->map(function($report) {
                return "Report ID: {$report->id}, Title: '{$report->title}', Description: '{$report->description}'";
            })
            ->implode("\n");
            
        $systemPrompt = "You are Nagorik Assistant, an AI helper for the Nagorik-AI municipal reporting system. 
Your job is to help the citizen categorize their issues (options: Infrastructure, Roads, Sanitation, Water Supply, Traffic, Parks, General). 
If they upload an image or describe a problem, suggest the right category.
Also, you have access to their current reports. Answer questions about their report statuses perfectly based on this database context.
Here are the user's current reports:
" . ($recentReports ?: "User has no recent reports.");

        // Format Payload for Gemini API
        $partsPayload = [];
        $partsPayload[] = ['text' => $request->message];
        
        if ($request->filled('image')) {
            $imagePartsArr = explode(';base64,', $request->image);
            if (count($imagePartsArr) == 2) {
                $mimeType = explode(':', $imagePartsArr[0])[1];
                $base64Data = $imagePartsArr[1];
                
                $partsPayload[] = [
                    'inlineData' => [
                        'mimeType' => $mimeType,
                        'data' => $base64Data
                    ]
                ];
            }
        }

        $apiKey = env('GEMINI_API_KEY');
        if (empty($apiKey)) {
            return response()->json(['reply' => "Internal Error: Please add GEMINI_API_KEY to the server's .env file."], 500);
        }

        $payload = [
            'systemInstruction' => [
                'parts' => [
                    ['text' => $systemPrompt]
                ]
            ],
            'contents' => [
                [
                    'parts' => $partsPayload
                ]
            ],
            'generationConfig' => [
                'maxOutputTokens' => 500
            ]
        ];

        try {
            // Trying Gemini 1.5 Pro
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" . $apiKey;
            
            $response = Http::timeout(30)->post($url, $payload);

            if ($response->successful()) {
                $reply = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? "No response parsed.";
                return response()->json(['reply' => $reply]);
            }

            return response()->json([
                'reply' => "Gemini API Error: " . $response->body()
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json(['reply' => "Connection Error: I couldn't communicate with the Google AI backbone right now."], 500);
        }
    }
}
