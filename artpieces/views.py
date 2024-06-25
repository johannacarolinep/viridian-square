from rest_framework import generics, permissions
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


class ArtpieceList(generics.ListCreateAPIView):
    """
    Lists artpieces + allows for creating an artpiece if authenticated
    """
    serializer_class = ArtpieceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Artpiece.objects.all().order_by('-created_on')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
