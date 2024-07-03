from django.db.models import Q
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import EnquirySerializer
from .models import Enquiry


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
