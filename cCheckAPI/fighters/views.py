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


# Create your views here.
class FighterList(APIView):
	permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

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
			#If there is a fighter passed in the request
			if 'fighter' in request.data:
				serializer = FighterSerializer(data=request.data['fighter'])
			#If there is a username passed in the request
			if 'username' in request.data:
				userSet = User.objects.filter(username=request.data['username'])
				#Take first user (username should be unique) None if not found
				if userSet.count() > 0:
					user = userSet[0]
				else:
					user = None
			else:
				user = None			
			
			#If the data is valid save fighter and return success
			if serializer.is_valid():
				serializer.save(user=user)		
				return Response(serializer.data, status=status.HTTP_201_CREATED)
			#invalid data, return error
			return Response("Invalid data", status=status.HTTP_400_BAD_REQUEST)
		except IntegrityError as e:
			raise			
		finally:
			pass

class SessionList(APIView):
	permission_classes = (permissions.IsAuthenticated,)

	def get(self, request, format=None):
		sessions = PracticeSession.objects.all()
		serializer = PracticeSessionSerializer(sessions, many=True)
		return Response(serializer.data)

	# POST - add new fighter
	#accepts json in the form
	#	{"username": "username", "fighter": {"name": "name", "status": "status"} }
	#
	def post(self, request, format=None):
		try:


			serializer = PracticeSessionSerializer(data=request.data)
			print(request.data)
			if serializer.is_valid():
				#serializer.save()
				return Response(serializer.data, status=status.HTTP_201_CREATED)			
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
