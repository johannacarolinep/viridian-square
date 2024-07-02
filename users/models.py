from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin)
from django.db import models
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    """
    Custom manager for the CustomUser model.

    Methods:
    - create_user(email, password=None, **extra_fields): Creates and returns a
        new user with the provided email and password.
    - create_superuser(email, password=None, **extra_fields): Creates and
    returns a new superuser with the provided email and password.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Creates and returns a new user with the provided email and password.
        Raises a ValueError if the email is not set.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and returns a new superuser with the provided email and
        password. Raises a ValueError if is_staff or is_superuser are not True.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model where email is the unique identifier.

    Attributes:
    - USERNAME_FIELD (str): The field used for authentication, 'email'.
    - REQUIRED_FIELDS (list): List of required fields besides the
    USERNAME_FIELD, am empty list.
    - objects (CustomUserManager): The manager for the CustomUser model.

    Methods:
    __str__(): Returns the email of the user.
    update_email(new_email): Updates the user's email address and saves.
    """
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def str(self):
        return self.email

    def update_email(self, new_email):
        """
        Update the user's email address.
        """
        self.email = new_email
        self.save(update_fields=['email'])
