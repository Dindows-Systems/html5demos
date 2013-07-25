curl([
    "stackmob"
]).then(

    function( StackMob ) {
        console.log( StackMob );

    },

    function ( ex ) {
        var msg = 'OH SNAP: ' + ex.message;
        alert(msg);
    }
);