/**
 * @See http://lostechies.com/derickbailey/2012/02/09/asynchronously-load-html-templates-for-backbone-views/
 */
Backbone.View.extend({
    //template: 'my-view-template',

    render: function( template ){
        var that = this;
        $.get("/templates/" + template + ".html", function(template){
            var html = $(template).tmpl();
            that.$el.html(html);
        });
        return this;
    }

});