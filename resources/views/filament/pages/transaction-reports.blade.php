<x-filament-panels::page>
    <div class="equify-report-stack">
        {{-- Print-only Header --}}
        <div class="equify-print-header">
            <div>
                <h1 style="font-size: 1.25rem; font-weight: 700; color: #111827;">Laporan Transaksi Marketplace Dunia Ikan</h1>
                <p style="margin-top: 0.25rem; font-size: 0.75rem; color: #4b5563;">
                    Periode:
                    {{ $filters['date_from'] !== '' ? $filters['date_from'] : 'Awal' }}
                    s/d
                    {{ $filters['date_to'] !== '' ? $filters['date_to'] : 'Sekarang' }}
                </p>
            </div>
            <p style="font-size: 0.75rem; color: #6b7280;">
                Dicetak: {{ now()->format('d M Y, H:i') }} WIB
            </p>
        </div>

        {{-- Interactive Filter Panel (hidden when printing) --}}
        <div class="equify-print-hide">
            <x-filament::section>
                <div class="equify-preset-row">
                    <div class="equify-preset-buttons">
                        <span class="equify-preset-label">Periode Cepat:</span>
                        <x-filament::button size="xs" color="gray" wire:click="applyPreset('today')">
                            Hari Ini
                        </x-filament::button>
                        <x-filament::button size="xs" color="gray" wire:click="applyPreset('7d')">
                            7 Hari Terakhir
                        </x-filament::button>
                        <x-filament::button size="xs" color="gray" wire:click="applyPreset('month')">
                            Bulan Ini
                        </x-filament::button>
                        <x-filament::button size="xs" color="gray" wire:click="applyPreset('all')">
                            Semua Periode
                        </x-filament::button>
                    </div>

                    <x-filament::button size="xs" color="danger" outlined wire:click="resetFilters">
                        Reset Filter
                    </x-filament::button>
                </div>

                <div class="equify-report-filters">
                    <div>
                        <label class="equify-filter-label">Dari Tanggal</label>
                        <input type="date" wire:model.live="date_from" class="equify-filter-input" />
                    </div>
                    <div>
                        <label class="equify-filter-label">Sampai Tanggal</label>
                        <input type="date" wire:model.live="date_to" class="equify-filter-input" />
                    </div>
                    <div>
                        <label class="equify-filter-label">Toko Mitra</label>
                        <select wire:model.live="store_id" class="equify-filter-input">
                            <option value="">Semua Toko</option>
                            @foreach ($stores as $store)
                                <option value="{{ $store->id }}">{{ $store->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label class="equify-filter-label">Status Pesanan</label>
                        <select wire:model.live="status" class="equify-filter-input">
                            <option value="">Semua Status</option>
                            <option value="pending_payment">Menunggu Pembayaran</option>
                            <option value="awaiting_confirmation">Menunggu Konfirmasi</option>
                            <option value="processing">Diproses</option>
                            <option value="shipped">Dikirim</option>
                            <option value="delivered">Selesai</option>
                            <option value="cancelled">Dibatalkan</option>
                        </select>
                    </div>
                    <div>
                        <label class="equify-filter-label">Status Pembayaran</label>
                        <select wire:model.live="payment_status" class="equify-filter-input">
                            <option value="">Semua Pembayaran</option>
                            <option value="verified">Terverifikasi</option>
                            <option value="paid">Sudah Dibayar</option>
                            <option value="unpaid">Belum Dibayar</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>
                </div>
            </x-filament::section>
        </div>

        {{-- Summary KPI Row --}}
        <div class="equify-report-kpis">
            <div class="equify-report-kpi">
                <p class="equify-kpi-label">Omzet Terverifikasi</p>
                <p class="equify-kpi-value">
                    Rp {{ number_format((float) $summary['verifiedRevenue'], 0, ',', '.') }}
                </p>
                <p class="equify-kpi-sub equify-kpi-sub-emerald">
                    {{ $summary['verifiedOrders'] }} pesanan terverifikasi
                </p>
            </div>

            <div class="equify-report-kpi">
                <p class="equify-kpi-label">Nilai Pesanan Aktif</p>
                <p class="equify-kpi-value">
                    Rp {{ number_format((float) $summary['activeOrderTotal'], 0, ',', '.') }}
                </p>
                <p class="equify-kpi-sub equify-kpi-sub-sky">
                    Di luar transaksi dibatalkan
                </p>
            </div>

            <div class="equify-report-kpi">
                <p class="equify-kpi-label">Total Transaksi</p>
                <p class="equify-kpi-value">
                    {{ number_format((int) $summary['totalOrders'], 0, ',', '.') }}
                </p>
                <p class="equify-kpi-sub equify-kpi-sub-muted">
                    Ditampilkan {{ $summary['displayedOrders'] }} baris
                </p>
            </div>

            <div class="equify-report-kpi">
                <p class="equify-kpi-label">Dibatalkan</p>
                <p class="equify-kpi-value">
                    {{ number_format((int) $summary['cancelledOrders'], 0, ',', '.') }}
                </p>
                <p class="equify-kpi-sub equify-kpi-sub-rose">
                    Transaksi berstatus batal
                </p>
            </div>
        </div>

        @if ($summary['isTruncated'])
            <div class="equify-report-alert">
                Menampilkan {{ $summary['maxRows'] }} transaksi terbaru di layar agar tetap ringan. Gunakan tombol
                <strong>Ekspor CSV</strong> untuk mengunduh seluruh {{ $summary['totalOrders'] }} data sesuai filter.
            </div>
        @endif

        {{-- Store Breakdown --}}
        <x-filament::section heading="Ringkasan Performa per Toko">
            <div class="equify-table-scroll">
                <table class="equify-report-table">
                    <thead>
                        <tr>
                            <th>Nama Toko</th>
                            <th style="text-align: right;">Total Pesanan</th>
                            <th style="text-align: right;">Terverifikasi</th>
                            <th style="text-align: right;">Nilai Aktif</th>
                            <th style="text-align: right;">Omzet Terverifikasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($storeBreakdown as $row)
                            <tr>
                                <td style="font-weight: 600;">{{ $row['store_name'] }}</td>
                                <td style="text-align: right;">{{ $row['total_orders'] }}</td>
                                <td style="text-align: right;">{{ $row['verified_orders'] }}</td>
                                <td style="text-align: right;">
                                    Rp {{ number_format((float) $row['active_order_total'], 0, ',', '.') }}
                                </td>
                                <td style="text-align: right; font-weight: 600; color: #059669;">
                                    Rp {{ number_format((float) $row['verified_revenue'], 0, ',', '.') }}
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" style="padding: 1.5rem; text-align: center; color: #6b7280;">
                                    Tidak ada data toko pada rentang filter ini.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </x-filament::section>

        {{-- Detailed Order List --}}
        <x-filament::section heading="Rincian Transaksi ({{ $orders->count() }} baris)">
            <div class="equify-table-scroll">
                <table class="equify-report-table">
                    <thead>
                        <tr>
                            <th>No. Pesanan</th>
                            <th>Tanggal</th>
                            <th>Pembeli</th>
                            <th>Toko</th>
                            <th>Pembayaran</th>
                            <th>Status</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($orders as $order)
                            <tr>
                                <td style="font-weight: 600;">{{ $order->order_number }}</td>
                                <td style="white-space: nowrap;">
                                    {{ $order->created_at?->format('d M Y H:i') ?? '-' }}
                                </td>
                                <td>{{ $order->buyer?->name ?? 'Guest' }}</td>
                                <td>{{ $order->store?->name ?? 'Toko Dihapus' }}</td>
                                <td>
                                    <span class="equify-pay-pill {{ $order->payment_status === 'verified' ? 'equify-pay-pill-verified' : 'equify-pay-pill-neutral' }}">
                                        {{ strtoupper((string) $order->payment_method) }} • {{ $order->payment_status }}
                                    </span>
                                </td>
                                <td>{{ $order->status }}</td>
                                <td style="text-align: right; font-weight: 600;">
                                    Rp {{ number_format((float) $order->grand_total, 0, ',', '.') }}
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" style="padding: 1.5rem; text-align: center; color: #6b7280;">
                                    Belum ada transaksi yang sesuai dengan filter saat ini.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </x-filament::section>
    </div>
</x-filament-panels::page>
