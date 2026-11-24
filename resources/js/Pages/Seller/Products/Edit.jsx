import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { Fish, ArrowLeft, Save } from '@/Components/Icons';
import { useLanguage } from '@/lib/i18n';

export default function Edit({ product, categories }) {
    const { pick, trCategory } = useLanguage();
    const fish = product.fish_detail;

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        category_id: product.category_id || '',
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock ?? 0,
        image_file: null,
        image_url: product.image || '',
        is_active: product.is_active ?? true,

        // Atribut Ikan
        is_fish: !!fish,
        species_name: fish?.species_name || '',
        morph_trait: fish?.morph_trait || '',
        sex: fish?.sex || 'unsexed',
        size_stage: fish?.size_stage || '',
        water_type: fish?.water_type || 'freshwater',
        min_tank_liters: fish?.min_tank_liters || '',
        temp_min: fish?.temp_min || '',
        temp_max: fish?.temp_max || '',
        ph_min: fish?.ph_min || '',
        ph_max: fish?.ph_max || '',
        care_level: fish?.care_level || 'pemula',
        temperament: fish?.temperament || 'damai',
        diet_type: fish?.diet_type || '',
        breeding_origin: fish?.breeding_origin || 'captive_bred',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/seller/products/${product.id}`);
    };

    return (
        <SellerLayout>
            <Head title={`Edit ${product.name} - ${pick('Portal Penjual', 'Seller Portal')}`} />

            <div className="space-y-6">
                <Link href="/seller/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-dunia-blue transition">
                    <ArrowLeft className="w-4 h-4" />
                    {pick('Kembali ke Daftar Produk', 'Back to Products')}
                </Link>

                <div className="bg-white dark:bg-[#0e1424] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                    <div>
                        <h1 className="text-xl font-extrabold text-dunia-navy dark:text-white">
                            {pick('Edit Produk:', 'Edit Product:')} {product.name}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {pick(
                                'Perbarui harga, stok, foto, dan karakteristik morfologi spesimen ikan Anda.',
                                'Update price, stock, photo, and fish morphology traits.'
                            )}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                        <div className="space-y-4">
                            <h2 className="font-bold text-slate-900 dark:text-white uppercase text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
                                {pick('1. Informasi Utama Produk', '1. Main Product Info')}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                        {pick('Kategori', 'Category')}
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                        required
                                    >
                                        {categories?.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{trCategory(cat.name)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                        {pick('Nama Produk / Morf', 'Product Name / Morph')}
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                        required
                                    />
                                    {errors.name && <p className="text-rose-600 mt-1">{errors.name}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                        {pick('Harga (Rp)', 'Price (IDR)')}
                                    </label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                        {pick('Stok (Ekor/Item)', 'Stock (Qty)')}
                                    </label>
                                    <input
                                        type="number"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                    {pick('Ganti Foto Produk', 'Replace Product Photo')}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setData('image_file', e.target.files[0])}
                                            className="w-full text-slate-500 dark:text-slate-400 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="url"
                                            placeholder={pick('URL Gambar...', 'Image URL...')}
                                            value={data.image_url}
                                            onChange={(e) => setData('image_url', e.target.value)}
                                            className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                    {pick('Deskripsi Lengkap', 'Full Description')}
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                    required
                                />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded-sm text-dunia-blue"
                                />
                                <span className="font-bold text-slate-700 dark:text-slate-200">
                                    {pick('Tampilkan produk ini di katalog (Status Aktif)', 'Show product in catalog (Active)')}
                                </span>
                            </label>
                        </div>

                        {/* Section 2: Spesifikasi Biologi Ikan */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="font-bold text-dunia-navy dark:text-white uppercase text-xs flex items-center gap-1.5">
                                    <Fish className="w-4 h-4 text-dunia-marine" />
                                    {pick('2. Karakteristik Biologi & Morfologi Ikan', '2. Fish Biology & Morphology')}
                                </h2>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_fish}
                                        onChange={(e) => setData('is_fish', e.target.checked)}
                                        className="rounded-sm text-dunia-blue"
                                    />
                                    <span className="font-bold text-slate-700 dark:text-slate-200">
                                        {pick('Aktifkan data morfologi', 'Enable morphology data')}
                                    </span>
                                </label>
                            </div>

                            {data.is_fish && (
                                <div className="bg-sky-50/50 dark:bg-[#111c33] p-5 rounded-2xl border border-sky-100 dark:border-slate-700/80 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                {pick('Nama Ilmiah / Spesies', 'Scientific Name / Species')}
                                            </label>
                                            <input
                                                type="text"
                                                value={data.species_name}
                                                onChange={(e) => setData('species_name', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white italic"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                {pick('Mutasi Morfologi / Varian', 'Morph Trait / Variant')}
                                            </label>
                                            <input
                                                type="text"
                                                value={data.morph_trait}
                                                onChange={(e) => setData('morph_trait', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                {pick('Jenis Kelamin', 'Sex')}
                                            </label>
                                            <select
                                                value={data.sex}
                                                onChange={(e) => setData('sex', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                            >
                                                <option value="male">{pick('♂ Jantan (Male)', '♂ Male')}</option>
                                                <option value="female">{pick('♀ Betina (Female)', '♀ Female')}</option>
                                                <option value="pair">{pick('Sepasang (Pair)', 'Pair')}</option>
                                                <option value="unsexed">Unsexed</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                {pick('Ukuran / Fase', 'Size / Stage')}
                                            </label>
                                            <input
                                                type="text"
                                                value={data.size_stage}
                                                onChange={(e) => setData('size_stage', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                {pick('Tipe Habitat Air', 'Water Type')}
                                            </label>
                                            <select
                                                value={data.water_type}
                                                onChange={(e) => setData('water_type', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                            >
                                                <option value="freshwater">{pick('Air Tawar', 'Freshwater')}</option>
                                                <option value="saltwater">{pick('Air Laut', 'Saltwater')}</option>
                                                <option value="brackish">{pick('Air Payau', 'Brackish')}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                {pick('Min. Tank (Liter)', 'Min. Tank (Liters)')}
                                            </label>
                                            <input
                                                type="number"
                                                value={data.min_tank_liters}
                                                onChange={(e) => setData('min_tank_liters', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                {pick('Suhu Min (°C)', 'Min Temp (°C)')}
                                            </label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                value={data.temp_min}
                                                onChange={(e) => setData('temp_min', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                {pick('Suhu Max (°C)', 'Max Temp (°C)')}
                                            </label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                value={data.temp_max}
                                                onChange={(e) => setData('temp_max', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                {pick('pH Min-Max', 'pH Min-Max')}
                                            </label>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.ph_min}
                                                    onChange={(e) => setData('ph_min', e.target.value)}
                                                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                                />
                                                <span>-</span>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.ph_max}
                                                    onChange={(e) => setData('ph_max', e.target.value)}
                                                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                {pick('Tingkat Perawatan', 'Care Level')}
                                            </label>
                                            <select
                                                value={data.care_level}
                                                onChange={(e) => setData('care_level', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                            >
                                                <option value="pemula">{pick('Pemula', 'Beginner')}</option>
                                                <option value="menengah">{pick('Menengah', 'Intermediate')}</option>
                                                <option value="mahir">{pick('Mahir', 'Advanced')}</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                {pick('Temperamen', 'Temperament')}
                                            </label>
                                            <select
                                                value={data.temperament}
                                                onChange={(e) => setData('temperament', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                            >
                                                <option value="damai">{pick('Damai', 'Peaceful')}</option>
                                                <option value="semi-agresif">{pick('Semi-Agresif', 'Semi-Aggressive')}</option>
                                                <option value="agresif">{pick('Agresif', 'Aggressive')}</option>
                                                <option value="predator">Predator</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                {pick('Pakan', 'Diet')}
                                            </label>
                                            <input
                                                type="text"
                                                value={data.diet_type}
                                                onChange={(e) => setData('diet_type', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                {pick('Asal Pembiakan', 'Breeding Origin')}
                                            </label>
                                            <select
                                                value={data.breeding_origin}
                                                onChange={(e) => setData('breeding_origin', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] text-slate-900 dark:text-white"
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

                        <div className="pt-4 flex justify-end gap-3">
                            <Link
                                href="/seller/products"
                                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold"
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
                                    : pick('Simpan Perubahan Produk', 'Save Product Changes')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SellerLayout>
    );
}
