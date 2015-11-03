
// hash router

function routerParseOn(rule) {

    rule = rule.replace(/^\/+/, '');
    rule = rule.replace(/\/:[-\w]+\?/g, '(\\/[^\\/]+)?');
    rule = rule.replace(/\/:[-\w]+/g, '(\\/[^\\/]+)');
    
    return new RegExp('^'+rule+'$')
}

function routerParseStartWith(rule) {
    return new RegExp('^'+rule.replace(/^\/+/, '')+'(?:\\/(.*))?');
}

function Router() {

    var me = this,
        routes = [],
        each = function(callback){
            for (i = 0, len = routes.length; i < len; i++) {
                if (false === callback(routes[i], i)) return;
            }
        };

    this.listen = function(){
        var handler;
         window.addEventListener('hashchange', handler = function(e){
            var hash = window.location.hash.replace(/^#/, '');
            me.trigger(hash);
         });

        handler();

         return this;
    }

    this.startWith = function(rule, callback){
        routes.push([
            routerParseStartWith(rule),
            callback,
            rule
        ]);
    };

    this.on = function(rule, callback){
        routes.push([
            routerParseOn(rule),
            callback,
            rule
        ]);

        return this;
    };

    this.off = function(re){
        var i = routes.length;
        while (i--) {
            if (re.test(routes[i][2])) {
                routes.splice(i, 1);
            }
        }

        return this;
    };

    this.trigger = function(hash){
        var re, 
            match;

        each(function(rule, i){
            re = rule[0];
            callback = rule[1];
            if (match = hash.match(re)) {
                callback.apply(null, match.slice(1).map(function(v){return v ? v.replace(/^\//, '') : null;}));
                return;
            }
        }); 
    
    };
}

