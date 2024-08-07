from django.urls import path
from artpieces import views

urlpatterns = [
    path('artpieces/', views.ArtpieceList.as_view()),
    path('artpieces/<int:pk>/', views.ArtpieceDetail.as_view()),
    path(
        'artpieces/trending/',
        views.ArtpieceTrendList.as_view(),
        name='artpiece_trendlist'
        )
]
