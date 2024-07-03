from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import EnquirySerializer
from .models import Enquiry


class EnquiryList(generics.ListCreateAPIView):
    serializer_class = EnquirySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Enquiry.objects.all()

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)
