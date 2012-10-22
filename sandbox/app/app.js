window.closestEnabledButton = function ( element ) {
    var cname;

    while ( element ) {
		// Note that we check for typeof className below because the element we
		// handed could be in an SVG DOM where className on SVG elements is defined to
		// be of a different type (SVGAnimatedString). We only operate on HTML DOM
		// elements, so we look for plain "string".
        cname = ( typeof element.className === 'string' ) && (element.className + ' ');
        if ( cname && cname.indexOf("ui-btn ") > -1 && cname.indexOf("ui-disabled ") < 0 ) {
            break;
        }

        element = element.parentNode;
    }

    return element;
};

var classes = {'active' : 'ui-btn-active'};
var pattern = [];
var drawing_pattern = false;
var addDigit = function (elem_id) {
    if (!drawing_pattern) return;
    var digit = elem_id.charAt(elem_id.length-1);
    if ($.inArray(digit, pattern) == -1) {
        var elem = $('#' + elem_id);
        elem.addClass(classes.active);
        pattern.push(digit);
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

(function() {

window.print = function (str, level) {
    if (!level || level < 0) return;
    if ($('.log').length == 0) $('#page2').append($('<div class="log">'));
    if (typeof console != 'undefined') console.log(str);
    if (typeof str == 'object') {
        var sub = [];
        for (var k in str) {
            sub.push(k + ':' + str[k]);
        }
        str = sub.join('\n');
    }
    $('.log').append($('<pre>').text(str));
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

[
'touchstart',
'touchmove',
'touchenter',
'touchend',
'touchcancel',
'click',
'hover',
'drag',
'onmousedown',
'mousedown',
'mouseup',
'mouseenter',
'mouseover',
'drag',
'hover'
].map(function (event_type) {
        //$('#page2 a').map(function (index, elem) { elem.addEventListener(event_type, function(e) {
    var last_pos_hash = 1000000; var last_pos_time = 0;
    document.addEventListener(event_type, function(e) {
        if ((drawing_pattern == false) && ($.inArray(event_type, ['touchstart', 'mousedown']) == -1)) {
            return;
        }
        if (event_type != 'touchmove') {
            var target = closestEnabledButton(e.target);
            if (!target) return;
        }

        switch (event_type) {
            case 'touchstart':
            case 'mousedown':
                print(event_type);
                start(target.id);
                e.preventDefault();
                break;
            case 'touchend':
            case 'mouseup':
                print(event_type);
                end(target.id);
                e.preventDefault();
                break;
            case 'mouseover':
            case 'drag':
            case 'hover':
                print(event_type);
                addDigit(target.id);
                e.preventDefault();
                break;
            case 'touchmove':
                var new_touch = e.touches[e.touches.length - 1];
                var x = new_touch.clientX,
                    y = new_touch.clientY,
                    now = new Date().getTime();
                if (Math.abs(last_pos_hash - x - y) > 30 || last_pos_time - now > 200) {
                    print(event_type);
                    findAndAddDigit(x, y, '#page2 a');
                    last_pos_hash = x + y;
                    last_pos_time = now;
                }
                break;
        }
        //return false;
    }, false)});

var findAndAddDigit = function(x, y, selector) {
    var digits = $(selector);
    for (var index in digits) {
        var digit = $(digits[index]),
            position = digit.position(),
            min_y = position.top,
            max_y = position.top + digit.height(),
            min_x = position.left,
            max_x = position.left + digit.width();
        //print([min_x, x, max_x, ' - ', min_y, y, max_y]);
        if (y > min_y && y <= max_y && x > min_x && x <= max_x) {
            addDigit(digit.attr('id'));
            break;
        }
    }
};
})();
