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
            res.write(JSON.stringify({msgCode: 1000, msgResp: {url: 'https://ai-designer.io/upload/images/'+type+'/'+fileName}}));
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
            res.write(JSON.stringify({msgCode: 1000, msgResp: {url: 'https://ai-designer.io/upload/weights/'+fileName}}));
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
                res.write(JSON.stringify({msgCode: 1000, msgResp: {url: 'https://ai-designer.io/upload/tfjs/'+subdir+'/model.json'}}));
                res.end();
            });
        });
    });
};
