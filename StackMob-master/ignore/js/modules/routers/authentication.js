curl([
    'jquery',
    'underscore',
    'backbone'
]).then(
    /**
     *
     * @param Backbone
     * @return {Object}
     */
    function (Backbone) {
        var AppRouter = Backbone.Router.extend({
            routes: {
                '/login':   'login',
                '/logout':  'logout'
            },
            login: function(){

            },

            logout: function(){

            }
        });

        var initialize = function(){
            var app_router = new AppRouter;
            Backbone.history.start();
        };
        return {
            initialize: initialize
        };
    },
    /**
     *
     * @param ex
     */
    function (ex) {
        var msg = 'OH SNAP: ' + ex.message;
        alert(msg);
    }
);