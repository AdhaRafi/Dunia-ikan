@php
    $items = $distribution['items'] ?? [];
    $source = $distribution['source'] ?? 'orders';
    $activeRegions = collect($items)->pluck('region')->unique()->all();
@endphp

<x-filament-widgets::widget>
    <x-filament::section
        heading="Pesanan Berdasarkan Kota"
        :description="$source === 'orders' ? 'Top kota pengiriman aktif di Indonesia.' : 'Top kota asal toko mitra Dunia Ikan.'"
    >
        <div class="equify-city-wrap">
            <div class="equify-map-box">
                <svg viewBox="0 0 560 190" class="equify-map-svg" aria-label="Peta sebaran kota transaksi Indonesia">
                    <path
                        d="M36 42 L74 36 L118 76 L142 114 L120 128 L86 102 L48 64 Z"
                        fill="{{ in_array('sumatra', $activeRegions, true) ? '#0EA5E9' : '#CBD5E1' }}"
                        fill-opacity="{{ in_array('sumatra', $activeRegions, true) ? '0.88' : '0.45' }}"
                    />
                    <path
                        d="M148 134 L224 134 L268 142 L262 154 L198 152 L144 146 Z"
                        fill="{{ in_array('java', $activeRegions, true) ? '#00C0E8' : '#CBD5E1' }}"
                        fill-opacity="{{ in_array('java', $activeRegions, true) ? '0.92' : '0.45' }}"
                    />
                    <path
                        d="M270 144 L318 148 L358 156 L354 166 L300 162 L266 154 Z"
                        fill="{{ in_array('east_java_bali', $activeRegions, true) ? '#10B981' : '#CBD5E1' }}"
                        fill-opacity="{{ in_array('east_java_bali', $activeRegions, true) ? '0.88' : '0.45' }}"
                    />
                    <path
                        d="M206 38 L272 34 L288 74 L268 104 L214 102 L196 72 Z"
                        fill="{{ in_array('kalimantan_sulawesi', $activeRegions, true) ? '#8B5CF6' : '#CBD5E1' }}"
                        fill-opacity="{{ in_array('kalimantan_sulawesi', $activeRegions, true) ? '0.88' : '0.45' }}"
                    />
                    <path
                        d="M312 48 L368 42 L386 64 L354 88 L362 114 L322 112 L308 82 Z"
                        fill="{{ in_array('kalimantan_sulawesi', $activeRegions, true) ? '#8B5CF6' : '#CBD5E1' }}"
                        fill-opacity="{{ in_array('kalimantan_sulawesi', $activeRegions, true) ? '0.78' : '0.45' }}"
                    />
                    <path
                        d="M428 72 L520 82 L534 114 L496 124 L434 102 Z"
                        fill="#CBD5E1"
                        fill-opacity="0.4"
                    />
                </svg>
            </div>

            @if (count($items) > 0)
                <div class="equify-city-bar">
                    @foreach ($items as $item)
                        <div
                            style="width: {{ max((float) $item['percentage'], 4) }}%; background-color: {{ $item['color'] }};"
                            title="{{ $item['city'] }} ({{ $item['percentage'] }}%)"
                        ></div>
                    @endforeach
                </div>

                <div class="equify-city-grid">
                    @foreach ($items as $item)
                        <div class="equify-city-chip">
                            <div class="equify-city-chip-left">
                                <span class="equify-city-dot" style="background-color: {{ $item['color'] }};"></span>
                                <span class="equify-city-name">{{ $item['city'] }}</span>
                            </div>
                            <span class="equify-city-count">
                                {{ $item['count'] }} ({{ $item['percentage'] }}%)
                            </span>
                        </div>
                    @endforeach
                </div>
            @else
                <div style="border-radius: 0.75rem; border: 1px dashed rgba(15, 23, 42, 0.15); padding: 1.5rem 1rem; text-align: center; font-size: 0.875rem; color: #6b7280;">
                    Belum ada data kota pengiriman atau lokasi toko yang tercatat.
                </div>
            @endif
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
