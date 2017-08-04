/**
 * Created by kimilsik on 7/7/17.
 */

// private function
function _privatefunc (a, b) {
    return 'this is a private func ! ' + (a + b);
}

module.exports = {
    sum : function(a, b) {
        return a + b;
    },
    privateMessage : function(a, b) {
        return _privatefunc(a, b);
    }
};



