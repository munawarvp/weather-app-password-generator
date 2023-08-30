from django.shortcuts import render
from .models import Room, Messages, Notification
from account.models import UserModel
from .serializers import RoomSerializer, MessageSerializer, NotificationSerializer
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Create your views here.
def index(request):
    return render(request, "chat/index.html")

def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})

class CreateRoomCommunity(APIView):
    def post(self, request):
        room_name = request.data['name']
        user_id = request.data['user']
        user = UserModel.objects.get(id=user_id)
        
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                'notifications',
                {
                    'type': 'room.created',
                    'room_name': room_name,
                    'user': user.username,
                    'user_id': user_id
                }
            )
            return Response(serializer.data)
        return Response({'msg': 500})

class RoomValidation(APIView):
    def get(self, request, room_name):
        try:
            room = Room.objects.get(name=room_name)
        except:
            Room.DoesNotExist
            return Response({'msg': 500})
        serializer = RoomSerializer(room)
        return Response({'msg': 200, 'data': serializer.data})
    

class GetAllRooms(APIView):
    def get(self, request):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)
    
class MessageList(APIView):
    def get(self, request, room_id):
        try:
            room_obj = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return Response({"error": "Room not found."}, status=status.HTTP_404_NOT_FOUND)
        messages = Messages.objects.filter(room=room_obj)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, room_id):
        room = Room.objects.get(id=room_id)
        #print(request.data)
        serializer = MessageSerializer(data=request.data)
        serializer.is_valid()
        print(serializer.errors)
        if serializer.is_valid():
            serializer.save(room=room)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class NotificationList(APIView):
    def get(self, request):
        try:
            notifications = Notification.objects.all().order_by('-created_at')[:6]
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    

class NotificationSeen(APIView):
    def put(self, request):
        user_id = request.data['user_id']
        notification_id = request.data['notification']

        user = UserModel.objects.get(id=user_id)
        notification = Notification.objects.get(id=notification_id)
        if user in notification.seen_by.all():
            return Response({'msg': 'already seen'}, status=status.HTTP_200_OK)
        else:
            notification.seen_by.add(user)
            return Response(status=status.HTTP_200_OK)