import re
from rest_framework import serializers
from .models import Artpiece, Hashtag
import cloudinary.uploader


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ['id', 'name']


class ArtpieceSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    image_url = serializers.SerializerMethodField()
    image = serializers.ImageField(write_only=True, required=False)
    hashtags = serializers.CharField(write_only=True, required=False)

    def validate_image(self, data):
        if not data:  # No image provided
            if not self.instance:  # Creating new instance
                raise serializers.ValidationError('Image is required.')
            return data  # If updating artpiece, keep existing image

        # Validate size and dimensions of new images
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
        if not value:
            return value
        pattern = r'#[a-zA-Z0-9_]+'
        hashtags = re.findall(pattern, value)
        if not hashtags:
            raise serializers.ValidationError('Hashtags must be in the format "#hashtag" and separated by spaces.')
        return ' '.join(hashtags)

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
        hashtags_str = validated_data.pop('hashtags', '')
        hashtags_list = self._parse_hashtags(hashtags_str)
        image = validated_data.pop('image', None)
        if image:
            upload_data = cloudinary.uploader.upload(image)
            instance.image = upload_data['url']
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.art_medium = validated_data.get('art_medium', instance.art_medium)
        instance.for_sale = validated_data.get('for_sale', instance.for_sale)
        instance.art_collection_id = validated_data.get('art_collection_id', instance.art_collection_id)
        instance.save()
        self._create_or_update_hashtags(instance, hashtags_list)
        return instance

    def _create_or_update_hashtags(self, artpiece, hashtags_list):
        artpiece.hashtags.clear()
        for tag_name in hashtags_list:
            hashtag, created = Hashtag.objects.get_or_create(name=tag_name)
            artpiece.hashtags.add(hashtag)

    def _parse_hashtags(self, hashtags_str):
        pattern = r'#[a-zA-Z0-9_]+'
        return [tag[1:] for tag in re.findall(pattern, hashtags_str)]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['hashtags'] = ' '.join([f'#{tag.name}' for tag in instance.hashtags.all()])
        return representation

    class Meta:
        model = Artpiece
        fields = [
            'id', 'owner', 'is_owner', 'profile_id',
            'profile_image', 'created_on', 'updated_on',
            'title', 'description', 'image', 'image_url', 'art_medium',
            'for_sale', 'art_collection_id', 'hashtags',
        ]
