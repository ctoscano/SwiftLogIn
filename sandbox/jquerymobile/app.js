$(function() {

window.print = function (str, level) {
    if (!level || level < 0) return;
    if ($('#log').length == 0) $('#page1').append($('<div id="log">'));
    if (typeof console != 'undefined') console.log(str);
    if (typeof str == 'object') {
        var sub = [];
        for (var k in str) {
            sub.push(k + ':' + str[k]);
        }
        str = sub.join('\n');
    }
    $('#log').append($('<pre>').text(str));
};

$('#camera-btn').click(function (e) {
    $('#camera-input').click();
});

$('#camera-input').change(function() {
    var form = $('form');
    var postData = postData = new FormData(form[0]);
    $.post(form.attr('action'), function (response) {
        print(response);
        $.mobile.changePage("#page2");
    });
    $.mobile.changePage("#page2");
});


var grid = $('.ui-grid-b');

[
//'touchstart',
'touchmove',
'touchenter',
//'touchend',
//'touchcancel',
//'click',
//'hover',
//'drag'
].map(function (event_type) {
    $('#page2 a').map(function (index, elem) { elem.addEventListener(event_type, function(e) {
        print('event: ' + event_type)
        var target = closestEnabledButton(e.target);
        if (!target) return;
        e.preventDefault();
        if (event_type.indexOf('touch') != -1) {
            var touch = e.touches[0];
            print(event_type + ': ' + touch.pageX + " - " + touch.pageY, 1);
            addDigit(target.id);
            print(target.id, 1);
            print(e.current,1);
        } else {
            print(event_type + ' , ' + $(target).attr('id'), 1);
            print(e);
        }
        return false;
    }, false)});
    });

var classes = {'active' : 'ui-btn-active'};
var pattern = [];
var drawing_pattern = false;
var addDigit = function (elem_id) {
    if (!drawing_pattern) return;
    var elem = $('#' + elem_id);
    if (!elem.hasClass(classes.active)) {
        pattern.push($.trim(elem.text()));
        elem.addClass(classes.active);
        print('adding ' + elem_id);
    }
};
var start = function (elem_id) {
    print('Starting pattern with ' + elem_id);
    drawing_pattern = true;
    addDigit(elem_id);
};
var end = function (elem_id) {
    print('Ending pattern with ' + elem_id);
    addDigit(elem_id);
    drawing_pattern = false;
    print('Final pattern: ' + pattern.join(), 1);
    pattern = [];
    $('.btn-digit').removeClass(classes.active);
};

var events = {
    'starters' : ['touchstart', 'mousedown', 'drag'],
    'enders' : ['touchend', 'touchcancel', 'mouseup'],
    'overs' : ['onmouseenter', 'touchenter', 'vmouseover', 'mouseover', 'mouseenter', 'hover', 'touchmove', 'vmousemove']
};
events.starters.map(function(event_type) {
    document.addEventListener(event_type, function(e) {
        e.preventDefault();
        var target = closestEnabledButton(e.target);
        if (!target) { print('out of bounds'); return false;}
        print('Starting');
        start(target.id);
        return false;
    }, false);
});
events.enders.map(function(event_type) {
    $( document ).on(event_type, '#page2', function(e) {
        e.preventDefault();
        var target = closestEnabledButton(e.target);
        if (!target) { print('out of bounds'); return false;}
        end(target.id);
        return false;
    }, false);
});
events.overs.map(function(event_type) {
    $( document ).on( event_type, '#page2 a', function(e) {
        print('Hover0', 1);
        e.preventDefault();
        if (!drawing_pattern) return;
        var target = closestEnabledButton(e.target);
        if (!target) { print('out of bounds'); return false;}
        print('Hover', 1);
        addDigit(target.id);
        return false;
    }, false);
});
if (true)
$('.btn-digit').hover(function(e) {
    e.preventDefault();
    if (!drawing_pattern) return;
    var target = closestEnabledButton(e.target);
    if (!target) { print('out of bounds'); return false;}
    print('Hover');
    addDigit(target.id);
    return false;
}, false);

var findDigit = function(x, y, selector) {
    var digits = $(selector);
    for (var index in digits) {
        var digit = $(digits[index]),
            position = digit.position(),
            min_y = position.top,
            max_y = position.top + digit.height(),
            min_x = position.left,
            max_x = position.left + digit.width();
        if (y > min_y && y <= max_y && x > min_x && x <= max_x) {
            addDigit(digit.attr('id'));
        }
    }
}
});
