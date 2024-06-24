from rest_framework import generics
from .serializers import ArtpieceSerializer
from .models import Artpiece


# Create your views here.
class ArtpieceDetail(generics.RetrieveAPIView):
    """
    Retrieve an artpiece.
    """
    serializer_class = ArtpieceSerializer
    queryset = Artpiece.objects.all()
