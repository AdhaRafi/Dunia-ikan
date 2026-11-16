<?php

namespace Tests\Feature;

use App\Filament\Pages\TransactionReports;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class AdminReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin_reports_or_export(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);
        $seller = User::factory()->create(['role' => 'seller']);

        $this->get('/admin/transaction-reports')->assertRedirect('/admin/login');
        $this->get('/admin/transaction-reports/export')->assertRedirect();
        $this->get('/admin-portal/reports')->assertRedirect();

        $this->actingAs($buyer)->get('/admin/transaction-reports')->assertRedirect('/admin/login');
        $this->actingAs($buyer)->get('/admin/transaction-reports/export')->assertForbidden();
        $this->actingAs($buyer)->get('/admin-portal/reports')->assertForbidden();
        $this->actingAs($buyer)->get('/admin-portal/reports/export')->assertForbidden();

        $this->actingAs($seller)->get('/admin/transaction-reports')->assertRedirect('/admin/login');
        $this->actingAs($seller)->get('/admin/transaction-reports/export')->assertForbidden();
        $this->actingAs($seller)->get('/admin-portal/reports')->assertForbidden();
        $this->actingAs($seller)->get('/admin-portal/reports/export')->assertForbidden();

        $guestHtml = $this->get('/')->getContent();
        $this->assertIsString($guestHtml);
        $this->assertStringNotContainsString('admin.reports.index', $guestHtml);
        $this->assertStringNotContainsString('admin.reports.export', $guestHtml);
        $this->assertStringNotContainsString('filament.admin.reports.export', $guestHtml);
    }

    public function test_admin_can_view_reports_filtered_by_period_store_and_status(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $buyer = User::factory()->create(['role' => 'buyer', 'name' => 'Budi Santoso']);
        $sellerA = User::factory()->create(['role' => 'seller']);
        $sellerB = User::factory()->create(['role' => 'seller']);

        $storeA = Store::create([
            'user_id' => $sellerA->id,
            'name' => 'Toko Koi Nusantara',
            'slug' => 'toko-koi-nusantara',
            'city' => 'Bandung',
            'address' => 'Jl. Ikan Koi No. 1',
            'phone' => '081234567801',
        ]);

        $storeB = Store::create([
            'user_id' => $sellerB->id,
            'name' => 'Aquascape Jaya',
            'slug' => 'aquascape-jaya',
            'city' => 'Bogor',
            'address' => 'Jl. Aquascape No. 2',
            'phone' => '081234567802',
        ]);

        $this->createOrderWithItem($buyer, $storeA, 'DI-RPT-001', '2026-11-10 10:00:00', 'delivered', 'verified', 150000, 'Koi Kohaku');
        $this->createOrderWithItem($buyer, $storeB, 'DI-RPT-002', '2026-11-12 14:00:00', 'processing', 'paid', 200000, 'Filter Canister');
        $this->createOrderWithItem($buyer, $storeA, 'DI-RPT-003', '2026-10-05 09:00:00', 'cancelled', 'unpaid', 90000, 'Cupang Halfmoon');

        $this->actingAs($admin, 'admin')
            ->get('/admin/transaction-reports')
            ->assertOk()
            ->assertSee('Laporan Transaksi')
            ->assertSee('DI-RPT-001')
            ->assertSee('DI-RPT-002')
            ->assertSee('DI-RPT-003')
            ->assertSee('Rp 150.000')
            ->assertSee('Rp 350.000')
            ->assertSee('Toko Koi Nusantara')
            ->assertSee('Aquascape Jaya');

        // Legacy portal reports URL redirects into unified Filament report page with query string preserved.
        $this->actingAs($admin, 'admin')
            ->get('/admin-portal/reports?date_from=2026-11-01&date_to=2026-11-15')
            ->assertRedirect('/admin/transaction-reports?date_from=2026-11-01&date_to=2026-11-15');

        $this->actingAs($admin, 'admin');

        Livewire::test(TransactionReports::class)
            ->set('date_from', '2026-11-01')
            ->set('date_to', '2026-11-15')
            ->assertSee('DI-RPT-001')
            ->assertSee('DI-RPT-002')
            ->assertDontSee('DI-RPT-003')
            ->set('store_id', (string) $storeA->id)
            ->set('payment_status', 'verified')
            ->assertSee('DI-RPT-001')
            ->assertDontSee('DI-RPT-002')
            ->assertDontSee('DI-RPT-003');
    }

    public function test_admin_csv_export_filters_rows_and_neutralizes_formula_injection(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $buyer = User::factory()->create(['role' => 'buyer', 'name' => '+Attacker']);
        $seller = User::factory()->create(['role' => 'seller']);

        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Toko Test Export',
            'slug' => 'toko-test-export',
            'city' => 'Jakarta',
            'address' => 'Jl. Export No. 1',
            'phone' => '081234567899',
        ]);

        $this->createOrderWithItem($buyer, $store, 'DI-CSV-NOV', '2026-11-14 11:00:00', 'delivered', 'verified', 125000, '=CMD|calc');
        $this->createOrderWithItem($buyer, $store, 'DI-CSV-OCT', '2026-10-01 11:00:00', 'delivered', 'verified', 75000, 'Arwana Silver');

        $response = $this->actingAs($admin, 'admin')
            ->get('/admin/transaction-reports/export?date_from=2026-11-01&date_to=2026-11-30');

        $response->assertOk();
        $this->assertStringContainsString('text/csv', (string) $response->headers->get('Content-Type'));

        $csv = $response->streamedContent();
        $this->assertStringStartsWith("\xEF\xBB\xBF", $csv);
        $this->assertStringContainsString('DI-CSV-NOV', $csv);
        $this->assertStringNotContainsString('DI-CSV-OCT', $csv);
        $this->assertStringContainsString("'+Attacker", $csv);
        $this->assertStringContainsString("'=CMD|calc (x1)", $csv);
    }

    private function createOrderWithItem(
        User $buyer,
        Store $store,
        string $orderNumber,
        string $createdAt,
        string $status,
        string $paymentStatus,
        float $grandTotal,
        string $productName,
    ): Order {
        $order = Order::create([
            'order_number' => $orderNumber,
            'buyer_id' => $buyer->id,
            'store_id' => $store->id,
            'status' => $status,
            'payment_method' => 'qris',
            'payment_status' => $paymentStatus,
            'total_product_amount' => $grandTotal - 15000,
            'shipping_cost' => 15000,
            'grand_total' => $grandTotal,
            'shipping_recipient_name' => $buyer->name,
            'shipping_phone' => '081234567890',
            'shipping_city' => 'Bandung',
            'shipping_address' => 'Jl. Pengiriman No. 1',
        ]);

        $timestamp = Carbon::parse($createdAt);
        $order->forceFill([
            'created_at' => $timestamp,
            'updated_at' => $timestamp,
        ])->save();

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => null,
            'product_name' => $productName,
            'price' => $grandTotal - 15000,
            'quantity' => 1,
            'subtotal' => $grandTotal - 15000,
        ]);

        return $order;
    }
}
