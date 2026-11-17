<?php

use App\Http\Controllers\Api\SystemController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [SystemController::class, 'health']);

Route::middleware('auth:sanctum')->get('/user', [SystemController::class, 'user']);
