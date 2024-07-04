from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import CustomUser
from .models import Enquiry, Artpiece


class EnquiryListTests(APITestCase):
    """
    Test suite for the EnquiryList view.

    Includes setup for creating test users and artpieces, and tests for:
    - Listing enquiries related to the authenticated user.
    - Creating a new enquiry associated with the authenticated user.
    """

    def setUp(self):
        """ Sets up two test users and one test artpiece. """
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


class EnquiryDetailTests(APITestCase):
    """
    Test suite for the EnquiryDetail view.

    Includes setup for creating test users, artpieces, and an enquiry, and
    tests for:
    - Retrieving an enquiry and updating the 'checked' status.
    - Updating an enquiry's response_message and status.
    - Soft deleting an enquiry by nullifying the buyer or artpiece fields.
    """

    def setUp(self):
        """
        Sets up two test users, one test artpiece,
        and one test ennquiry.
        """
        self.user = CustomUser.objects.create_user(
            email='user1@test.com', password='pass'
        )
        self.artist = CustomUser.objects.create_user(
            email='artist1@test.com', password='pass'
        )
        self.artpiece = Artpiece.objects.create(
            title='Art 1', owner=self.artist, for_sale=1)

        self.enquiry = Enquiry.objects.create(
            buyer=self.user,
            artpiece=self.artpiece,
            initial_message='enquiry message'
        )

    def test_retrieve_enquiry(self):
        """
        Test a user can retrieve an enquiry, given they are either the buyer or
        the artpiece owner.
        """
        self.client.login(email='user1@test.com', password='pass')
        url = reverse('enquiry-detail', args=[self.enquiry.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.enquiry.id)

    def test_update_enquiry(self):
        """
        Test that the artpiece owner/artist can update the enquiry status when
        the status is 0 ('pending').
        """
        self.client.login(email='artist1@test.com', password='pass')
        url = reverse('enquiry-detail', args=[self.enquiry.id])
        data = {
            'response_message': 'enquiry response',
            'status': 1,
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.enquiry.refresh_from_db()
        self.assertEqual(self.enquiry.response_message, 'enquiry response')
        self.assertEqual(self.enquiry.status, 1)

    def test_delete_enquiry_by_buyer(self):
        """
        Test that the buyer can soft delete the enquiry by setting the buyer
        field to null.
        """
        self.client.login(email='user1@test.com', password='pass')
        url = reverse('enquiry-detail', args=[self.enquiry.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.enquiry.refresh_from_db()
        self.assertIsNone(self.enquiry.buyer)
        self.assertIsNotNone(self.enquiry.artpiece)

    def test_delete_enquiry_by_artist(self):
        """
        Test that the artist can soft delete the enquiry by setting the
        artpiece field to null.
        """
        self.client.login(email='artist1@test.com', password='pass')
        url = reverse('enquiry-detail', args=[self.enquiry.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.enquiry.refresh_from_db()
        self.assertIsNone(self.enquiry.artpiece)
        self.assertIsNotNone(self.enquiry.buyer)
