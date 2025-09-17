from rest_framework import serializers

class KYCSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(read_only=True)
    aadhar_number = serializers.CharField(max_length=12, allow_null=True, allow_blank=True)
    phone_number = serializers.CharField(max_length=15, allow_null=True, allow_blank=True)
    # aadhar_card will be handled as a URL or base64 string in views, not directly here as ImageField
    is_verified = serializers.BooleanField(default=False)

class AadharVerificationSerializer(serializers.Serializer):
    aadhar_number = serializers.CharField(max_length=12)
    # aadhar_card = serializers.CharField(required=False) # If you want to pass base64 string or URL
    otp = serializers.CharField(max_length=6, required=False)

class DashboardDataSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(read_only=True)
    welcome_message = serializers.CharField(max_length=255, default="Welcome to your dashboard!")

class PhoneNumberSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)

class EmergencyContactSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True) # MongoDB _id will be a string
    user_id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100)
    phone_number = serializers.CharField(max_length=15)