from rest_framework import permissions


class IsBuyerOrArtist(permissions.BasePermission):
    """
    Custom permission to allow access only to the buyer or artpiece owner.
    """

    def has_object_permission(self, request, view, obj):
        return request.user == obj.buyer or request.user == obj.artpiece.owner
