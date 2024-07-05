from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import EmailUpdateSerializer, DeleteUserSerializer, CurrentUserSerializer
from dj_rest_auth.views import UserDetailsView


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
    - delete: Validates the provided password and deletes the user's account.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = DeleteUserSerializer

    def delete(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.delete()

        return Response(
            {"message": "Account deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )


class CustomUserDetailsView(UserDetailsView):
    """
    Custom view for retrieving user details with a custom serializer.

    This view extends `UserDetailsView` and uses the `CurrentUserSerializer`
    to provide additional user profile information.
    """
    serializer_class = CurrentUserSerializer

    def get(self, request, *args, **kwargs):
        """ Retrieve the current user's details """
        response = super().get(request, *args, **kwargs)
        return response
