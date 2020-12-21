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
        if (!['user'].includes(type)) {
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

exports.deleteWeightsFiles = function(req, res) {
    var fs = require('fs');

    var authPassword = req.header('Authorization');
    if (authPassword != global.settings.authPassword) {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1001, msgResp: 'Unauthorized'}));
        res.end();
        return;
    }

    var path = req.body.path;
    if (!path) {
        path = path.replace(req.protocol+'://'+req.headers.host, '');
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1003, msgResp: 'Missing path'}));
        res.end();
        return;
    }

    fs.unlink('./public'+path, (err) => {
        res.writeHead(200, {});
        res.write(JSON.stringify({msgCode: 1000, msgResp: 'Success'}));
        res.end();
    });
};

exports.deleteTFJS = function(req, res) {
    var fs = require('fs');

    var authPassword = req.header('Authorization');
    if (authPassword != global.settings.authPassword) {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1001, msgResp: 'Unauthorized'}));
        res.end();
        return;
    }

    var path = req.body.path;
    if (!path) {
        path = path.replace(req.protocol+'://'+req.headers.host, '');
        path = path.replace('/model.json', '');
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1003, msgResp: 'Missing path'}));
        res.end();
        return;
    }

    fs.rmdir('./public'+path, { recursive: true }, function(err) {
        res.writeHead(200, {});
        res.write(JSON.stringify({msgCode: 1000, msgResp: 'Success'}));
        res.end();
    });
};
