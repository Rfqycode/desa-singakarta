import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  MapPin, Building2, Search, ArrowRight,
  FileText, HeartPulse, Users, ShieldCheck, Award
} from 'lucide-react';
import { faskesData, beritaData, galeriData } from './mockData';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function App() {
  const [activeTab, setActiveTab] = useState('beranda');

  // Filter Peta Faskes
  const [searchMap, setSearchMap] = useState('');
  const filteredFaskes = faskesData.filter(f =>
    f.nama.toLowerCase().includes(searchMap.toLowerCase()) ||
    f.kategori.toLowerCase().includes(searchMap.toLowerCase())
  );

  // State Data Dynamic dari Backend Django API
  const [totalWarga, setTotalWarga] = useState(0);
  const [totalLaki, setTotalLaki] = useState(0);
  const [totalPerempuan, setTotalPerempuan] = useState(0);
  const [chartDataRT, setChartDataRT] = useState({ labels: [], datasets: [] });
  const [chartDataGender, setChartDataGender] = useState({ labels: [], datasets: [] });

  // Fetching Data Asli dari Backend Django
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/warga/')
      .then((res) => res.json())
      .then((data) => {
        setTotalWarga(data.length);

        // 1. Hitung Gender berdasarkan field 'jenis_kelamin' di models.py
        const lakiCount = data.filter(
          (w) => w.jenis_kelamin?.toLowerCase().includes('l') || w.jenis_kelamin === 'Laki-laki'
        ).length;
        const perempuanCount = data.filter(
          (w) => w.jenis_kelamin?.toLowerCase().includes('p') || w.jenis_kelamin === 'Perempuan'
        ).length;

        setTotalLaki(lakiCount);
        setTotalPerempuan(perempuanCount);

        // 2. Hitung Sebaran per RT berdasarkan field 'rt' di models.py
        const rtGrouping = {};
        data.forEach((w) => {
          const rtKey = `RT ${w.rt || '001'}`;
          rtGrouping[rtKey] = (rtGrouping[rtKey] || 0) + 1;
        });

        const sortedRtKeys = Object.keys(rtGrouping).sort();
        const sortedRtValues = sortedRtKeys.map((key) => rtGrouping[key]);

        // State Grafik Batang RT
        setChartDataRT({
          labels: sortedRtKeys.length > 0 ? sortedRtKeys : ['RT 001', 'RT 002'],
          datasets: [
            {
              label: 'Jumlah Warga',
              data: sortedRtValues.length > 0 ? sortedRtValues : [0, 0],
              backgroundColor: '#10b981',
              borderRadius: 6,
            },
          ],
        });

        // State Grafik Donat Gender
        setChartDataGender({
          labels: ['Laki-laki', 'Perempuan'],
          datasets: [
            {
              data: [lakiCount, perempuanCount],
              backgroundColor: ['#10b981', '#1e293b'],
              borderWidth: 0,
            },
          ],
        });
      })
      .catch((err) => console.error('Gagal mengambil data dari API Django:', err));
  }, []);

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
                DESA PERSIAPAN SINGAKARTA
              </h1>
              <p className="text-[11px] text-emerald-400 font-medium tracking-wide uppercase">KALIMANTAN TIMUR</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/50">
            {[
              { id: 'beranda', label: 'Beranda' },
              { id: 'profil', label: 'Profil Desa' },
              { id: 'visi', label: 'Visi & Misi' },
              { id: 'maps', label: 'Peta Faskes' },
              { id: 'berita', label: 'Kabar Desa' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
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

        {/* ==================== TAB 1: HOMEPAGE / BERANDA ==================== */}
        {activeTab === 'beranda' && (
          <div className="space-y-12 pb-16">

            {/* HERO SECTION */}
            <section className="relative bg-slate-900 text-white overflow-hidden min-h-[480px] flex items-center">
              <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10"></div>

              <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 relative z-20 w-full grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Portal Informasi & Layanan Warga Desa Singakarta
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
                    Selamat Datang di <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                      Desa Singakarta
                    </span>
                  </h1>
                  <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed font-normal">
                    Pusat informasi digital terpadu untuk keterbukaan data kependudukan, penyebaran berita kegiatan desa, serta pemetaan fasilitas kesehatan secara akurat.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button onClick={() => setActiveTab('maps')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition hover:-translate-y-0.5">
                      <HeartPulse className="w-4 h-4" /> Cari Rumah Sakit
                    </button>
                    <button onClick={() => setActiveTab('profil')} className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 px-6 py-3.5 rounded-2xl font-semibold text-sm backdrop-blur-sm transition">
                      Profil Desa
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK ACCESS / CARD MENU */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* GRAFIK DEMOGRAFI PENDUDUK (SAMA DENGAN ADMIN PANEL) */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Demografi Penduduk Desa</h2>
                <p className="text-xs text-slate-500">Statistik transparansi jumlah warga dan rasio gender per wilayah</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Grafik Batang Per RT */}
                <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">Sebaran Warga per RT</h3>
                      <p className="text-xs text-slate-500">Total populasi terdaftar di wilayah Singakarta</p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> {totalWarga} Total Jiwa
                    </div>
                  </div>
                  <div className="h-64">
                    <Bar
                      data={chartDataRT}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                      }}
                    />
                  </div>
                </div>

                {/* Grafik Donat Gender */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Rasio Jenis Kelamin Warga</h3>
                    <p className="text-xs text-slate-500">Perbandingan Laki-laki & Perempuan</p>
                  </div>
                  <div className="h-48 my-2 flex justify-center">
                    <Doughnut
                      data={chartDataGender}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-[11px] text-slate-500 flex justify-around text-center font-semibold">
                    <div><span className="text-emerald-600 block text-xs font-bold">{totalLaki} Jiwa</span> Laki-laki</div>
                    <div className="border-r border-slate-200"></div>
                    <div><span className="text-slate-800 block text-xs font-bold">{totalPerempuan} Jiwa</span> Perempuan</div>
                  </div>
                </div>
              </div>
            </section>

            {/* SAMBUTAN KETUA RT / KEPALA DESA */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 pt-2">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-2xl shrink-0">
                  RT
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-slate-900 text-lg">Sambutan Pengurus Desa Singakarta</h3>
                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    "Website ini dihadirkan sebagai sarana kemudahan bagi warga Singakarta. Melalui keterbukaan informasi kegiatan, statistik kependudukan, dan pemetaan fasilitas kesehatan, kita wujudkan lingkungan desa yang tertib, sehat, dan modern."
                  </p>
                </div>
              </div>
            </section>

            {/* PREVIEW KABAR DESA */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 pt-2 space-y-6">
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
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-6">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" /> Informasi Wilayah
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Profil Desa Persiapan Singakarta</h2>

              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  Desa Persiapan Singakarta merupakan salah satu wilayah strategis yang terus berkembang pesat di Sangatta, Kabupaten Kutai Timur, Kalimantan Timur. Dengan komitmen tinggi terhadap pelayanan publik, keterbukaan informasi, dan kesejahteraan warga, desa ini berfokus pada modernisasi administrasi berbasis digital.
                </p>
                <p>
                  Portal layanan warga ini dikembangkan secara mandiri untuk memfasilitasi koordinasi yang transparan antara warga, pengurus RT, dan perangkat desa, khususnya dalam pengelolaan data kependudukan secara aman dan cepat.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: VISI & MISI ==================== */}
        {activeTab === 'visi' && (
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-6">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
                <Award className="w-4 h-4" /> Arah & Tujuan Desa
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Visi & Misi Desa Singakarta</h2>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                    V
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Visi Utama</h3>
                  <p className="text-slate-600 text-sm leading-relaxed italic border-l-4 border-emerald-500 pl-4 py-1">
                    "Terwujudnya Desa Singakarta yang mandiri, transparan, religius, serta unggul dalam pelayanan publik berbasis teknologi digital yang ramah warga."
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
                    M
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Misi Pembangunan</h3>
                  <ul className="text-sm text-slate-600 space-y-2.5 list-disc list-inside leading-relaxed">
                    <li>Meningkatkan transparansi data administrasi kependudukan dan layanan warga.</li>
                    <li>Mengoptimalkan akses kesehatan dan fasilitas darurat secara terpadu.</li>
                    <li>Mendorong partisipasi aktif masyarakat dalam pembangunan desa berbasis digital.</li>
                  </ul>
                </div>
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
          <p>© 2026 Pemerintah Desa Persiapan Singakarta - RT. 054. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-4 text-slate-500">
            <span>Privasi</span>
            <span>Kontak RT</span>
          </div>
        </div>
      </footer>

    </div>
  );
}