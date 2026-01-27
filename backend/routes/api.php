<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubscriptionParserController;

Route::post('/subscriptions/parse', [SubscriptionParserController::class, 'parse']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
