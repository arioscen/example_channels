from django import forms
from django.shortcuts import render
from django.http import HttpResponseRedirect
from .models import CustomUser


def index(request):
    return render(request, "customauth/index.html")


class MyUserForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput, help_text="注意大小寫")
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ['email', 'nickname']

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("密碼不相符")
        return password2

    def clean_email(self):
        email = self.cleaned_data["email"]
        try:
            CustomUser.objects.get(email=email)
            raise forms.ValidationError("此信箱已被使用")
        except CustomUser.DoesNotExist:
            return email

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


def register(request):
    if request.method == 'POST':
        form = MyUserForm(request.POST)
        if form.is_valid():
            form.save()
            next_ = request.POST.get('next', '')
            if next_:
                return HttpResponseRedirect(next_)
            else:
                return HttpResponseRedirect('/accounts/login/')
    else:
        form = MyUserForm()
    next_ = request.GET.get('next', '')
    return render(request, 'registration/register.html', {'form': form, 'next': next_})
