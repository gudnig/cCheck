from django.db import IntegrityError
from rest_framework import mixins, generics, status


#For class based views
from rest_framework.views import APIView
from rest_framework.response import Response

# models and serialization
from fighters.models import Fighter, PracticeSession
from django.contrib.auth.models import User
from fighters.serializers import FighterSerializer, PracticeSessionSerializer, UserSerializer


from rest_framework.parsers import JSONParser

#authentication
from rest_framework import permissions
from fighters.permissions import IsOwnerOrReadOnly

#TODO:
# Move authentication to token auth
# Fix authentication permissions


class GenerateTokens(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	def get(self, request):
		from django.contrib.auth.models import User
		from rest_framework.authtoken.models import Token

		for user in User.objects.all():
			Token.objects.get_or_create(user=user)
		return Response("Success", status=status.HTTP_200_OK)

class FighterList(generics.ListCreateAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	queryset = Fighter.objects.all()
	serializer_class = FighterSerializer


class FighterDetail(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
	queryset = Fighter.objects.all()
	serializer_class = FighterSerializer

class UserList(generics.ListAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	queryset = User.objects.all()
	serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	queryset = User.objects.all()
	serializer_class = UserSerializer

class SessionList(generics.ListCreateAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	queryset = PracticeSession.objects.all()
	serializer_class = PracticeSessionSerializer

class SessionDetail(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	queryset = PracticeSession.objects.all()
	serializer_class = PracticeSessionSerializer