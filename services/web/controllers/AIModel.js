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

exports.playMnistDigits = function(req, res) {
    res.render('ai-model/play-mnist-digits', {});
};

exports.playFingers = function(req, res) {
    res.render('ai-model/play-fingers', {});
};

exports.playFace1024 = function(req, res) {
    res.render('ai-model/play-face1024', {});
};

exports.playFaceali128x128 = function(req, res) {
    res.render('ai-model/play-faceali128x128', {});
};