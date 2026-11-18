<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminAnalyticsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function __construct(public AdminAnalyticsService $analytics) {}

    public function exportCsv(Request $request): StreamedResponse
    {
        return $this->analytics->streamReportCsv($request->query());
    }

    /**
     * Redirect legacy admin-portal report URLs cleanly into Filament reports with query string preserved.
     */
    public function redirectToFilament(Request $request): RedirectResponse
    {
        $suffix = $request->getQueryString() ? '?'.$request->getQueryString() : '';

        return redirect('/admin/transaction-reports'.$suffix);
    }
}
