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
from fighters.permissions import IsTrainerOrReadOnly, IsTrainer, IsTrainerOrOwner


class GenerateTokens(APIView):
	permission_classes = (permissions.IsAuthenticated, IsTrainer,)
	def get(self, request):
		from django.contrib.auth.models import User
		from rest_framework.authtoken.models import Token

		for user in User.objects.all():
			Token.objects.get_or_create(user=user)
		return Response("Success", status=status.HTTP_200_OK)

class FighterList(generics.ListCreateAPIView):
	permission_classes = (permissions.IsAuthenticated, IsTrainerOrReadOnly,)
	queryset = Fighter.objects.all()
	serializer_class = FighterSerializer


class FighterDetail(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = (permissions.IsAuthenticated, IsTrainerOrOwner,)
	queryset = Fighter.objects.all()
	serializer_class = FighterSerializer

class UserList(generics.ListAPIView):
	permission_classes = (permissions.IsAuthenticated, IsTrainer,)
	queryset = User.objects.all()
	serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
	permission_classes = (permissions.IsAuthenticated, IsTrainer,)
	queryset = User.objects.all()
	serializer_class = UserSerializer

class SessionList(generics.ListCreateAPIView):
	permission_classes = (permissions.IsAuthenticated, IsTrainer,)
	queryset = PracticeSession.objects.all()
	serializer_class = PracticeSessionSerializer

class SessionDetail(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = (permissions.IsAuthenticated, IsTrainer,)
	queryset = PracticeSession.objects.all()
	serializer_class = PracticeSessionSerializer