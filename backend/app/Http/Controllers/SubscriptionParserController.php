<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Models\Category;
use Carbon\Carbon;

class SubscriptionParserController extends Controller
{
    public function parse(Request $request)
    {
        $text = $request->input('text');
        
        if (empty($text)) {
            return response()->json(['message' => 'Please provide some text to parse.'], 400);
        }

        // 1. Extract Entities (Regex Fallback)
        $entities = $this->extractEntities($text);
        
        // 2. Determine Action/Response
        if ($entities['confidence'] < 0.5) {
            return response()->json([
                'message' => "I couldn't quite catch the details. Which service did you subscribe to and how much does it cost?",
                'entities' => $entities,
                'status' => 'needs_clarification'
            ]);
        }

        // 3. (Optional) Check for missing critical info
        if (empty($entities['provider'])) {
            return response()->json([
                'message' => "I catch the amount, but which service is this for?",
                'entities' => $entities,
                'status' => 'needs_provider'
            ]);
        }

        if (empty($entities['amount'])) {
            return response()->json([
                'message' => "Got it, {$entities['provider']}! How much do you pay for it?",
                'entities' => $entities,
                'status' => 'needs_amount'
            ]);
        }

        // 4. Create Subscription
        try {
            $user = \App\Models\User::first();
            if (!$user) {
                return response()->json(['message' => 'No user found in system.'], 500);
            }
            
            // Find or create category based on provider (simplified)
            $categoryId = $this->guessCategory($entities['provider']);
            
            $subscription = Subscription::create([
                'user_id' => $user->id,
                'category_id' => $categoryId,
                'name' => $entities['provider'],
                'amount' => $entities['amount'],
                'currency' => $entities['currency'] ?? 'USD',
                'billing_cycle' => $entities['cycle'] ?? 'monthly',
                'start_date' => now(),
                'next_payment_date' => $this->calculateNextDate($entities['cycle'] ?? 'monthly'),
                'is_active' => true,
            ]);

            \Log::info('NLP Parsing result', ['text' => $text, 'entities' => $entities]);

            return response()->json([
                'message' => "Perfect! I've added {$entities['provider']} ({$entities['currency']} {$entities['amount']} / {$entities['cycle']}) to your dashboard.",
                'subscription' => $subscription,
                'status' => 'success'
            ]);
        } catch (\Exception $e) {
            \Log::error('Subscription creation failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'message' => "I had trouble saving that: " . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    private function extractEntities($text)
    {
        $entities = [
            'provider' => null,
            'amount' => null,
            'currency' => 'USD',
            'cycle' => 'monthly',
            'confidence' => 0
        ];

        // Provider Detection (Look for capitalized words or known services)
        $knownServices = ['netflix', 'spotify', 'disney+', 'hulu', 'amazon prime', 'youtube premium', 'canva', 'adobe', 'chatgpt', 'github'];
        foreach ($knownServices as $service) {
            if (stripos($text, $service) !== false) {
                $entities['provider'] = ucfirst($service);
                $entities['confidence'] += 0.4;
                break;
            }
        }

        if (!$entities['provider']) {
            // "subbed to X", "signed up for X", "paid for X"
            if (preg_match('/(?:subbed to|signed up for|paid for|for|to)\s+([a-z0-9\s.\-+]+?)(?:\s+for|\s+every|\s+each|\s+\d|$)/i', $text, $matches)) {
                $entities['provider'] = trim($matches[1]);
                $entities['confidence'] += 0.3;
            }
        }

        // Amount Detection
        if (preg_match('/(\d+(?:\.\d{1,2})?)/', $text, $matches)) {
            $entities['amount'] = (float)$matches[1];
            $entities['confidence'] += 0.4;
        }

        // Currency Detection
        $currencies = [
            'PHP' => ['pesos', 'php', '₱'],
            'USD' => ['dollars', 'usd', '$'],
            'EUR' => ['euros', 'eur', '€'],
        ];

        foreach ($currencies as $code => $keywords) {
            foreach ($keywords as $kw) {
                if (stripos($text, $kw) !== false) {
                    $entities['currency'] = $code;
                    $entities['confidence'] += 0.1;
                    break 2;
                }
            }
        }

        // Cycle Detection
        if (stripos($text, 'year') !== false || stripos($text, 'annual') !== false) {
            $entities['cycle'] = 'yearly';
            $entities['confidence'] += 0.1;
        } elseif (stripos($text, 'week') !== false) {
            $entities['cycle'] = 'weekly';
            $entities['confidence'] += 0.1;
        }

        return $entities;
    }

    private function guessCategory($provider)
    {
        if (!$provider) return null;
        $provider = strtolower($provider);
        $entertainment = ['netflix', 'spotify', 'disney', 'hulu', 'youtube', 'music', 'hbo'];
        $software = ['adobe', 'canva', 'github', 'chatgpt', 'office', 'microsoft', 'cursor', 'copilot'];
        
        foreach ($entertainment as $kw) {
            if (str_contains($provider, $kw)) return 1; // Assuming Entertainment ID = 1
        }
        
        foreach ($software as $kw) {
            if (str_contains($provider, $kw)) return 2; // Assuming Software ID = 2
        }

        return 10; // Default to 'Other' which is ID 10 in our seeder
    }

    private function calculateNextDate($cycle)
    {
        $date = now();
        return match($cycle) {
            'weekly' => $date->addWeek(),
            'yearly' => $date->addYear(),
            default => $date->addMonth(),
        };
    }
}
