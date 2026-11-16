<?php

namespace App\Filament\Pages;

use App\Services\AdminAnalyticsService;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Livewire\Attributes\Url;
use UnitEnum;

class TransactionReports extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentChartBar;

    protected static ?string $navigationLabel = 'Laporan Transaksi';

    protected static string|UnitEnum|null $navigationGroup = 'Ringkasan & Laporan';

    protected static ?int $navigationSort = 2;

    protected static ?string $slug = 'transaction-reports';

    protected string $view = 'filament.pages.transaction-reports';

    protected ?string $heading = 'Laporan Transaksi';

    protected ?string $subheading = 'Filter transaksi marketplace, tinjau ringkasan per toko, ekspor CSV, atau cetak PDF.';

    #[Url(except: '')]
    public string $date_from = '';

    #[Url(except: '')]
    public string $date_to = '';

    #[Url(except: '')]
    public string $store_id = '';

    #[Url(except: '')]
    public string $status = '';

    #[Url(except: '')]
    public string $payment_status = '';

    public function applyPreset(string $preset): void
    {
        $today = now();

        if ($preset === 'today') {
            $this->date_from = $today->format('Y-m-d');
            $this->date_to = $today->format('Y-m-d');

            return;
        }

        if ($preset === '7d') {
            $this->date_from = $today->copy()->subDays(6)->format('Y-m-d');
            $this->date_to = $today->format('Y-m-d');

            return;
        }

        if ($preset === 'month') {
            $this->date_from = $today->copy()->startOfMonth()->format('Y-m-d');
            $this->date_to = $today->format('Y-m-d');

            return;
        }

        $this->date_from = '';
        $this->date_to = '';
    }

    public function resetFilters(): void
    {
        $this->date_from = '';
        $this->date_to = '';
        $this->store_id = '';
        $this->status = '';
        $this->payment_status = '';
    }

    /**
     * @return array<string, string>
     */
    public function currentFilters(): array
    {
        return [
            'date_from' => $this->date_from,
            'date_to' => $this->date_to,
            'store_id' => $this->store_id,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
        ];
    }

    public function exportUrl(): string
    {
        $query = array_filter(
            $this->currentFilters(),
            static fn (string $value): bool => $value !== '',
        );

        return route('filament.admin.reports.export', $query);
    }

    /**
     * @return array<Action>
     */
    protected function getHeaderActions(): array
    {
        return [
            Action::make('printPdf')
                ->label('Cetak / Simpan PDF')
                ->icon(Heroicon::OutlinedPrinter)
                ->color('gray')
                ->extraAttributes([
                    'onclick' => 'window.print(); return false;',
                ]),
            Action::make('exportCsv')
                ->label('Ekspor CSV')
                ->icon(Heroicon::OutlinedArrowDownTray)
                ->color('primary')
                ->url(fn (): string => $this->exportUrl()),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function getViewData(): array
    {
        return app(AdminAnalyticsService::class)->getReportData($this->currentFilters());
    }
}
