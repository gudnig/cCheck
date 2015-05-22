from django.db import IntegrityError
from rest_framework import mixins, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response


# models and serialization
from fighters.models import Fighter, PracticeSession
from django.contrib.auth.models import User
from fighters.serializers import FighterSerializer, PracticeSessionSerializer, UserSerializer

#authentication
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework import permissions
from fighters.permissions import IsTrainerOrReadOnly, IsTrainer, IsTrainerOrOwner

class ObtainAuthToken(APIView):	
	permission_classes = ()	
	serializer_class = AuthTokenSerializer
	def post(self, request):
		serializer = self.serializer_class(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.validated_data['user']
		token, created = Token.objects.get_or_create(user=user)
		print(user.fighter)		
		return Response({'token': token.key, 'name': user.fighter.name, 'status': user.fighter.status})


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