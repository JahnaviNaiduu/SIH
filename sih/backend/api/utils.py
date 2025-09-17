import random
import time
from typing import List, Dict

# In a real application, OTPs would be stored in a database or cache (e.g., Redis)
# and would have an expiration time.
# For this simulation, we'll use a simple dictionary.
_otp_store = {}

def generate_otp() -> str:
    return str(random.randint(100000, 999999))

def send_otp(phone_number: str) -> str:
    """
    Simulates sending an OTP to a phone number.
    In a real scenario, this would integrate with an SMS gateway.
    """
    otp = generate_otp()
    _otp_store[phone_number] = {'otp': otp, 'timestamp': time.time(), 'verified': False}
    print(f"Simulating OTP send to {phone_number}: {otp}") # For demonstration
    return otp

def verify_otp(phone_number: str, otp_attempt: str, expiration_minutes: int = 5) -> bool:
    """
    Simulates OTP verification.
    """
    if phone_number in _otp_store:
        stored_otp_info = _otp_store[phone_number]
        if stored_otp_info['otp'] == otp_attempt:
            # Check for expiration
            if (time.time() - stored_otp_info['timestamp']) / 60 < expiration_minutes:
                stored_otp_info['verified'] = True
                return True
    return False

def simulate_aadhar_verification(aadhar_number: str) -> bool:
    """
    Simulates Aadhar verification. For a real API, this would involve calling an external service.
    For demonstration, it returns True for a specific Aadhar number, False otherwise.
    """
    # In a real scenario, you'd call an external Aadhar API here.
    # For this simulation, let's say Aadhar number '123456789012' is always successful.
    # And other numbers have a 70% chance of success.
    if aadhar_number == '123456789012':
        return True
    else:
        return random.random() < 0.7  # 70% chance of success for other numbers

def send_automated_message(phone_number: str, message: str) -> bool:
    """
    Simulates sending an automated message to a phone number.
    In a real scenario, this would integrate with an SMS gateway.
    """
    print(f"Simulating automated message to {phone_number}: {message}")
    return True

def send_emergency_messages(contacts: List[Dict[str, str]], message: str) -> bool:
    """
    Simulates sending emergency messages to a list of contacts.
    """
    success = True
    for contact in contacts:
        phone_number = contact.get('phone_number')
        name = contact.get('name', 'Emergency Contact')
        if phone_number:
            full_message = f"Emergency Alert from {name}: {message}"
            if not send_automated_message(phone_number, full_message):
                success = False
        else:
            print(f"Warning: Emergency contact {name} has no phone number.")
            success = False
    return success