from rest_framework import generics, permissions
from .serializers import ArtCollectionSerializer
from .models import ArtCollection


# Create your views here.
class ArtCollectionList(generics.ListCreateAPIView):
    serializer_class = ArtCollectionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = ArtCollection.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
