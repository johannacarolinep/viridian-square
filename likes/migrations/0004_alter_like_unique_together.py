# Generated by Django 4.2.13 on 2024-07-01 08:52

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('artpieces', '0004_remove_artpiece_art_collection_id_and_more'),
        ('likes', '0003_alter_like_liked_piece'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='like',
            unique_together={('owner', 'liked_piece')},
        ),
    ]
