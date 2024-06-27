
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from .serializers import ArtCollectionSerializer
from viridian_api.permissions import IsOwnerOrReadOnly, IsOwner
from .models import ArtCollection
from artpieces.models import Artpiece


class ArtCollectionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ArtCollectionSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = ArtCollection.objects.all()


class ArtCollectionList(generics.ListCreateAPIView):
    serializer_class = ArtCollectionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = ArtCollection.objects.all()
    filter_backends = [
        DjangoFilterBackend
    ]
    filterset_fields = [
        'owner__id'
    ]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ArtCollectionUpdateArtpieces(generics.GenericAPIView):
    queryset = ArtCollection.objects.all()
    serializer_class = ArtCollectionSerializer
    permission_classes = [IsOwner]

    def post(self, request, *args, **kwargs):
        collection_id = kwargs.get('pk')
        new_artpiece_ids = request.data.get('artpiece_ids', [])

        try:
            art_collection = self.get_object()
            existing_artpieces = Artpiece.objects.filter(art_collection=collection_id)

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
                        raise PermissionDenied(detail=f"You do not have permission to add artpiece {artpiece_id}.")
                    artpiece_to_add.add_to_collection(art_collection)
                except Artpiece.DoesNotExist:
                    # Handle case where artpiece doesn't exist
                    return Response({'detail': f'Artpiece with ID {artpiece_id} not found.'}, status=status.HTTP_404_NOT_FOUND)

            # Refresh the art collection instance
            art_collection.refresh_from_db()

            # Serialize and return the updated art collection
            serializer = self.get_serializer(instance=art_collection)
            return Response(serializer.data)

        except ArtCollection.DoesNotExist:
            return Response({'detail': 'Art collection not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Artpiece.DoesNotExist:
            return Response({'detail': 'One or more artpieces not found.'}, status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return Response({'detail': str(e)}, status=status.HTTP_403_FORBIDDEN)