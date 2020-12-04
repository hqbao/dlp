const express = require('express');
const https = require('https');
// const http = require('http');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const securityAudit = require('./components/SecurityAudit');
const user = require('./routes/User');
const aiModel = require('./routes/AIModel');
const codegen = require('./routes/Codegen');
const gdrive = require('./routes/GoogleDrive');
const upload = require('./routes/Upload');
const cUser = require('./controllers/User');
const cIndex = require('./controllers/Index');
const cDLT = require('./controllers/DLT');

// Global settings
global.settings = {
    loginLockedTimeCoefficient: 5,
    loginAllowedRetries: 4,
    loginJwtPeriod: 24*3600,
    resetPasswordPeriod: 1*300,
    mailService: 'gmail',
    mailTransporterID: 'baofair001@gmail.com',
    mailSenderID: 'baofair001@gmail.com',
    mailSenderPass: '123!@#qweQWE',
    loginJwtCertPath: './token-cert/jwt-token.crt',
    loginJwtPrivateKeyPath: './token-cert/jwt-token.key',
    sslCertPath: './ssl-cert/ai-designer.io/certificate.crt',
    sslCAPath: './ssl-cert/ai-designer.io/ca_bundle.crt',
    sslPrivateKeyPath: './ssl-cert/ai-designer.io/private.key',
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
    defaultPagingLimit: 20,
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
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '16mb'}));
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

app.get('/api', function(req, res) {
    res.writeHead(200, {});
    res.write(JSON.stringify({
        name: 'DLP service', 
        version: '1.0'
    }));
    res.end();
});

app.post('/api/user/login', user.login);
app.post('/api/user/register', user.register);
app.patch('/api/user/update', user.update);
app.get('/api/user/detail', user.detail);
app.patch('/api/user/change-password', user.changePassword);
app.patch('/api/user/reset-password', user.resetPassword);
app.delete('/api/user/delete', user.delete);

app.get('/api/aimodel/list', aiModel.list);
app.post('/api/aimodel/create', aiModel.create);
app.patch('/api/aimodel/update', aiModel.update);
app.get('/api/aimodel/detail', aiModel.detail);
app.delete('/api/aimodel/delete', aiModel.delete);

app.post('/api/codegen/generate', codegen.generate);

app.get('/gdrive/sign-in', gdrive.signIn);
app.get('/gdrive/sign-in-return', gdrive.signInReturn);
app.get('/gdrive/list', gdrive.list);

app.post('/upload/image', upload.image);
app.post('/upload/weights', upload.weights);

app.get('/', cIndex.index);
app.get('/sign-in', cUser.signIn);
app.get('/sign-up', cUser.signUp);
app.get('/dlt', cDLT.index);

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://bao:123qweASD@127.0.0.1:27017/dlp";
MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
    if (err) {
        console.log(err);
        return;
    }

    // Set mongoDB
    global.mongoDB = db;

    // Start http
    var httpsServer = https.createServer(credentials, app);
    // const httpsServer = http.createServer(app);
    httpsServer.listen(app.get('port'), function() {
        console.log('[Web Service] API server listening on port ' + app.get('port'));
    });
});
