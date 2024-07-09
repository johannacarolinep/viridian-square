import re
from rest_framework import serializers
from .models import Artpiece, Hashtag
import cloudinary.uploader


class HashtagSerializer(serializers.ModelSerializer):
    """
    Serializer for the Hashtag model.

    Handles serialization and deserialization of the Hashtag model. It includes
    the following fields:
        - id: The unique identifier of the hashtag.
        - name: The name of the hashtag.
    """
    class Meta:
        model = Hashtag
        fields = ['id', 'name']


class ArtpieceSerializer(serializers.ModelSerializer):
    """
    Handles serialization and deserialization of Artpiece instances, including
    validation of image and hashtag fields. Provides additional fields such as
    owner email, profile ID, profile image, and is_owner field.

    Fields:
        - id: Unique identifier of the art piece (PK).
        - owner: ID of the owner (read-only).
        - is_owner: Boolean indicating if the request user is the owner.
        - profile_id: ID of the owner's profile (read-only).
        - profile_name: The name as specified in the owner's profile.
        - profile_image: URL of the owner's profile image (read-only).
        - created_on: Time and date when the art piece was created (read-only).
        - updated_on: Time and date when the art piece was last updated
        (read-only).
        - title: Title of the art piece.
        - description: Description of the art piece.
        - image: Image of the art piece (write-only).
        - image_url: URL of the image.
        - art_medium: Medium used for the art piece.
        - for_sale: Sale status of the art piece.
        - art_collection: Collection to which the art piece belongs.
        - hashtags: Hashtags associated with the art piece (write-only).
        - likes_count: Number of likes on the art piece (read-only).

    Methods:
        - validate_image: Validates the image field.
        - validate_hashtags: Validates the hashtags field.
        - validate_art_collection: Validated the collection field, ensuring
        the user is the owner of the added collection.
        - get_is_owner: Returns whether the request user is the owner of the
            art piece.
        - get_image_url: Returns the URL of the art piece's image.
        - create: Handles creation of a new Artpiece instance.
        - update: Handles updating an existing Artpiece instance.
        - _create_or_update_hashtags: Adds or updates hashtags associated with
            an art piece.
        - _parse_hashtags: Parses a string of hashtags into a list.
        - to_representation: Customizes the representation of the Artpiece
        instance to include hashtags as a string.
    """
    owner = serializers.ReadOnlyField(source='owner.id')
    is_owner = serializers.SerializerMethodField()
    profile_name = serializers.ReadOnlyField(source='owner.profile.name')
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    image_url = serializers.SerializerMethodField()
    image = serializers.ImageField(write_only=True, required=False)
    hashtags = serializers.CharField(write_only=True, required=False)
    likes_count = serializers.ReadOnlyField()

    def validate_image(self, data):
        """
        Validates the image field - ensures the image is provided when creating
        a new instance. Checks that the size does not exceed 2MB and dimensions
        are within 2000x2000px.

        Args:
            data: The image data to be validated.

        Returns:
            The validated image data.

        Raises:
            serializers.ValidationError: If the image is not provided for a new
            instance, or if the image size or dimensions exceed the specified
            limits.
        """
        if not data:  # No image provided
            if not self.instance:  # Creating new instance
                raise serializers.ValidationError('Image is required.')
            return data  # If updating artpiece, keep existing image

        if data.size > 2 * 1024 * 1024:
            raise serializers.ValidationError('Image size larger than 2MB!')
        if data.image.height > 2000:
            raise serializers.ValidationError(
                'Image height larger than 2000px!')
        if data.image.width > 2000:
            raise serializers.ValidationError(
                'Image width larger than 2000px!')

        return data

    def validate_hashtags(self, value):
        """
        Validates the hashtags field. ensuring hashtags are in the correct
        format (e.g. "#hashtag") and separated by spaces.

        Args:
            value: The hashtags string to be validated.

        Returns:
            The validated hashtags string.

        Raises:
            serializers.ValidationError: If the hashtags are not in the correct
            format.
        """
        if not value:
            return value
        pattern = r'#[a-zA-Z0-9_]+'
        hashtags = re.findall(pattern, value)
        if not hashtags:
            raise serializers.ValidationError(
                'Hashtags must be in the format "#hashtag"'
                + 'and separated by spaces.')
        return ' '.join(hashtags)

    def validate_art_collection(self, value):
        """
        Validate that the user owns the specified art collection.
        """
        user = self.context['request'].user
        if value and not value.owner == user:
            raise serializers.ValidationError(
                "You can only add artpieces to your own collections.")
        return value

    def get_is_owner(self, obj):
        """
        Returns whether the request user is the owner of the art piece.

        Args:
            obj: The Artpiece instance.

        Returns:
            bool: True if the request user is the owner, False otherwise.
        """
        request = self.context['request']
        return request.user == obj.owner

    def get_image_url(self, obj):
        """
        Returns the URL of the art piece's image.

        Args:
            obj: The Artpiece instance.

        Returns:
            str: The URL of the image.
        """
        if isinstance(obj.image, str):
            return obj.image
        return obj.image.url

    def create(self, validated_data):
        """
        Handles creation of a new Artpiece instance. Processes the image upload
        and associates hashtags with the new art piece.

        Args:
            validated_data: The validated data for the new Artpiece instance.

        Returns:
            Artpiece: The newly created Artpiece instance.

        Raises:
            serializers.ValidationError: If the image is not provided.
        """
        hashtags_str = validated_data.pop('hashtags', '')
        hashtags_list = self._parse_hashtags(hashtags_str)
        image = validated_data.pop('image', None)

        if not image:
            raise serializers.ValidationError(
                {'image': 'This field is required.'})

        upload_data = cloudinary.uploader.upload(image)
        validated_data['image'] = upload_data['url']
        artpiece = Artpiece.objects.create(**validated_data)
        self._create_or_update_hashtags(artpiece, hashtags_list)
        return artpiece

    def update(self, instance, validated_data):
        """
        Handles updating an existing Artpiece instance. Processes the image
        upload and updates hashtags associated with the art piece.

        Args:
            instance: The existing Artpiece instance to be updated.
            validated_data: The validated data for updating the instance.

        Returns:
            Artpiece: The updated Artpiece instance.
        """
        hashtags_str = validated_data.pop('hashtags', '')
        hashtags_list = self._parse_hashtags(hashtags_str)
        image = validated_data.pop('image', None)
        if image:
            upload_data = cloudinary.uploader.upload(image)
            instance.image = upload_data['url']
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get(
            'description', instance.description
            )
        instance.art_medium = validated_data.get(
            'art_medium', instance.art_medium
            )
        instance.for_sale = validated_data.get('for_sale', instance.for_sale)
        instance.art_collection_id = validated_data.get(
            'art_collection_id', instance.art_collection_id
            )
        instance.save()
        self._create_or_update_hashtags(instance, hashtags_list)
        return instance

    def _create_or_update_hashtags(self, artpiece, hashtags_list):
        """
        Adds or updates hashtags associated with an art piece.

        Args:
            artpiece: The Artpiece instance.
            hashtags_list: The list of hashtags to associate with the art piece
        """
        artpiece.hashtags.clear()
        for tag_name in hashtags_list:
            hashtag, created = Hashtag.objects.get_or_create(name=tag_name)
            artpiece.hashtags.add(hashtag)

    def _parse_hashtags(self, hashtags_str):
        """
        Parses a string of hashtags into a list.

        Args:
            hashtags_str: The string of hashtags to be parsed.

        Returns:
            list: A list of hashtags without the leading '#'.
        """
        pattern = r'#[a-zA-Z0-9_]+'
        return [tag[1:] for tag in re.findall(pattern, hashtags_str)]

    def to_representation(self, instance):
        """
        Customizes the representation of the Artpiece instance. Includes
        hashtags as a string in the representation.

        Args:
            instance: The Artpiece instance to be represented.

        Returns:
            dict: The customized representation of the Artpiece instance.
        """
        representation = super().to_representation(instance)
        representation['hashtags'] = ' '.join(
            [f'#{tag.name}' for tag in instance.hashtags.all()])
        return representation

    class Meta:
        model = Artpiece
        fields = [
            'id', 'owner', 'is_owner', 'profile_id', 'profile_name',
            'profile_image', 'created_on', 'updated_on',
            'title', 'description', 'image', 'image_url', 'art_medium',
            'for_sale', 'art_collection', 'hashtags', 'likes_count',
        ]
