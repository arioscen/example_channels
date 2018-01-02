from django.conf.urls import include
from django.urls import path
from . import views

app_name = 'customauth'
urlpatterns = [
    path('', views.index, name='index'),
    path('register/', views.register, name='register')
]