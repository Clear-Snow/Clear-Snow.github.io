(function($){
    var $window = $(window),
        $body   = $('body'),
        $wrapper= $('#wrapper'),
        $header = $('#header'),
        $footer = $('#footer'),
        $main   = $('#main'),
        $main_articles = $main.children('article');

    breakpoints({
        xlarge: ['1281px', '1680px'],
        large:  ['981px',  '1280px'],
        medium: ['737px',  '980px' ],
        small:  ['481px',  '736px' ],
        xsmall: ['361px',  '480px' ],
        xxsmall: [null,   '360px' ]
    });

    $window.on('load', function(){
        window.setTimeout(function(){
            $body.removeClass('is-preload');
        }, 100);
    });

    if (navigator.userAgent.match(/MSIE|Trident/)) {
        var flexboxFix = function(){
            var $w = $(window);
            if ($wrapper.prop('scrollHeight') > $w.height())
                $wrapper.css('height', 'auto');
            else
                $wrapper.css('height', '100vh');
        };
        $window.on('resize.flexbox-fix', flexboxFix).triggerHandler('resize.flexbox-fix');
    }

    var $nav = $header.children('nav'),
        $nav_li = $nav.find('li');
    if ($nav_li.length % 2 === 0) {
        $nav.addClass('use-middle');
        $nav_li.eq($nav_li.length / 2).addClass('is-middle');
    }

    var delay = 325, locked = false;

    $main._show = function(id, initial){
        var $article = $main_articles.filter('#' + id);
        if (!$article.length) return;

        if (locked || initial === true) {
            $body.addClass('is-switching is-article-visible');
            $main_articles.removeClass('active');
            $header.hide(); $footer.hide();
            $main.show(); $article.show().addClass('active');
            locked = false;
            setTimeout(function(){ $body.removeClass('is-switching'); }, initial ? 1000 : 0);
            return;
        }

        locked = true;
        if ($body.hasClass('is-article-visible')) {
            var $current = $main_articles.filter('.active').removeClass('active');
            setTimeout(function(){
                $current.hide();
                $article.show();
                setTimeout(function(){
                    $article.addClass('active');
                    $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
                    setTimeout(function(){ locked = false; }, delay);
                }, 25);
            }, delay);
        } else {
            $body.addClass('is-article-visible');
            setTimeout(function(){
                $header.hide(); $footer.hide();
                $main.show(); $article.show();
                setTimeout(function(){
                    $article.addClass('active');
                    $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
                    setTimeout(function(){ locked = false; }, delay);
                }, 25);
            }, delay);
        }
    };

    $main._hide = function(addState){
        if (!$body.hasClass('is-article-visible')) return;
        if (addState === true) history.replaceState(null, null, '#');

        if (locked) {
            $body.addClass('is-switching');
            $main_articles.filter('.active').removeClass('active').hide();
            $main.hide();
            $footer.show(); $header.show();
            $body.removeClass('is-article-visible is-switching');
            $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
            locked = false;
            return;
        }

        locked = true;
        var $article = $main_articles.filter('.active').removeClass('active');
        setTimeout(function(){
            $article.hide(); $main.hide();
            $footer.show(); $header.show();
            setTimeout(function(){
                $body.removeClass('is-article-visible');
                $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
                setTimeout(function(){ locked = false; }, delay);
            }, 25);
        }, delay);
    };

    $main_articles.each(function(){
        var $this = $(this);
        $('<div class="close">Close</div>').appendTo($this).on('click', function(){
            location.hash = '';
        });
        $this.on('click', function(e){ e.stopPropagation(); });
    });

    $body.on('click', function(){ $main._hide(true); });
    $window.on('keyup', function(e){
        if (e.keyCode === 27 && $body.hasClass('is-article-visible')) $main._hide(true);
    });

    $window.on('hashchange', function(){
        if (location.hash === '' || location.hash === '#') $main._hide();
        else if ($main_articles.filter(location.hash).length) {
            $main._show(location.hash.substr(1));
        }
    });

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    $main.hide(); $main_articles.hide();
    if (location.hash && location.hash !== '#') {
        $window.on('load', function(){ $main._show(location.hash.substr(1), true); });
    }
})(jQuery);
