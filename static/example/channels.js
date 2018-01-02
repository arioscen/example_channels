(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery'), require('window')) :
	typeof define === 'function' && define.amd ? define('isInViewport', ['jquery', 'window'], factory) :
	(factory(global.$,global.window));
}(this, (function ($,window) { 'use strict';

$ = 'default' in $ ? $['default'] : $;
window = 'default' in window ? window['default'] : window;

/**
 * @author  Mudit Ameta
 * @license https://github.com/zeusdeux/isInViewport/blob/master/license.md MIT
 */

// expose isInViewport as a custom pseudo-selector
$.extend($.expr[':'], {
  // if $.expr.createPseudo is available, use it
  'in-viewport': $.expr.createPseudo
    ? $.expr.createPseudo(function (argsString) { return function (currElement) { return isInViewport(currElement, getSelectorArgs(argsString)); }; })
  : function (currObj, index, meta) { return isInViewport(currObj, getSelectorArgs(meta[3])); }
});


// expose isInViewport as a function too
// this lets folks pass around actual objects as options (like custom viewport)
// and doesn't tie 'em down to strings. It also prevents isInViewport from
// having to look up and wrap the dom element corresponding to the viewport selector
$.fn.isInViewport = function(options) {
  return this.filter(function (i, el) { return isInViewport(el, options); })
};

$.fn.run = run;

// lets you chain any arbitrary function or an array of functions and returns a jquery object
function run(args) {
  var this$1 = this;

  if (arguments.length === 1 && typeof args === 'function') {
    args = [args];
  }

  if (!(args instanceof Array)) {
    throw new SyntaxError('isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions')
  }

  args.forEach(function (arg) {
    if (typeof arg !== 'function') {
      console.warn('isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions');
      console.warn('isInViewport: Ignoring non-function values in array and moving on');
    } else {
      [].slice.call(this$1).forEach(function (t) { return arg.call($(t)); });
    }
  });

  return this
}


// gets the width of the scrollbar
function getScrollbarWidth(viewport) {
  // append a div that has 100% width to get true width of viewport
  var el = $('<div></div>').css({
    width: '100%'
  });
  viewport.append(el);

  // subtract true width from the viewport width which is inclusive
  // of scrollbar by default
  var scrollBarWidth = viewport.width() - el.width();

  // remove our element from DOM
  el.remove();
  return scrollBarWidth
}


// Returns true if DOM element `element` is in viewport
function isInViewport(element, options) {
  var ref = element.getBoundingClientRect();
  var top = ref.top;
  var bottom = ref.bottom;
  var left = ref.left;
  var right = ref.right;

  var settings = $.extend({
    tolerance: 0,
    viewport: window
  }, options);
  var isVisibleFlag = false;
  var $viewport = settings.viewport.jquery ? settings.viewport : $(settings.viewport);

  if (!$viewport.length) {
    console.warn('isInViewport: The viewport selector you have provided matches no element on page.');
    console.warn('isInViewport: Defaulting to viewport as window');
    $viewport = $(window);
  }

  var $viewportHeight = $viewport.height();
  var $viewportWidth = $viewport.width();
  var typeofViewport = $viewport[0].toString();

  // if the viewport is other than window recalculate the top,
  // bottom,left and right wrt the new viewport
  // the [object DOMWindow] check is for window object type in PhantomJS
  if ($viewport[0] !== window && typeofViewport !== '[object Window]' && typeofViewport !== '[object DOMWindow]') {
    // use getBoundingClientRect() instead of $.Offset()
    // since the original top/bottom positions are calculated relative to browser viewport and not document
    var viewportRect = $viewport[0].getBoundingClientRect();

    // recalculate these relative to viewport
    top = top - viewportRect.top;
    bottom = bottom - viewportRect.top;
    left = left - viewportRect.left;
    right = right - viewportRect.left;

    // get the scrollbar width from cache or calculate it
    isInViewport.scrollBarWidth = isInViewport.scrollBarWidth || getScrollbarWidth($viewport);

    // remove the width of the scrollbar from the viewport width
    $viewportWidth -= isInViewport.scrollBarWidth;
  }

  // handle falsy, non-number and non-integer tolerance value
  // same as checking using isNaN and then setting to 0
  // bitwise operators deserve some love too you know
  settings.tolerance = ~~Math.round(parseFloat(settings.tolerance));

  if (settings.tolerance < 0) {
    settings.tolerance = $viewportHeight + settings.tolerance; // viewport height - tol
  }

  // the element is NOT in viewport iff it is completely out of
  // viewport laterally or if it is completely out of the tolerance
  // region. Therefore, if it is partially in view then it is considered
  // to be in the viewport and hence true is returned. Because we have adjusted
  // the left/right positions relative to the viewport, we should check the
  // element's right against the viewport's 0 (left side), and the element's
  // left against the viewport's width to see if it is outside of the viewport.

  if (right <= 0 || left >= $viewportWidth) {
    return isVisibleFlag
  }

  // if the element is bound to some tolerance
  isVisibleFlag = settings.tolerance ? top <= settings.tolerance && bottom >= settings.tolerance : bottom > 0 && top <= $viewportHeight;

  return isVisibleFlag
}


// get the selector args from the args string proved by Sizzle
function getSelectorArgs(argsString) {
  if (argsString) {
    var args = argsString.split(',');

    // when user only gives viewport and no tolerance
    if (args.length === 1 && isNaN(args[0])) {
      args[1] = args[0];
      args[0] = void 0;
    }

    return {
      tolerance: args[0] ? args[0].trim() : void 0,
      viewport: args[1] ? $(args[1].trim()) : void 0
    }
  }
  return {}
}

})));

//# sourceMappingURL=isInViewport.js.map

// tools
String.format = function() {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    s = s.replace(reg, arguments[i + 1]);
  }
  return s;
};
function setCookie(cookieName,cookieValue,nDays) {
 var today = new Date();
 var expire = new Date();
 if (nDays==null || nDays==0) nDays=1;
 expire.setTime(today.getTime() + 3600000*24*nDays);
 document.cookie = cookieName+"="+escape(cookieValue)
                 + ";expires="+expire.toGMTString();
};
function readCookie(cookieName) {
 var re = new RegExp('[; ]'+cookieName+'=([^\\s;]*)');
 var sMatch = (' '+document.cookie).match(re);
 if (cookieName && sMatch) return unescape(sMatch[1]);
 return '';
};
// 插入聊天室窗與開關按鈕至<body>
$(document).ready(function(){
    var liveChat = '<div id="live-chat-button"></div>\
        <div id="live-chat">\
            <header class="clearfix">\
                <a href="#" class="chat-close">x</a>\
                <h4>bot</h4>\
                <span class="chat-message-counter" >0</span>\
            </header>\
            <div class="chat">\
                <div class="chat-history">\
                </div> <!-- end chat-history -->\
                <!--<p class="chat-feedback">Your partner is typing…</p>-->\
                <form id="message-form" onsubmit="submit_function(); return false;">\
                    <fieldset>\
                        <input type="text" id="message" placeholder="Type your message…" autofocus autocomplete="off">\
                        <input type="hidden">\
                    </fieldset>\
                </form>\
            </div> <!-- end chat -->\
        </div> <!-- end live-chat -->\
    '
    $('body').prepend(liveChat)
});
//var channels_url = '192.168.192.56:8000'
var session_id;
var socket;
var user_name = "你";
var user_picture;
var opponent_name = 'bot'
var opponent_picture;
var messageHistory = 4; // 一次取出 5 個歷史記錄，因為打招呼不會記錄但會加一，所以要先減一
                        // 注意修改時要跟 consumers.py 的初始載入數量配合
// listen event
$( document ).ready(function() {
    // 取得對方的圖像
    $.get("/get_profile_picture/"+'bot', function(picture_url) {
        opponent_picture = picture_url;
    });
    // 取得使用者的 session_id
    $.get("/get_session_id", function(response) {
        if (readCookie('live-chat')){
            session_id = readCookie('live-chat');
        }else{
            session_id = response;
            setCookie('live-chat',response,365);
        };
        // 取得使用者的頭像
        $.get("/get_profile_picture/"+session_id, function(picture_url) {
            user_picture = picture_url;
            // connect to channels
            socket = new WebSocket('ws://' + window.location.host + '/users/?session_id='+session_id);
            if (socket.readyState == WebSocket.OPEN) {
                socket.onopen();
            };
            socket.onmessage = function (message) {
                var data = JSON.parse(message.data);
                // 一般訊息的處理
                if (data["opponent_id"]){
                    updateLog(data["opponent_id"], opponent_picture, data["msg"], data["pic"]);
                    $('.chat-history').scrollTop($('.chat-history')[0].scrollHeight);
                    messageHistory += 1;
                // 歷史訊息的處理
                }else {
                    // 新增時，捲動保持在原本位置
                    var origin_height = $('.chat-history')[0].scrollHeight;
                    for (var m in data){
                        // 判斷是使用者或對方的訊息
                        if (data[m].opponent_id == session_id){
                            var name = user_name;
                            var profile_picture = user_picture;
                        }else{
                            var name = opponent_name;
                            var profile_picture = opponent_picture;
                        };
                        var msg = data[m].msg;
                        var pic = data[m].pic;
                        var post_date = data[m].post_date;
                        prependPreviousMessage(name, profile_picture, msg, pic, post_date);
                    };
                    var prepend_height = $('.chat-history')[0].scrollHeight;
                    $('.chat-history').scrollTop(prepend_height - origin_height);
                };
            };
        });
    });
	$('#live-chat header').on('click', function() {
		$('.chat').slideToggle(300, 'swing');
		if ($('.chat-message-counter').text() != "0"){
	        $('.chat-message-counter').fadeToggle(300, 'swing');
		};
	});
	$('.chat-close').on('click', function(e) {
		e.preventDefault();
		$('#live-chat').fadeToggle(300);
		$('#live-chat-button').fadeToggle(300, 'swing');

	});
	$('#live-chat-button').on('click',function(e){
        $('#live-chat').fadeToggle(300);
        $('#live-chat-button').fadeToggle(300, 'swing');
        if (!$('.chat').is(':visible')){
            $('.chat').slideToggle(300, 'swing');
        };
	});
    $(".chat-history").scroll(function(){
        view_check();
        if ($('.chat-history').scrollTop() == 0){
            var msg = {"text": "#getHistory", "session_id":session_id, "start":messageHistory, "end":messageHistory+5};
            socket.send(JSON.stringify(msg));
            messageHistory += 5;
	    }
    });
});

// connect to channels
function updateLog(name, profile_picture, chat_message, chat_picture) {
    var dt = new Date();
    var time = dt.getHours() + ":" + (dt.getMinutes()<10?'0':'') + dt.getMinutes()
    var ele =  '<div class="chat-message clearfix">\
                    <img class="img-radius" src="{0}" alt="" width="32" height="32">\
                    <div class="chat-message-content clearfix">\
                        <span class="chat-time">{1}</span>\
                        <h5>{2}</h5>\
                        {3}\
                        {4}\
                    </div>\
                </div>\
                <hr>'
    chat_message = (chat_message!=null)?('<p class="chat-message-text" view="false">' + chat_message + '</p>'):""
    chat_picture = (chat_picture!=null)?('<img src="' + chat_picture + '">'):""
    ele_format = String.format(ele, profile_picture, time, name, chat_message, chat_picture)
    $(".chat-history").append(ele_format);
    var message_number = parseInt($(".chat-message-counter").text());
    $(".chat-message-counter").text(message_number += 1);
}
function submit_function() {
    var inputText = $("#message").val();
    $("#message").val("");
    $("#message").focus();
    if (typeof(inputText) == "undefined" || inputText.length < 1) {}
    else {
        var msg = {"text": inputText, "session_id":session_id};
        socket.send(JSON.stringify(msg));
        updateLog(user_name, user_picture, inputText);
        view_check();
        messageHistory += 1;
    };
    $('.chat-history').scrollTop($('.chat-history')[0].scrollHeight);
};
function view_check(){
    $('.chat-message-text').isInViewport().each(function(){
        if ($(this).attr('view') == "false"){
            var message_number = parseInt($(".chat-message-counter").text());
            $(".chat-message-counter").text(message_number -= 1);
            $(this).attr('view', "true");
        };
    });
};
function prependPreviousMessage(name, profile_picture, chat_message, chat_picture, time){
    var ele =  '<div class="chat-message clearfix">\
                    <img class="img-radius" src="{0}" alt="" width="32" height="32">\
                    <div class="chat-message-content clearfix">\
                        <span class="chat-time">{1}</span>\
                        <h5>{2}</h5>\
                        {3}\
                        {4}\
                    </div>\
                </div>\
                <hr>';
    chat_message = (chat_message!=null)?('<p class="chat-message-text" view="true">' + chat_message + '</p>'):"";
    chat_picture = (chat_picture!=null)?('<img src="' + chat_picture + '">'):"";
    ele_format = String.format(ele, profile_picture, time, name, chat_message, chat_picture);
    $(".chat-history").prepend(ele_format);
};
