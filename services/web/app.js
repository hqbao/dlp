const express = require('express');
const https = require('https');
// const http = require('http');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const securityAudit = require('./components/SecurityAudit');

// Global settings
global.settings = {
    sslCertPath: './ssl-cert/certificate.crt',
    sslCAPath: './ssl-cert/ca_bundle.crt',
    sslPrivateKeyPath: './ssl-cert/private.key',
    loginJwtCert: './token-cert/jwt-token.crt',
    webServiceEndPoint: 'https://dlp.fansipan.io',
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

// Start http
const httpsServer = https.createServer(credentials, app);
// const httpsServer = http.createServer(app);
httpsServer.listen(app.get('port'), function() {
    console.log('[DLP Service] API server listening on port ' + app.get('port'));
});
