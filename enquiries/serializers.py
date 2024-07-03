from rest_framework import serializers
from .models import Enquiry


class EnquirySerializer(serializers.ModelSerializer):
    """
    This serializer handles the serialization and deserialization of
    Enquiry objects, including validation of fields.
    """
    buyer = serializers.ReadOnlyField(source='buyer.email')
    is_buyer = serializers.SerializerMethodField()
    artpiece = serializers.ReadOnlyField(source='artpiece.id')
    is_artist = serializers.SerializerMethodField()
    buyer_profile_id = serializers.ReadOnlyField(source='buyer.profile.id')
    buyer_profile_image = serializers.ReadOnlyField(source='buyer.profile.profile_image.url')
    artist_profile_id = serializers.ReadOnlyField(source='artpiece.owner.profile.id')
    artist_profile_image = serializers.ReadOnlyField(source='artpiece.owner.profle.profile_image.url')

    def get_is_buyer(self, obj):
        """
        Returns True if the requesting user is the owner of
        the collection.
        """
        request = self.context['request']
        return request.user == obj.buyer

    def get_is_artist(self, obj):
        """
        Returns True if the requesting user is the owner of
        the collection.
        """
        request = self.context['request']
        return request.user == obj.artpiece.owner

    def validate_initial_message(self, value):
        """ Validates that the message is 255 characters or less. """
        if len(value) > 255:
            raise serializers.ValidationError(
                'The message must be 255 characters or less.'
                )
        return value

    def validate_response_message(self, value):
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
            'buyer_profile_image', 'artpiece', 'is_artist',
            'artist_profile_id', 'artist_profile_image', 'initial_message',
            'response_message', 'created_on', 'updated_on', 'status',
            'buyer_has_checked', 'artist_has_checked',
        ]
