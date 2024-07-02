from django.urls import path
from .views import EmailUpdateView

urlpatterns = [
    path('update-email/', EmailUpdateView.as_view(), name='update-email'),
]
