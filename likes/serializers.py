from django.db import IntegrityError
from rest_framework import serializers
from .models import Like


class LikeSerializer(serializers.ModelSerializer):
    """
    Serializer for the Like model.

    This serializer handles the serialization and deserialization of Like
    instances.
    It catches IntegrityError exceptions to prevent duplicate likes, and
    validated that the user creating the like is not the owner of the artpiece.

    Fields:
        - id: Primary key of the like instance.
        - owner: Read-only field, the id of the like's owner.
        - name: Read-only field, the name of the like's owner.
        - created_on: DateTime field indicating when the like was created.
        - liked_piece: Field representing the liked artpiece (foreign key).

    Methods:
        - validate(self, data): validates the user is not liking their own
        artpiece.
        - create(self, validated_data): ensures no duplicate likes are created.
    """
    owner = serializers.ReadOnlyField(source='owner.id')
    name = serializers.ReadOnlyField(source='owner.profile.name')

    def validate(self, data):
        """
        Ensures a user cannot like their own art piece.
        """
        if data['liked_piece'].owner == self.context['request'].user:
            raise serializers.ValidationError({
                'detail': 'You cannot like your own art piece.'
            })
        return data

    def create(self, validated_data):
        """
        Creates a new Like instance, ensuring no duplicates by catching
        IntegrityError and raising a ValidationError with a custom message.
        """
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({
                'detail': 'possible duplicate'
            })

    class Meta:
        model = Like
        fields = ['id', 'created_on', 'owner', 'name', 'liked_piece']
