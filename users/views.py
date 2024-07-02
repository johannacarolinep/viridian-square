from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import EmailUpdateSerializer


class EmailUpdateView(generics.UpdateAPIView):
    """
    API view to update a user's email address.

    Uses `EmailUpdateSerializer` for validation and updating.

    Permissions:
    - IsAuthenticated: Only authenticated users can update their email address.
    """
    serializer_class = EmailUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Gets the user object (the logged-in user).
        """
        return self.request.user
