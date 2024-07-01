from users.models import CustomUser
from .models import Artpiece, Hashtag
from rest_framework import status
from rest_framework.test import APITestCase
from io import BytesIO
import requests
import json


class ArtpieceListTests(APITestCase):
    """
    Test suite for the Artpiece list API endpoints.
    """

    def setUp(self):
        """
        Set up a test user for the test cases.
        """
        CustomUser.objects.create_user(
            email='test@test.com',
            password='testpass')

    def test_can_list_artpieces(self):
        """
        Tests that a user can retrieve a list of art pieces through a GET
        request to the API endpoint /artpieces/.

        Asserts the API returns a 200 status code.
        """
        test_user = CustomUser.objects.get(email='test@test.com')
        Artpiece.objects.create(owner=test_user, title='test title')
        response = self.client.get('/artpieces/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_can_create_artpiece(self):
        """
        Tests that an anonymous user cannot create an artpiece, and that a
        logged in user can.

        First makes a POST request to API endpoint '/artpieces/' with
        an authenticated used. Asserts the API returns a 201 status code.

        Then deletes the created artpiece instance to delete the image from
        Cloudinary.

        Lastly logs out and tries to make the POST request again, asserting
        the API returns a 403 status code.
        """
        self.client.login(
            email='test@test.com',
            password='testpass')

        # Downloading image since the file is required for artpiece creation
        image = 'https://res.cloudinary.com/deceun0wd/image/upload/'\
            'v1716381135/default_image_kp6bpt.jpg'
        image_response = requests.get(image)
        image_content = image_response.content
        image_file = BytesIO(image_content)
        image_file.name = 'test_image.jpg'

        data = {
            'title': 'a test title',
            'image': image_file,
        }
        response = self.client.post(
            '/artpieces/',
            data,
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Retrieve and delete the created instance to delete Cloudinary image
        response_data = json.loads(response.content)
        created_artpiece = Artpiece.objects.get(id=response_data['id'])
        created_artpiece.delete()
        with self.assertRaises(Artpiece.DoesNotExist):
            Artpiece.objects.get(id=response_data['id'])

        # Log out and try to make the POST request again
        self.client.logout()
        response_anonymous = self.client.post(
            '/artpieces/',
            data,
            format='multipart'
        )
        self.assertEqual(
            response_anonymous.status_code, status.HTTP_403_FORBIDDEN)


class ArtpieceDetailTests(APITestCase):
    """
    Test suite for the Artpiece detail API endpoint.
    """

    def setUp(self):
        """
        Set up a test user, hashtags, and an artpiece for the test cases.
        """
        self.test_user = CustomUser.objects.create_user(
            email='test@test.com',
            password='testpass')

        hashtag1 = Hashtag.objects.create(name='hashtag1')
        hashtag2 = Hashtag.objects.create(name='hashtag2')

        self.test_artpiece = Artpiece.objects.create(
            owner=self.test_user,
            title='test title',
            )

        self.test_artpiece.hashtags.set([hashtag1, hashtag2])

    def test_can_retrieve_artpiece(self):
        """
        Tests that a user can retrieve a specific artpiece by its ID through a
        GET request to the API endpoint /artpieces/{id}/.

        Asserts the API returns a 200 status code.
        """
        response = self.client.get(f'/artpieces/{self.test_artpiece.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_can_update_title_and_description(self):
        """
        Tests that a logged in user can update the title and description of an
        artpiece.

        Asserts the title and description are updated with a PUT request to
        API endpoint /artpieces/{id}/, resulting in a 200 response status code.
        """
        self.client.login(
            email='test@test.com',
            password='testpass')

        data = {
            'title': 'a new title',
            'description': 'a new description',
        }
        response = self.client.put(
            f'/artpieces/{self.test_artpiece.id}/',
            data,
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.test_artpiece.refresh_from_db()
        self.assertEqual(self.test_artpiece.title, "a new title")
        self.assertEqual(self.test_artpiece.description, "a new description")

    def test_can_update_hashtags(self):
        """
        Tests that a logged in user can update the hashtags associated with an
        artpiece.

        Asserts the hashtags are updated with a PUT request to API endpoint
        /artpieces/{id}/, resulting in a 200 response status code. Verifies
        that orphaned hashtags are deleted.
        """
        self.client.login(
            email='test@test.com',
            password='testpass')

        data = {
            'title': 'a new title',
            'hashtags': '#hashtag2 #hashtag3',
        }
        response = self.client.put(
            f'/artpieces/{self.test_artpiece.id}/',
            data,
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.test_artpiece.refresh_from_db()
        updated_hashtags = set(
            self.test_artpiece.hashtags.values_list('name', flat=True))
        expected_hashtags = {'hashtag2', 'hashtag3'}
        self.assertEqual(updated_hashtags, expected_hashtags)
        self.assertFalse(Hashtag.objects.filter(name='hashtag1').exists())

    def test_can_delete_artpiece(self):
        """
        Tests that a logged in user can delete an artpiece.

        Asserts the artpiece is deleted with a DELETE request to API endpoint
        /artpieces/{id}/, resulting in a 204 response status code. Verifies
        that orphaned hashtags are deleted.
        """
        self.client.login(
            email='test@test.com',
            password='testpass')

        response = self.client.delete(
            f'/artpieces/{self.test_artpiece.id}/')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(self.test_artpiece.DoesNotExist)
        self.assertEqual(Hashtag.objects.count(), 0)
