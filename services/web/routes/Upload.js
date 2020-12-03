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

        var fileName = moment().unix()+'_'+file.name;
        var oldpath = file.path;
        var newpath = './public/upload/images/'+type+'/'+fileName;
        fs.rename(oldpath, newpath, function (err) {
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

        var fileName = moment().unix()+'_'+file.name;
        var oldpath = file.path;
        var newpath = './public/upload/weights/'+fileName;
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                console.log(err);
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
