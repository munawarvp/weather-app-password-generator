from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from .serializers import UserModelSerializer
from .models import UserModel
import random
import string
# Create your views here.

class GenerateRandomPass(APIView):
    def get(self, request):
        my_chars = string.ascii_letters
        my_puch = '!@#$%&*'
        print(string.punctuation)
        my_int = string.digits
        print(string.digits)
        generated_char = ''.join(random.choice(my_chars) for i in range(8))
        generated_puch = ''.join(random.choice(my_puch) for i in range(2))
        generated_int = ''.join(random.choice(my_int) for i in range(2))
        print(generated_int)
        return Response({'pass': generated_char+generated_puch+generated_int})


class RegisterUser(APIView):
    def post(self, request):
        form_data = request.data
        hashed = make_password(form_data['password'])
        print(hashed)
        form_data['password'] = hashed
        print(form_data)
        serializer = UserModelSerializer(data=form_data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'msg':user.id}, status=201)
        return Response(status=400)
    

class LoginAuthentication(APIView):
    def post(self, request):
        data = request.data
        email = data['email']
        password = data['password']
        print(email, password)
        authen = UserModel.objects.get(email=email)
        to_check = authen.password

        checking = check_password(password, to_check)
        print(checking)
        if checking:
            return Response({'user':authen.id}, status=200)
        return Response(status=400)