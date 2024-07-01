from django.urls import path
from likes import views

urlpatterns = [
    path('likes/', views.LikeList.as_view(), name='likes-list'),
    path('likes/<int:pk>/', views.LikeDetail.as_view(), name='likes-detail')
]
