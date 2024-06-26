from django.urls import path
from art_collections import views

urlpatterns = [
    path('collections/', views.ArtCollectionList.as_view())
]
