# Generated by Django 4.2.13 on 2024-07-21 22:14

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0004_alter_profile_profile_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='profile_image',
            field=cloudinary.models.CloudinaryField(default='default_t6trzy', max_length=255, verbose_name='image'),
        ),
    ]
