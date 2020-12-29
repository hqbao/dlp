exports.create = function(req, res) {
    const fs = require('fs');
    const jwt = require('jsonwebtoken');
    const moment = require('moment');

    var token = req.header('Authorization');
    if (token) { token = token.replace('Bearer ', ''); }
    var cert = fs.readFileSync(global.settings.loginJwtCertPath);
    jwt.verify(token, cert, function(err, decoded) {
        if (err) {
            res.writeHead(401, {});
            res.write(JSON.stringify({msgCode: 1001, msgResp: 'Unauthorized'}));
            res.end();
            return;
        }

        var message = req.body.message;
        if (!message || message.length > 4096) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Invalid message'}));
            res.end();
            return;
        }

        var photoUrl = req.body.photoUrl;

        var doc = {
            uid: decoded.uid,
            message: message,
            photoUrl: photoUrl,
            createdAt: moment().unix(),
        };

        const feedbackModel = require('../model/Feedback');
        feedbackModel.create(doc, function(feedback) {
            res.writeHead(200, {});
            res.write(JSON.stringify({msgCode: 1000, msgResp: 'Success'}));
            res.end();
        }, function(e) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1005, msgResp: 'Unknown error'}));
            res.end();
        });
    });
};
