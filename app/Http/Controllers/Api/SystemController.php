<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemController extends Controller
{
    /**
     * Return a lightweight JSON service health status.
     */
    public function health(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'service' => config('app.name'),
        ]);
    }

    /**
     * Return the authenticated Sanctum user with their store relation.
     */
    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()?->loadMissing('store'),
        ]);
    }
}
