from rest_framework import serializers
from .models import Profile
import cloudinary.uploader


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the Profile model.

    Attributes:
        owner (ReadOnlyField): The profile owner's object id
        is_owner (SerializerMethodField): Indicates if the request user is the
        profile owner.
        profile_image_url (SerializerMethodField): URL of the profile image.
        profile_image (ImageField): Image data for profile image, write-only.
        name (CharField): Name of the profile, optional and allow blank.
        artpiece_count (ReadOnlyField): Number of art pieces associated with
        the profile.
        collection_count (ReadOnlyField): Number of collections associated with
        the profile.
        for_sale_count (ReadOnlyField): Number of art pieces marked for sale
        associated with the profile.

    Methods:
        validate_name(value): Validates uniqueness and length constraints for
        the name field.
        validate_description(value): Validates length constraints for the
        description field.
        validate_location(value): Validates length constraints for the location
        field.
        validate_profile_image(data): Validates size and dimensions of the
        profile image.
        get_profile_image_url(obj): Retrieves the URL of the profile image.
        get_is_owner(obj): Determines if the request user is the owner of the
        profile.
        create: Handles creation of Profile instances
        update: Handles update of existing profile instances
    """
    owner = serializers.ReadOnlyField(source='owner.id')
    is_owner = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()
    profile_image = serializers.ImageField(write_only=True, required=False)
    name = serializers.CharField(required=False, allow_blank=True)
    artpiece_count = serializers.ReadOnlyField()
    collection_count = serializers.ReadOnlyField()
    for_sale_count = serializers.ReadOnlyField()

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

    def create(self, validated_data):
        """
        Handles creation of a new Profile instance.
        """
        profile_image = validated_data.pop('profile_image', None)

        if profile_image:
            upload_data = cloudinary.uploader.upload(profile_image, secure=True)
            validated_data['profile_image'] = upload_data['secure_url']

        profile = Profile.objects.create(**validated_data)
        return profile

    def update(self, instance, validated_data):
        """
        Handles updating an existing Profile instance.
        """
        profile_image = validated_data.pop('profile_image', None)

        if profile_image:
            upload_data = cloudinary.uploader.upload(profile_image, secure=True)
            instance.profile_image = upload_data['secure_url']

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    class Meta:
        model = Profile
        fields = [
            'id', 'owner', 'is_owner', 'created_at', 'updated_at', 'name',
            'description', 'profile_image', 'profile_image_url', 'location',
            'artpiece_count', 'collection_count', 'for_sale_count'
        ]
