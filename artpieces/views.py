from rest_framework import generics, permissions, filters
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import ArtpieceSerializer
from .models import Artpiece
from viridian_api.permissions import IsOwnerOrReadOnly


class ArtpieceDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, or deleting an artpiece instance.

    Uses `ArtpieceSerializer` for serialization.

    Permissions:
    - IsOwnerOrReadOnly: Users who own the artpiece can edit or delete it,
    while others can only view its details.
    """
    serializer_class = ArtpieceSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Artpiece.objects.annotate(
        likes_count=Count('likes', disctinct=True)
    ).order_by('-created_on')


class ArtpieceList(generics.ListCreateAPIView):
    """
    API view for listing and creating artpieces.

    Uses `ArtpieceSerializer` for serialization.

    Permissions:
    - IsAuthenticatedOrReadOnly: Allows authenticated users to create new
    artpieces. Read-only access is granted to unauthenticated users.

    Filter Backends:
    - DjangoFilterBackend: Allows filtering of artpieces based on specified
        fields ('art_medium', 'for_sale', 'art_collection_id', 'likes__owner',
        'owner').
    - SearchFilter: Enables searching for artpieces based on fields
        ('title', 'owner__profile__name', 'hashtags__name',
        'art_collection_id__title').
    - OrderingFilter: Allows ordering of artpieces based on fields
        ('likes_count', 'created_on').

    Methods:
    - perform_create: Overrides the creation process to associate the artpiece
        with the authenticated user before saving.
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
        'art_collection_id',
        'likes__owner',
        'owner'
    ]
    search_fields = [
        'title',
        'owner__profile__name',
        'hashtags__name',
        'art_collection_id__title'
    ]
    ordering_fields = [
        'likes_count',
        'created_on'
    ]

    def perform_create(self, serializer):
        """
        Overrides the creation process to associate the artpiece
        with the authenticated user before saving.
        """
        serializer.save(owner=self.request.user)
