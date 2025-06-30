<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;

class ImageInterpreterService
{
    protected $apiKey;
    protected $systemPrompt;
    protected $userPrompt;

    public function __construct()
    {
        $this->apiKey = config('services.openai.api_key');
        $this->systemPrompt = config('services.openai.system_prompt');
        $this->userPrompt = config('services.openai.user_prompt');
    }

    public function interpretImage($base64_code)
    {
        $messages = [
            ['role' => 'system', 'content' => $this->systemPrompt],
            ['role' => 'user', 'content' => [
                [
                    'type' => "text",
                    'text' => $this->userPrompt
                ],
                [
                    'type'=> "image_url",
                    'image_url'=>[
                        // 'url'=> base64_encode(file_get_contents($imagePath))
                        'url' => 'data:image/png;base64,'.$base64_code
                    ]
                ]
            ]],
        ];
        // Send the image to OpenAI for interpretation
        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.$this->apiKey,
            'Content-type'=> 'application/json',
            'X-Slack-No-Retry'=> 1
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4o-mini',
            'messages' => $messages,
            'temperature' => 0.5,
            'max_tokens'=> 2049,
        ]);

        $result = Arr::get($response, 'choices.0.message')['content'] ?? '';
        
        return response()->json(['message' => $result]);
    }
}
 