import re
import uuid
from django.db import IntegrityError, models
from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import CustomUser
from cloudinary.models import CloudinaryField
from cloudinary.uploader import destroy


class Profile(models.Model):
    """
    Model representing a user profile.

    Attributes:
        owner (OneToOneField): One-to-one relationship with the User model.
        created_at (DateTimeField): The date and time when the profile was
        created.
        updated_at (DateTimeField): The date and time when the profile was last
        updated.
        name (CharField): The the profile name, required and unique, defaults
        to a generated string containing a UUID.
        description (CharField): A short description, can be blank.
        feature_image (CloudinaryField): The profile image, stored using
        Cloudinary.
        location (CharField): The location of the profile owner, can be blank.
    """
    owner = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(
        max_length=30,
        blank=False,
        unique=True
        )
    description = models.CharField(max_length=180, blank=True)
    profile_image = CloudinaryField(
        'image',
        default='default_profile_shke8m',)
    location = models.CharField(max_length=50, blank=True)

    def save(self, *args, **kwargs):
        """
        Overrides the save method to ensure a unique name is generated
        if not provided.
        """
        if not self.name:
            self._generate_unique_name()
        super().save(*args, **kwargs)

    def _generate_unique_name(self):
        """
        Generates a unique name by appending a shortened UUID to 'newuser'
        and validates its uniqueness.
        """
        while True:
            self.name = f'newuser{uuid.uuid4().hex[:8]}'
            try:
                self.full_clean()  # Validate uniqueness
                break
            except IntegrityError:
                continue

    def delete(self, *args, **kwargs):
        """
        Deletes the profile's associated image from Cloudinary before
        deleting the profile instance, unless it's the default image.
        """
        default_image_public_id = 'default_profile_shke8m'
        # Regular expression to extract public_id from image url
        match = re.search(r'/([^/]+)$', self.profile_image.url)
        if match:
            public_id = match.group(1).split('.')[0]
            if public_id != default_image_public_id:
                destroy(public_id)

        # Delete the Profile instance
        super().delete(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.owner.email}'s profile"


@receiver(post_save, sender=CustomUser)
def create_profile(sender, instance, created, **kwargs):
    """
    Signal receiver that creates a Profile instance when a new User is created.

    Args:
        sender (Model): The model class that sent the signal (User).
        instance (User): The instance of the User model that triggered the
        signal.
        created (bool): A boolean indicating whether a new record was created.
        **kwargs: Additional keyword arguments.
    """
    if created:
        Profile.objects.create(owner=instance)


post_save.connect(create_profile, sender=CustomUser)
