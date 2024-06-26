from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import ArtCollectionSerializer
from .models import ArtCollection


# Create your views here.
class ArtCollectionList(generics.ListCreateAPIView):
    serializer_class = ArtCollectionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = ArtCollection.objects.all()
    filter_backends = [
        DjangoFilterBackend
    ]

    filterset_fields = [
        'owner__id'
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
