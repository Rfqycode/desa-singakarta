import os
import django
import random
from faker import Faker

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from kependudukan.models import Warga

fake = Faker('id_ID')

daftar_rt = ['001', '002', '003', '004', '005', '006', '007', '008', '009']
daftar_agama = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha']
daftar_status = ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati']
daftar_bantuan = ['Tidak Ada', 'PKH', 'BPNT', 'BLT Desa', 'KIS / PBI']

print("Sedang membuat 90 data warga dummy untuk 9 RT...")

# Bersihkan data lama jika ada
Warga.objects.all().delete()

for _ in range(90):
    jk = random.choice(['Laki-laki', 'Perempuan'])
    nama = fake.name_male() if jk == 'Laki-laki' else fake.name_female()
    
    Warga.objects.create(
        nik=fake.numerify('6408############'),
        nama=nama,
        jenis_kelamin=jk,
        tempat_lahir='Sangatta',
        tanggal_lahir=fake.date_of_birth(minimum_age=1, maximum_age=75),
        status_kawin=random.choice(daftar_status),
        agama=random.choice(daftar_agama),
        gol_darah=random.choice(['A', 'B', 'AB', 'O']),
        kewarganegaraan='WNI',
        no_kk=fake.numerify('6408############'),
        nama_ayah=fake.name_male(),
        nama_ibu=fake.name_female(),
        hubungan_keluarga=random.choice(['Kepala Keluarga', 'Istri', 'Anak']),
        nama_dusun='Singakarta',
        rt=random.choice(daftar_rt),
        rw='00',
        jalan=fake.street_address(),
        nomor_telepon=fake.phone_number(),
        email=fake.email(),
        no_akta_kelahiran=fake.bothify(text='AK-######'),
        pendidikan_terakhir=random.choice(['SD', 'SMP', 'SMA/Sederajat', 'S1/D4']),
        pekerjaan=fake.job(),
        etnis_suku=random.choice(['Kutai', 'Dayak', 'Bugis', 'Jawa']),
        jenis_bantuan=random.choice(daftar_bantuan)
    )

print("Selesai! 90 Data Warga Dummy berhasil dibuat.")