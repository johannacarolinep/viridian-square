from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import CustomUser
from .models import Enquiry, Artpiece


class EnquiryListTests(APITestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email='user1@test.com', password='pass'
        )
        self.artist = CustomUser.objects.create_user(
            email='artist1@test.com', password='pass'
        )
        self.artpiece = Artpiece.objects.create(
            title='Art 1', owner=self.artist, for_sale=1)

    def test_list_enquiries(self):
        """
        Test an authenticated user can retrieve a list of enquiries
        related to themselves, as the buyer or artist.
        """
        self.client.login(email='user1@test.com', password='pass')
        url = reverse('enquiry-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_enquiry(self):
        """
        Ensure an authenticated user can create a new enquiry for an artpiece.
        """
        self.client.login(email='user1@test.com', password='pass')
        url = reverse('enquiry-list')
        data = {
            'artpiece': self.artpiece.id,
            'initial_message': 'enquiry message',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['buyer_name'], self.user.profile.name)
