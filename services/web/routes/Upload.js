exports.image = function(req, res) {
    const formidable = require('formidable');
    const fs = require('fs');
    const moment = require('moment');

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1001, msgResp: 'Error'}));
            res.end();
            return;
        }

        var type = fields['type'];
        if (!['user', 'feedback'].includes(type)) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Invalid type'}));
            res.end();
            return;
        }

        var file = files['file'];
        if (!file) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1005, msgResp: 'File not found'}));
            res.end();
            return;
        }

        var fileName = moment().valueOf()+'_'+file.name;
        var oldPath = file.path;
        var newPath = './public/upload/images/'+type+'/'+fileName;
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1007, msgResp: 'Error'}));
                res.end();
                return;
            }
            
            res.writeHead(200, {});
            res.write(JSON.stringify({msgCode: 1000, msgResp: {url: req.protocol+'://'+req.headers.host+'/upload/images/'+type+'/'+fileName}}));
            res.end();
        });
    });
};

exports.weights = function(req, res) {
    const formidable = require('formidable');
    const fs = require('fs');
    const moment = require('moment');

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1001, msgResp: 'Error'}));
            res.end();
            return;
        }

        var file = files['file'];
        if (!file) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'File not found'}));
            res.end();
            return;
        }

        var fileName = moment().valueOf()+'_'+file.name;
        var oldPath = file.path;
        var newPath = './public/upload/weights/'+fileName;
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1005, msgResp: 'Error'}));
                res.end();
                return;
            }
            
            res.writeHead(200, {});
            res.write(JSON.stringify({msgCode: 1000, msgResp: {url: req.protocol+'://'+req.headers.host+'/upload/weights/'+fileName}}));
            res.end();
        });
    });
};

exports.tfjs = function(req, res) {
    const formidable = require('formidable');
    const fs = require('fs');
    const unzipper = require('unzipper');
    const moment = require('moment');

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1001, msgResp: 'Error'}));
            res.end();
            return;
        }

        var file = files['file'];
        if (!file) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'File not found'}));
            res.end();
            return;
        }

        var subdir = moment().valueOf();
        var uploadFileName = 'model.zip';
        var oldPath = file.path;
        var newPath = './public/upload/tfjs/'+uploadFileName;
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1005, msgResp: 'Error'}));
                res.end();
                return;
            }

            // Unzip
            fs.createReadStream(newPath)
            .pipe(unzipper.Extract({ path: './public/upload/tfjs/'+subdir+'/'}))
            .on('error', function(e) {
                fs.unlinkSync(newPath);

                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1007, msgResp: 'Error'}));
                res.end();
            })
            .on('close', function() {
                fs.unlinkSync(newPath);

                res.writeHead(200, {});
                res.write(JSON.stringify({msgCode: 1000, msgResp: {url: req.protocol+'://'+req.headers.host+'/upload/tfjs/'+subdir+'/model.json'}}));
                res.end();
            });
        });
    });
};

exports.faceid = function(req, res) {
    const formidable = require('formidable');
    const fs = require('fs');
    const moment = require('moment');
    const jwt = require('jsonwebtoken');

    var token = req.header('Authorization');
    if (token) { token = token.replace('Bearer ', ''); }
    const cert = fs.readFileSync(global.settings.loginJwtCertPath);
    jwt.verify(token, cert, function(err, decoded) {
        var ip = req.headers['x-forwarded-for'] || 
        req.connection.remoteAddress ||
        req.socket.remoteAddress || 
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
        var userDir = ip;
        if (!err) {
            userDir = decoded.uid;
        }

        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1001, msgResp: 'Error'}));
                res.end();
                return;
            }

            var faceidDir = fields['id'];
            if (!faceidDir) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1003, msgResp: 'Missing face ID'}));
                res.end();
                return;
            }

            var file = files['file'];
            if (!file) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1005, msgResp: 'File not found'}));
                res.end();
                return;
            }

            var path = './public/upload/faceid';
            if (!fs.existsSync(path+'/'+userDir)){ fs.mkdirSync(path+'/'+userDir); }
            if (!fs.existsSync(path+'/'+userDir+'/'+faceidDir)){ fs.mkdirSync(path+'/'+userDir+'/'+faceidDir); }

            var fileName = moment().valueOf()+'_'+file.name;
            var oldPath = file.path;
            var newPath = path+'/'+userDir+'/'+faceidDir+'/'+fileName;
            fs.rename(oldPath, newPath, function (err) {
                if (err) {
                    console.log(err);
                    res.writeHead(400, {});
                    res.write(JSON.stringify({msgCode: 1007, msgResp: 'Error'}));
                    res.end();
                    return;
                }
                
                res.writeHead(200, {});
                res.write(JSON.stringify({msgCode: 1000, msgResp: {url: req.protocol+'://'+req.headers.host+'/upload/faceid/'+userDir+'/'+faceidDir+'/'+fileName}}));
                res.end();
            });
        });
    });
};

exports.archiveFaceid = function(req, res) {
    const fs = require('fs');
    const jwt = require('jsonwebtoken');

    var token = req.header('Authorization');
    if (token) { token = token.replace('Bearer ', ''); }
    const cert = fs.readFileSync(global.settings.loginJwtCertPath);
    jwt.verify(token, cert, function(err, decoded) {
        var ip = req.headers['x-forwarded-for'] || 
        req.connection.remoteAddress ||
        req.socket.remoteAddress || 
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
        var userDir = ip;
        if (!err) {
            userDir = decoded.uid;
        }

        var path = './public/upload/faceid/';
        var zipModelFilePath = path+userDir+'.zip';
        var dirToArchive = path+userDir;

        fs.unlink(zipModelFilePath, function(err) {});

        var output = fs.createWriteStream(zipModelFilePath, {overwrite: true});
        output.on('error', function(err){
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Error'}));
            res.end();
        });
        output.on('close', function () {
            fs.readFile(zipModelFilePath, {}, function(err, fileData) {
                if (err) {
                    res.writeHead(400, {});
                    res.write(JSON.stringify({msgCode: 1005, msgResp: 'Can\'t archive'}));
                    res.end();
                    return;
                }

                res.writeHead(200, {});
                res.write(JSON.stringify({msgCode: 1000, msgResp: {url: req.protocol+'://'+req.headers.host+'/upload/faceid/'+userDir+'.zip'}}));
                res.end();
            });
        });

        var archiver = require('archiver');
        var zipArchive = archiver('zip');
        zipArchive.on('error', function(err){
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1001, msgResp: 'Archive exception'}));
            res.end();
        });
        zipArchive.pipe(output);
        zipArchive.directory(dirToArchive, false);
        zipArchive.finalize();
    });
};

exports.listWeightsFiles = function(req, res) {
    const fs = require('fs');
    fs.readdir('./public/upload/weights/', (err, files) => {
        res.writeHead(200, {});
        res.write(JSON.stringify({msgCode: 1000, msgResp: files}));
        res.end();
    });
};

exports.listTFJS = function(req, res) {
    const fs = require('fs');
    fs.readdir('./public/upload/tfjs/', (err, files) => {
        res.writeHead(200, {});
        res.write(JSON.stringify({msgCode: 1000, msgResp: files}));
        res.end();
    });
};
