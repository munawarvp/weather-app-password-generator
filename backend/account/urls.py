from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterUser.as_view()),
    path('generate-pass/', views.GenerateRandomPass.as_view()),
    path('login-user/', views.LoginAuthentication.as_view()),
]