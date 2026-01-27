<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubscriptionParserController;
use App\Http\Controllers\DashboardController;

Route::post('/subscriptions/parse', [SubscriptionParserController::class, 'parse']);
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::delete('/subscriptions/{subscription}', function (\App\Models\Subscription $subscription) {
    $subscription->delete();
    return response()->json(['message' => 'Subscription deleted']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
