<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ImageInterpreterService;
use Illuminate\Support\Facades\Http;

class PerformanceController extends Controller
{
    protected $imageInterpreter;

    public function __construct(ImageInterpreterService $imageInterpreter)
    {
        $this->imageInterpreter = $imageInterpreter;
    }
    
    public function index()
    {
        return view('performance');
    } 

    public function upload(Request $request)
    {
        $results = [];
        $request->validate([
            'images.*' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        foreach ($request->file('images') as $image) {
            $path = $image->store('uploads', 'public');
            $base64_code = base64_encode(file_get_contents(storage_path('app/public/' . $path)));
            array_push($results, array(
                'base64' => $base64_code,
                'path' => storage_path('app/public/' . $path)
            ));
        }

        return response()->json($results);
    }

    public function interpreter(Request $request)
    {
        $base64_code = $request->input();
        $performanceData = $this->imageInterpreter->interpretImage($base64_code[0]);

        return response()->json($performanceData);
    }

    public function summarize(Request $request)
    {
        $interpretations = $request->input('interpretations');
        
        // Create a prompt for the overall summary
        $prompt = "I have multiple chart interpretations that I'd like you to analyze together and provide a comprehensive summary. Here are the individual interpretations:\n\n";
        foreach ($interpretations as $index => $interpretation) {
            $prompt .= "Chart " . ($index + 1) . ":\n" . $interpretation . "\n\n";
        }
        $prompt .= "\nPlease provide a comprehensive analysis that:\n";
        $prompt .= "1. Identifies common themes or patterns across the charts\n";
        $prompt .= "2. Highlights key insights from the collection of charts\n";
        $prompt .= "3. Suggests any relevant correlations or relationships between the data shown in different charts\n";
        $prompt .= "4. Provides an overall conclusion about what these charts together reveal\n";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.openai.api_key'),
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an expert data analyst who specializes in interpreting and synthesizing information from multiple charts and graphs.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.7,
                'max_tokens' => 1000,
            ]);

            $summary = $response->json()['choices'][0]['message']['content'];
            return response()->json(['summary' => $summary]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to generate summary'], 500);
        }
    }
}
