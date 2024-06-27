from rest_framework import serializers
from .models import ArtCollection
from artpieces.models import Artpiece
from artpieces.serializers import ArtpieceSerializer


class ArtCollectionSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    artpieces = serializers.PrimaryKeyRelatedField(many=True, read_only=True, source='collection_artpieces')

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    def validate_title(self, value):
        if len(value) > 70:
            raise serializers.ValidationError('The title must be 70 characters or less.')
        return value

    def validate_description(self, value):
        if len(value) > 180:
            raise serializers.ValidationError('The description must be 180 characters or less.')
        return value

    class Meta:
        model = ArtCollection
        fields = [
            'id', 'owner', 'is_owner', 'profile_id', 'profile_image', 'created_on',
            'updated_on', 'title', 'description', 'artpieces',
        ]
