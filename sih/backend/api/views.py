from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from pymongo import MongoClient
from bson.objectid import ObjectId

from .serializers import AadharVerificationSerializer, KYCSerializer, DashboardDataSerializer, PhoneNumberSerializer, EmergencyContactSerializer
from .utils import simulate_aadhar_verification, send_otp, verify_otp, send_automated_message, send_emergency_messages

# MongoDB Connection
# Replace with your MongoDB connection string and database name
MONGO_URI = "mongodb://localhost:27017/"
DATABASE_NAME = "sih_db"

mongo_client = MongoClient(MONGO_URI)
db = mongo_client[DATABASE_NAME]

kyc_collection = db["kyc"]
dashboard_collection = db["dashboard_data"]
emergency_contacts_collection = db["emergency_contacts"]

@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Username and password are required.'}, status=400)
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists.'}, status=400)
        
        user = User.objects.create_user(username=username, password=password)
        
        # Create initial KYC document in MongoDB
        kyc_collection.insert_one({'user_id': user.id, 'aadhar_number': None, 'phone_number': None, 'aadhar_card': None, 'is_verified': False})
        
        # Create initial DashboardData document in MongoDB
        dashboard_collection.insert_one({'user_id': user.id, 'welcome_message': 'Welcome to your dashboard!'})
        
        token, created = Token.objects.get_or_create(user=user)
        return JsonResponse({'message': 'User created successfully. Please proceed with Aadhar verification.', 'token': token.key}, status=201)

@api_view(['POST'])
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({'message': 'Login successful.', 'token': token.key})
        else:
            return JsonResponse({'error': 'Invalid username or password.'}, status=400)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_otp(request):
    user_id = request.user.id
    kyc_data = kyc_collection.find_one({'user_id': user_id})

    if not kyc_data:
        return Response({'error': 'KYC entry not found for this user.'}, status=status.HTTP_404_NOT_FOUND)
    
    phone_number = kyc_data.get('phone_number')

    if not phone_number:
        return Response({'error': 'Phone number not registered. Please update your phone number first.'}, status=status.HTTP_400_BAD_REQUEST)
    
    otp = send_otp(phone_number)
    return Response({'message': f'OTP sent to {phone_number}. Please use it for Aadhar verification.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_phone_number(request):
    serializer = PhoneNumberSerializer(data=request.data)
    if serializer.is_valid():
        phone_number = serializer.validated_data.get('phone_number')
        user_id = request.user.id

        result = kyc_collection.update_one(
            {'user_id': user_id},
            {'$set': {'phone_number': phone_number}}
        )

        if result.matched_count == 0:
            return Response({'error': 'KYC entry not found for this user.'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'message': 'Phone number updated successfully.', 'phone_number': phone_number}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def aadhar_verification(request):
    serializer = AadharVerificationSerializer(data=request.data)
    if serializer.is_valid():
        aadhar_number = serializer.validated_data.get('aadhar_number')
        # aadhar_card_image = serializer.validated_data.get('aadhar_card') # If you want to handle image as string
        otp_attempt = serializer.validated_data.get('otp')
        user_id = request.user.id

        kyc_data = kyc_collection.find_one({'user_id': user_id})

        if not kyc_data:
            return Response({'error': 'KYC entry not found for this user.'}, status=status.HTTP_404_NOT_FOUND)
        
        phone_number = kyc_data.get('phone_number')

        if not phone_number:
            return Response({'error': 'Phone number not registered. Please update your phone number and request OTP first.'}, status=status.HTTP_400_BAD_REQUEST)

        if not otp_attempt or not verify_otp(phone_number, otp_attempt):
            return Response({'error': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        # Simulate Aadhar verification
        is_verified_by_aadhar_api = simulate_aadhar_verification(aadhar_number)

        if is_verified_by_aadhar_api:
            update_fields = {'aadhar_number': aadhar_number, 'is_verified': True}
            # if aadhar_card_image: # If you want to handle image as string
            #     update_fields['aadhar_card'] = aadhar_card_image

            result = kyc_collection.update_one(
                {'user_id': user_id},
                {'$set': update_fields}
            )
            if result.matched_count == 0:
                return Response({'error': 'KYC entry not found for this user.'}, status=status.HTTP_404_NOT_FOUND)

            updated_kyc_data = kyc_collection.find_one({'user_id': user_id})
            updated_kyc_data['user_id'] = str(updated_kyc_data['_id'])
            serializer = KYCSerializer(updated_kyc_data)
            return Response({'message': 'Aadhar verification successful.', 'kyc_status': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Aadhar verification failed.'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    data = json.loads(request.body)
    message = data.get('message')
    user_id = request.user.id

    if not message:
        return Response({'error': 'Message content is required.'}, status=status.HTTP_400_BAD_REQUEST)

    kyc_data = kyc_collection.find_one({'user_id': user_id})

    if not kyc_data:
        return Response({'error': 'KYC entry not found for this user.'}, status=status.HTTP_404_NOT_FOUND)
    
    phone_number = kyc_data.get('phone_number')

    if not phone_number:
        return Response({'error': 'Phone number not registered. Cannot send message.'}, status=status.HTTP_400_BAD_REQUEST)
    
    if send_automated_message(phone_number, message):
        return Response({'message': f'Automated message sent to {phone_number}.'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Failed to send message.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def emergency_contact_list_create(request):
    user_id = request.user.id

    if request.method == 'GET':
        contacts = list(emergency_contacts_collection.find({'user_id': user_id}))
        for contact in contacts:
            contact['id'] = str(contact['_id'])
        serializer = EmergencyContactSerializer(contacts, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = EmergencyContactSerializer(data=request.data)
        if serializer.is_valid():
            contact_data = serializer.validated_data
            contact_data['user_id'] = user_id
            result = emergency_contacts_collection.insert_one(contact_data)
            contact_data['id'] = str(result.inserted_id)
            return Response(contact_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def emergency_contact_detail(request, pk):
    user_id = request.user.id

    try:
        # Ensure the contact belongs to the authenticated user
        contact_data = emergency_contacts_collection.find_one({'_id': ObjectId(pk), 'user_id': user_id})
        if not contact_data:
            return Response({'error': 'Emergency contact not found or does not belong to this user.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception:
        return Response({'error': 'Invalid contact ID.'}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        contact_data['id'] = str(contact_data['_id'])
        serializer = EmergencyContactSerializer(contact_data)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = EmergencyContactSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            update_fields = serializer.validated_data
            result = emergency_contacts_collection.update_one(
                {'_id': ObjectId(pk), 'user_id': user_id},
                {'$set': update_fields}
            )
            if result.matched_count == 0:
                return Response({'error': 'Emergency contact not found or does not belong to this user.'}, status=status.HTTP_404_NOT_FOUND)
            
            updated_contact = emergency_contacts_collection.find_one({'_id': ObjectId(pk)})
            updated_contact['id'] = str(updated_contact['_id'])
            return Response(updated_contact)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        result = emergency_contacts_collection.delete_one({'_id': ObjectId(pk), 'user_id': user_id})
        if result.deleted_count == 0:
            return Response({'error': 'Emergency contact not found or does not belong to this user.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sos_alert(request):
    user = request.user
    user_id = user.id
    emergency_contacts = list(emergency_contacts_collection.find({'user_id': user_id}))
    
    if not emergency_contacts:
        return Response({'error': 'No emergency contacts found for this user.'}, status=status.HTTP_400_BAD_REQUEST)

    contact_data = [{'name': contact.get('name'), 'phone_number': contact.get('phone_number')} for contact in emergency_contacts]
    
    # You can customize the emergency message here
    emergency_message = f"SOS Alert! {user.username} needs help. Please contact them immediately."

    if send_emergency_messages(contact_data, emergency_message):
        return Response({'message': 'Emergency alert sent to all contacts.'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Failed to send emergency messages to all contacts.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    user_id = request.user.id
    dashboard_instance = dashboard_collection.find_one({'user_id': user_id})

    if not dashboard_instance:
        return Response({'error': 'Dashboard data not found for this user.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        dashboard_instance['user_id'] = str(dashboard_instance['_id'])
        serializer = DashboardDataSerializer(dashboard_instance)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = DashboardDataSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            update_fields = serializer.validated_data
            result = dashboard_collection.update_one(
                {'user_id': user_id},
                {'$set': update_fields}
            )
            if result.matched_count == 0:
                return Response({'error': 'Dashboard data not found for this user.'}, status=status.HTTP_404_NOT_FOUND)
            
            updated_dashboard_data = dashboard_collection.find_one({'user_id': user_id})
            updated_dashboard_data['user_id'] = str(updated_dashboard_data['_id'])
            return Response(updated_dashboard_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)