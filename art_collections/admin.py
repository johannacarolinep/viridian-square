from django.contrib import admin
from art_collections.models import ArtCollection


@admin.register(ArtCollection)
class ArtCollectionAdmin(admin.ModelAdmin):
    """
    Customizes the admin interface for the ArtCollection model,
    specifying the fields to display in the list view and adding a custom
    method to display related artpieces.
    """
    list_display = (
        'id',
        'owner',
        'title',
        'created_on',
        'updated_on',
        'get_artpieces'
        )

    def get_artpieces(self, obj):
        """
        Returns a comma-separated string of artpieces
        associated with the art collection.
        """
        return ", ".join([str(ap) for ap in obj.collection_artpieces.all()])
    get_artpieces.short_description = 'Artpieces'
