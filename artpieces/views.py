from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
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
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]
    filterset_fields = [
        'art_medium',
        'for_sale',
    ]
    search_fields = [
        'title',
        'owner__username',
        'owner__profile__name',
        'hashtags__name',
        'art_collection_id__title'
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
