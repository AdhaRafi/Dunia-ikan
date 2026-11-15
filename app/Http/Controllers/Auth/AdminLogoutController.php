<?php

namespace App\Http\Controllers\Auth;

use Filament\Auth\Http\Controllers\LogoutController;
use Filament\Auth\Http\Responses\Contracts\LogoutResponse;
use Illuminate\Support\Facades\Auth;

class AdminLogoutController extends LogoutController
{
    public function __invoke(): LogoutResponse
    {
        if (Auth::guard('admin')->check()) {
            Auth::guard('admin')->logout();
        } elseif (Auth::guard('web')->user()?->isAdmin()) {
            Auth::guard('web')->logout();
        }

        $session = request()->session();

        if (! Auth::guard('web')->check() && ! Auth::guard('admin')->check()) {
            $session->invalidate();
        } else {
            $session->regenerate();
        }

        $session->regenerateToken();

        return app(LogoutResponse::class);
    }
}
