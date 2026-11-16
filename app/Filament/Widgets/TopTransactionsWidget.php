<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class TopTransactionsWidget extends TableWidget
{
    protected static ?bool $isLazyLoaded = false;

    protected static ?int $sort = 4;

    protected int|string|array $columnSpan = [
        'default' => 'full',
        'xl' => 7,
    ];

    public function table(Table $table): Table
    {
        return $table
            ->heading('Transaksi Terbesar')
            ->description('5 pesanan aktif dengan nilai transaksi tertinggi di Dunia Ikan.')
            ->query(
                Order::query()
                    ->with(['buyer:id,name', 'store:id,name'])
                    ->where('status', '!=', 'cancelled')
                    ->orderByDesc('grand_total')
                    ->latest()
                    ->limit(5)
            )
            ->paginated(false)
            ->recordUrl(fn (Order $record): string => OrderResource::getUrl('view', ['record' => $record]))
            ->headerActions([
                Action::make('viewAllOrders')
                    ->label('Lihat Semua')
                    ->size('sm')
                    ->color('gray')
                    ->url(OrderResource::getUrl()),
            ])
            ->columns([
                TextColumn::make('order_number')
                    ->label('No. Pesanan')
                    ->weight('semibold')
                    ->searchable(false),
                TextColumn::make('store.name')
                    ->label('Toko')
                    ->placeholder('-'),
                TextColumn::make('buyer.name')
                    ->label('Pembeli')
                    ->placeholder('-'),
                TextColumn::make('grand_total')
                    ->label('Total')
                    ->formatStateUsing(fn (mixed $state): string => 'Rp '.number_format((float) $state, 0, ',', '.'))
                    ->weight('semibold')
                    ->alignEnd(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'pending_payment' => 'Menunggu Bayar',
                        'awaiting_confirmation' => 'Verifikasi Bayar',
                        'processing' => 'Diproses',
                        'shipped' => 'Dikirim',
                        'delivered' => 'Selesai',
                        'cancelled' => 'Dibatalkan',
                        default => (string) $state,
                    })
                    ->color(fn (?string $state): string => match ($state) {
                        'delivered' => 'success',
                        'processing', 'shipped' => 'info',
                        'awaiting_confirmation' => 'primary',
                        'pending_payment' => 'warning',
                        'cancelled' => 'danger',
                        default => 'gray',
                    }),
            ]);
    }
}
