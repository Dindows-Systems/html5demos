curl = {
    baseUrl:            "/js/modules",
    /**
     * Define external modules:
     * -> StackMob
     * -> Twitter Bootstrap
     * -> Modernizr
     */
    paths: {
        "backbone":     "/js/libraries/backbone",
        "curl":         "/js/libraries/curl",
        "crypto.js":    "//static.stackmob.com/js/2.5.3-crypto-sha1-hmac.js",
        "jquery":       "//code.jquery.com/jquery-1.8.0.min",
        "json2.js":     "//static.stackmob.com/js/json2-min.js",
        "modernizr":    "//cdnjs.cloudflare.com/ajax/defines/modernizr/2.6.1/modernizr.min",
        "stackmob":     "defines/stackmob",
        "!text":        "/html/templates",
        "twbootstrap":  "//netdna.bootstrapcdn.com/twitter-bootstrap/2.0.4/js/bootstrap.min",
        "underscore":   "/js/libraries/underscore"
    }
};


/*
i have to create amd modules for each of these things basically that isn't AMD. or get the ones that are.
then test if it works.
    */