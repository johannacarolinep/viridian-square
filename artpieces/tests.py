from users.models import CustomUser
from .models import Artpiece, Hashtag
from rest_framework import status
from rest_framework.test import APITestCase
from io import BytesIO
import requests


class ArtpieceListTests(APITestCase):
    def setUp(self):
        CustomUser.objects.create_user(
            email='test@test.com',
            username='testname',
            password='testpass')

    def test_can_list_artpieces(self):
        test_user = CustomUser.objects.get(email='test@test.com')
        Artpiece.objects.create(owner=test_user, title='test title')
        response = self.client.get('/artpieces/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_can_create_artpiece(self):
        self.client.login(
            email='test@test.com',
            password='testpass')

        # Image file is mandatory for creating artpiece
        image = 'https://res.cloudinary.com/deceun0wd/image/upload/v1716381135/default_image_kp6bpt.jpg'

        # Download the image from the URL
        image_response = requests.get(image)
        image_content = image_response.content

        # Create a BytesIO object from the downloaded image content
        image_file = BytesIO(image_content)

        data = {
            'title': 'a test title',
            'image': image_file
        }
        response = self.client.post(
            '/artpieces/',
            data,
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
