from django.forms import widgets
from rest_framework import serializers
from fighters.models import Fighter, PracticeSession
from django.contrib.auth.models import User

class FighterSerializer(serializers.ModelSerializer):
	class Meta:
		model = Fighter
		fields = ( 'id', 'name', 'status', 'created', 'user' )


class UserSerializer(serializers.ModelSerializer):
	fighter = serializers.PrimaryKeyRelatedField(queryset=Fighter.objects.all())

	class Meta:
		model = User
		fields = ('id', 'username', 'fighter',)

class PracticeSessionSerializer(serializers.ModelSerializer):
	attendance = serializers.SlugRelatedField(
												many=True, 
												queryset=Fighter.objects.all(), 
												allow_null=True, 
												slug_field='id'
	)

	class Meta:
		model = PracticeSession
		fields = ('id', 'date', 'description', 'attendance',)		

