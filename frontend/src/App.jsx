import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  Users, MapPin, Building2, Search, ArrowRight,
  FileText, HeartPulse
} from 'lucide-react';
import { initialWargaData, faskesData, beritaData, galeriData } from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('beranda');
  const [wargaList] = useState(initialWargaData);

  // Filter Peta Faskes
  const [searchMap, setSearchMap] = useState('');
  const filteredFaskes = faskesData.filter(f =>
    f.nama.toLowerCase().includes(searchMap.toLowerCase()) ||
    f.kategori.toLowerCase().includes(searchMap.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">

      {/* NAVBAR MODERN DARK (MURNI UNTUK WARGA) */}
      <header className="bg-slate-900/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('beranda')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                DESA SINGAKARTA
              </h1>
              <p className="text-[11px] text-emerald-400 font-medium tracking-wide uppercase">RT 054 / RW 00 • KALTIM</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/50">
            {[
              { id: 'beranda', label: 'Beranda' },
              { id: 'profil', label: 'Profil & Visi' },
              { id: 'infografis', label: 'Data Warga' },
              { id: 'maps', label: 'Peta Faskes' },
              { id: 'berita', label: 'Kabar Desa' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* BODY CONTENT */}
      <main className="flex-1">

        {/* ==================== TAB 1: HOMEPAGE ==================== */}
        {activeTab === 'beranda' && (
          <div className="space-y-12 pb-16">

            {/* HERO SECTION DENGAN OVERLAY & IMAGE */}
            <section className="relative bg-slate-900 text-white overflow-hidden min-h-[480px] flex items-center">
              <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10"></div>

              <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 relative z-20 w-full grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Portal Informasi & Kependudukan RT 054
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
                    Selamat Datang di <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                      Desa Singakarta
                    </span>
                  </h1>
                  <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed font-normal">
                    Pusat layanan digital terpadu untuk pendataan warga RT 054, penyebaran berita kegiatan desa, serta pemetaan fasilitas kesehatan terdekat secara akurat.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button onClick={() => setActiveTab('maps')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition hover:-translate-y-0.5">
                      <HeartPulse className="w-4 h-4" /> Cari Rumah Sakit
                    </button>
                    <button onClick={() => setActiveTab('infografis')} className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 px-6 py-3.5 rounded-2xl font-semibold text-sm backdrop-blur-sm transition">
                      Buku Adminduk Warga
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK ACCESS / CARD MENU (HANYA 3 KARTU DENGAN GRID PAS) */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => setActiveTab('infografis')} className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-emerald-300 cursor-pointer group transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-3 group-hover:bg-emerald-600 group-hover:text-white transition">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition">Sensus Penduduk</h3>
                  <p className="text-xs text-slate-500 mt-1">Data kependudukan RT 054 secara transparan</p>
                </div>

                <div onClick={() => setActiveTab('maps')} className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-emerald-300 cursor-pointer group transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-3 group-hover:bg-teal-600 group-hover:text-white transition">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 group-hover:text-teal-600 transition">Peta Faskes</h3>
                  <p className="text-xs text-slate-500 mt-1">Lokasi Rumah Sakit & Klinik terdekat</p>
                </div>

                <div onClick={() => setActiveTab('berita')} className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-emerald-300 cursor-pointer group transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition">Kabar Desa</h3>
                  <p className="text-xs text-slate-500 mt-1">Berita & galeri kegiatan warga</p>
                </div>
              </div>
            </section>

            {/* SAMBUTAN & STATISTIK RINGKAS */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-lg">
                      RT
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Ketua RT. 054 Desa Singakarta</h3>
                      <p className="text-xs text-slate-500">Pengantar Buku Adminduk Digital</p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    "Website ini dihadirkan sebagai sarana kemudahan bagi warga Singakarta khususnya di RT 054. Melalui keterbukaan data kependudukan dan pemetaan fasilitas kesehatan, kita wujudkan lingkungan desa yang tertib, sehat, dan modern."
                  </p>
                </div>

                <div className="md:col-span-5 grid grid-cols-2 gap-4">
                  <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                    <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">Total Penduduk</p>
                    <h4 className="text-4xl font-extrabold mt-2">{wargaList.length} Jiwa</h4>
                    <p className="text-[11px] text-emerald-200 mt-1">Terdata di RT 054</p>
                  </div>

                  <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                    <p className="text-teal-400 text-xs font-semibold uppercase tracking-wider">Peta Faskes</p>
                    <h4 className="text-4xl font-extrabold mt-2">{faskesData.length} Lokasi</h4>
                    <p className="text-[11px] text-slate-400 mt-1">RS & Puskesmas</p>
                  </div>
                </div>
              </div>
            </section>

            {/* PREVIEW KABAR DESA */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 pt-4 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Kabar Desa Singakarta</h2>
                  <p className="text-xs text-slate-500">Informasi kegiatan dan pengumuman terbaru bagi warga</p>
                </div>
                <button onClick={() => setActiveTab('berita')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                  Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {beritaData.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition">
                    <div className="p-6 space-y-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg uppercase tracking-wide">{item.category}</span>
                      <h3 className="font-bold text-slate-800 text-base hover:text-emerald-600 transition cursor-pointer">{item.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.snippet}</p>
                    </div>
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>{item.date}</span>
                      <span>{item.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* ==================== TAB 2: PROFIL DESA ==================== */}
        {activeTab === 'profil' && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b pb-3">Profil Wilayah Desa Singakarta</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Desa Singakarta merupakan salah satu wilayah yang terus berkembang di Sangatta, Kutai Timur. Sistem Informasi Kependudukan RT 054 diciptakan untuk mempermudah koordinasi antar warga, pengurus RT, dan pemerintah desa secara efisien dan transparan.
              </p>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: BUKU ADMINDUK ==================== */}
        {activeTab === 'infografis' && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Buku Adminduk & Kependudukan RT. 054</h2>
                <p className="text-xs text-slate-500">Rekapitulasi data resmi warga Desa Singakarta</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider">
                      <th className="p-3.5 border-b">NIK</th>
                      <th className="p-3.5 border-b">Nama Lengkap</th>
                      <th className="p-3.5 border-b">JK</th>
                      <th className="p-3.5 border-b">RT/RW</th>
                      <th className="p-3.5 border-b">Pekerjaan</th>
                      <th className="p-3.5 border-b">Pendidikan</th>
                      <th className="p-3.5 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {wargaList.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5 font-mono text-xs font-semibold text-slate-500">{w.nik}</td>
                        <td className="p-3.5 font-bold text-slate-800">{w.nama}</td>
                        <td className="p-3.5 text-xs">{w.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                        <td className="p-3.5 text-xs">{w.rt}/{w.rw}</td>
                        <td className="p-3.5 text-xs">{w.pekerjaan}</td>
                        <td className="p-3.5 text-xs">{w.pendidikan}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-[10px] uppercase">
                            {w.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: PETA SANGATTA ==================== */}
        {activeTab === 'maps' && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-4">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Peta Pemetaan Fasilitas Sangatta</h2>
                <p className="text-xs text-slate-500">Cari lokasi Rumah Sakit, Puskesmas, dan Klinik terdekat di sekitar Singakarta</p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari RS atau Klinik..."
                  value={searchMap}
                  onChange={(e) => setSearchMap(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="h-[520px] w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200">
              <MapContainer center={[0.4950, 117.5350]} zoom={14} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {filteredFaskes.map((faskes) => (
                  <Marker key={faskes.id} position={[faskes.lat, faskes.lng]}>
                    <Popup>
                      <div className="p-1">
                        <h4 className="font-bold text-emerald-800">{faskes.nama}</h4>
                        <p className="text-xs font-semibold text-slate-600">{faskes.kategori}</p>
                        <p className="text-[11px] text-slate-500 mt-1">{faskes.alamat}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: BERITA & GALERI ==================== */}
        {activeTab === 'berita' && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Berita & Pengumuman Desa</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {beritaData.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="p-6 space-y-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg uppercase">{item.category}</span>
                      <h3 className="font-bold text-slate-800 text-base">{item.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.snippet}</p>
                    </div>
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                      <span>{item.date}</span>
                      <span>{item.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-bold text-slate-900">Galeri Foto Kegiatan</h2>
              <div className="grid md:grid-cols-4 gap-4">
                {galeriData.map((foto) => (
                  <div key={foto.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden group shadow-sm">
                    <div className="h-40 overflow-hidden">
                      <img src={foto.image} alt={foto.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                    </div>
                    <div className="p-3 text-center">
                      <p className="text-xs font-bold text-slate-700">{foto.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER MODERN */}
      <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-800 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Pemerintah Desa Singakarta - RT. 054. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-4 text-slate-500">
            <span>Privasi</span>
            <span>Kontak RT</span>
          </div>
        </div>
      </footer>

    </div>
  );
}