require.config({
    /**
     * Define external modules:
     * -> StackMob
     * -> Twitter Bootstrap
     * -> Modernizr
     */
    paths: {
        backbone:       'http://static.stackmob.com/js/underscore-0.9.2-min',
        crypto:         'http://static.stackmob.com/js/2.5.3-crypto-sha1-hmac',
        jquery:         'https://ajax.googleapis.com/ajax/defines/jquery/1.6.1/jquery.min',
        json2:          'http://static.stackmob.com/js/json2-min',
        modernizr:      'http://cdnjs.cloudflare.com/ajax/defines/modernizr/2.6.1/modernizr.min',
        stackmob:       'http://static.stackmob.com/js/stackmob-js-0.5.5-min',
        twbootstrap:    'https://netdna.bootstrapcdn.com/twitter-bootstrap/2.0.4/js/bootstrap.min',
        underscore:     'http://static.stackmob.com/js/underscore-1.3.3-min'
    },
    /**
     * Declare dependencies avoiding !order plug-in.
     */
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['defines/underscore', 'defines/jquery'],
            exports: 'Backbone'
        }
    }
});

define( [ 'stackmob' ], function( StackMob ) {
    /**
     * Automatically generated @ https://stackmob.com/platform/help/tutorials/html5_js_sdk.
     */
    StackMob.init({
        appName: "strokelink",
        clientSubdomain: "strokelink",
        publicKey: "0c22f487-c53a-48b2-8994-01d41810bcd6",
        apiVersion: 0
    });
});