curl([
    'js!http://static.stackmob.com/js/underscore-1.3.3-min.js!exports=_',
    'js!http://static.stackmob.com/js/stackmob-js-0.5.5-min.js'
]).then(
    /**
     *
     * @param StackMob
     */
    function( _, stackmob ) {
        console.log(_);
    },
    /**
     *
     * @param ex
     */
    function ( ex ) {
        var msg = 'OH SNAP: ' + ex.message;
        alert(msg);
    }
);