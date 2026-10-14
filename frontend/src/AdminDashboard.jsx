import React, { useState, useEffect } from 'react';
import {
    Users, Plus, Trash2, Edit, Search, LogOut, LayoutDashboard, ChevronRight, Lock,
    FileText, BarChart3, Database, UserPlus, Printer, Building2, Filter, Shield
} from 'lucide-react';

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');

    // Role & Scope RT Login
    const [loginRole, setLoginRole] = useState('SUPER_ADMIN'); // 'SUPER_ADMIN' atau 'RT_USER'
    const [selectedUserRt, setSelectedUserRt] = useState('001'); // RT yang sedang diakses

    const [activeTab, setActiveTab] = useState('input_data'); // input_data, database, rekapitulasi, cetak_surat

    // List RT 001 - 009 Desa Singakarta
    const daftarRT = ['001', '002', '003', '004', '005', '006', '007', '008', '009'];

    // State Data Warga & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRtFilter, setSelectedRtFilter] = useState('ALL');
    const [isEditing, setIsEditing] = useState(null); // Menyimpan NIK yang sedang diedit

    // 1. Objek template awal untuk form (disesuaikan dengan field Django backend)
    const initialForm = {
        nik: '', nama: '', jenis_kelamin: 'Laki-laki', tempat_lahir: 'Sangatta',
        tanggal_lahir: '', status_kawin: 'Belum Kawin', agama: 'Islam', gol_darah: 'O',
        kewarganegaraan: 'WNI', no_kk: '', nama_ayah: '', nama_ibu: '',
        hubungan_keluarga: 'Kepala Keluarga', nama_dusun: 'Singakarta', rw: '00',
        rt: loginRole === 'RT_USER' ? selectedUserRt : '001',
        jalan: '', nomor_telepon: '', email: '', no_akta_kelahiran: '',
        pendidikan_terakhir: 'SMA/Sederajat', pekerjaan: '', etnis_suku: 'Kutai', jenis_bantuan: 'Tidak Ada'
    };

    // 2. State untuk form data
    const [formData, setFormData] = useState(initialForm);

    const [wargaList, setWargaList] = useState([]);
    const [loading, setLoading] = useState(true);

    // 3. Ambil data dari Django API saat halaman admin dimuat
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/warga/')
            .then((res) => res.json())
            .then((data) => {
                setWargaList(data);
                setLoading(false);
            })
            .catch((error) => console.error('Gagal mengambil data warga:', error));
    }, []);

    // Form State untuk Cetak Surat
    const [selectedWargaSurat, setSelectedWargaSurat] = useState(null);
    const [keperluanSurat, setKeperluanSurat] = useState('Pengurusan KTP / KK Baru');

    // Handler Login Admin
    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === 'admin123' || passwordInput === 'admin' || passwordInput === 'rt123') {
            setIsAuthenticated(true);
            if (loginRole === 'RT_USER') {
                setFormData(prev => ({ ...prev, rt: selectedUserRt }));
                setSelectedRtFilter(selectedUserRt);
            }
        } else {
            alert('Password Admin Salah!');
        }
    };

    // Handler Simpan / Edit Data Warga (Terhubung ke Backend Django)
    const handleSaveWarga = async (e) => {
        e.preventDefault();

        // Tentukan RT mana yang disimpan (Jika Pengurus RT -> RT-nya terkunci ke RT diri sendiri)
        const rtToSave = loginRole === 'RT_USER' ? selectedUserRt : formData.rt;
        const finalData = { ...formData, rt: rtToSave };

        try {
            if (isEditing) {
                // PUT ke Django API
                const response = await fetch(`http://127.0.0.1:8000/api/warga/${isEditing}/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalData),
                });

                if (response.ok) {
                    const updated = await response.json();
                    setWargaList(wargaList.map(item => item.nik === isEditing ? updated : item));
                    setIsEditing(null);
                    alert(`Data warga RT ${rtToSave} berhasil diperbarui!`);
                    setFormData(initialForm);
                    setActiveTab('database');
                } else {
                    const errData = await response.json();
                    console.error("Error dari Django Backend:", errData);
                    alert(`Gagal memperbarui data: ${JSON.stringify(errData)}`);
                }
            } else {
                // CREATE (POST) ke Django API
                const response = await fetch('http://127.0.0.1:8000/api/warga/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalData),
                });

                if (response.ok) {
                    const created = await response.json();
                    setWargaList([...wargaList, created]);
                    alert(`Data warga berhasil ditambahkan ke RT ${rtToSave}!`);
                    setFormData(initialForm);
                    setActiveTab('database');
                } else {
                    const errData = await response.json();
                    console.error("Error dari Django Backend:", errData);
                    alert(`Gagal menambah data. Pastikan NIK unik.`);
                }
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Terjadi kesalahan koneksi ke server.');
        }
    }

    const handleEdit = (warga) => {
        setIsEditing(warga.nik);
        setFormData({
            ...initialForm,
            ...warga || '001'
        });
        setActiveTab('input_data');
    };

    const handleDelete = async (nik) => {
        if (confirm('Apakah Anda yakin ingin menghapus data warga ini?')) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/warga/${nik}/`, {
                    method: 'DELETE',
                });
                if (response.ok || response.status === 204) {
                    setWargaList(wargaList.filter(item => item.nik !== nik));
                    alert('Data warga berhasil dihapus.');
                } else {
                    alert('Gagal menghapus data dari server.');
                }
            } catch (error) {
                console.error('Error deleting data:', error);
                alert('Terjadi kesalahan koneksi saat menghapus.');
            }
        }
    };

    // Kalkulasi Rekapitulasi Statistik
    const totalWarga = wargaList.length;
    const totalLaki = wargaList.filter(w => w.jenis_kelamin === 'Laki-laki').length;
    const totalPerempuan = wargaList.filter(w => w.jenis_kelamin === 'Perempuan').length;
    const totalPenerimaBantuan = wargaList.filter(w => w.jenis_bantuan && w.jenis_bantuan !== 'Tidak Ada').length;

    // Filtered Warga List (Sesuai Hak Akses & Filter)
    const filteredWarga = wargaList.filter(w => {
        const matchSearch = (w.nama && w.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (w.nik && w.nik.includes(searchTerm)) ||
            (w.pekerjaan && w.pekerjaan.toLowerCase().includes(searchTerm.toLowerCase()));

        const targetRtFilter = loginRole === 'RT_USER' ? selectedUserRt : selectedRtFilter;
        const matchRT = targetRtFilter === 'ALL' || w.rt === targetRtFilter;

        return matchSearch && matchRT;
    });

    // 1. HALAMAN LOGIN RAHASIA (/admin)
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-800">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-800">
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
                            <Lock className="w-7 h-7" />
                        </div>
                        <h2 className="font-black text-slate-900 text-xl tracking-tight">Buku Adminduk Desa Singakarta</h2>
                        <p className="text-xs text-slate-500">Portal Pengelolaan Data RT 001 - 009</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 space-y-2">
                            <label className="text-[11px] font-bold text-slate-600 block px-1">Tipe Hak Akses</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setLoginRole('SUPER_ADMIN')}
                                    className={`py-2 rounded-xl text-xs font-bold transition ${loginRole === 'SUPER_ADMIN' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-slate-600 border'}`}
                                >
                                    Sekdes (All RT)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLoginRole('RT_USER')}
                                    className={`py-2 rounded-xl text-xs font-bold transition ${loginRole === 'RT_USER' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-slate-600 border'}`}
                                >
                                    Pengurus RT
                                </button>
                            </div>

                            {loginRole === 'RT_USER' && (
                                <div className="pt-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Pilih Wilayah RT Anda:</label>
                                    <select
                                        value={selectedUserRt}
                                        onChange={(e) => setSelectedUserRt(e.target.value)}
                                        className="w-full border border-emerald-400 bg-white rounded-xl p-2 text-xs font-bold text-emerald-900 mt-1"
                                    >
                                        {daftarRT.map(rt => (
                                            <option key={rt} value={rt}>RT {rt}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-slate-500 uppercase">Kata Sandi / Password Admin</label>
                            <input
                                type="password"
                                required
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-600 outline-none mt-1"
                                placeholder="Masukkan kata sandi..."
                            />
                        </div>

                        <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl font-bold text-xs shadow-md transition">
                            Masuk Dashboard {loginRole === 'SUPER_ADMIN' ? 'Sekdes' : `RT ${selectedUserRt}`}
                        </button>
                    </form>

                    <div className="text-center">
                        <a href="/" className="text-xs font-semibold text-slate-400 hover:text-slate-600">&larr; Kembali ke Website Publik</a>
                    </div>
                </div>
            </div>
        );
    }

    // 2. DASHBOARD UTAMA ADMIN
    return (
        <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">

            {/* SIDEBAR NAVIGASI */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0">
                <div>
                    <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-white text-base tracking-tight leading-none">Buku Adminduk</h1>
                            <p className="text-[10px] text-emerald-400 font-bold tracking-wide mt-1 uppercase">
                                {loginRole === 'SUPER_ADMIN' ? 'Semua RT (001-009)' : `Akses Khusus RT ${selectedUserRt}`}
                            </p>
                        </div>
                    </div>

                    <nav className="p-3 space-y-1.5 text-xs font-semibold">
                        <p className="px-3 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Fitur Admin</p>

                        <button
                            onClick={() => setActiveTab('input_data')}
                            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${activeTab === 'input_data' ? 'bg-emerald-600 text-white shadow-lg font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
                        >
                            <div className="flex items-center gap-3">
                                <UserPlus className="w-4 h-4" />
                                <span>Input Data Penduduk</span>
                            </div>
                            {activeTab === 'input_data' && <ChevronRight className="w-3.5 h-3.5" />}
                        </button>

                        <button
                            onClick={() => setActiveTab('database')}
                            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${activeTab === 'database' ? 'bg-emerald-600 text-white shadow-lg font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Database className="w-4 h-4" />
                                <span>Database Warga</span>
                            </div>
                            {activeTab === 'database' && <ChevronRight className="w-3.5 h-3.5" />}
                        </button>

                        <button
                            onClick={() => setActiveTab('rekapitulasi')}
                            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${activeTab === 'rekapitulasi' ? 'bg-emerald-600 text-white shadow-lg font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
                        >
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-4 h-4" />
                                <span>Rekapitulasi</span>
                            </div>
                            {activeTab === 'rekapitulasi' && <ChevronRight className="w-3.5 h-3.5" />}
                        </button>

                        <button
                            onClick={() => setActiveTab('cetak_surat')}
                            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${activeTab === 'cetak_surat' ? 'bg-emerald-600 text-white shadow-lg font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Printer className="w-4 h-4" />
                                <span>Cetak Pengantar RT</span>
                            </div>
                            {activeTab === 'cetak_surat' && <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                    </nav>
                </div>

                <div className="p-3 border-t border-slate-800">
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar Sistem</span>
                    </button>
                </div>
            </aside>

            {/* AREA KONTEN UTAMA */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <span>Desa Singakarta</span> &gt;
                        <span className="text-emerald-700 uppercase font-black">
                            {activeTab === 'input_data' && ' Input Data Penduduk Baru'}
                            {activeTab === 'database' && ` Database Kependudukan (${loginRole === 'SUPER_ADMIN' ? 'All RT' : `RT ${selectedUserRt}`})`}
                            {activeTab === 'rekapitulasi' && ' Rekapitulasi & Statistik Warga'}
                            {activeTab === 'cetak_surat' && ' Cetak Surat Pengantar RT'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 font-bold text-emerald-800 flex items-center justify-center text-xs">
                            {loginRole === 'SUPER_ADMIN' ? 'KM' : 'RT'}
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold text-slate-800">
                                {loginRole === 'SUPER_ADMIN' ? 'Sekretaris Desa / Kak Mul' : `Pengurus RT ${selectedUserRt}`}
                            </p>
                            <p className="text-[10px] text-slate-400">
                                {loginRole === 'SUPER_ADMIN' ? 'Super Admin Desa' : `Admin Wilayah RT ${selectedUserRt}`}
                            </p>
                        </div>
                    </div>
                </header>

                <main className="p-8 space-y-6">

                    {/* ================= 1. FORM INPUT DATA PENDUDUK ================= */}
                    {activeTab === 'input_data' && (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                            <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {isEditing ? 'Edit Data Penduduk' : `Form Input Data Penduduk (${loginRole === 'SUPER_ADMIN' ? 'Semua RT' : `RT ${selectedUserRt}`})`}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {loginRole === 'RT_USER' ? `Khusus menginput data warga di wilayah RT ${selectedUserRt}.` : 'Pilih RT dan isi data kependudukan secara lengkap.'}
                                    </p>
                                </div>
                                {isEditing && (
                                    <button onClick={() => { setIsEditing(null); setFormData(initialForm); }} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold">
                                        Batal Edit
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSaveWarga} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-8">

                                    {/* KOLOM KIRI */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider border-b border-emerald-100 pb-1">Identitas Diri (Sesuai KTP)</h4>

                                        <div>
                                            <label className="text-[11px] font-bold text-slate-600">NIK (16 Digit)</label>
                                            <input type="text" required disabled={isEditing !== null} value={formData.nik} onChange={(e) => setFormData({ ...formData, nik: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1 outline-none focus:ring-2 focus:ring-emerald-600 disabled:bg-slate-100" placeholder="6408..." />
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-bold text-slate-600">Nama Lengkap</label>
                                            <input type="text" required value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1 outline-none focus:ring-2 focus:ring-emerald-600" placeholder="Nama Warga" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Jenis Kelamin</label>
                                                <select value={formData.jenis_kelamin} onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1">
                                                    <option>Laki-laki</option>
                                                    <option>Perempuan</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Golongan Darah</label>
                                                <select value={formData.gol_darah} onChange={(e) => setFormData({ ...formData, gol_darah: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1">
                                                    <option>A</option>
                                                    <option>B</option>
                                                    <option>AB</option>
                                                    <option>O</option>
                                                    <option>Tidak Tahu</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Tempat Lahir</label>
                                                <input type="text" value={formData.tempat_lahir} onChange={(e) => setFormData({ ...formData, tempat_lahir: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1" placeholder="Sangatta" />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Tanggal Lahir</label>
                                                <input type="date" value={formData.tanggal_lahir} onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Status Kawin</label>
                                                <select value={formData.status_kawin} onChange={(e) => setFormData({ ...formData, status_kawin: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1">
                                                    <option>Belum Kawin</option>
                                                    <option>Kawin</option>
                                                    <option>Cerai Hidup</option>
                                                    <option>Cerai Mati</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Agama</label>
                                                <select value={formData.agama} onChange={(e) => setFormData({ ...formData, agama: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1">
                                                    <option>Islam</option>
                                                    <option>Kristen</option>
                                                    <option>Katolik</option>
                                                    <option>Hindu</option>
                                                    <option>Buddha</option>
                                                    <option>Konghucu</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Kewarganegaraan</label>
                                                <input type="text" value={formData.kewarganegaraan} onChange={(e) => setFormData({ ...formData, kewarganegaraan: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">No. Kartu Keluarga (KK)</label>
                                                <input type="text" value={formData.no_kk} onChange={(e) => setFormData({ ...formData, no_kk: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1" placeholder="6408..." />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Nama Ayah</label>
                                                <input type="text" value={formData.nama_ayah} onChange={(e) => setFormData({ ...formData, nama_ayah: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Nama Ibu</label>
                                                <input type="text" value={formData.nama_ibu} onChange={(e) => setFormData({ ...formData, nama_ibu: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* KOLOM KANAN */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider border-b border-emerald-100 pb-1">Wilayah RT & Detail Tambahan</h4>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Hubungan Keluarga</label>
                                                <select value={formData.hubungan_keluarga} onChange={(e) => setFormData({ ...formData, hubungan_keluarga: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1">
                                                    <option>Kepala Keluarga</option>
                                                    <option>Suami</option>
                                                    <option>Istri</option>
                                                    <option>Anak</option>
                                                    <option>Orang Tua</option>
                                                    <option>Mertua</option>
                                                    <option>Famili Lain</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Nama Dusun / Desa</label>
                                                <input type="text" value={formData.nama_dusun} onChange={(e) => setFormData({ ...formData, nama_dusun: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1" />
                                            </div>
                                        </div>

                                        {/* DROPDOWN RT (TERKUNCI JIKA PENGURUS RT) */}
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <label className="text-[11px] font-extrabold text-emerald-800">
                                                    RT {loginRole === 'RT_USER' ? '(Terkunci)' : '(001 - 009)'}
                                                </label>
                                                <select
                                                    disabled={loginRole === 'RT_USER'}
                                                    value={loginRole === 'RT_USER' ? selectedUserRt : formData.rt}
                                                    onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                                                    className={`w-full border-2 rounded-xl p-2.5 text-xs mt-1 font-black ${loginRole === 'RT_USER'
                                                        ? 'bg-slate-100 border-slate-300 text-slate-600 cursor-not-allowed'
                                                        : 'border-emerald-500 bg-emerald-50 text-emerald-900 focus:ring-2 focus:ring-emerald-600'}`}
                                                >
                                                    {daftarRT.map((rtVal) => (
                                                        <option key={rtVal} value={rtVal}>RT {rtVal}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">RW</label>
                                                <input type="text" value={formData.rw} onChange={(e) => setFormData({ ...formData, rw: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Etnis / Suku</label>
                                                <input type="text" value={formData.etnis_suku} onChange={(e) => setFormData({ ...formData, etnis_suku: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1" placeholder="Kutai / Dayak / Bugis" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-bold text-slate-600">Jalan / Alamat Rumah</label>
                                            <input type="text" value={formData.jalan} onChange={(e) => setFormData({ ...formData, jalan: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1" placeholder="Jl. Yos Sudarso Sangatta..." />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Nomor Telepon / WA</label>
                                                <input type="text" value={formData.nomor_telepon} onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1" placeholder="0812..." />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Email</label>
                                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1" placeholder="warga@gmail.com" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">No. Akta Kelahiran</label>
                                                <input type="text" value={formData.no_akta_kelahiran} onChange={(e) => setFormData({ ...formData, no_akta_kelahiran: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Pendidikan Terakhir</label>
                                                <select value={formData.pendidikan_terakhir} onChange={(e) => setFormData({ ...formData, pendidikan_terakhir: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1">
                                                    <option>Tidak/Belum Sekolah</option>
                                                    <option>SD</option>
                                                    <option>SMP</option>
                                                    <option>SMA/Sederajat</option>
                                                    <option>D3</option>
                                                    <option>S1/D4</option>
                                                    <option>S2/S3</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Pekerjaan</label>
                                                <input type="text" value={formData.pekerjaan} onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1" placeholder="PNS / Swasta / Buruh" />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-600">Jenis Bantuan yg Diterima</label>
                                                <select value={formData.jenis_bantuan} onChange={(e) => setFormData({ ...formData, jenis_bantuan: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs mt-1">
                                                    <option>Tidak Ada</option>
                                                    <option>PKH</option>
                                                    <option>BPNT</option>
                                                    <option>BLT Desa</option>
                                                    <option>KIS / PBI</option>
                                                </select>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end">
                                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-2xl text-xs shadow-lg transition">
                                        {isEditing ? 'Simpan Edit Warga' : `Simpan Warga Baru (${loginRole === 'RT_USER' ? `RT ${selectedUserRt}` : `RT ${formData.rt}`})`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ================= 2. DATABASE WARGA ================= */}
                    {activeTab === 'database' && (
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">
                                        Database Kependudukan {loginRole === 'SUPER_ADMIN' ? 'Desa Singakarta' : `Wilayah RT ${selectedUserRt}`}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {loginRole === 'RT_USER' ? `Menampilkan data khusus warga terdaftar di RT ${selectedUserRt}.` : 'Menampilkan data terdaftar dari ke-9 RT di Desa Singakarta.'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 items-center">
                                    {loginRole === 'SUPER_ADMIN' && (
                                        <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
                                            <Filter className="w-3.5 h-3.5 text-slate-500" />
                                            <span className="text-[11px] font-bold text-slate-600">Filter RT:</span>
                                            <select
                                                value={selectedRtFilter}
                                                onChange={(e) => setSelectedRtFilter(e.target.value)}
                                                className="bg-transparent text-xs font-bold text-emerald-800 outline-none"
                                            >
                                                <option value="ALL">Semua RT (001 - 009)</option>
                                                {daftarRT.map((rt) => (
                                                    <option key={rt} value={rt}>RT {rt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <input
                                        type="text"
                                        placeholder="Cari NIK, Nama, Pekerjaan..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border border-slate-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-600 outline-none w-60"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-700 font-bold uppercase">
                                            <th className="p-3 border-b">NIK & Nama</th>
                                            <th className="p-3 border-b">JK</th>
                                            <th className="p-3 border-b">RT / RW</th>
                                            <th className="p-3 border-b">Pekerjaan</th>
                                            <th className="p-3 border-b">No. Telepon</th>
                                            <th className="p-3 border-b">Bantuan</th>
                                            <th className="p-3 border-b">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredWarga.length > 0 ? (
                                            filteredWarga.map((w) => (
                                                <tr key={w.nik} className="hover:bg-slate-50">
                                                    <td className="p-3">
                                                        <p className="font-bold text-slate-900">{w.nama}</p>
                                                        <p className="font-mono text-[10px] text-slate-500">{w.nik}</p>
                                                    </td>
                                                    <td className="p-3">{w.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                                                    <td className="p-3 font-bold text-emerald-800">RT {w.rt || '001'} / RW {w.rw || '00'}</td>
                                                    <td className="p-3">{w.pekerjaan || '-'}</td>
                                                    <td className="p-3 font-mono text-[11px]">{w.nomor_telepon || '-'}</td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-0.5 font-bold rounded-md text-[10px] ${w.jenis_bantuan && w.jenis_bantuan !== 'Tidak Ada' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'}`}>
                                                            {w.jenis_bantuan || 'Tidak Ada'}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 space-x-1">
                                                        <button onClick={() => handleEdit(w)} className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg"><Edit className="w-3.5 h-3.5" /></button>
                                                        <button onClick={() => handleDelete(w.nik)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="p-8 text-center text-slate-400 font-semibold">
                                                    Tidak ditemukan data warga untuk filter pencarian ini.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ================= 3. REKAPITULASI ================= */}
                    {activeTab === 'rekapitulasi' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-lg space-y-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Total Penduduk</span>
                                    <h3 className="text-4xl font-extrabold">{totalWarga} Jiwa</h3>
                                    <p className="text-[10px] text-emerald-200">Terdaftar di Desa Singakarta</p>
                                </div>

                                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Laki-Laki / Wanita</span>
                                    <h3 className="text-4xl font-extrabold">{totalLaki} / {totalPerempuan}</h3>
                                    <p className="text-[10px] text-slate-400">Rasio Jenis Kelamin</p>
                                </div>

                                <div className="bg-amber-500 text-slate-950 p-6 rounded-3xl shadow-lg space-y-1">
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">Penerima Bantuan</span>
                                    <h3 className="text-4xl font-extrabold">{totalPenerimaBantuan} Jiwa</h3>
                                    <p className="text-[10px] font-bold text-slate-900">PKH / BPNT / BLT</p>
                                </div>

                                <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-lg space-y-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">Cakupan Wilayah</span>
                                    <h3 className="text-4xl font-extrabold">9 RT</h3>
                                    <p className="text-[10px] text-indigo-200">Desa Singakarta</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= 4. CETAK PENGANTAR RT ================= */}
                    {activeTab === 'cetak_surat' && (
                        <div className="grid md:grid-cols-12 gap-8">
                            <div className="md:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4 h-fit">
                                <h3 className="font-bold text-slate-900 text-base border-b pb-2">Buat Surat Pengantar RT</h3>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-600">Pilih Warga Pemohon</label>
                                        <select
                                            onChange={(e) => {
                                                const selected = wargaList.find(w => w.nik === e.target.value);
                                                setSelectedWargaSurat(selected);
                                            }}
                                            className="w-full border rounded-xl p-2.5 text-xs mt-1"
                                        >
                                            <option value="">-- Pilih Warga --</option>
                                            {filteredWarga.map(w => (
                                                <option key={w.nik} value={w.nik}>{w.nama} - NIK: {w.nik} (RT {w.rt || '001'})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-slate-600">Keperluan Surat</label>
                                        <input
                                            type="text"
                                            value={keperluanSurat}
                                            onChange={(e) => setKeperluanSurat(e.target.value)}
                                            className="w-full border rounded-xl p-2.5 text-xs mt-1"
                                            placeholder="Contoh: Pengurusan KTP Baru"
                                        />
                                    </div>

                                    <button
                                        onClick={() => window.print()}
                                        disabled={!selectedWargaSurat}
                                        className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl text-xs shadow-md transition"
                                    >
                                        Cetak Surat (Print / PDF)
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                                {selectedWargaSurat ? (
                                    <div className="p-6 border border-slate-300 rounded-2xl font-serif text-slate-900 space-y-4 text-xs">
                                        <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
                                            <h2 className="font-bold text-sm tracking-widest uppercase">PEMERINTAH DESA SINGAKARTA</h2>
                                            <h3 className="font-bold text-xs uppercase">RUKUN TETANGGA (RT) {selectedWargaSurat.rt || '001'} SANGATTA</h3>
                                            <p className="text-[10px] font-sans text-slate-500">Kecamatan Sangatta, Kabupaten Kutai Timur, Kalimantan Timur</p>
                                        </div>

                                        <div className="text-center space-y-0.5 pt-2">
                                            <h4 className="font-bold text-xs underline uppercase">SURAT PENGANTAR RT</h4>
                                            <p className="font-sans text-[10px] text-slate-500">Nomor: {selectedWargaSurat.rt || '001'}/SK-RT/2026/012</p>
                                        </div>

                                        <p className="leading-relaxed">Yang bertanda tangan di bawah ini Ketua RT {selectedWargaSurat.rt || '001'} Desa Singakarta, menerangkan bahwa:</p>

                                        <table className="w-full text-xs space-y-1 font-sans">
                                            <tbody>
                                                <tr><td className="w-32 py-1 font-bold">Nama Lengkap</td><td>: {selectedWargaSurat.nama}</td></tr>
                                                <tr><td className="py-1 font-bold">NIK</td><td>: {selectedWargaSurat.nik}</td></tr>
                                                <tr><td className="py-1 font-bold">Jenis Kelamin</td><td>: {selectedWargaSurat.jenis_kelamin}</td></tr>
                                                <tr><td className="py-1 font-bold">Pekerjaan</td><td>: {selectedWargaSurat.pekerjaan || '-'}</td></tr>
                                                <tr><td className="py-1 font-bold">Alamat / Wilayah</td><td>: RT {selectedWargaSurat.rt || '001'} Desa Singakarta</td></tr>
                                            </tbody>
                                        </table>

                                        <p className="leading-relaxed">
                                            Orang tersebut di atas adalah benar warga kami yang berdomisili di RT {selectedWargaSurat.rt || '001'} Desa Singakarta dan bermaksud untuk: <strong className="underline">{keperluanSurat}</strong>.
                                        </p>

                                        <div className="pt-8 flex justify-between text-center font-sans">
                                            <div>
                                                <p>Pemohon,</p>
                                                <div className="h-14"></div>
                                                <p className="font-bold underline">{selectedWargaSurat.nama}</p>
                                            </div>
                                            <div>
                                                <p>Sangatta, 14 Oktober 2026</p>
                                                <p>Ketua RT {selectedWargaSurat.rt || '001'},</p>
                                                <div className="h-14"></div>
                                                <p className="font-bold underline">( .................................... )</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-16 text-slate-400 space-y-2">
                                        <Printer className="w-12 h-12 mx-auto text-slate-300" />
                                        <p className="text-xs font-semibold">Pilih warga di sebelah kiri untuk melihat pratinjau Surat Pengantar RT.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}