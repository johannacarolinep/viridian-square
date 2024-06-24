from rest_framework import serializers
from .models import Artpiece
import cloudinary.uploader


class ArtpieceSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    image_url = serializers.SerializerMethodField()
    image = serializers.ImageField(write_only=True, required=True)

    def validate_image(self, data):
        request = self.context['request']
        image = request.FILES.get('image')

        if image and image.size > 2 * 1024 * 1024:
            raise serializers.ValidationError('Image size larger than 2MB!')
        if image and image.image.height > 2000:
            raise serializers.ValidationError(
                'Image height larger than 2000px!'
            )
        if image and image.image.width > 2000:
            raise serializers.ValidationError(
                'Image width larger than 2000px!'
            )
        return data

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    def get_image_url(self, obj):
        if isinstance(obj.image, str):
            return obj.image
        return obj.image.url

    def create(self, validated_data):
        image = validated_data.pop('image')
        upload_data = cloudinary.uploader.upload(image)
        validated_data['image'] = upload_data['url']
        return super().create(validated_data)

    def update(self, instance, validated_data):
        image = validated_data.pop('image', None)
        if image:
            upload_data = cloudinary.uploader.upload(image)
            instance.image = upload_data['url']
        return super().update(instance, validated_data)

    class Meta:
        model = Artpiece
        fields = [
            'id', 'owner', 'is_owner', 'profile_id',
            'profile_image', 'created_on', 'updated_on',
            'title', 'description', 'image', 'image_url', 'art_medium',
            'for_sale', 'art_collection_id', 'hashtags',
        ]
