from django.db.models import Q
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import EnquirySerializer, EnquiryResponseSerializer
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
    permission_classes = [IsBuyerOrArtist]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return EnquiryResponseSerializer
        return EnquirySerializer

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
        data = serializer.data

        # Annotate artist_email if status is accepted
        if instance.status == 1:
            data['artist_email'] = instance.artpiece.owner.email

        return Response(data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Ensure PUT request is coming from the artist
        if request.user != instance.artpiece.owner:
            raise ValidationError(
                "You do not have permission to update this enquiry."
                )

        # Ensure enquiry status is 'pending'
        if instance.status != 0:
            raise ValidationError("This enquiry has already been answered.")

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.buyer_has_checked = False
        instance.save()
