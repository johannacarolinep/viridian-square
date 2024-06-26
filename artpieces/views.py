from rest_framework import generics, permissions, filters
from django.db.models import Count
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
    queryset = Artpiece.objects.annotate(
        likes_count=Count('likes', disctinct=True)
    ).order_by('-created_on')


class ArtpieceList(generics.ListCreateAPIView):
    """
    Lists artpieces + allows for creating an artpiece if authenticated
    """
    serializer_class = ArtpieceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Artpiece.objects.annotate(
        likes_count=Count('likes', disctinct=True)
    ).order_by('-created_on')
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
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
    ordering_fields = [
        'likes_count',
        'created_on'
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
