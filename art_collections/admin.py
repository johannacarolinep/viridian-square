from django.contrib import admin
from art_collections.models import ArtCollection


@admin.register(ArtCollection)
class ArtCollectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'owner', 'title', 'created_on', 'updated_on', 'get_artpieces')

    def get_artpieces(self, obj):
        return ", ".join([str(ap) for ap in obj.collection_artpieces.all()])
    get_artpieces.short_description = 'Artpieces'
