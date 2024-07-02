from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')
    is_owner = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()
    profile_image = serializers.ImageField(write_only=True, required=False)
    name = serializers.CharField(required=False, allow_blank=True)

    def validate_name(self, value):
        """
        Validates the name field to ensure it is unique and not empty.
        """
        if not value:
            raise serializers.ValidationError(('Name field cannot be empty.'))
        if len(value) > 30:
            raise serializers.ValidationError(
                ('Profile name cannot be longer than 30 characters.'))
        if self.instance.name == value:
            return value
        if Profile.objects.filter(name=value).exists():
            raise serializers.ValidationError(('This name is already taken.'))
        return value

    def validate_description(self, value):
        """
        Validates the description field to ensure it meets length requirements.
        """
        if len(value) > 180:
            raise serializers.ValidationError(
                ('Description cannot be longer than 180 characters.'))
        return value

    def validate_location(self, value):
        """
        Validates the location field to ensure it meets length requirements.
        """
        if len(value) > 50:
            raise serializers.ValidationError(
                ('Location cannot be longer than 50 characters.'))
        return value

    def validate_profile_image(self, data):
        """
        Validates the image field - Checks that the size does not exceed 2MB
        and dimensions are within 2000x2000px.

        Args:
            data: The image data to be validated.

        Returns:
            The validated image data.

        Raises:
            serializers.ValidationError: If the image size or dimensions exceed
            the specified limits.
        """
        if not data:  # No image provided
            return data  # Keep existing image

        if data.size > 2 * 1024 * 1024:
            raise serializers.ValidationError('Image size larger than 2MB!')
        if data.image.height > 2000:
            raise serializers.ValidationError(
                'Image height larger than 2000px!')
        if data.image.width > 2000:
            raise serializers.ValidationError(
                'Image width larger than 2000px!')

        return data

    def get_profile_image_url(self, obj):
        """
        Returns the URL of the profile image.

        Args:
            obj: The Profile instance.

        Returns:
            str: The URL of the image.
        """
        if isinstance(obj.profile_image, str):
            return obj.profile_image
        return obj.profile_image.url

    def get_is_owner(self, obj):
        """
        Returns whether the request user is the owner of the profile.

        Args:
            obj: The Profile instance.

        Returns:
            bool: True if the request user is the owner, False otherwise.
        """
        request = self.context['request']
        return request.user == obj.owner

    class Meta:
        model = Profile
        fields = [
            'id', 'owner', 'is_owner', 'created_at', 'updated_at', 'name',
            'description', 'profile_image', 'profile_image_url', 'location',
        ]
