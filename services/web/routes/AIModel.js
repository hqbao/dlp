exports.list = function(req, res) {
    const fs = require('fs');
    const jwt = require('jsonwebtoken');

    var token = req.header('Authorization');
    if (token) { token = token.replace('Bearer ', ''); }
    const cert = fs.readFileSync(global.settings.loginJwtCertPath);
    jwt.verify(token, cert, function(err, decoded) {
        if (err) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1001, msgResp: 'Unauthorized'}));
            res.end();
            return;
        }

        var search = {uid: decoded.uid};
        var sort = {_id: -1};
        var skip = req.query.skip ? parseInt(req.query.skip) : 0;
        var limit = req.query.limit ? parseInt(req.query.limit) : global.settings.defaultPagingLimit;

        const aiModelModel = require('../model/AIModel');
        aiModelModel.find(search, sort, skip, limit, function(aiModels) {
            res.writeHead(200, {});
            res.write(JSON.stringify({msgCode: 1000, msgResp: aiModels}));
            res.end();
        }, function(e){
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Unknown error'}));
            res.end();
        });
    });
};

exports.create = function(req, res) {
    const fs = require('fs');
    const jwt = require('jsonwebtoken');
    const moment = require('moment');

    var token = req.header('Authorization');
    if (token) { token = token.replace('Bearer ', ''); }
    var cert = fs.readFileSync(global.settings.loginJwtCertPath);
    jwt.verify(token, cert, function(err, decoded) {
        if (err) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1001, msgResp: 'Unauthorized'}));
            res.end();
            return;
        }

        var name = req.body.name;
        if (!name || name.length > 64) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Invalid model name'}));
            res.end();
            return;
        }

        var screenshot = req.body.screenshot;
        if (!screenshot) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1005, msgResp: 'Missing screenshot'}));
            res.end();
            return;
        }

        var model = req.body.model;

        var doc = {
            name: name,
            screenshot: screenshot,
            model: model,
            uid: decoded.uid,
            colabFileId: null,
            weights: null,
            trainResult: [],
            createdAt: moment().unix(),
        };

        const aiModelModel = require('../model/AIModel');
        aiModelModel.create(doc, function(aiModel) {
            res.writeHead(201, {});
            res.write(JSON.stringify({msgCode: 1000, msgResp: aiModel}));
            res.end();
        }, function(e) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1007, msgResp: 'Unknown error'}));
            res.end();
        });
    });
};

exports.update = function(req, res) {
    const fs = require('fs');
    const jwt = require('jsonwebtoken');

    var token = req.header('Authorization');
    if (token) { token = token.replace('Bearer ', ''); }
    var cert = fs.readFileSync(global.settings.loginJwtCertPath);
    jwt.verify(token, cert, function(err, decoded) {
        if (err) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1001, msgResp: 'Unauthorized'}));
            res.end();
            return;
        }

        var doc = {};

        var id = req.query.id;
        if (!id) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Missing ID'}));
            res.end();
            return;
        }

        var name = req.body.name;
        if (name) {
            if (name.length > 64) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1005, msgResp: 'Invalid model name'}));
                res.end();
                return;
            }

            doc['name'] = name;
        }

        var screenshot = req.body.screenshot;
        if (screenshot) {
            doc['screenshot'] = screenshot;
        }

        var model = req.body.model;
        if (model) {
            doc['model'] = model;
        }

        var colabFileId = req.body.colabFileId;
        if (colabFileId) {
            if (colabFileId.length > 256) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1007, msgResp: 'Invalid colab file ID'}));
                res.end();
                return;
            }

            doc['colabFileId'] = colabFileId;
        }

        var weights = req.body.weights;
        if (weights) {
            if (weights.length > 1024) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1007, msgResp: 'Invalid URL'}));
                res.end();
                return;
            }

            doc['weights'] = weights;
        }

        var trainResult = req.body.trainResult;
        if (trainResult) {
            doc['trainResult'] = trainResult;
        }

        const aiModelModel = require('../model/AIModel');
        aiModelModel.findById(id, function(aiModel) {
            if (!aiModel) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1009, msgResp: 'Item not found'}));
                res.end();
                return;
            }

            if (aiModel.uid != decoded.uid) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1011, msgResp: 'Invalid update request'}));
                res.end();
                return;
            }

            aiModelModel.update(id, doc, function() {
                res.writeHead(200, {});
                res.write(JSON.stringify({msgCode: 1000, msgResp: 'Success'}));
                res.end();
            }, function(e) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1013, msgResp: 'Unknown error'}));
                res.end();
            });
        }, function(e){
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1015, msgResp: 'Unknown error'}));
            res.end();
        });
    });
};

exports.detail = function(req, res) {
    const fs = require('fs');
    const jwt = require('jsonwebtoken');

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

        const aiModelModel = require('../model/AIModel');
        aiModelModel.findById(req.query.id, function(aiModel) {
            if (!aiModel) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1003, msgResp: 'Item not found'}));
                res.end();
                return;
            }

            if (aiModel.uid != decoded.uid) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1005, msgResp: 'Invalid request'}));
                res.end();
                return;
            }

            res.writeHead(200, {});
            res.write(JSON.stringify({msgCode: 1000, msgResp: aiModel}));
            res.end();
        }, function(e){
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1007, msgResp: 'Unknow error'}));
            res.end();
        });
    });
};

exports.delete = function(req, res) {
    const fs = require('fs');
    const jwt = require('jsonwebtoken');

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

        const aiModelModel = require('../model/AIModel');
        aiModelModel.findById(req.query.id, function(aiModel) {
            if (!aiModel) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1003, msgResp: 'Item not found'}));
                res.end();
                return;
            }

            if (aiModel.uid != decoded.uid) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1005, msgResp: 'Invalid request'}));
                res.end();
                return;
            }

            aiModelModel.delete(req.query.id, function() {
                res.writeHead(200, {});
                res.write(JSON.stringify({msgCode: 1000, msgResp: 'Success'}));
                res.end();
            }, function(e){
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1007, msgResp: 'Unknow error'}));
                res.end();
            });
        }, function(e){
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1009, msgResp: 'Unknow error'}));
            res.end();
        });
    });
};
