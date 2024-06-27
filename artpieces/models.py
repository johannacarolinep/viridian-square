from django.db import models
from django.core.validators import MaxLengthValidator
from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from users.models import CustomUser
from cloudinary.models import CloudinaryField
from art_collections.models import ArtCollection


class Hashtag(models.Model):
    """
    Represents a hashtag that can be associated with multiple art pieces.

    Attributes:
        name (str): The name of the hashtag. It must be unique and non-blank.

    Meta:
        ordering (list): Specifies that hashtag instances should be ordered by
        their name in ascending order.

    Methods:
        __str__(): Returns the name of the hashtag.
    """
    name = models.CharField(
        max_length=30,
        unique=True,
        blank=False
        )

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


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
        - art_collection (ForeignKey): Optional foreign key linking to a
        ArtCollection. If the collection is deleted, this field is set to NULL.
        - hashtags (ManyToManyField): Optional many-to-many relationship with
        Hashtag. An art piece can have multiple hashtags, and a hashtag can be
        associated with multiple art pieces.

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
        ordering (list): Specifies the default ordering of the Artpiece
        objects. Ordered by creation date in descending order.

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
        ('noselection', 'No medium selected'),
        ('oil', 'Oil'),
        ('watercolour', 'Watercolour'),
        ('gouache', 'Gouache'),
        ('acrylic', 'Acrylic'),
        ('charcoal', 'Charcoal'),
        ('chalk', 'Chalk'),
        ('photography', 'Photography'),
        ('mixedmedia', 'Mixed media'),
        ('other', 'Other')
    ]
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
    image = CloudinaryField(
        'image',
        blank=False,
        null=False)
    art_medium = models.CharField(max_length=30, choices=ART_MEDIUM_CHOICES, default=0)
    for_sale = models.IntegerField(choices=FOR_SALE_CHOICES, default=0)
    art_collection = models.ForeignKey(
        ArtCollection,
        related_name='collection_artpieces',
        on_delete=models.SET_NULL,
        null=True,
        blank=True)
    hashtags = models.ManyToManyField(
        Hashtag,
        related_name='hashed_artpieces',
        blank=True)

    class Meta:
        ordering = ['-created_on']

    def __str__(self):
        return f'{self.id} {self.title}'

    def add_to_collection(self, collection_id):
        # Add the collection ID to the artpiece if not already added
        if collection_id != self.art_collection:
            self.art_collection = collection_id
            self.save()

    def remove_from_collection(self):
        # Remove the collection ID from the artpiece
        self.art_collection = None
        self.save()


@receiver(m2m_changed, sender=Artpiece.hashtags.through)
def check_hashtags(sender, instance, action, reverse, pk_set, **kwargs):
    """
    Signal handler delete unused hashtags.

    This function listens to the `m2m_changed` signal for the `hashtags`
    ManyToManyField on the `Artpiece` model. If a hashtag is about to be
    removed from an artpiece, and is not associated with any other artpieces,
    it is deleted from the database.

    Args:
        sender (Model): The model class that sent the signal (Artpiece).
        instance (Artpiece): The instance of the Artpiece being modified.
        action (str): The type of modification being made - "pre_remove" and
        "pre_clear" actions.
        reverse (bool): A flag indicating the direction of the relation.
        pk_set (set): A set of primary key values for the related hashtag
        objects.
        **kwargs: Additional keyword arguments.

    Credit: https://stackoverflow.com/questions/10609699/\
        efficiently-delete-orphaned-m2m-objects-tags-in-django
    """
    if action in ["pre_remove", "pre_clear"]:
        if action == "pre_clear":
            pk_set = set(instance.hashtags.values_list('pk', flat=True))
        for hashtag_id in pk_set:
            hashtag = Hashtag.objects.get(pk=hashtag_id)
            # checks if the hashtag is orphaned and deletes it
            if hashtag.hashed_artpieces.count() == 1:
                hashtag.delete()
