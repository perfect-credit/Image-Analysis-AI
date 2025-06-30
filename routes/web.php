<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PerformanceController;

Route::get('/', [PerformanceController::class, 'index']);
Route::post('/upload', [PerformanceController::class, 'upload']);
Route::post('/interpreter', [PerformanceController::class, 'interpreter']);
Route::post('/interpreter/summary', [PerformanceController::class, 'summarize']);