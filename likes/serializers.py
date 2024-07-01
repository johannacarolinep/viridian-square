from django.db import IntegrityError
from rest_framework import serializers
from .models import Like


class LikeSerializer(serializers.ModelSerializer):
    """
    Serializer for the Like model.

    This serializer handles the serialization and deserialization of Like
    instances.
    It catches IntegrityError exceptions to prevent duplicate likes.

    Fields:
        - id: Primary key of the like instance.
        - owner: Read-only field displaying the email of the like's owner.
        - created_on: DateTime field indicating when the like was created.
        - liked_piece: Field representing the liked artpiece (foreign key).

    Methods:
        - create(self, validated_data): ensures no duplicate likes are created.
    """
    owner = serializers.ReadOnlyField(source='owner.email')

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
        fields = ['id', 'created_on', 'owner', 'liked_piece']
