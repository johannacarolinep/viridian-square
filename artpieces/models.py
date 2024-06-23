from django.db import models
from django.core.validators import MaxLengthValidator
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField


class Artpiece(models.Model):
    """
    Represents an art piece in the platform.

    Attributes:
        - owner (ForeignKey): The user who owns this art piece. Linked to the
        User model.
        - created_on (DateTimeField): The date and time when this art piece was
        created. Automatically set on creation.
        - updated_on (DateTimeField): The date and time when this art piece was
        last updated. Automatically updated.
        - title (CharField): The title of the art piece. Must be unique, cannot
        be null or blank, and has a max length of 70 characters.
        - description (TextField): A brief description of the art piece.
        Optional, with a max length of 180 characters.
        - image (CloudinaryField): The image of the art piece. Mandatory field.
        - art_medium (IntegerField): The medium of the art piece, chosen from
        predefined choices.
        - for_sale (IntegerField): The sale status of the art piece, chosen
        from predefined choices.
        - collection_id (ForeignKey): Optional foreign key linking to a
        Collection. If the collection is deleted, this field is set to NULL.

    Choices:
        FOR_SALE_CHOICES: Defines the sale status of the art piece.
            0 - Not for sale
            1 - For sale
            2 - Sold

        ART_MEDIUM_CHOICES: Defines the medium of the art piece.
            0 - No medium selected
            1 - Oil
            2 - Watercolour
            3 - Gouache
            4 - Acrylic
            5 - Charcoal
            6 - Chalk
            7 - Photography
            8 - Mixed media
            9 - Other

    Meta:
        ordering (list): Specifies the default ordering of the Artpiece objects.
        Ordered by creation date in descending order.

    Methods:
        __str__: Returns a string representation of the Artpiece instance,
        including its ID and title.
    """
    FOR_SALE_CHOICES = [
        (0, 'Not for sale'),
        (1, 'For sale'),
        (2, 'Sold')
    ]
    ART_MEDIUM_CHOICES = [
        (0, 'No medium selected'),
        (1, 'Oil'),
        (2, 'Watercolour'),
        (3, 'Gouache'),
        (4, 'Acrylic'),
        (5, 'Charcoal'),
        (6, 'Chalk'),
        (7, 'Photography'),
        (8, 'Mixed media'),
        (9, 'Other')
    ]
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
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
    image = CloudinaryField(
        'image',
        blank=False,
        null=False)
    art_medium = models.IntegerField(choices=ART_MEDIUM_CHOICES, default=0)
    for_sale = models.IntegerField(choices=FOR_SALE_CHOICES, default=0)
    collection_id = models.ForeignKey(
        Collection,
        related_name='collection',
        on_delete=models.SET_NULL,
        null=True,
        blank=True)

    class Meta:
        ordering = ['-created_on']

    def __str__(self):
        return f'{self.id} {self.title}'
