from django.db import models


class UserSession(models.Model):
    session_id = models.CharField(max_length=200, primary_key=True)
    expire_date = models.DateTimeField('date expired')

    def __str__(self):
        return self.session_id

class UserMessage(models.Model):
    session_id = models.ForeignKey(UserSession, on_delete=models.CASCADE)
    opponent_id = models.CharField(max_length=200)
    message_text = models.CharField(max_length=500)
    post_date = models.DateTimeField('date posted')

    def __str__(self):
        return self.message_text