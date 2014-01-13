define([
], function(){
    return {
        trim: function(str, chr){
            if (!chr) {
                chr = '\\s';
            }
            return str.replace(new RegExp('^'+chr+'+|'+ chr+'+$', 'g'), '');
        }
    }
});
