from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from users.models import CustomUser


class CustomRegisterSerializer(RegisterSerializer):
    email = serializers.EmailField(required=True)

    def get_cleaned_data(self):
        return {
            'email': self.validated_data.get('email', ''),
            'password1': self.validated_data.get('password1', ''),
            'password2': self.validated_data.get('password2', ''),
        }

    def save(self, request):
        cleaned_data = self.get_cleaned_data()
        user = CustomUser.objects.create_user(
            email=cleaned_data['email'],
            password=cleaned_data['password1']
        )
        return user
