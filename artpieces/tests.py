from users.models import CustomUser
from .models import Artpiece, Hashtag
from rest_framework import status
from rest_framework.test import APITestCase
from io import BytesIO
import requests
import json


class ArtpieceListTests(APITestCase):
    def setUp(self):
        CustomUser.objects.create_user(
            email='test@test.com',
            username='testname',
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
        Tests that a logged in user can create an artpiece.

        Asserts an artpiece is created given valid input, with a POST request
        to API endpoint '/artpieces/', resulting in a 201 response status code.
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
