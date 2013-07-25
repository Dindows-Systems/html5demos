curl([
    'js!stackmob.js'
]).then(
    function( StackMob ) {
        /**
         * Automatically generated @ https://stackmob.com/platform/help/tutorials/html5_js_sdk.
         */
        StackMob.init({
            appName:            'strokelink',
            clientSubdomain:    'strokelink',
            publicKey:          '0c22f487-c53a-48b2-8994-01d41810bcd6',
            apiVersion:         0
        });
    },
    function ( ex ) {
        var msg = 'OH SNAP: ' + ex.message;
        alert(msg);
    }
);