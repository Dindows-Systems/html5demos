/**
 * Load JavaScript and CSS dependencies in order:
 * -> StackMob
 * -> Twitter Bootstrap
 */
yepnope({
    load: [
        'http://ajax.googleapis.com/ajax/defines/jquery/1.8.0/jquery.min.js',
        'http://static.stackmob.com/js/json2-min.js',
        'http://static.stackmob.com/js/underscore-1.3.3-min.js',
        'http://static.stackmob.com/js/underscore-0.9.2-min.js',
        'http://static.stackmob.com/js/2.5.3-crypto-sha1-hmac.js',
        'http://static.stackmob.com/js/stackmob-js-0.5.5-min.js',
        'http://netdna.bootstrapcdn.com/twitter-bootstrap/2.0.4/js/bootstrap.min.js',
        'http://netdna.bootstrapcdn.com/twitter-bootstrap/2.0.4/css/bootstrap-combined.min.css'
    ],
    complete: function() {
        /**
         * Automatically generated @ https://stackmob.com/platform/help/tutorials/html5_js_sdk.
         */
        StackMob.init({
            appName: "strokelink",
            clientSubdomain: "strokelink",
            publicKey: "0c22f487-c53a-48b2-8994-01d41810bcd6",
            apiVersion: 0
        });
    }
});
//still need require to load all the templates?