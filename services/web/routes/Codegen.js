exports.generate = function(req, res) {
    var modelJson = undefined;
    try { modelJson = JSON.stringify(req.body.model); } catch (e) {}
    if (!modelJson) {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1001, msgResp: 'Invalid request'}));
        res.end();
        return;
    }

    var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress ||
    req.socket.remoteAddress || 
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
    if (!ip) {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1003, msgResp: 'IP not present'}));
        res.end();
        return;
    }

    const exec = require('child_process').exec;
    exec('./codegen/codegen.sh \''+ip+'\' \''+modelJson+'\'', function(err, stdout, stderr){
        if (err) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1005, msgResp: 'Unknow error'}));
            res.end();
            return;
        }

        const tokenPath = global.settings.GOOGLEAPP_tokenPath;
        const fs = require('fs');
        fs.readFile(tokenPath, 'utf8', (err, jToken) => {
            if (err) {
                res.writeHead(400, {});
                res.write(JSON.parse({msgCode: 1007, msgResp: 'Can not read token JSON'}));
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
                res.write(JSON.stringify({msgCode: 1009, msgResp: 'Unknow error'}));
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
                    name: 'codegen_'+Buffer.from(ip).toString('base64')+'.ipynb',
                });   
                restapi.post('www.googleapis.com', 443, 
                    '/drive/v3/files', 
                    'Bearer '+accessToken, jBdyStr, function(msgResp2) {
                    var filePath = './codegen/'+ip+'/play.ipynb';
                    fs.readFile(filePath, {encoding: 'utf-8'}, function(err, fileData){
                        if (err) {
                            res.writeHead(400, {});
                            res.write(JSON.stringify({msgCode: 1011, msgResp: 'Unknow error'}));
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
                            res.write(JSON.stringify({msgCode: 1013, msgResp: 'Unknow error'}));
                            res.end();
                        });
                    });
                }, function(msgCode) {
                    res.writeHead(400, {});
                    res.write(JSON.stringify({msgCode: 1015, msgResp: 'Unknow error'}));
                    res.end();
                });
            }, function(msgCode) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1017, msgResp: 'Unknow error'}));
                res.end();
            });
        });
    });
};
