from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):
    """
    Form for creating a new user.

    Inherits from Django's UserCreationForm and uses the CustomUser model.

    Meta:
        model (CustomUser): The model associated with this form.
        fields (tuple): The fields to include in the form: 'email'.
    """
    class Meta(UserCreationForm):
        model = CustomUser
        fields = ('email',)


class CustomUserChangeForm(UserChangeForm):
    """
    Form for updating an existing user.

    Inherits from Django's UserChangeForm and uses the CustomUser model.

    Meta:
        model (CustomUser): The model associated with this form.
        fields (tuple): The fields to include in the form: 'email'.
    """
    class Meta:
        model = CustomUser
        fields = ('email',)
