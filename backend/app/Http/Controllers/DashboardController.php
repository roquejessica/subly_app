<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Models\PaymentHistory;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = \App\Models\User::first();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $subscriptions = Subscription::where('user_id', $user->id)
            ->where('is_active', true)
            ->with('category')
            ->get();

        // Calculate Monthly Total (Converted to PHP for demonstration)
        $monthlyTotalPHP = 0;
        foreach ($subscriptions as $sub) {
            $monthlyTotalPHP += $this->convertToMonthly($this->convertToBase($sub->amount, $sub->currency), $sub->billing_cycle);
        }

        // Calculate Daily Burn Rate
        $dailyBurn = $monthlyTotalPHP / 30;

        // Get Upcoming Payments (Next 35 days to ensure monthly ads show up)
        $upcoming = Subscription::where('user_id', $user->id)
            ->where('is_active', true)
            ->whereDate('next_payment_date', '>=', now()->toDateString())
            ->whereDate('next_payment_date', '<=', now()->addDays(35)->toDateString())
            ->orderBy('next_payment_date', 'asc')
            ->with('category')
            ->get();

        // Category Breakdown
        $categoryData = $subscriptions->groupBy('category_id')->map(function ($subs, $catId) {
            $category = $subs->first()->category;
            return [
                'name' => $category ? $category->name : 'Uncategorized',
                'value' => round($subs->sum(fn($s) => $this->convertToMonthly($this->convertToBase($s->amount, $s->currency), $s->billing_cycle)), 2),
                'color' => $category ? $category->color : '#94a3b8'
            ];
        })->values();

        // Burn Rate Chart Data
        $chartData = $this->getBurnRateChartData($user->id);

        return response()->json([
            'stats' => [
                'monthly_total' => round($monthlyTotalPHP, 2),
                'daily_burn' => round($dailyBurn, 2),
                'weekly_burn' => round($dailyBurn * 7, 2),
                'subscription_count' => $subscriptions->count(),
            ],
            'upcoming' => $upcoming,
            'category_breakdown' => $categoryData,
            'chart_data' => $chartData
        ]);
    }

    private function convertToBase($amount, $currency)
    {
        $rates = [
            'USD' => 56.40, // Static rates for demo
            'EUR' => 61.20,
            'PHP' => 1.0
        ];
        
        $rate = $rates[strtoupper($currency)] ?? 1.0;
        return $amount * $rate;
    }

    private function convertToMonthly($amount, $cycle)
    {
        return match($cycle) {
            'weekly' => $amount * 4.33,
            'yearly' => $amount / 12,
            'quarterly' => $amount / 3,
            'biannual' => $amount / 6,
            default => $amount,
        };
    }

    private function getBurnRateChartData($userId)
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            
            $monthlyTotal = Subscription::where('user_id', $userId)
                ->where('is_active', true)
                ->where('created_at', '<=', $date->endOfDay())
                ->get()
                ->sum(fn($sub) => $this->convertToMonthly($this->convertToBase($sub->amount, $sub->currency), $sub->billing_cycle));

            $data[] = [
                'date' => $date->format('M d'),
                'amount' => round($monthlyTotal / 30, 2)
            ];
        }
        return $data;
    }
}
