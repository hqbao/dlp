exports.generate = function(req, res) {
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

        var aiModelId = req.body.aiModelId;
        if (!aiModelId || (aiModelId.length != 12 && aiModelId.length != 24)) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Invalid model ID'}));
            res.end();
            return;
        }

        const aiModelModel = require('../model/AIModel');
        aiModelModel.findById(aiModelId, function(aiModel) {
            if (!aiModel) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1007, msgResp: 'AI model not found'}));
                res.end();
                return;
            }

            var modelJson = undefined;
            try { modelJson = JSON.stringify(aiModel.model); } catch (e) {}
            if (!modelJson) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1009, msgResp: 'Invalid JSON model'}));
                res.end();
                return;
            }

            var encodedToken = JSON.stringify({id: aiModelId, jwtToken: token})
            const exec = require('child_process').exec;
            exec('./codegen/codegen.sh \''+decoded.uid+'\' '+modelJson+' \''+encodedToken+'\'', function(err, stdout, stderr){
                if (err || stdout != 'Success\n') {
                    res.writeHead(400, {});
                    res.write(JSON.stringify({msgCode: 1011, msgResp: 'Unknow error'}));
                    res.end();
                    return;
                }

                const tokenPath = global.settings.GOOGLEAPP_refreshTokenPath;
                const fs = require('fs');
                fs.readFile(tokenPath, 'utf8', (err, jToken) => {
                    if (err) {
                        res.writeHead(400, {});
                        res.write(JSON.stringify({msgCode: 1013, msgResp: 'Can not read token JSON'}));
                        res.end();
                        return;
                    }

                    var accessToken = undefined;
                    try {
                        token = JSON.parse(jToken);
                        accessToken = token.access_token;
                    }
                    catch (e) {}
                    
                    if (!accessToken) {
                        res.writeHead(400, {});
                        res.write(JSON.stringify({msgCode: 1015, msgResp: 'Unknow error'}));
                        res.end();
                        return;
                    }

                    const restapi = require('../components/GDriveRestAPI');
                    restapi.get('www.googleapis.com', 443, 
                        '/drive/v3/files/generateIds?count=1', 
                        'Bearer '+accessToken, function(msgResp1) {
                        var id = msgResp1.ids[0];
                        var jBdyStr = JSON.stringify({
                            parents: ['1VffZdAFvzsjVbxrCnANUu-YCa8eUfxap'],
                            mimeType: 'application/vnd.google.colaboratory',
                            id: id,
                            name: 'codegen_'+decoded.uid+'.ipynb',
                        });   
                        restapi.post('www.googleapis.com', 443, 
                            '/drive/v3/files', 
                            'Bearer '+accessToken, jBdyStr, function(msgResp2) {
                            var filePath = './codegen/'+decoded.uid+'/train.ipynb';
                            fs.readFile(filePath, {encoding: 'utf-8'}, function(err, fileData){
                                if (err) {
                                    res.writeHead(400, {});
                                    res.write(JSON.stringify({msgCode: 1017, msgResp: 'Unknow error'}));
                                    res.end();
                                    return;
                                }

                                restapi.patchFile('www.googleapis.com', 443, 
                                    '/upload/drive/v3/files/'+id+'?uploadType=media',
                                    'Bearer '+accessToken, fileData, function(msgResp3) {

                                    res.writeHead(200, {});
                                    res.write(JSON.stringify({msgCode: 1000, msgResp: {colabUrl: 'https://colab.research.google.com/drive/'+id}}));
                                    res.end();
                                }, function(msgCode) {
                                    res.writeHead(400, {});
                                    res.write(JSON.stringify({msgCode: 1019, msgResp: 'Unknow error'}));
                                    res.end();
                                });
                            });
                        }, function(msgCode) {
                            res.writeHead(400, {});
                            res.write(JSON.stringify({msgCode: 1021, msgResp: 'Unknow error'}));
                            res.end();
                        });
                    }, function(msgCode) {
                        res.writeHead(400, {});
                        res.write(JSON.stringify({msgCode: 1023, msgResp: 'Unknow error'}));
                        res.end();
                    });
                });
            });
        }, function(e) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1025, msgResp: 'Unknown error'}));
            res.end();
        });
    });
};
