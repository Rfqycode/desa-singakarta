from rest_framework import serializers
from .models import Warga

class WargaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warga
        fields = '__all__'