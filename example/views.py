from django.shortcuts import render
from example.models import UserSession
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.contrib.staticfiles import finders
from django.utils import timezone
from datetime import timedelta
from customauth.models import CustomUser
import json

# 如果 UserSession 物件不存在產生 UserSession 物件
def create_user_session(session_id):
    try:
        UserSession.objects.get(session_id=session_id)
    except ObjectDoesNotExist:
        expire_date = timezone.now() + timedelta(days=365)
        user_session = UserSession(session_id=session_id, expire_date=expire_date)
        user_session.save()


# 產生 session_id
def create_session_id(request):
    s = request.session
    s.create()
    session_id = s.session_key
    return session_id


# javascript 確認/請求 session_id
def get_session_id(request):
    user_id = request.user.id
    if user_id:
        session_id = user_id
    else:
        live_chat = request.GET.get('live_chat', '')
        if live_chat:
            session_id = live_chat
        else:
            session_id = create_session_id(request)
    create_user_session(session_id)
    return HttpResponse(session_id)


def get_profile(request, uid):
    # 取得使用者名稱
    if uid == 'bot':
        name = uid
    else:
        try:
            user = CustomUser.objects.get(id=uid)
            if user.nickname:
                name = user.nickname
            else:
                name = user.email.split("@")[0]
        except (ObjectDoesNotExist, ValueError):
            name = str(request.user)

    # 取得使用者頭像
    host = request.META['HTTP_HOST']
    path = 'profile_picture/'
    picture_path = path+uid
    if finders.find(picture_path):
        picture = "http://" + host + static(picture_path)
    else:
        if request.user.is_authenticated:
            picture = "http://" + host + static(path + 'auth')
        else:
            picture = "http://" + host + static(path+'user')
    profile = {
        "name": name,
        "picture": picture
    }
    return HttpResponse(json.dumps(profile))


def chat(request):
    context = {}
    return render(request, 'example/chat.html', context=context)
