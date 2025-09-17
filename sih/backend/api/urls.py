from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('request-otp/', views.request_otp, name='request_otp'),
    path('update-phone/', views.update_phone_number, name='update_phone_number'),
    path('aadhar-verify/', views.aadhar_verification, name='aadhar_verification'),
    path('send-message/', views.send_message, name='send_message'),
    path('emergency-contacts/', views.emergency_contact_list_create, name='emergency_contact_list_create'),
    path('emergency-contacts/<int:pk>/', views.emergency_contact_detail, name='emergency_contact_detail'),
    path('sos-alert/', views.sos_alert, name='sos_alert'),
    path('dashboard/', views.dashboard_data, name='dashboard_data'),
]
