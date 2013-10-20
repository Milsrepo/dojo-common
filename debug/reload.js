define(['dijit/registry'], function(registry) {
    return function (module) {
        console.warn("Reload module ", module);
        if (module.replace) {
            var dijitName = module.replace(/\//g, ".");
            var arr = registry.toArray();
            for (var i in arr) {
                if (arr[i].declaredClass == dijitName) {
                    console.warn("Destroying widget ", dijitName);
                    arr[i].destroyRecursive && arr[i].destroyRecursive();
                }
            }
        }
        require.modules && require.modules[module] && delete require.modules[module];
    }
});