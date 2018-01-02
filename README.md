# 使用 channels 實現網頁版聊天機器人
參考：[通过Django Channels设计聊天机器人WEB框架](https://www.jianshu.com/p/3f4eac744f9c)

## 客製化使用者 customauth
models 繼承使用者(AbstractBaseUser)，並新增 nickname 項目 \
views 繼承表單(forms.ModelForm)，定義賬號名稱檢查與密碼驗證

## javascript
考量到實際應用，以插件方式設計，能置入非相同專案的網頁中 \
使用方式： \
將 channels.js 與 channels.css 導入目標 html \
並修改 example/channels.js \
```
- var domain_name = "";
+ var domain_name = "<yourDomain>:8000";
```

## session
使用 javascript 存取 cookie ，使用者與對話會儲存至資料庫 \
重新讀取網頁會載入先前的 5 則對話 \
捲動對話框可載入更舊的對話

##  展望
可再開發使用者之間的對話，例如聊天室的功能 \
這個案例以機器人為主要架構，若能加入真人對話會更加完善
