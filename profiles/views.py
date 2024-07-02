from django.db.models import Count, Case, When, IntegerField
from rest_framework import generics
from viridian_api.permissions import IsOwnerOrReadOnly
from .models import Profile
from .serializers import ProfileSerializer


class ProfileList(generics.ListAPIView):
    """
    API view for listing profiles.

    Retrieves a list of profiles with associated counts of art pieces,
    collections, and art pieces for sale.

    Uses `ProfileSerializer` for serialization.

    Annotations:
    - artpiece_count: Number of art pieces associated with each profile.
    - collection_count: Number of collections associated with each profile.
    - for_sale_count: Number of art pieces marked for sale associated with each
    profile.

    """
    queryset = Profile.objects.annotate(
        artpiece_count=Count('owner__artpiece', distinct=True),
        collection_count=Count('owner__artcollection', distinct=True),
        for_sale_count=Count(
            Case(
                When(owner__artpiece__for_sale=1, then='owner__artpiece__id'),
                output_field=IntegerField()
            ),
            distinct=True
        )
    )
    serializer_class = ProfileSerializer


class ProfileDetail(generics.RetrieveUpdateAPIView):
    """
    API view for retrieving and updating a profile.

    Uses `ProfileSerializer` for serialization.

    Permissions:
    - IsOwnerOrReadOnly: Only allows the owner of the profile to update their
    profile. Others have read-only access.

    Annotations:
    - artpiece_count: Number of art pieces associated with the profile.
    - collection_count: Number of collections associated with the profile.
    - for_sale_count: Number of art pieces marked for sale associated with
    the profile.

    """
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Profile.objects.annotate(
        artpiece_count=Count('owner__artpiece', distinct=True),
        collection_count=Count('owner__artcollection', distinct=True),
        for_sale_count=Count(
            Case(
                When(owner__artpiece__for_sale=1, then='owner__artpiece__id'),
                output_field=IntegerField()
            ),
            distinct=True
        )
    )
    serializer_class = ProfileSerializer
