from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from users.models import CustomUser
from artpieces.models import Artpiece


class Enquiry(models.Model):
    """
    Represents an enquiry made by a user regarding an art piece.

    Attributes:
        - buyer (ForeignKey): The user who made the enquiry. Linked to the User
            model.
        - artpiece (ForeignKey): The artpiece the enquiry is about. Linked to
            the Artpiece model.
        - initial_message (CharField): The initial message content of the
            enquiry. Must be provided and has a max length of 255 characters.
        - response_message (CharField): The response message from the artist.
            Optional, with a max length of 255 characters.
        - created_on (DateTimeField): The date and time when the enquiry was
            created. Automatically set on creation.
        - updated_on (DateTimeField): The date and time when the enquiry was
            last updated. Automatically updated.
        - status (IntegerField): The status of the enquiry, chosen from
            predefined choices. Default is Pending (0).
        - buyer_has_checked (BooleanField): Indicates whether the buyer has
            checked the enquiry. Default is True.
        - artist_has_checked (BooleanField): Indicates whether the artist has
            checked the enquiry. Default is False.

    Choices:
        STATUS_CHOICES: Defines the status of the enquiry.
            0 - Pending
            1 - Accepted
            2 - Declined

    Meta:
        ordering (list): Specifies the default ordering of the Enquiry objects.
        Ordered by creation date in descending order.

    Methods:
        __str__: Returns a string representation of the Enquiry instance,
            including the art piece and the buyer.
    """
    STATUS_CHOICES = [
        (0, 'Pending'),
        (1, 'Accepted'),
        (2, 'Declined')
    ]
    buyer = models.ForeignKey(
        CustomUser,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
        )
    artpiece = models.ForeignKey(
        Artpiece,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
        )
    initial_message = models.CharField(
        null=False,
        max_length=255,
        blank=False
        )
    response_message = models.CharField(
        null=True,
        max_length=255,
        blank=True
        )
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=0)
    buyer_has_checked = models.BooleanField(default=True)
    artist_has_checked = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_on']

    def __str__(self):
        return f'Enquiry re {self.artpiece} by {self.buyer}'


@receiver(pre_save, sender=Enquiry)
def delete_enquiry_if_null(sender, instance, **kwargs):
    """
    Deletes the Enquiry instance if both artpiece and buyer are null.
    """
    if instance.artpiece_id is None and instance.buyer_id is None:
        instance.delete()
