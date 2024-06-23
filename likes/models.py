from django.db import models
from users.models import CustomUser
from artpieces.models import Artpiece


class Like(models.Model):
    """
    Represents a like made by a user on an art piece.

    Attributes:
        - owner (ForeignKey): The user who liked the art piece. Linked to the
            User model.
        - liked_piece (ForeignKey): The art piece that was liked. Linked to the
            Artpiece model.
        - created_on (DateTimeField): The date and time when the like was
            created. Automatically set on creation.

    Meta:
        ordering (list): Specifies the default ordering of the Like objects.
        Ordered by creation date in descending order.

    Methods:
        __str__: Returns a string representation of the Like instance,
        including the owner and the liked art piece.
    """
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    liked_piece = models.ForeignKey(Artpiece, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_on']

    def __str__(self):
        return f'{self.owner} liked {self.liked_piece}'
