var scripts = [
    "query/query.js",
    "test/testLoding.js"
]

for(var i=0; i<scripts.length; ++i) {
    $.getScript(scripts[i], function() {
        console.log(scripts[i]+" loaded but not necessarily executed.");
     });
}
