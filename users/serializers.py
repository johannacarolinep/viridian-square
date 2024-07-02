from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from users.models import CustomUser


class CustomRegisterSerializer(RegisterSerializer):
    """
    Serializer for user registration with email and password.

    Fields:
        email (EmailField): The email address of the user. Required.
    """
    email = serializers.EmailField(required=True)

    def get_cleaned_data(self):
        """
        Retrieves and returns the cleaned data for email,
        password1, and password2.
        """
        return {
            'email': self.validated_data.get('email', ''),
            'password1': self.validated_data.get('password1', ''),
            'password2': self.validated_data.get('password2', ''),
        }

    def save(self, request):
        """
        Creates and returns a new user with the provided email
        and password.
        """
        cleaned_data = self.get_cleaned_data()
        user = CustomUser.objects.create_user(
            email=cleaned_data['email'],
            password=cleaned_data['password1']
        )
        return user


class EmailUpdateSerializer(serializers.Serializer):
    """
    Handles serialization for updating CustomUser's email field.
    """
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """
        Check that the email is not already in use.
        """
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def update(self, instance, validated_data):
        """
        Update the user's email address.
        """
        instance.email = validated_data['email']
        instance.save(update_fields=['email'])
        return instance
