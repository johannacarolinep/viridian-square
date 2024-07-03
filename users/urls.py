from django.urls import path
from .views import EmailUpdateView, DeleteUserView

urlpatterns = [
    path('update-email/', EmailUpdateView.as_view(), name='update-email'),
    path('delete-user/', DeleteUserView.as_view(), name='delete-user'),
]
