from rest_framework import permissions

class IsTrainerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # If trainer grant access
        if request.user.fighter.status == "Þjálfari":
            return True
        # If owner grant access
        return obj.user == request.user

class IsTrainerOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to trainers.
        return request.user.fighter.status == "Þjálfari"

class IsTrainer(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.fighter.status == "Þjálfari"