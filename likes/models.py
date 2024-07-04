from datetime import timedelta
from django.utils import timezone
from django.db import models
from django.db.models import Count
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
        unique_together: Constraint to avoid duplicate likes

    Methods:
        __str__: Returns a string representation of the Like instance,
        including the owner and the liked art piece.
        top_trending_artpieces: classmethod, returns a queryset with
        the most liked artpieces in the last 30 days
    """
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    liked_piece = models.ForeignKey(
        Artpiece, on_delete=models.CASCADE, related_name='likes')
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_on']
        unique_together = ['owner', 'liked_piece']

    def __str__(self):
        return f'{self.owner} liked {self.liked_piece}'

    @classmethod
    def top_trending_artpieces(cls):
        """
        Returns a queryset of artpiece id's that have reveiced the highest
        number of likes in the last 30 days, and the number of likes they
        received.
        """
        last_30_days = timezone.now() - timedelta(days=30)
        return (cls.objects.filter(created_on__gte=last_30_days)
                .values('liked_piece')
                .annotate(recent_likes=Count('liked_piece'))
                .order_by('-recent_likes')[:4])
