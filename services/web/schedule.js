var cron = require('node-cron');

// Global settings
global.settings = {
    webServiceDomain: 'ai-designer.io',
    webServicePort: 443,
};

cron.schedule('*/28 * * * *', () => {
	refreshToken();
});

cron.schedule('*/5 * * * * *', () => {
    clearWeightFiles();
    clearTFJS();
});

function refreshToken() {
    const https = require('https');
    const options = {
        hostname: global.settings.webServiceDomain,
        port: global.settings.webServicePort,
        path: '/gdrive/refresh',
        method: 'GET',
        headers: {'User-Agent': 'DLP-web-server/1.0'}
    };

    const request = https.request(options, response => {
        var data = '';
        response.on('data', chunk => {
            data += chunk;
        });

        response.on('end', () => {
            var body = null;
            try { body = JSON.parse(data); }
            catch (err) {}

            if (body == null) {
                console.log('NULL');
                return;
            }

            if (~~(response.statusCode/100) == 2) {}
            else {
                console.log(body);
            }
        });
    });

    request.on('error', err => {
        console.log(err);
    });

    request.end();
};

function clearWeightFiles() {
    var fs = require('fs');
    var restapi = require('./components/RestAPI');
    restapi.get(global.settings.webServiceDomain, global.settings.webServicePort, '/upload/list-weights-files', null, function(msg1) {
        var weightsFiles = msg1.msgResp;
        restapi.get(global.settings.webServiceDomain, global.settings.webServicePort, '/api/aimodel/list-weights-files', null, function(msg2) {
            var inUseWeightsFiles = msg2.msgResp;
            var inUseWeightsFileDict = {};
            for (var i = 0; i < inUseWeightsFiles.length; i++) {
                var inUseWeightsFile = inUseWeightsFiles[i];
                var tobereplace = 'https://'+global.settings.webServiceDomain+':'+global.settings.webServicePort+'/upload/weights/';
                tobereplace = tobereplace.replace(':80', '');
                tobereplace = tobereplace.replace(':443', '');
                inUseWeightsFile = inUseWeightsFile.replace(tobereplace, '');
                inUseWeightsFileDict[inUseWeightsFile] = 1;
            }

            var keepIndices = [];
            for (var i = 0; i < weightsFiles.length; i++) {
                var weightsFile = weightsFiles[i];
                if (weightsFile in inUseWeightsFileDict) {
                    keepIndices.push(i);
                }
            }

            for (var i = keepIndices.length-1; i >= 0; i--) {
                weightsFiles.splice(keepIndices[i], 1);
            }

            for (var i = 0; i < weightsFiles.length; i++) {
                var removeFilePath = './public/upload/weights/'+weightsFiles[i];
                fs.unlink(removeFilePath, function(err) {
                    if (err) {
                        console.log('Can\'t remove '+removeFilePath+' because of '+err);
                    }
                });
            }
        }, function(msgCode) {
            console.log('1: '+msgCode);
        });
    }, function(msgCode) {
        console.log('2: '+msgCode);
    });
}

function clearTFJS() {
    var fs = require('fs');
    var restapi = require('./components/RestAPI');
    restapi.get(global.settings.webServiceDomain, global.settings.webServicePort, '/upload/list-tfjs', null, function(msg1) {
        var tfjsFolders = msg1.msgResp;
        restapi.get(global.settings.webServiceDomain, global.settings.webServicePort, '/api/aimodel/list-tfjs', null, function(msg2) {
            var inUseTFJSFolders = msg2.msgResp;
            var inUseTFJSFolderDict = {};
            for (var i = 0; i < inUseTFJSFolders.length; i++) {
                var inUseTFJSFolder = inUseTFJSFolders[i];
                var tobereplace = 'https://'+global.settings.webServiceDomain+':'+global.settings.webServicePort+'/upload/tfjs/';
                tobereplace = tobereplace.replace(':80', '');
                tobereplace = tobereplace.replace(':443', '');
                inUseTFJSFolder = inUseTFJSFolder.replace(tobereplace, '');
                inUseTFJSFolder = inUseTFJSFolder.replace('model.json', '')
                inUseTFJSFolderDict[inUseTFJSFolder] = 1;
            }

            var keepIndices = [];
            for (var i = 0; i < tfjsFolders.length; i++) {
                var tfjsFolder = tfjsFolders[i];
                if (tfjsFolder in inUseTFJSFolderDict) {
                    keepIndices.push(i);
                }
            }

            for (var i = keepIndices.length-1; i >= 0; i--) {
                tfjsFolders.splice(keepIndices[i], 1);
            }

            for (var i = 0; i < tfjsFolders.length; i++) {
                var removeFilePath = './public/upload/weights/'+tfjsFolders[i];
                fs.rmdir(removeFilePath, { recursive: true }, function(err) {
                    if (err) {
                        console.log('Can\'t remove '+removeFilePath+' because of '+err);
                    }
                });
            }
        }, function(msgCode) {
            console.log('3: '+msgCode);
        });
    }, function(msgCode) {
        console.log('4: '+msgCode);
    });
}
