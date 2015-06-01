from django.db import models

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

# Create your models here.
class Fighter(models.Model):
	name = models.CharField(max_length=100)
	status = models.CharField(max_length=20)
	created = models.DateTimeField(auto_now_add=True)
	user = models.OneToOneField('auth.User', null=True)


class PracticeSession(models.Model):
	description = models.CharField(max_length=200, null=True)
	date = models.DateField()
	full_attendance = models.ManyToManyField(Fighter, related_name='full_attendance')
	half_attendance = models.ManyToManyField(Fighter, related_name='half_attendance')

#Add token to users as they are created
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)