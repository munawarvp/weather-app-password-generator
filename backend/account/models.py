from django.db import models
from django.contrib.auth.hashers import make_password

# Create your models here.
class UserModel(models.Model):
    username = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.username

