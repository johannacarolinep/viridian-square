from django.urls import path
from artpieces import views

urlpatterns = [
    path('artpieces/<int:pk>/', views.ArtpieceDetail.as_view())
]
