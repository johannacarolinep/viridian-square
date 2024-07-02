from django.db.models import Count, Case, When, IntegerField
from rest_framework import generics
from viridian_api.permissions import IsOwnerOrReadOnly
from .models import Profile
from .serializers import ProfileSerializer


class ProfileList(generics.ListAPIView):
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
    Retrieve or update a profile if you're the owner.
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
