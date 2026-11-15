import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { Fish, ArrowLeft, Upload, Sparkles, HeartPulse, Save } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function Create({ categories }) {
    const { pick, trCategory } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({
        category_id: categories?.[0]?.id || '',
        name: '',
        description: '',
        price: '',
        stock: 5,
        image_file: null,
        image_url: '',
        is_active: true,

        // Atribut Ikan (MorphMarket-inspired)
        is_fish: true,
        species_name: '',
        morph_trait: '',
        sex: 'unsexed',
        size_stage: 'M (3.5 - 4.0 cm)',
        water_type: 'freshwater',
        min_tank_liters: 15,
        temp_min: 25.0,
        temp_max: 29.0,
        ph_min: 6.5,
        ph_max: 7.5,
        care_level: 'pemula',
        temperament: 'damai',
        diet_type: 'Omnivora',
        breeding_origin: 'captive_bred',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/seller/products');
    };

    return (
        <SellerLayout>
            <Head title={pick('Tambah Produk Ikan Baru - Portal Penjual', 'Add New Fish Product — Seller Portal')} />

            <div className="space-y-6">
                <Link href="/seller/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-dunia-blue transition">
                    <ArrowLeft className="w-4 h-4" />
                    {pick('Kembali ke Daftar Produk', 'Back to Products')}
                </Link>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <div>
                        <h1 className="text-xl font-extrabold text-dunia-navy">
                            {pick('Tambah Produk / Ikan Baru', 'Add New Product / Fish')}
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            {pick(
                                'Lengkapi spesifikasi morfologi ikan untuk mempermudah calon pembeli menemukan spesimen yang tepat.',
                                'Complete the fish morphology specs so buyers can easily find the right specimen.'
                            )}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                        {/* Section 1: Informasi Dasar */}
                        <div className="space-y-4">
                            <h2 className="font-bold text-slate-900 uppercase text-xs pb-2 border-b border-slate-100">
                                {pick('1. Informasi Utama Produk', '1. Main Product Info')}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">
                                        {pick('Kategori', 'Category')}
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => {
                                            setData('category_id', e.target.value);
                                            // Auto-toggle is_fish if category is ikan-hias
                                            const selected = categories.find((c) => c.id == e.target.value);
                                            if (selected?.slug === 'ikan-hias') {
                                                setData('is_fish', true);
                                            }
                                        }}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                        required
                                    >
                                        {categories?.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{trCategory(cat.name)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">
                                        {pick('Nama Produk / Varian Ikan', 'Product Name / Fish Variant')}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={pick(
                                            'Contoh: Cupang Halfmoon Rosetail Super Red',
                                            'Example: Halfmoon Rosetail Super Red Betta'
                                        )}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                        required
                                    />
                                    {errors.name && <p className="text-rose-600 mt-1">{errors.name}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">
                                        {pick('Harga (Rp)', 'Price (IDR)')}
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="175000"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                        required
                                    />
                                    {errors.price && <p className="text-rose-600 mt-1">{errors.price}</p>}
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">
                                        {pick('Jumlah Stok Tersedia (Ekor/Item)', 'Available Stock (Qty)')}
                                    </label>
                                    <input
                                        type="number"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                        required
                                    />
                                    {errors.stock && <p className="text-rose-600 mt-1">{errors.stock}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">
                                    {pick('Foto Produk Ikan', 'Product Image')}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-slate-500 block mb-1">
                                            {pick('Unggah Berkas Foto (Maks 3MB)', 'Upload Photo File (Max 3MB)')}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setData('image_file', e.target.files[0])}
                                            className="w-full text-slate-500 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block mb-1">
                                            {pick('Atau Masukkan URL Gambar Langsung', 'Or Enter Direct Image URL')}
                                        </span>
                                        <input
                                            type="url"
                                            placeholder="https://images.unsplash.com/..."
                                            value={data.image_url}
                                            onChange={(e) => setData('image_url', e.target.value)}
                                            className="w-full p-2 rounded-xl border border-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">
                                    {pick('Deskripsi Lengkap', 'Full Description')}
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder={pick(
                                        'Jelaskan kondisi mental, riwayat perawatan pakan, kebersihan packing, dll...',
                                        'Describe temperament, feeding history, quarantine/packing care, etc...'
                                    )}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200"
                                    required
                                />
                                {errors.description && <p className="text-rose-600 mt-1">{errors.description}</p>}
                            </div>
                        </div>

                        {/* Section 2: Spesifikasi Biologi Ikan (MorphMarket Traits) */}
                        <div className="pt-4 border-t border-slate-100 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h2 className="font-bold text-dunia-navy uppercase text-xs flex items-center gap-1.5">
                                    <HeartPulse className="w-4 h-4 text-dunia-marine" />
                                    {pick(
                                        '2. Karakteristik Biologi & Morfologi Ikan (MorphMarket Specs)',
                                        '2. Fish Biology & Morphology Specs'
                                    )}
                                </h2>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_fish}
                                        onChange={(e) => setData('is_fish', e.target.checked)}
                                        className="rounded-sm text-dunia-blue"
                                    />
                                    <span className="font-bold text-slate-700">
                                        {pick('Produk ini adalah Ikan Hias', 'This product is a live fish')}
                                    </span>
                                </label>
                            </div>

                            {data.is_fish && (
                                <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">
                                                {pick('Nama Ilmiah / Spesies', 'Scientific Name / Species')}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Betta splendens"
                                                value={data.species_name}
                                                onChange={(e) => setData('species_name', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white italic"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">
                                                {pick('Mutasi Morfologi / Varian (Morph)', 'Morph Trait / Variant')}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Rosetail Super Red, Maru Yellow, Avatar"
                                                value={data.morph_trait}
                                                onChange={(e) => setData('morph_trait', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">
                                                {pick('Jenis Kelamin', 'Sex')}
                                            </label>
                                            <select
                                                value={data.sex}
                                                onChange={(e) => setData('sex', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            >
                                                <option value="male">{pick('♂ Jantan (Male)', '♂ Male')}</option>
                                                <option value="female">{pick('♀ Betina (Female)', '♀ Female')}</option>
                                                <option value="pair">{pick('Sepasang (Pair)', 'Pair')}</option>
                                                <option value="unsexed">Unsexed</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">
                                                {pick('Ukuran / Fase Hidup', 'Size / Life Stage')}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. M (3.5 - 4 cm) / Juvenile"
                                                value={data.size_stage}
                                                onChange={(e) => setData('size_stage', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">
                                                {pick('Tipe Habitat Air', 'Water Type')}
                                            </label>
                                            <select
                                                value={data.water_type}
                                                onChange={(e) => setData('water_type', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            >
                                                <option value="freshwater">{pick('Air Tawar (Freshwater)', 'Freshwater')}</option>
                                                <option value="saltwater">{pick('Air Laut (Saltwater)', 'Saltwater')}</option>
                                                <option value="brackish">{pick('Air Payau (Brackish)', 'Brackish')}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">
                                                {pick('Min. Tank (Liter)', 'Min. Tank (Liters)')}
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="15"
                                                value={data.min_tank_liters}
                                                onChange={(e) => setData('min_tank_liters', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">
                                                {pick('Suhu Min (°C)', 'Min Temp (°C)')}
                                            </label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                placeholder="24.0"
                                                value={data.temp_min}
                                                onChange={(e) => setData('temp_min', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">
                                                {pick('Suhu Max (°C)', 'Max Temp (°C)')}
                                            </label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                placeholder="29.0"
                                                value={data.temp_max}
                                                onChange={(e) => setData('temp_max', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">
                                                {pick('pH Ideal (Min-Max)', 'Ideal pH (Min-Max)')}
                                            </label>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="6.5"
                                                    value={data.ph_min}
                                                    onChange={(e) => setData('ph_min', e.target.value)}
                                                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                                />
                                                <span>-</span>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="7.5"
                                                    value={data.ph_max}
                                                    onChange={(e) => setData('ph_max', e.target.value)}
                                                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">
                                                {pick('Tingkat Perawatan', 'Care Level')}
                                            </label>
                                            <select
                                                value={data.care_level}
                                                onChange={(e) => setData('care_level', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            >
                                                <option value="pemula">{pick('Pemula / Mudah', 'Beginner / Easy')}</option>
                                                <option value="menengah">{pick('Menengah', 'Intermediate')}</option>
                                                <option value="mahir">{pick('Mahir / Sulit', 'Advanced / Expert')}</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">
                                                {pick('Temperamen', 'Temperament')}
                                            </label>
                                            <select
                                                value={data.temperament}
                                                onChange={(e) => setData('temperament', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            >
                                                <option value="damai">{pick('Damai (Peaceful)', 'Peaceful')}</option>
                                                <option value="semi-agresif">{pick('Semi-Agresif', 'Semi-Aggressive')}</option>
                                                <option value="agresif">{pick('Agresif / Teritorial', 'Aggressive / Territorial')}</option>
                                                <option value="predator">Predator</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">
                                                {pick('Tipe Pakan', 'Diet Type')}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={pick('e.g. Pelet & Cacing', 'e.g. Pellets & Bloodworms')}
                                                value={data.diet_type}
                                                onChange={(e) => setData('diet_type', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">
                                                {pick('Asal Pembiakan', 'Breeding Origin')}
                                            </label>
                                            <select
                                                value={data.breeding_origin}
                                                onChange={(e) => setData('breeding_origin', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            >
                                                <option value="captive_bred">{pick('Captive Bred (Budidaya)', 'Captive Bred')}</option>
                                                <option value="farm_raised">{pick('Farm Raised (Kolam)', 'Farm Raised')}</option>
                                                <option value="wild_caught">{pick('Tangkapan Liar', 'Wild Caught')}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end gap-3">
                            <Link
                                href="/seller/products"
                                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                            >
                                {pick('Batal', 'Cancel')}
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 rounded-xl bg-dunia-blue text-white font-bold hover:bg-sky-600 transition flex items-center gap-2 shadow-xs cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                {processing
                                    ? pick('Menyimpan...', 'Saving...')
                                    : pick('Simpan Produk Ikan', 'Save Product')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SellerLayout>
    );
}
