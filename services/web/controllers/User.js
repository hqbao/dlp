exports.signIn = function(req, res) {
    res.render('user/sign-in', {});
};

exports.signUp = function(req, res) {
    res.render('user/sign-up', {});
};

exports.profile = function(req, res) {
    res.render('user/profile', {});
};
