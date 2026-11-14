<?php

namespace App\Filament\Resources\Orders\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_number')
                    ->searchable(),
                TextColumn::make('buyer.name')
                    ->searchable(),
                TextColumn::make('store.name')
                    ->searchable(),
                TextColumn::make('status')
                    ->searchable(),
                TextColumn::make('payment_method')
                    ->searchable(),
                TextColumn::make('payment_status')
                    ->searchable(),
                TextColumn::make('total_product_amount')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('shipping_cost')
                    ->money()
                    ->sortable(),
                TextColumn::make('grand_total')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('shipping_recipient_name')
                    ->searchable(),
                TextColumn::make('shipping_phone')
                    ->searchable(),
                TextColumn::make('shipping_city')
                    ->searchable(),
                TextColumn::make('shipping_courier')
                    ->searchable(),
                TextColumn::make('shipping_tracking_number')
                    ->searchable(),
                TextColumn::make('payment_proof')
                    ->searchable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
