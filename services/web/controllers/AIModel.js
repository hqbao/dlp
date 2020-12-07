exports.list = function(req, res) {
    res.render('ai-model/index', {});
};

exports.detailIC = function(req, res) {
    res.render('ai-model/detail-ic', {});
};

exports.detailOD = function(req, res) {
    res.render('ai-model/detail-od', {});
};

exports.detailOD4 = function(req, res) {
    res.render('ai-model/detail-od4', {});
};

exports.detailHM = function(req, res) {
    res.render('ai-model/detail-hm', {});
};

exports.playDigits = function(req, res) {
    res.render('ai-model/play-digits', {});
};