from rest_framework import serializers
from .models import Enquiry
from artpieces.models import Artpiece
from users.models import CustomUser


class EnquirySerializer(serializers.ModelSerializer):
    """
    This serializer handles the serialization and deserialization of
    Enquiry objects, including validation of fields.
    """
    buyer = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), allow_null=True)
    is_buyer = serializers.SerializerMethodField()
    buyer_profile_id = serializers.SerializerMethodField()
    buyer_profile_image = serializers.SerializerMethodField()
    artpiece = serializers.PrimaryKeyRelatedField(queryset=Artpiece.objects.all(), allow_null=True)
    artist = serializers.SerializerMethodField()
    is_artist = serializers.SerializerMethodField()
    artist_profile_id = serializers.SerializerMethodField()
    artist_profile_image = serializers.SerializerMethodField()

    def get_is_buyer(self, obj):
        """
        Returns True if the requesting user is the owner of
        the collection.
        """
        request = self.context['request']
        return request.user == obj.buyer

    def get_buyer_profile_id(self, obj):
        if obj.buyer is None:
            return None
        return obj.buyer.profile.id

    def get_buyer_profile_image(self, obj):
        if obj.buyer is None:
            return None
        return obj.buyer.profile.profile_image.url

    def get_is_artist(self, obj):
        """
        Returns True if the requesting user is the owner of
        the collection.
        """
        request = self.context['request']
        return obj.artpiece is not None and request.user == obj.artpiece.owner

    def get_artist(self, obj):
        if obj.artpiece is None:
            return None
        return obj.artpiece.owner.profile.name

    def get_artist_profile_id(self, obj):
        if obj.artpiece is None:
            return None
        return obj.artpiece.owner.profile.id

    def get_artist_profile_image(self, obj):
        if obj.artpiece is None:
            return None
        return obj.artpiece.owner.profile.profile_image.url

    def validate(self, data):
        """
        Validate an artpiece not belonging to the requesting user is
        provided on creation.
        """
        request = self.context['request']

        if self.instance is None:
            if request.user == data.get('artpiece').owner:
                raise serializers.ValidationError(
                    "You cannot enquire about your own artpiece.")
            if data.get('artpiece') is None:
                raise serializers.ValidationError(
                    "Artpiece field is required."
                    )
        return data

    def validate_initial_message(self, value):
        """ Validates that the message is 255 characters or less. """
        if len(value) > 255:
            raise serializers.ValidationError(
                'The message must be 255 characters or less.'
                )
        return value

    class Meta:
        model = Enquiry
        fields = [
            'id', 'buyer', 'is_buyer', 'buyer_profile_id',
            'buyer_profile_image', 'artpiece', 'artist', 'is_artist',
            'artist_profile_id', 'artist_profile_image', 'initial_message',
            'response_message', 'created_on', 'updated_on', 'status',
            'buyer_has_checked', 'artist_has_checked',
        ]


class EnquiryResponseSerializer(serializers.ModelSerializer):

    def validate_response_message(self, value):
        """ Validates that the message is 255 characters or less. """
        if len(value) > 255:
            raise serializers.ValidationError(
                'The message must be 255 characters or less.'
                )
        return value

    def validate_status(self, value):
        # Convert status to an integer if it's not already
        if isinstance(value, str):
            try:
                value = int(value)
            except ValueError:
                raise serializers.ValidationError(
                    'Incorrect format. Expected integer value.')
        if value != 1 and value != 2:
            raise serializers.ValidationError(
                'Please either accept or decline the enquiry.'
            )
        return value

    def validate(self, data):
        """
        Ensure a status value is included.
        """
        if 'status' not in data:
            raise serializers.ValidationError(
                "The only acceptable actions are Accept/Decline.")
        return data

    class Meta:
        model = Enquiry
        fields = ['response_message', 'status']
