from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from users.models import CustomUser
from artpieces.models import Artpiece
from .models import Like


class LikeListTests(APITestCase):
    """
    Test suite for the API view LikeList, related to listing and
    creating likes.
    """
    def setUp(self):
        """
        Set up a test user, a second user, and a test art piece.
        Log in the test user.
        """
        self.user = CustomUser.objects.create_user(
            email='test@test.com',
            password='testpass'
        )
        self.other_user = CustomUser.objects.create_user(
            email='other@test.com',
            password='otherpass'
        )
        self.artpiece = Artpiece.objects.create(
            owner=self.other_user,
            title='Test Artpiece'
        )
        self.client.login(email='test@test.com', password='testpass')
        self.url_list = reverse('likes-list')

    def test_list_likes(self):
        """
        Test retrieving a list of all likes.

        Ensures a user can retrieve a list of all likes with a GET
        request.

        Asserts:
        - The response status code is 200.
        """
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_like(self):
        """
        Test creating a new like.

        Ensures an authenticated user can create a new like with a
        POST request to '/likes/'.

        Asserts:
        - The response status code is 201.
        - A Like object has been created in the database.
        """
        data = {'liked_piece': self.artpiece.id}
        response = self.client.post(self.url_list, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Like.objects.count(), 1)

    def test_cannot_like_own_artpiece(self):
        """
        Test that a user cannot like their own art piece.

        Ensures that an authenticated user cannot create a like for
        their own art piece with a POST request.

        Asserts:
        - The response status code is 400.
        - No Like object has been created in the database.
        """
        own_artpiece = Artpiece.objects.create(
            owner=self.user,
            title='Own Artpiece'
        )
        data = {'liked_piece': own_artpiece.id}
        response = self.client.post(self.url_list, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Like.objects.count(), 0)


class LikeDetailTests(APITestCase):
    """
    Test suite for testing LikeDetail view, endpoint /likes/id/,
    and specifically retrieving and deleting a Like instance.
    """
    def setUp(self):
        """
        Set up a test user, a second user, and a test art piece.
        Log in the test user and create a like instance.
        """
        self.user = CustomUser.objects.create_user(
            email='test@test.com',
            password='testpass'
        )
        self.other_user = CustomUser.objects.create_user(
            email='other@test.com',
            password='otherpass'
        )
        self.artpiece = Artpiece.objects.create(
            owner=self.other_user,
            title='Test Artpiece'
        )
        self.like = Like.objects.create(
            owner=self.user,
            liked_piece=self.artpiece
        )
        self.url_detail = reverse('likes-detail', args=[self.like.id])
        self.client.login(email='test@test.com', password='testpass')

    def test_can_retrieve_like(self):
        """
        Test that an anonymous user can retrieve a like by ID.

        Ensures that a like can be retrieved by its ID with a GET
        request.

        Asserts:
        - The response status code is 200.
        - The response contains the correct like data.
        """
        self.client.logout()
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.like.id)
        self.assertEqual(response.data['owner'], self.user.id)
        self.assertEqual(response.data['liked_piece'], self.artpiece.id)

    def test_owner_can_delete_like(self):
        """
        Test that the owner of the like can delete it.

        Ensures that a like can be deleted by its owner with a DELETE
        request.

        Asserts:
        - The response status code is 204.
        - The like no longer exists in the database.
        """
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Like.DoesNotExist):
            Like.objects.get(id=self.like.id)

    def test_non_owner_cannot_delete_like(self):
        """
        Test that a non-owner cannot delete a like.

        Ensures that a non-owner cannot delete a like with a DELETE
        request.

        Asserts:
        - The response status code is 403.
        - The like still exists in the database.
        """
        self.client.logout()
        self.client.login(email='other@test.com', password='otherpass')
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Like.objects.filter(id=self.like.id).exists())
