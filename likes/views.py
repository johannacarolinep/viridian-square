from rest_framework import generics, permissions
from viridian_api.permissions import IsOwnerOrReadOnly
from .models import Like
from .serializers import LikeSerializer


class LikeList(generics.ListCreateAPIView):
    """
    View for listing all likes or creating a new like.

    - GET: Returns a list of all likes. No authentication required.
    - POST: Creates a new like. Requires authentication.

    Uses `LikeSerializer` for serialization.

    Permissions:
    - `IsAuthenticatedOrReadOnly`: Authenticated users can create likes;
      others can only read.

    Attributes:
        serializer_class (LikeSerializer): Handles serialization.
        permission_classes (list): Defines access permissions.
        queryset (QuerySet): Base queryset for retrieving likes.

    Methods:
        perform_create(self, serializer):
            Saves the new like instance with the authenticated user
            set as the owner.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = LikeSerializer
    queryset = Like.objects.all()

    def perform_create(self, serializer):
        """
        Saves the new like instance with the authenticated user set as
        the owner.
        """
        serializer.save(owner=self.request.user)


class LikeDetail(generics.RetrieveDestroyAPIView):
    """
    View for retrieving or deleting a like by its ID.

    - GET: Retrieve a like by its primary key. No authentication required.
    - DELETE: Delete a like by its primary key. Requires ownership of the like.

    Uses `LikeSerializer` for serialization.

    Permissions:
    - `IsOwnerOrReadOnly`: Owners can delete the like; others can only read.

    Attributes:
        serializer_class (LikeSerializer): Handles serialization.
        permission_classes (list): Defines access permissions.
        queryset (QuerySet): Base queryset for retrieving likes.
    """
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = LikeSerializer
    queryset = Like.objects.all()
