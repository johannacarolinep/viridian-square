from rest_framework import generics
from .serializers import ArtpieceSerializer
from .models import Artpiece
from viridian_api.permissions import IsOwnerOrReadOnly


# Create your views here.
class ArtpieceDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve an artpiece.
    """
    serializer_class = ArtpieceSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Artpiece.objects.all()
