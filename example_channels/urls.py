from django.conf.urls import include, url
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.views import static
from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    path('', include('example.urls')),
    url(r'^static/(?P<path>.*)$', static.serve, {'document_root': settings.STATIC_ROOT, }, name='static'),
    path('customauth/', include('customauth.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('accounts/profile/', views.profile, name='profile'),
]
