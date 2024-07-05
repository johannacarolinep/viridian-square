from rest_framework import generics, permissions, filters
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import ArtpieceSerializer
from .models import Artpiece
from likes.models import Like
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


class ArtpieceTrendList(generics.ListAPIView):
    """
    API view for listing the top 4 'trending' art pieces.

    Uses `ArtpieceSerializer` for serialization.

    Methods:
    - get_queryset: Retrieves the top 4 art pieces with the highest number of
        likes in the last 30 days. If fewer than 4 art pieces have likes in the
        last 30 days, it includes additional top-liked art pieces to make a
        total of 4.

    The queryset is ordered by the number of likes in descending order.
    """
    serializer_class = ArtpieceSerializer

    def get_queryset(self):
        """
        Retrieves the top 4 art pieces with the highest number of
        likes in the last 30 days. If fewer than 4 art pieces have likes in the
        last 30 days, it includes additional top-liked art pieces to make a
        total of 4.
        """
        trending_artpieces = Like.top_trending_artpieces()
        trending_artpiece_ids = {
            artpiece['liked_piece'] for artpiece in trending_artpieces
            }

        if len(trending_artpiece_ids) < 4:
            # If less than 4 "trending" art pieces, get the total top 4
            additional_artpieces = Artpiece.objects.annotate(
                likes_count=Count('likes')
            ).exclude(id__in=trending_artpiece_ids).order_by(
                '-likes_count')[:4-len(trending_artpiece_ids)]

            additional_artpiece_ids = {
                artpiece.id for artpiece in additional_artpieces
                }
            trending_artpiece_ids.update(additional_artpiece_ids)

        # Get the final queryset of art pieces
        queryset = Artpiece.objects.filter(
            id__in=trending_artpiece_ids).annotate(
            likes_count=Count('likes', distinct=True)).order_by('-likes_count')

        return queryset
