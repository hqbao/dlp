exports.list = function(req, res) {
    const fs = require('fs');
    const jwt = require('jsonwebtoken');

    var token = req.header('Authorization');
    if (token) { token = token.replace('Bearer ', ''); }
    const cert = fs.readFileSync(global.settings.loginJwtCertPath);
    jwt.verify(token, cert, function(err, decoded) {
        if (err) {
            res.writeHead(401, {});
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
            res.writeHead(401, {});
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
        var type = null;
        var datasetName = null;
        if (model) {
            var jModel = JSON.parse(model);
            for (var i = 0; i < jModel.vertices.length; i++) {
                var vertex = jModel.vertices[i];
                switch (vertex.blockType) {
                    case 'IMAGE_CLASSIFICATION_DATAGEN':
                        type = 'IMAGE_CLASSIFICATION_DATAGEN';
                        break;
                    case 'OBJECT_DETECTION_DATAGEN':
                        type = 'OBJECT_DETECTION_DATAGEN';
                        break;
                    case 'OBJECT_DETECTION_4TIERS_DATAGEN':
                        type = 'OBJECT_DETECTION_4TIERS_DATAGEN';
                        break;
                    case 'HEATMAP_REGRESSION_DATAGEN':
                        type = 'HEATMAP_REGRESSION_DATAGEN';
                        break;
                }

                if (type != null) break;
            }

            datasetName = vertex.params.dataset_name;
        }

        var doc = {
            name: name,
            screenshot: screenshot,
            type: type,
            datasetName: datasetName,
            model: model,
            uid: decoded.uid,
            colabFileId: null,
            weights: null,
            trainLoss: [],
            testLoss: [],
            TP: [],
            FP: [],
            FN: [],
            precision: [],
            recall: [],
            bestPrecision: 0.0,
            bestPrecisionWeights: null,
            bestRecall: 0.0,
            bestRecallWeights: null,
            bestAccuracy: 0.0,
            bestAccuracyWeights: null,
            converting: false,
            converted: false,
            tfjsModelUrl: null,
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
            res.writeHead(401, {});
            res.write(JSON.stringify({msgCode: 1001, msgResp: 'Unauthorized'}));
            res.end();
            return;
        }

        var id = req.query.id;
        if (!id) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Missing ID'}));
            res.end();
            return;
        }

        var doc = {};

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
            var jModel = JSON.parse(model);
            var type = null;
            for (var i = 0; i < jModel.vertices.length; i++) {
                var vertex = jModel.vertices[i];
                switch (vertex.blockType) {
                    case 'IMAGE_CLASSIFICATION_DATAGEN':
                        type = 'IMAGE_CLASSIFICATION_DATAGEN';
                        break;
                    case 'OBJECT_DETECTION_DATAGEN':
                        type = 'OBJECT_DETECTION_DATAGEN';
                        break;
                    case 'OBJECT_DETECTION_4TIERS_DATAGEN':
                        type = 'OBJECT_DETECTION_4TIERS_DATAGEN';
                        break;
                    case 'HEATMAP_REGRESSION_DATAGEN':
                        type = 'HEATMAP_REGRESSION_DATAGEN';
                        break;
                }

                if (type != null) break;
            }

            doc['type'] = type;
            doc['datasetName'] = vertex.params.dataset_name;
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
                res.write(JSON.stringify({msgCode: 1009, msgResp: 'Invalid URL'}));
                res.end();
                return;
            }

            doc['weights'] = weights;
        }

        var trainLoss = req.body.trainLoss;
        if (trainLoss) {
            if (!Array.isArray(trainLoss)) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1011, msgResp: 'Train loss must be array'}));
                res.end();
                return;
            }

            doc['trainLoss'] = trainLoss;
        }

        var testLoss = req.body.testLoss;
        if (testLoss) {
            if (!Array.isArray(testLoss)) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1013, msgResp: 'Test loss must be array'}));
                res.end();
                return;
            }

            doc['testLoss'] = testLoss;
        }

        var TP = req.body.TP;
        if (TP) {
            if (!Array.isArray(TP)) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1015, msgResp: 'TP must be array'}));
                res.end();
                return;
            }

            doc['TP'] = TP;
        }

        var FP = req.body.FP;
        if (FP) {
            if (!Array.isArray(FP)) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1015, msgResp: 'FP must be array'}));
                res.end();
                return;
            }

            doc['FP'] = FP;
        }

        var FN = req.body.FN;
        if (FN) {
            if (!Array.isArray(FN)) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1015, msgResp: 'FN must be array'}));
                res.end();
                return;
            }

            doc['FN'] = FN;
        }

        var precision = req.body.precision;
        if (precision) {
            if (!Array.isArray(precision)) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1015, msgResp: 'Precision must be array'}));
                res.end();
                return;
            }

            doc['precision'] = precision;
        }

        var recall = req.body.recall;
        if (recall) {
            if (!Array.isArray(recall)) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1017, msgResp: 'Recall must be array'}));
                res.end();
                return;
            }

            doc['recall'] = recall;
        }

        var bestPrecision = req.body.bestPrecision;
        if (bestPrecision) {
            if (bestPrecision < 0 || bestPrecision > 1) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1019, msgResp: 'Invalid precision value'}));
                res.end();
                return;
            }

            doc['bestPrecision'] = bestPrecision;
        }

        var bestPrecisionWeights = req.body.bestPrecisionWeights;
        if (bestPrecisionWeights) {
            if (bestPrecisionWeights.length > 1024) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1021, msgResp: 'Invalid URL'}));
                res.end();
                return;
            }

            doc['bestPrecisionWeights'] = bestPrecisionWeights;
        }

        var bestRecall = req.body.bestRecall;
        if (bestRecall) {
            if (bestRecall < 0 || bestRecall > 1) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1023, msgResp: 'Invalid recall value'}));
                res.end();
                return;
            }

            doc['bestRecall'] = bestRecall;
        }

        var bestRecallWeights = req.body.bestRecallWeights;
        if (bestRecallWeights) {
            if (bestRecallWeights.length > 1024) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1025, msgResp: 'Invalid URL'}));
                res.end();
                return;
            }

            doc['bestRecallWeights'] = bestRecallWeights;
        }

        var bestAccuracy = req.body.bestAccuracy;
        if (bestAccuracy) {
            if (bestAccuracy < 0 || bestAccuracy > 1) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1027, msgResp: 'Invalid accuracy value'}));
                res.end();
                return;
            }

            doc['bestAccuracy'] = bestAccuracy;
        }

        var bestAccuracyWeights = req.body.bestAccuracyWeights;
        if (bestAccuracyWeights) {
            if (bestAccuracyWeights.length > 1024) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1029, msgResp: 'Invalid URL'}));
                res.end();
                return;
            }

            doc['bestAccuracyWeights'] = bestAccuracyWeights;
        }

        const aiModelModel = require('../model/AIModel');
        aiModelModel.findById(id, function(aiModel) {
            if (!aiModel) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1031, msgResp: 'Item not found'}));
                res.end();
                return;
            }

            if (aiModel.uid != decoded.uid) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1033, msgResp: 'Invalid update request'}));
                res.end();
                return;
            }

            aiModelModel.update(id, doc, function() {
                res.writeHead(200, {});
                res.write(JSON.stringify({msgCode: 1000, msgResp: 'Success'}));
                res.end();
            }, function(e) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1035, msgResp: 'Unknown error'}));
                res.end();
            });
        }, function(e){
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1037, msgResp: 'Unknown error'}));
            res.end();
        });
    });
};

exports.updateTrainResult = function(req, res) {
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

        var id = req.query.id;
        if (!id) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Missing ID'}));
            res.end();
            return;
        }

        const aiModelModel = require('../model/AIModel');
        aiModelModel.findById(id, function(aiModel) {
            if (!aiModel) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1005, msgResp: 'Item not found'}));
                res.end();
                return;
            }

            if (aiModel.uid != decoded.uid) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1007, msgResp: 'Invalid update request'}));
                res.end();
                return;
            }

            var doc = {};

            var weights = req.body.weights;
            if (weights) {
                if (weights.length > 1024) {
                    res.writeHead(400, {});
                    res.write(JSON.stringify({msgCode: 1009, msgResp: 'Invalid URL'}));
                    res.end();
                    return;
                }

                doc['weights'] = weights;
            }

            var eTrainLoss = req.body.eTrainLoss;
            var eTestLoss = req.body.eTestLoss;
            var eTP = req.body.eTP;
            var eFP = req.body.eFP;
            var eFN = req.body.eFN;
            if (!Array.isArray(eTrainLoss) || 
                !Array.isArray(eTestLoss) || 
                !Array.isArray(eTP) || 
                !Array.isArray(eFP) || 
                !Array.isArray(eFN)) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1011, msgResp: 'Invalid format'}));
                res.end();
                return;
            }

            eTrainLoss = eTrainLoss.reduce((a, b) => a + b, 0) / eTrainLoss.length;
            var trainLoss = aiModel.trainLoss;
            trainLoss.push(eTrainLoss);
            doc['trainLoss'] = trainLoss;

            eTestLoss = eTestLoss.reduce((a, b) => a + b, 0) / eTestLoss.length;
            var testLoss = aiModel.testLoss;
            testLoss.push(eTestLoss);
            doc['testLoss'] = testLoss;

            eTP = eTP.reduce((a, b) => a + b, 0) / eTP.length;
            var TP = aiModel.TP;
            TP.push(eTP);
            doc['TP'] = TP;

            eFP = eFP.reduce((a, b) => a + b, 0) / eFP.length;
            var FP = aiModel.FP;
            FP.push(eFP);
            doc['FP'] = FP;

            eFN = eFN.reduce((a, b) => a + b, 0) / eFN.length;
            var FN = aiModel.FN;
            FN.push(eFN);
            doc['FN'] = FN;

            var ePrecision = eTP/(eTP+eFP);
            var precision = aiModel.precision;
            precision.push(ePrecision);
            doc['precision'] = precision;
            if (ePrecision > aiModel.bestPrecision) {
                doc['bestPrecision'] = ePrecision;
                doc['bestPrecisionWeights'] = weights;
            }

            var eRecall = eTP/(eTP+eFN);
            var recall = aiModel.recall;
            recall.push(eRecall);
            doc['recall'] = recall;
            if (eRecall > aiModel.bestRecall) {
                doc['bestRecall'] = eRecall;
                doc['bestRecallWeights'] = weights;
            }

            var accuracy = (ePrecision+eRecall)/2;
            if (accuracy > aiModel.bestAccuracy) {
                doc['bestAccuracy'] = accuracy;
                doc['bestAccuracyWeights'] = weights;
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

        var id = req.query.id;
        if (id.length != 12 && id.length != 24) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Missing ID'}));
            res.end();
            return;
        }

        const aiModelModel = require('../model/AIModel');
        aiModelModel.findById(id, function(aiModel) {
            if (!aiModel) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1005, msgResp: 'Item not found'}));
                res.end();
                return;
            }

            if (aiModel.uid != decoded.uid) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1007, msgResp: 'Invalid request'}));
                res.end();
                return;
            }

            res.writeHead(200, {});
            res.write(JSON.stringify({msgCode: 1000, msgResp: aiModel}));
            res.end();
        }, function(e){
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1009, msgResp: 'Unknow error'}));
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

exports.convert = function(req, res) {
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

        var id = req.query.id;
        if (id.length != 12 && id.length != 24) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Missing ID'}));
            res.end();
            return;
        }

        const aiModelModel = require('../model/AIModel');
        aiModelModel.findById(id, function(aiModel) {
            if (!aiModel) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1005, msgResp: 'Item not found'}));
                res.end();
                return;
            }

            var converting = aiModel.converting;
            if (converting == true) {
                res.writeHead(200, {});
                res.write(JSON.stringify({msgCode: 1000, msgResp: 'Model is being converted'}));
                res.end();
                return;
            }

            if (aiModel.uid != decoded.uid) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1007, msgResp: 'Invalid request'}));
                res.end();
                return;
            }

            var modelJson = aiModel.model;
            if (!modelJson) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1009, msgResp: 'Empty model'}));
                res.end();
                return;
            }

            var weightsFileUrl = aiModel.bestAccuracyWeights ? aiModel.bestAccuracyWeights : aiModel.weights;
            if (!weightsFileUrl) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1011, msgResp: 'Weights not exist'}));
                res.end();
                return;
            }

            var settings = req.body.settings;
            if (!settings) {
                settings = '{}';
            }

            function updateStatus(converted) {
                aiModelModel.update(id, {converting: false, converted: converted}, function() {}, function(e) {
                    console.log('Update status failed ('+id+'), this should be re-updated in cronjob');
                });
            }

            aiModelModel.update(id, {converting: true}, function() {
                res.writeHead(200, {});
                res.write(JSON.stringify({msgCode: 1000, msgResp: 'Command ordered'}));
                res.end();

                var weightsFilePath = './codegen/'+decoded.uid+'/weights.h5';
                const https = require('https');
                const request = https.get(weightsFileUrl, function(response) {
                    response.pipe(fs.createWriteStream(weightsFilePath));

                    const exec = require('child_process').exec;
                    exec('./codegen/codegen_convert.sh \''+decoded.uid+'\' \''+modelJson+'\' '+weightsFilePath+' \''+settings+'\'', function(err, stdout, stderr) {
                        if (err || stdout.slice(-7) != 'Success') {
                            updateStatus(false);
                            return;
                        }

                        var zipModelFilePath = './codegen/'+decoded.uid+'/model.zip';
                        var output = fs.createWriteStream(zipModelFilePath);
                        var archiver =  require('archiver');
                        var zipArchive = archiver('zip');
                        zipArchive.on('error', function(err){
                            updateStatus(false);
                        });
                        output.on('close', function () {
                            fs.readFile(zipModelFilePath, {}, function(err, fileData) {
                                if (err) {
                                    updateStatus(false);
                                    return;
                                }

                                const restapi = require('../components/RestAPI');
                                restapi.postFile('ai-designer.io', 443, '/upload/tfjs', undefined, fileData, function(msg) {
                                    aiModelModel.update(id, {tfjsModelUrl: msg.msgResp.url}, function() {
                                        updateStatus(true);
                                    }, function(e) {
                                        updateStatus(false);
                                    });
                                }, function(msgCode) {
                                    updateStatus(false);
                                });
                            });
                        });
                        zipArchive.pipe(output);
                        zipArchive.directory('./codegen/'+decoded.uid+'/tfjs/', false);
                        zipArchive.finalize();
                    });
                });
                request.on('error', function(err) {
                    updateStatus(false);
                });
            }, function(e) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1013, msgResp: 'Unknown error'}));
                res.end();
            });
        }, function(e){
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1015, msgResp: 'Unknow error'}));
            res.end();
        });
    });
};
