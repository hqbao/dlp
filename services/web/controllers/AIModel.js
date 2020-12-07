exports.list = function(req, res) {
    res.render('ai-model/index', {});
};

exports.detail = function(req, res) {
    res.render('ai-model/detail', {});
};

exports.playDigits = function(req, res) {
    res.render('ai-model/play-digits', {});
};