from django.urls import path
from .views import EnquiryList

urlpatterns = [
    path(
        'enquiries/',
        EnquiryList.as_view(),
        name='enquiry-list'
        ),
]
