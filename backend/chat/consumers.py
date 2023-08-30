import json
from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from .models import Messages, Room, Notification
from account.models import UserModel

class ChatConsumer(AsyncWebsocketConsumer):
    @sync_to_async
    def save_message(self, room_id, author, message):
        room = Room.objects.get(id=room_id)
        user = UserModel.objects.get(pk=author)
        new_message = Messages.objects.create(
            room = room,
            author = user,
            content = message
        )

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)


    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        room_id = data['room']
        author = data['author']
        message = data["content"]
        await self.save_message(room_id, author, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {
            "type": "chat.message", 
            "message": message,
            "room_id": room_id,
            "author": author}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        room_id = event["room_id"]
        author = event["author"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"content": message,
                                              "room_id": room_id,
                                              "author": author}))


class NotificationConsumer(AsyncWebsocketConsumer):
    @sync_to_async
    def save_notification(self, user_id, text):
        created_user = UserModel.objects.get(id=user_id)
        print(created_user,'reached save')
        new_notification = Notification.objects.create(
            creator = created_user,
            content = text
        )
        print(new_notification,'new notification')

    async def connect(self):
        self.group_name = 'notifications'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self):
        # Leave room group
        await self.channel_layer.group_discard(self.group_name)

    async def room_created(self, event):
        room_name = event['room_name']
        username = event['user']
        user_id = event['user_id']
        message = f'{username} created a room "{room_name}"'

        await self.save_notification(user_id, message)
        
        await self.send(text_data=json.dumps({
            'message': message
        }))