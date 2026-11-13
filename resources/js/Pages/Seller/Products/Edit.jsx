import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { Fish, ArrowLeft, HeartPulse, Save } from 'lucide-react';

export default function Edit({ product, categories }) {
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
            <Head title={`Edit ${product.name} - Portal Penjual`} />

            <div className="space-y-6">
                <Link href="/seller/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-dunia-blue transition">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar Produk
                </Link>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                    <div>
                        <h1 className="text-xl font-extrabold text-dunia-navy">
                            Edit Produk: {product.name}
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Perbarui harga, stok, foto, dan karakteristik morfologi spesimen ikan Anda.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                        <div className="space-y-4">
                            <h2 className="font-bold text-slate-900 uppercase text-xs pb-2 border-b border-slate-100">
                                1. Informasi Utama Produk
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">Kategori</label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                        required
                                    >
                                        {categories?.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">Nama Produk / Morf</label>
                                    <input
                                        type="text"
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
                                    <label className="block font-bold text-slate-700 uppercase mb-1">Harga (Rp)</label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 uppercase mb-1">Stok (Ekor/Item)</label>
                                    <input
                                        type="number"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">Ganti Foto Produk</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setData('image_file', e.target.files[0])}
                                            className="w-full text-slate-500 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="url"
                                            placeholder="URL Gambar..."
                                            value={data.image_url}
                                            onChange={(e) => setData('image_url', e.target.value)}
                                            className="w-full p-2 rounded-xl border border-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 uppercase mb-1">Deskripsi Lengkap</label>
                                <textarea
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-200"
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
                                <span className="font-bold text-slate-700">Tampilkan produk ini di katalog (Status Aktif)</span>
                            </label>
                        </div>

                        {/* Section 2: Spesifikasi Biologi Ikan */}
                        <div className="pt-4 border-t border-slate-100 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h2 className="font-bold text-dunia-navy uppercase text-xs flex items-center gap-1.5">
                                    <HeartPulse className="w-4 h-4 text-dunia-marine" />
                                    2. Karakteristik Biologi & Morfologi Ikan
                                </h2>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_fish}
                                        onChange={(e) => setData('is_fish', e.target.checked)}
                                        className="rounded-sm text-dunia-blue"
                                    />
                                    <span className="font-bold text-slate-700">Aktifkan data morfologi</span>
                                </label>
                            </div>

                            {data.is_fish && (
                                <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Nama Ilmiah / Spesies</label>
                                            <input
                                                type="text"
                                                value={data.species_name}
                                                onChange={(e) => setData('species_name', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white italic"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Mutasi Morfologi / Varian</label>
                                            <input
                                                type="text"
                                                value={data.morph_trait}
                                                onChange={(e) => setData('morph_trait', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                                            <select
                                                value={data.sex}
                                                onChange={(e) => setData('sex', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            >
                                                <option value="male">♂ Jantan (Male)</option>
                                                <option value="female">♀ Betina (Female)</option>
                                                <option value="pair">Sepasang (Pair)</option>
                                                <option value="unsexed">Unsexed</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Ukuran / Fase</label>
                                            <input
                                                type="text"
                                                value={data.size_stage}
                                                onChange={(e) => setData('size_stage', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Tipe Habitat Air</label>
                                            <select
                                                value={data.water_type}
                                                onChange={(e) => setData('water_type', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            >
                                                <option value="freshwater">Air Tawar</option>
                                                <option value="saltwater">Air Laut</option>
                                                <option value="brackish">Air Payau</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Min. Tank (Liter)</label>
                                            <input
                                                type="number"
                                                value={data.min_tank_liters}
                                                onChange={(e) => setData('min_tank_liters', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Suhu Min (°C)</label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                value={data.temp_min}
                                                onChange={(e) => setData('temp_min', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Suhu Max (°C)</label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                value={data.temp_max}
                                                onChange={(e) => setData('temp_max', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">pH Min-Max</label>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.ph_min}
                                                    onChange={(e) => setData('ph_min', e.target.value)}
                                                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                                />
                                                <span>-</span>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.ph_max}
                                                    onChange={(e) => setData('ph_max', e.target.value)}
                                                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Tingkat Perawatan</label>
                                            <select
                                                value={data.care_level}
                                                onChange={(e) => setData('care_level', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            >
                                                <option value="pemula">Pemula</option>
                                                <option value="menengah">Menengah</option>
                                                <option value="mahir">Mahir</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Temperamen</label>
                                            <select
                                                value={data.temperament}
                                                onChange={(e) => setData('temperament', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            >
                                                <option value="damai">Damai</option>
                                                <option value="semi-agresif">Semi-Agresif</option>
                                                <option value="agresif">Agresif</option>
                                                <option value="predator">Predator</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Pakan</label>
                                            <input
                                                type="text"
                                                value={data.diet_type}
                                                onChange={(e) => setData('diet_type', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1">Asal Pembiakan</label>
                                            <select
                                                value={data.breeding_origin}
                                                onChange={(e) => setData('breeding_origin', e.target.value)}
                                                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                                            >
                                                <option value="captive_bred">Captive Bred (Budidaya)</option>
                                                <option value="farm_raised">Farm Raised (Kolam)</option>
                                                <option value="wild_caught">Tangkapan Liar</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Link
                                href="/seller/products"
                                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 rounded-xl bg-dunia-blue text-white font-bold hover:bg-sky-600 transition flex items-center gap-2 shadow-xs cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan Produk'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SellerLayout>
    );
}
