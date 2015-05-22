from django.db import models

from django.utils.encoding import python_2_unicode_compatible

# Create your models here.
class Fighter(models.Model):
	name = models.CharField(max_length=100)
	status = models.CharField(max_length=20)
	created = models.DateTimeField(auto_now_add=True)
	user = models.OneToOneField('auth.User', null=True)
