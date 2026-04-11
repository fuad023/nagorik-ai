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

        // Format Payload for Groq Vision API (OpenAI Compatible)
        $messages = [];
        $messages[] = [
            'role' => 'system',
            'content' => $systemPrompt
        ];

        $userContent = [];
        $userContent[] = ['type' => 'text', 'text' => $request->message];
        
        if ($request->filled('image')) {
            // Groq supports base64 data URI natively in image_url just like OpenAI
            $userContent[] = [
                'type' => 'image_url',
                'image_url' => [
                    'url' => $request->image
                ]
            ];
        }

        $messages[] = [
            'role' => 'user',
            'content' => $userContent
        ];

        $apiKey = env('GROQ_API_KEY');
        if (empty($apiKey)) {
            return response()->json(['reply' => "Internal Error: Please add GROQ_API_KEY to the server's .env file."], 500);
        }

        $payload = [
            'model' => 'meta-llama/llama-4-scout-17b-16e-instruct',
            'messages' => $messages,
            'max_tokens' => 500,
            'temperature' => 0.7
        ];

        try {
            $url = "https://api.groq.com/openai/v1/chat/completions";
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json'
            ])->timeout(30)->post($url, $payload);

            if ($response->successful()) {
                $reply = $response->json()['choices'][0]['message']['content'] ?? "No response parsed.";
                return response()->json(['reply' => $reply]);
            }

            // Diagnostic: If Groq model is deprecated or missing, list all supported models!
            $errorData = $response->json();
            $errorCode = $errorData['error']['code'] ?? '';
            
            if ($response->status() === 404 || in_array($errorCode, ['model_not_found', 'model_decommissioned'])) {
                $modelsResponse = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey
                ])->timeout(10)->get("https://api.groq.com/openai/v1/models");
                
                if ($modelsResponse->successful()) {
                    $allModels = collect($modelsResponse->json()['data'] ?? [])->pluck('id');
                    $available = $allModels->filter(function ($id) {
                        return strpos($id, 'vision') !== false;
                    })->implode(', ');

                    if (empty($available)) {
                        $available = $allModels->implode(', '); // Show all if no vision models found
                    }
                    
                    return response()->json([
                        'reply' => "Model failed. However, your Groq API key strictly supports these models: " . $available
                    ], 404);
                }
            }

            return response()->json([
                'reply' => "Groq API Error: " . $response->body()
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json(['reply' => "Connection Error: I couldn't communicate with the Groq backbone right now."], 500);
        }
    }
}
