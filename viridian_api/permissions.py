from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.

    Methods:
        has_object_permission(self, request, view, obj):
            Returns true if the request method is safe, eg GET. Otherwise
            returns True if the requesting user is the owner of the object,
            else false.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user
