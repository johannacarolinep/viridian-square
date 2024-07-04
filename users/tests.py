from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import CustomUser


class CustomUserTests(APITestCase):
    """
    Test suite for the API views EmailUpdateView and DeleteUserView.
    """

    def setUp(self):
        """ Set up a test user and log in the test user. """
        self.user = CustomUser.objects.create_user(
            email='testuser@test.com', password='testpass'
        )
        self.client.login(email='testuser@test.com', password='testpass')

    def test_update_email(self):
        """
        Ensure a logged in user can update their email.
        """
        url = reverse('update-email')
        data = {'email': 'newemail@test.com'}
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, 'newemail@test.com')

    def test_delete_user(self):
        """
        Ensure we can delete a user account.
        """
        url = reverse('delete-user')
        data = {'password': 'testpass'}
        response = self.client.delete(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            CustomUser.objects.filter(email='testuser@test.com').exists())

    def test_delete_user_wrong_password(self):
        """
        Ensure account deletion fails with incorrect password.
        """
        url = reverse('delete-user')
        data = {'password': 'wrongpassword'}
        response = self.client.delete(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(
            CustomUser.objects.filter(email='testuser@test.com').exists())

    def test_signup(self):
        """
        Test an anonymous user can sign up and create a CustomUser.
        """
        url = reverse('rest_register')

        data = {
            'email': 'newuser@test.com',
            'password1': 'YellowSubmarine',
            'password2': 'YellowSubmarine',
        }
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            CustomUser.objects.filter(email='newuser@test.com').exists()
            )
