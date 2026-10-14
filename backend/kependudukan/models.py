from django.db import models

# Create your models here.
class Warga(models.Model):
    nik = models.CharField(max_length=16, unique=True, primary_key=True)
    nama = models.CharField(max_length=255)
    jenis_kelamin = models.CharField(max_length=20)
    tempat_lahir = models.CharField(max_length=100, blank=True, null=True)
    tanggal_lahir = models.DateField(blank=True, null=True)
    status_kawin = models.CharField(max_length=50, blank=True, null=True)
    agama = models.CharField(max_length=50, blank=True, null=True)
    gol_darah = models.CharField(max_length=10, blank=True, null=True)
    kewarganegaraan = models.CharField(max_length=50, default='WNI')
    no_kk = models.CharField(max_length=16, blank=True, null=True)
    nama_ayah = models.CharField(max_length=255, blank=True, null=True)
    nama_ibu = models.CharField(max_length=255, blank=True, null=True)
    hubungan_keluarga = models.CharField(max_length=100, blank=True, null=True)
    nama_dusun = models.CharField(max_length=100, default='Singakarta')
    rt = models.CharField(max_length=5) # RT 001 - 009
    rw = models.CharField(max_length=5, default='00')
    jalan = models.TextField(blank=True, null=True)
    nomor_telepon = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    no_akta_kelahiran = models.CharField(max_length=100, blank=True, null=True)
    pendidikan_terakhir = models.CharField(max_length=50, blank=True, null=True)
    pekerjaan = models.CharField(max_length=100, blank=True, null=True)
    etnis_suku = models.CharField(max_length=50, blank=True, null=True)
    jenis_bantuan = models.CharField(max_length=100, default='Tidak Ada')

    def __str__(self):
        return f"{self.nama} (NIK: {self.nik}) - RT {self.rt}"