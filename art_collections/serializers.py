from rest_framework import serializers
from .models import ArtCollection


class ArtCollectionSerializer(serializers.ModelSerializer):
    """
    This serializer handles the serialization and deserialization of
    ArtCollection objects, including validation of fields.

    Fields:
        - owner: Read-only field displaying the email of the collection's owner
        - is_owner: Custom field indicating if the current user is the owner of
        the collection.
        - profile_id: Read-only field displaying the profile ID of the
        collection's owner.
        - profile_image: Read-only field displaying the URL of the profile
        image of the collection's owner.
        - artpieces: Read-only field displaying the primary keys of the
        artpieces associated to the collection.

    Meta:
        - model: Specifies the model class to serialize (ArtCollection).
        - fields: Lists the fields to be included in the serialized output.
    """
    owner = serializers.ReadOnlyField(source='owner.email')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    artpieces = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=True,
        source='collection_artpieces')

    def get_is_owner(self, obj):
        """
        Returns True if the requesting user is the owner of
        the collection.
        """
        request = self.context['request']
        return request.user == obj.owner

    def validate_title(self, value):
        """ Validates that the title is 70 characters or less. """
        if len(value) > 70:
            raise serializers.ValidationError(
                'The title must be 70 characters or less.'
                )
        return value

    def validate_description(self, value):
        """ Validates that the description is 180 characters or less. """
        if len(value) > 180:
            raise serializers.ValidationError(
                'The description must be 180 characters or less.'
                )
        return value

    class Meta:
        model = ArtCollection
        fields = [
            'id', 'owner', 'is_owner', 'profile_id', 'profile_image',
            'created_on', 'updated_on', 'title', 'description', 'artpieces',
        ]
