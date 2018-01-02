from channels import Group
import json
from example.models import UserSession
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from urllib.parse import parse_qs
import re
import datetime
import requests
import csv
from channels.auth import channel_session_user, channel_session_user_from_http

KEYWORD_URL = 'https://goo.gl/G8sHwy'


@channel_session_user_from_http
def ws_connect(message):
    user_attribute = message.user.__dict__
    # 如果使用者已登入
    if user_attribute:
        session_id = user_attribute['id']
        if user_attribute.get('nickname', ''):
            username = user_attribute.get('nickname', '')
        else:
            username = user_attribute.get("email", "").split("@")[0]
    # 取得 javascript 傳遞的 session_id
    else:
        params = parse_qs(message.content["query_string"])
        session_id = params[b'session_id'][0].decode("utf8")
        username = ''

    Group('users-%s' % session_id).add(message.reply_channel)
    message.reply_channel.send({"accept": True})

    # 從資料庫取得歷史對話資料
    previous_message = get_previous_message(session_id, 0, 5)
    send_previous_message(message, previous_message)

    send_message(message, opponent_id='bot', msg=username + " 你好，很高興為你服務。")


@channel_session_user
def ws_disconnect(message):
    Group('users').discard(message.reply_channel)


@channel_session_user
def ws_receive(message):
    def identify_message():
        if reply_message_text:
            return reply_message_text
        else:
            return reply_message_picture

    def save_message(session_id):
        try:
            user_session = UserSession.objects.get(session_id=session_id)
            # 記錄使用者訊息
            user_session.usermessage_set.create(opponent_id=session_id, message_text=receive_message,
                                                post_date=timezone.now())
            # 記錄 bot 回傳的訊息
            if identify_message():
                user_session.usermessage_set.create(opponent_id='bot', message_text=identify_message(),
                                                    post_date=timezone.now())
            # 儲存
            user_session.save()
        except ObjectDoesNotExist:
            pass

    def get_session_id(session_id):
        user_attribute = message.user.__dict__
        if user_attribute:
            session_id = user_attribute['id']
        return session_id

    data = json.loads(message['text'])
    receive_message = data['text']
    sessionid = get_session_id(data['session_id'])
    group = 'users-%s' % sessionid

    reply_message_text = None
    reply_message_picture = None

    if "#getHistory" == receive_message:
        start = data['start']
        end = data['end']
        previous_message = get_previous_message(sessionid, start, end)
        send_previous_message(message, previous_message)
        return 1
    elif re.match('http[s]?://.*\.(?i)(jpg|png|bmp|gif)', receive_message):
        save_message(sessionid)
        return 1

    # 排除傳送歷史訊息請求，要放在 #getHistory 的下面
    send_user_message(sessionid, group, receive_message)

    keyword_csv = requests.get(KEYWORD_URL).content.decode('utf-8').splitlines()[1:]
    keywords = csv.reader(keyword_csv, delimiter=',')
    for keyword in keywords:
        if keyword[0] in receive_message:
            reply_keyword = keyword[1]
            if re.match('http[s]?://.*\.(?i)(jpg|png|bmp|gif)', reply_keyword):
                reply_message_picture = reply_keyword
                group_message(group, pic=reply_message_picture)
            else:
                reply_message_text = reply_keyword
                group_message(group, msg=reply_message_text)
            save_message(sessionid)
            return 1

    reply_message_text = "不好意思，我不清楚您的意思，請嘗試輸入其他訊息，謝謝"
    group_message(group, msg=reply_message_text)
    save_message(sessionid)


def send_message(message, opponent_id='bot', msg=None, pic=None):
    message.reply_channel.send({
        'text': json.dumps({
            'opponent_id': opponent_id,
            'msg': msg,
            'pic': pic
        })
    })


def group_message(group, opponent_id='bot', msg=None, pic=None):
    Group(group).send({
        'text': json.dumps({
            'opponent_id': opponent_id,
            'msg': msg,
            'pic': pic
        })
    })


def get_previous_message(session_id, start, end):
    # 搜尋條件之後要加入對象名稱
    user_message = []
    previous_message = []
    try:
        user_session = UserSession.objects.get(session_id=session_id)
        user_message = user_session.usermessage_set.order_by('-post_date')[start:end]
    except ObjectDoesNotExist:
        pass
    for m in user_message:
        msg = None
        pic = None
        if re.match('http[s]?://.*\.(?i)(jpg|png|bmp|gif)', m.message_text):
            pic = m.message_text
        else:
            msg = m.message_text
        previous_message.append(
            {
                "opponent_id": m.opponent_id,
                'msg': msg,
                'pic': pic,
                "post_date": (m.post_date + datetime.timedelta(hours=8)).strftime("%m/%d %H:%M")
            }
        )
    return previous_message


def send_previous_message(message, previous_message):
    message.reply_channel.send({
        'text': json.dumps(previous_message)
    })


def send_user_message(user_id, group, user_message):
    msg = None
    pic = None
    if re.match('http[s]?://.*\.(?i)(jpg|png|bmp|gif)', user_message):
        pic = user_message
    else:
        msg = user_message

    group_message(group, opponent_id=user_id, msg=msg, pic=pic)
