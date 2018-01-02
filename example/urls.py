from django.conf.urls import url
from example.views import chat
from . import views
from django.urls import path

urlpatterns = [
    url(r'^$', chat, name='chat'),
    path('get_session_id', views.get_session_id, name='get_session_id'),
    path('get_profile/<str:uid>', views.get_profile, name='get_profile'),
]
