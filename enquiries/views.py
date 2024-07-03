from django.db.models import Q
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import EnquirySerializer
from .models import Enquiry
from .permissions import IsBuyerOrArtist


class EnquiryList(generics.ListCreateAPIView):
    serializer_class = EnquirySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Enquiry.objects.all().order_by('-updated_on')
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        'buyer',
        'artpiece__owner'
    ]
    ordering_fields = [
        'updated_on',
    ]

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()

        queryset = queryset.filter(Q(buyer=user) | Q(artpiece__owner=user))

        return queryset

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)


class EnquiryDetail(generics.RetrieveUpdateAPIView):
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer
    permission_classes = [IsBuyerOrArtist]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()

        # Set 'artist_has_checked' or 'buyer_has_checked'
        request_user = self.request.user
        if request_user == instance.buyer:
            instance.buyer_has_checked = True
        elif request_user == instance.artpiece.owner:
            instance.artist_has_checked = True
        # Save the updated instance
        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)
