from django.db.models import Q, Case, When, Value
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import EnquirySerializer, EnquiryResponseSerializer
from .models import Enquiry
from .permissions import IsBuyerOrArtist


class EnquiryList(generics.ListCreateAPIView):
    """
    API view for listing and creating enquiries.

    Uses `EnquirySerializer` for serialization.

    Permissions:
    - IsAuthenticatedOrReadOnly: Only authenticated users can create an
    enquiry.

    Filter Backends:
    - DjangoFilterBackend: Allows filtering of enquiries based on specified
    fields ('buyer', 'artpiece__owner').
    - OrderingFilter: Allows ordering of enquiries based on fields
    ('updated_on').

    Methods:
    - get_queryset: Restricts the returned enquiries to those related to the
    requesting user.
    - perform_create: Overrides the creation process to associate the enquiry
    with the authenticated user before saving.
    """
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
        """
        Restricts the returned enquiries to those related to the
        requesting user (as a buyer, or artpiece owner).
        """
        user = self.request.user
        queryset = super().get_queryset()

        queryset = queryset.filter(Q(buyer=user) | Q(artpiece__owner=user))

        return queryset

    def perform_create(self, serializer):
        """
        Overrides the creation process to associate the enquiry
        with the requesting user before saving.
        """
        serializer.save(buyer=self.request.user)


class EnquiryDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, and 'deleting' enquiries.

    Uses `EnquirySerializer` for read operations and
    `EnquiryResponseSerializer` for update operations.

    Permissions:
    - IsBuyerOrArtist: Allows access only to the buyer or artpiece owner.

    Methods:
    - get_serializer_class: Determines which serializer to use based on the
    request method.
    - get: Retrieves an enquiry and updates the 'checked' status for the buyer
    or artist, based on who made the request.
    - update: Updates an enquiry with response and status, ensuring only the
    artist can update and only when the status is 'pending' (0).
    - perform_update: Saves the enquiry and resets the buyer's 'checked' status
    - destroy: Soft deletes the enquiry by nullifying the buyer or artpiece
    fields instead of actual deletion.
    """
    queryset = Enquiry.objects.all()
    permission_classes = [IsBuyerOrArtist]

    def get_serializer_class(self):
        """
        Determines which serializer to use based on the
        request method.
        """
        if self.request.method in ['PUT', 'PATCH']:
            return EnquiryResponseSerializer
        return EnquirySerializer

    def get(self, request, *args, **kwargs):
        """
        Retrieves an enquiry and updates the 'checked' status for the buyer
        or artist, based on who made the request.

        Annotates the artists email if the enquiry status is 'accepted' (1).
        """
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
        """
        Updates an enquiry with response_message and status, ensuring only the
        artist can update and only when the status is 'pending' (0).
        """
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
        """ Saves the enquiry and resets the buyer's 'checked' status """
        instance = serializer.save()
        instance.buyer_has_checked = False
        instance.save()

    def destroy(self, request, *args, **kwargs):
        """
        Soft deletes the enquiry by nullifying the buyer or artpiece
        fields instead of actual deletion.
        """
        instance = self.get_object()

        if request.user == instance.artpiece.owner:
            instance.artpiece = None
        elif request.user == instance.buyer:
            instance.buyer = None

        instance.save()
        return Response(status=204)
