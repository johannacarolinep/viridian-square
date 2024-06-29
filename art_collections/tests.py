from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from users.models import CustomUser
from .models import ArtCollection


class ArtCollectionListTests(APITestCase):
    """
    Test suite for the API view ArtCollectionList, related to listing and
    creating art collections.
    """
    def setUp(self):
        """
        Set up a test user for the test cases, log in, and reverse the url
        pattern.
        """
        self.user = CustomUser.objects.create_user(
            email='test@test.com',
            username='testuser',
            password='testpass'
        )
        self.client.login(email='test@test.com', password='testpass')
        self.url_list = reverse('collection-list')

    def test_list_art_collections(self):
        """
        Test retrieving a list of all art collections.

        Ensures a user can retrieve a list of all art collections with a GET
        request.

        Asserts:
        - The response status code is 200.
        """
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_art_collection(self):
        """
        Test creating a new art collection.

        Ensures an authenticated user can create a new art collection with a
        POST request to '/collections/'.

        Asserts:
        - The response status code is 201
        - One ArtCollection object has been created in the database.
        """
        data = {'title': 'New Collection'}
        response = self.client.post(self.url_list, data)
        print("RESPONSE ", response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ArtCollection.objects.count(), 1)
