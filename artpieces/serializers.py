from rest_framework import serializers
from .models import Artpiece


class ArtpieceSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')

    def validate_image(self, value):
        if value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError('Image size larger than 2MB!')
        if value.image.height > 2000:
            raise serializers.ValidationError(
                'Image height larger than 2000px!'
            )
        if value.image.width > 2000:
            raise serializers.ValidationError(
                'Image width larger than 2000px!'
            )
        return value

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    class Meta:
        model = Artpiece
        fields = [
            'id', 'owner', 'is_owner', 'profile_id',
            'profile_image', 'created_on', 'updated_on',
            'title', 'description', 'image', 'art_medium',
            'for_sale', 'art_collection_id', 'hashtags',
        ]
