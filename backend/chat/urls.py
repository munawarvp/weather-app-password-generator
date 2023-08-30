from django.urls import path, re_path
from . import views
from .consumers import ChatConsumer, NotificationConsumer
from .views import RoomValidation, GetAllRooms, MessageList, CreateRoomCommunity, NotificationList, NotificationSeen

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_name>\w+)/$", ChatConsumer.as_asgi()),
    re_path(r"ws/notifications/$", NotificationConsumer.as_asgi()),
]

urlpatterns = [
    path("", views.index, name='index'),
    path("<str:room_name>/", views.room, name="room"),
    path("createnew/room", CreateRoomCommunity.as_view()),
    path("roomvalidation/<str:room_name>", RoomValidation.as_view()),
    path("rooms/getall/", GetAllRooms.as_view()),
    path("rooms/<int:room_id>/messages", MessageList.as_view()),
    path("list/allnotifications", NotificationList.as_view()),
    path("seen/notification", NotificationSeen.as_view()),
]
