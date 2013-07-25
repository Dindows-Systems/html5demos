curl(
    [
        'js!plainOldJsFile1.js!order',
        'js!anotherPlainOldJsFile.js!order'
    ]
).then(
    function () {
        /* do something with your plain, boring javascript files */
    },
    function () {
        /* do something if any fail to load */
    }
);