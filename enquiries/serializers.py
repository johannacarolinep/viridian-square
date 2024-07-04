from rest_framework import serializers
from .models import Enquiry
from artpieces.models import Artpiece


class EnquirySerializer(serializers.ModelSerializer):
    """
    This serializer handles the serialization and deserialization of
    Enquiry objects, including validation of fields.
    """
    buyer_name = serializers.SerializerMethodField()
    is_buyer = serializers.SerializerMethodField()
    buyer_profile_id = serializers.SerializerMethodField()
    buyer_profile_image = serializers.SerializerMethodField()
    artpiece = serializers.PrimaryKeyRelatedField(
        queryset=Artpiece.objects.all(), allow_null=True)
    artist_name = serializers.SerializerMethodField()
    is_artist = serializers.SerializerMethodField()
    artist_profile_id = serializers.SerializerMethodField()
    artist_profile_image = serializers.SerializerMethodField()

    def get_buyer_name(self, obj):
        """
        Returns the name of the buyer from the profile,
        given the buyer is not null.
        """
        if obj.buyer and obj.buyer.profile:
            return obj.buyer.profile.name
        return None

    def get_is_buyer(self, obj):
        """
        Returns True if the requesting user is the buyer.
        """
        request = self.context['request']
        return request.user == obj.buyer

    def get_buyer_profile_id(self, obj):
        """ Returns the buyer's profile id, if the buyer is not null. """
        if obj.buyer is None:
            return None
        return obj.buyer.profile.id

    def get_buyer_profile_image(self, obj):
        """
        Returns the buyer's profile image url,
        if the buyer field is not null.
        """
        if obj.buyer is None:
            return None
        return obj.buyer.profile.profile_image.url

    def get_is_artist(self, obj):
        """
        Returns True if the requesting user is the owner of
        the artpiece.
        """
        request = self.context['request']
        return obj.artpiece is not None and request.user == obj.artpiece.owner

    def get_artist_name(self, obj):
        """
        Returns the artists name from the profile, if the artpiece field is not
        set to null.
        """
        if obj.artpiece is None:
            return None
        return obj.artpiece.owner.profile.name

    def get_artist_profile_id(self, obj):
        """
        Returns the artist's profile id, if the artpiece field
        is not set to null.
        """
        if obj.artpiece is None:
            return None
        return obj.artpiece.owner.profile.id

    def get_artist_profile_image(self, obj):
        """
        Returns the artist's profile image url, if the artpiece field is not
        set to null.
        """
        if obj.artpiece is None:
            return None
        return obj.artpiece.owner.profile.profile_image.url

    def validate(self, data):
        """
        Validate an artpiece not belonging to the requesting user is
        provided on creation, and that the provided artpiece is for sale.
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
            if data.get('artpiece').for_sale != 1:
                raise serializers.ValidationError(
                    "This artpiece is not for sale."
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
            'id', 'buyer_name', 'is_buyer', 'buyer_profile_id',
            'buyer_profile_image', 'artpiece', 'artist_name', 'is_artist',
            'artist_profile_id', 'artist_profile_image', 'initial_message',
            'response_message', 'created_on', 'updated_on', 'status',
            'buyer_has_checked', 'artist_has_checked',
        ]


class EnquiryResponseSerializer(serializers.ModelSerializer):
    """
    This serializer handles the serialization and deserialization of
    Enquiry responses, including validation of fields.
    """

    def validate_response_message(self, value):
        """ Validates that the message is 255 characters or less. """
        if len(value) > 255:
            raise serializers.ValidationError(
                'The message must be 255 characters or less.'
                )
        return value

    def validate_status(self, value):
        """
        Validates that the enquiry status is either
        1 (accepted) or 2 (declined).
        """
        # Convert status to an integer if it's not already
        if isinstance(value, str):
            try:
                value = int(value)
            except ValueError:
                raise serializers.ValidationError(
                    'Incorrect format. Expected integer value.')
        # Compares value to valid options for updating the status
        if value != 1 and value != 2:
            raise serializers.ValidationError(
                'Please either accept or decline the enquiry.'
            )
        return value

    def validate(self, data):
        """ Ensure a status value is included. """
        if 'status' not in data:
            raise serializers.ValidationError(
                "The only acceptable actions are Accept/Decline.")
        return data

    class Meta:
        model = Enquiry
        fields = ['response_message', 'status']
