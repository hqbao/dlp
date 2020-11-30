const express = require('express');
const https = require('https');
// const http = require('http');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const securityAudit = require('./components/SecurityAudit');
const gdrive = require('./routes/GoogleDrive');
const codegen = require('./routes/Codegen');

// Global settings
global.settings = {
    sslCertPath: './ssl-cert/ai-designer.io/certificate.crt',
    sslCAPath: './ssl-cert/ai-designer.io/ca_bundle.crt',
    sslPrivateKeyPath: './ssl-cert/ai-designer.io/private.key',
    loginJwtCert: './token-cert/jwt-token.crt',
    webServiceEndPoint: 'https://ai-designer.io',
    GOOGLEAPP_apiKey: 'AIzaSyAwuK6oxj3WWhAz-vGf_fWCXssuMrRu4qM',
    GOOGLEAPP_clientId: '210397520506-84pgv2tomkdqmvb5cv4hk7d37ifre5d7.apps.googleusercontent.com',
    GOOGLEAPP_clientSecret: '7WBSTo3UDvKk66gBPRlCWIw4',
    GOOGLEAPP_redirectURI: 'https://ai-designer.io/gdrive/sign-in-return',
    GOOGLEAPP_scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/drive.metadata',
        'https://www.googleapis.com/auth/drive.appdata',
    ],
    GOOGLEAPP_tokenPath: './misc/token.json',
};

// ssl
const certificate =fs.readFileSync(global.settings.sslCertPath, {encoding: 'utf8'}, function(err, data) {});
const ca  = fs.readFileSync(global.settings.sslCAPath, {encoding: 'utf8'}, function(err, data) {});
const privateKey  = fs.readFileSync(global.settings.sslPrivateKeyPath, {encoding: 'utf8'}, function(err, data) {});
const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
    rejectUnauthorized:false
};

const app = express();

// All environments
app.set('port', 443);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
    securityAudit.check(req, function() {
        const allowedOrigins = [
            global.settings.webServiceEndPoint,
        ];
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }

        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    }, function(errorMsg) {
        console.log(securityAudit.getLockedIPList());
        res.writeHead(520, {});
        res.write(JSON.stringify({msgCode: 1099, msgResp: errorMsg}));
        res.end();
    });
});

app.get('/', function(req, res) {
    res.writeHead(200, {});
    res.write(JSON.stringify({
        name: 'DLP service', 
        version: '1.0'
    }));
    res.end();
});
app.get('/gdrive/sign-in', gdrive.signIn);
app.get('/gdrive/sign-in-return', gdrive.signInReturn);
app.get('/gdrive/list', gdrive.list);
app.post('/codegen/generate', codegen.generate);

// Start http
const httpsServer = https.createServer(credentials, app);
// const httpsServer = http.createServer(app);
httpsServer.listen(app.get('port'), function() {
    console.log('[DLP Service] API server listening on port ' + app.get('port'));
});
