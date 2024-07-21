from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import EmailUpdateSerializer, DeleteUserSerializer
from django.contrib.auth import logout


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


class DeleteUserView(generics.GenericAPIView):
    """
    API view to delete a user.

    Uses `DeleteUserSerializer` for password validation.

    Permissions:
    - IsAuthenticated: Only authenticated users can delete their account.

    Methods:
    - delete: Validates the provided password and deletes the user's account,
    logs the user out and deletes cookies.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = DeleteUserSerializer

    def delete(self, request, *args, **kwargs):
        """
        Validates the user's password, logs the user out, deletes the user,
        and deletes authentication cookies.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        logout(request)
        user.delete()

        response = Response(
            {"message": "Account deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )
        response.delete_cookie('viridian-auth')
        response.delete_cookie('viridian-refresh-token')

        return response
