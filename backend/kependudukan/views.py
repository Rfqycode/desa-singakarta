from rest_framework import viewsets
from .models import Warga
from .serializers import WargaSerializer

class WargaViewSet(viewsets.ModelViewSet):
    queryset = Warga.objects.all().order_by('nama')
    serializer_class = WargaSerializer

    def get_queryset(self):
        queryset = Warga.objects.all().order_by('nama')
        
        # Fitur Filter berdasarkan Query Parameter ?rt=001 dan ?search=nama
        rt_param = self.request.query_params.get('rt', None)
        search_param = self.request.query_params.get('search', None)

        if rt_param:
            queryset = queryset.filter(rt=rt_param)
        if search_param:
            queryset = queryset.filter(nama__icontains=search_param)

        return queryset