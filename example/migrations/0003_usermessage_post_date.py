# Generated by Django 2.0 on 2017-12-14 03:09

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('example', '0002_auto_20171213_1416'),
    ]

    operations = [
        migrations.AddField(
            model_name='usermessage',
            name='post_date',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='date posted'),
            preserve_default=False,
        ),
    ]