from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from users.models import CustomUser
from .models import ArtCollection
from artpieces.models import Artpiece


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
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ArtCollection.objects.count(), 1)


class ArtCollectionDetailTests(APITestCase):
    """
    Test suite for testing ArtCollectionDetail view, endpoint /collections/id/,
    and specifically CRUD operations on an individual Art Collection.
    """
    def setUp(self):
        """
        Set up test user and a test Art Collection instance.
        """
        self.user = CustomUser.objects.create_user(
            email='test@test.com',
            password='testpass')

        self.art_collection = ArtCollection.objects.create(
            owner=self.user,
            title='Test Collection'
            )
        self.url_detail = reverse(
            'collection-detail',
            args=[self.art_collection.id])

    def test_can_retrieve_art_collection(self):
        """
        Test that an anonymous user can retrieve an art collection by ID.
        """
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_can_update_art_collection(self):
        """
        Test that a logged in user can update their art collection.
        """
        self.client.login(email='test@test.com', password='testpass')
        data = {'title': 'Updated Art Collection'}
        response = self.client.put(self.url_detail, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.art_collection.refresh_from_db()
        self.assertEqual(self.art_collection.title, 'Updated Art Collection')

    def test_logged_in_user_can_delete_art_collection(self):
        """
        Test that a logged in user can delete their art collection.
        """
        self.client.login(email='test@test.com', password='testpass')
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(ArtCollection.DoesNotExist):
            ArtCollection.objects.get(id=self.art_collection.id)


class ArtCollectionTests(APITestCase):
    """
    Test suite for the ArtCollection API endpoint
    '/collections/id/update-artpieces/', used for adding/removing artpieces to
    an art collection.
    """
    def setUp(self):
        """
        Sets up necessary data for the tests.

        - Creates a test user.
        - Creates two test artpieces owned by the test user.
        - Creates a test art collection owned by the test user and associates
        artpiece1 with it.
        - Logs in.
        """
        self.user = CustomUser.objects.create_user(
            email='test@test.com',
            password='testpass'
        )

        self.artpiece1 = Artpiece.objects.create(
            owner=self.user,
            title='Artpiece 1'
            )
        self.artpiece2 = Artpiece.objects.create(
            owner=self.user,
            title='Artpiece 2'
            )

        self.art_collection = ArtCollection.objects.create(
            owner=self.user,
            title='Test Collection'
        )
        self.art_collection.collection_artpieces.set([self.artpiece1])

        self.client.login(email='test@test.com', password='testpass')

    def test_can_update_artpieces_in_collection(self):
        """
        Tests updating artpieces in an art collection.

        - Sends a POST request to update the artpieces in art_collection with
        artpiece1 and artpiece2.
        - Asserts that the response status code is 200 OK.
        - Refreshes the art_collection instance and retrieves the updated
        artpiece IDs associated with it.
        - Asserts that the updated artpiece IDs match [artpiece1.id,
        artpiece2.id].
        """
        data = {
            'artpiece_ids': [self.artpiece1.id, self.artpiece2.id]
            }
        url = reverse(
            'collection-update-artpieces',
            args=[self.art_collection.id]
            )
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.art_collection.refresh_from_db()
        updated_artpiece_ids = list(
            self.art_collection.collection_artpieces.values_list(
                'id', flat=True
                )
        )
        self.assertEqual(
            sorted(updated_artpiece_ids),
            [self.artpiece1.id, self.artpiece2.id])
