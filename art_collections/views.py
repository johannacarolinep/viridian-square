
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import ArtCollectionSerializer
from viridian_api.permissions import IsOwnerOrReadOnly
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

    def post(self, request, *args, **kwargs):
        collection_id = kwargs.get('pk')
        artpiece_ids = request.data.get('artpiece_ids', [])

        try:
            art_collection = self.get_object()
            print("collection id ", collection_id)
            existing_artpieces = Artpiece.objects.filter(art_collection=collection_id)
            print("Existing artpieces", existing_artpieces)
            # existing_artpieces = art_collection.artpieces.values_list('id', flat=True)

            # Remove artpieces that are no longer selected
            for artpiece_id in existing_artpieces:
                if artpiece_id not in artpiece_ids:
                    print("Artpiece id = ", artpiece_id)
                    artpiece = Artpiece.objects.get(id=artpiece_id.id)
                    print("Artpiece ", artpiece)
                    artpiece.remove_from_collection()

            # Add artpieces that are not already in the collection
            for artpiece_id in artpiece_ids:
                # artpiece = Artpiece.objects.get(id=artpiece_id)
                # artpiece.add_to_collection(art_collection)
                try:
                    artpiece = Artpiece.objects.get(id=artpiece_id)
                    artpiece.add_to_collection(art_collection)
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
