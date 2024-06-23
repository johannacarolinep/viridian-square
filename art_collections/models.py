from django.db import models
from django.core.validators import MaxLengthValidator
from users.models import CustomUser


class ArtCollection(models.Model):
    """
    Represents a collection of artworks owned by a user.

    Attributes:
        - owner (ForeignKey): The user who owns this art collection. Linked to
        the User model.
        - created_on (DateTimeField): The date and time when the art collection
        was created. Automatically set on creation.
        - updated_on (DateTimeField): The date and time when the art collection
        was last updated. Automatically updated.
        - title (CharField): The title of the art collection. Must be unique,
        cannot be null or blank, and has a max length of 70 characters.
        - description (TextField): A brief description of the art collection.
        Optional, with a max length of 180 characters.

    Meta:
        ordering (list): Specifies the default ordering of the ArtCollection
        objects. Ordered by creation date in descending order.

    Methods:
        __str__: Returns a string representation of the ArtCollection instance,
        including its ID and title.
    """
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    title = models.CharField(
        null=False,
        max_length=70,
        blank=False,
        unique=True)
    description = models.TextField(
        blank=True,
        validators=[MaxLengthValidator(180)]
        )

    class Meta:
        ordering = ['-created_on']

    def __str__(self):
        return f'{self.id} {self.title} by {self.owner}'
