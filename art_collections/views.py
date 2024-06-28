
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from .serializers import ArtCollectionSerializer
from viridian_api.permissions import IsOwnerOrReadOnly, IsOwner
from .models import ArtCollection
from artpieces.models import Artpiece


class ArtCollectionDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update, or delete an art collection.

    - GET: Retrieve an art collection by its primary key.
    - PUT: Update an art collection (owner only).
    - DELETE: Delete an art collection (owner only).

    Uses `ArtCollectionSerializer` for serialization.

    Permissions:
    - `IsOwnerOrReadOnly`: Owners can modify; others can only read.

    Attributes:
        serializer_class (ArtCollectionSerializer): Handles serialization.
        permission_classes (list): Defines access permissions.
        queryset (QuerySet): Base queryset for retrieving art collections.
    """
    serializer_class = ArtCollectionSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = ArtCollection.objects.all()


class ArtCollectionList(generics.ListCreateAPIView):
    """
    View to list all art collections or create a new art collection.

    - GET: Returns a list of all art collections. Supports filtering by the
    owner's ID.
    - POST: Creates a new art collection (authenticated only). The
    authenticated user is set as the owner.

    Uses `ArtCollectionSerializer` for serialization.

    Permissions:
    - `IsAuthenticatedOrReadOnly`: Authenticated users can create; others can
    only read.

    Attributes:
        serializer_class (ArtCollectionSerializer): Handles serialization.
        permission_classes (list): Defines access permissions.
        queryset (QuerySet): The base queryset for retrieving art collections.
        filter_backends (list): List of filter backends used for filtering the
        queryset.
        filterset_fields (list): List of fields that can be used to filter the
        queryset.
        ordering_fields (list): List of fields that can used for ordering the
        queryset.

    Methods:
        perform_create(self, serializer):
            Saves the new art collection instance with the authenticated user
            set as the owner.
    """
    serializer_class = ArtCollectionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = ArtCollection.objects.all()
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        'owner__id'
    ]
    ordering_fields = [
        'created_on'
    ]

    def perform_create(self, serializer):
        """
        Saves the new art collection instance with the authenticated user
        set as the owner.
        """
        serializer.save(owner=self.request.user)


class ArtCollectionUpdateArtpieces(generics.GenericAPIView):
    """
    API view to bulk update the association of artpieces to an art collection.
    Only the owner of the art collection can modify it. Only the owner's
    artpieces can be added.

    - POST: Adds/removes artpieces from a collection (collection owner only).

    Uses `ArtCollectionSerializer` for serialization.

    Methods:
        post(self, request, *args, **kwargs):
            Updates the artpieces in the collection based on the provided list
            of artpiece IDs.
    """
    queryset = ArtCollection.objects.all()
    serializer_class = ArtCollectionSerializer
    permission_classes = [IsOwner]

    def post(self, request, *args, **kwargs):
        """
        Updates the artpieces in the collection based on the provided list
        of artpiece IDs. Adds new artpieces to the collection and removes
        artpieces that are not in the provided list. Ensures art pieces to be
        added to the collection belongs to the user.
        """
        collection_id = kwargs.get('pk')
        new_artpiece_ids = request.data.get('artpiece_ids', [])

        try:
            art_collection = self.get_object()
            existing_artpieces = Artpiece.objects.filter(
                art_collection=collection_id)

            # Remove artpieces that are no longer selected
            for artpiece in existing_artpieces:
                if artpiece not in new_artpiece_ids:
                    artpiece_to_remove = Artpiece.objects.get(id=artpiece.id)
                    artpiece_to_remove.remove_from_collection()

            # Add artpieces that are not already in the collection
            for artpiece_id in new_artpiece_ids:
                try:
                    artpiece_to_add = Artpiece.objects.get(id=artpiece_id)
                    if artpiece_to_add.owner != request.user:
                        raise PermissionDenied(
                            detail="You can only add your own artpieces.")
                    artpiece_to_add.add_to_collection(art_collection)
                except Artpiece.DoesNotExist:
                    # Handle case where artpiece doesn't exist
                    return Response(
                        {
                            'detail':
                            (f'Artpiece with ID {artpiece_id} not found.')
                        }, status=status.HTTP_404_NOT_FOUND)

            # Refresh the art collection instance
            art_collection.refresh_from_db()

            # Serialize and return the updated art collection
            serializer = self.get_serializer(instance=art_collection)
            return Response(serializer.data)

        except ArtCollection.DoesNotExist:
            return Response(
                {'detail': 'Art collection not found.'},
                status=status.HTTP_404_NOT_FOUND
                )
        except Artpiece.DoesNotExist:
            return Response(
                {'detail': 'One or more artpieces not found.'},
                status=status.HTTP_404_NOT_FOUND
                )
        except PermissionDenied as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_403_FORBIDDEN
                )
