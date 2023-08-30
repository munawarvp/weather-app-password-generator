from django.contrib import admin
from chat.models import Messages, Room, Notification
# Register your models here.

admin.site.register(Messages)
admin.site.register(Room)
admin.site.register(Notification)
