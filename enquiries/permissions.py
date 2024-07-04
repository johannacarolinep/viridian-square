from rest_framework import permissions


class IsBuyerOrArtist(permissions.BasePermission):
    """
    Custom permission to allow access only to the buyer or artpiece owner.
    """

    def has_object_permission(self, request, view, obj):
        is_buyer = obj.buyer and request.user == obj.buyer
        is_artist = obj.artpiece and request.user == obj.artpiece.owner
        return is_buyer or is_artist
