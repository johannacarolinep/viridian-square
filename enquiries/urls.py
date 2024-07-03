from django.urls import path
from .views import EnquiryList, EnquiryDetail

urlpatterns = [
    path(
        'enquiries/',
        EnquiryList.as_view(),
        name='enquiry-list'
        ),
    path(
        'enquiries/<int:pk>/',
        EnquiryDetail.as_view(),
        name='enquiry-detail'
        )
]
