from django.db import IntegrityError
from rest_framework import mixins, generics, status


#For class based views
from rest_framework.views import APIView
from rest_framework.response import Response

# models and serialization
from fighters.models import Fighter
from django.contrib.auth.models import User
from fighters.serializers import FighterSerializer
from fighters.serializers import UserSerializer

from rest_framework.parsers import JSONParser

#authentication
from rest_framework import permissions
from fighters.permissions import IsOwnerOrReadOnly


# Create your views here.

class FighterList(APIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
	queryset = Fighter.objects.all()
	serializer_class = FighterSerializer

	def get(self, request, format=None):
		fighters = Fighter.objects.all()
		serializer = FighterSerializer(fighters, many=True)
		return Response(serializer.data)

	# POST - add new fighter
	#accepts json in the form
	#	{"username": "username", "fighter": {"name": "name", "status": "status"} }
	#
	def post(self, request, format=None):
		try:
			userSet = User.objects.filter(username=request.data['username'])
			#Take first user (username should be unique) None otherwise
			if userSet.count() > 0:
				user = userSet[0]
			else:
				user = None
			serializer = FighterSerializer(data=request.data['fighter'])		
			if serializer.is_valid():
				serializer.save(user=user)		
				return Response(serializer.data, status=status.HTTP_201_CREATED)
			#invalid data		
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		except IntegrityError as e:
			raise			
		finally:
			pass
		

class FighterDetail(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly,)
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