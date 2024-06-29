from django.urls import path
from art_collections import views
from .views import ArtCollectionUpdateArtpieces

urlpatterns = [
    path(
        'collections/<int:pk>/',
        views.ArtCollectionDetail.as_view(),
        name='collection-detail'
        ),
    path(
        'collections/',
        views.ArtCollectionList.as_view(),
        name='collection-list'
        ),
    path(
        'collections/<int:pk>/update-artpieces/',
        ArtCollectionUpdateArtpieces.as_view(),
        name='collection-update-artpieces'),
]
