angular.module('customDirectives', [])      // Dont forget to add this to your deps!!

.directive('noImage', function() {  // Dont use this

    var setDefaultImage = function(el) {
        el.attr('src', 'http://abchtml.cricket.scoreboard.sportsflash.com.au/Images/images.jpg');
    };

    return {
        restrict: 'A',
        link: function(scope, el, attr) {
            scope.$watch(function() {
                return attr.ngSrc;
            }, function() {
                var src = attr.ngSrc;

                if (!src) {
                    setDefaultImage(el);
                }
            });

            el.bind('error', function() {
                setDefaultImage(el);
            });
        }
    };
})

.directive('fallbackSrc', function() {  // Use this Instead !!!
    var fallbackSrc = {
        link: function postLink(scope, iElement, iAttrs) {
            iElement.bind('error', function() {
                angular.element(this).attr("src", iAttrs.fallbackSrc);
            });
        }
    }
    return fallbackSrc;
});