from django.db import models
from account.models import UserModel

# Create your models here.

class Room(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Messages(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    author = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f'{self.author} - {self.content}'


class Notification(models.Model):
    creator = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    content = models.TextField()
    seen_by = models.ManyToManyField(UserModel, related_name='seen_notifications', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.creator.username}_{self.content}'