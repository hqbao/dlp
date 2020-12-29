exports.listMyModels = function(req, res) {
    res.render('ai-model/list-my-models', {});
};

exports.listTopModels = function(req, res) {
    res.render('ai-model/list-top-models', {});
};

exports.detailIC = function(req, res) {
    res.render('ai-model/detail-ic', {});
};

exports.detailOD = function(req, res) {
    res.render('ai-model/detail-od', {});
};

exports.detailHM = function(req, res) {
    res.render('ai-model/detail-hm', {});
};

exports.playDigitsRecognition = function(req, res) {
    res.render('ai-model/play-digits-recognition', {});
};

exports.playFaceId = function(req, res) {
    res.render('ai-model/play-face-id', {});
};

exports.playFingers = function(req, res) {
    res.render('ai-model/play-fingers', {});
};

exports.playFaceDetection = function(req, res) {
    res.render('ai-model/play-face-detection', {});
};

exports.playFace5landmarksDetection = function(req, res) {
    res.render('ai-model/play-face-5landmarks-detection', {});
};