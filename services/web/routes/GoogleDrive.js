exports.signIn = function(req, res) {
    const fs = require('fs');
    const {google} = require('googleapis');

    const tokenPath = global.settings.GOOGLEAPP_tokenPath;
    fs.readFile(tokenPath, (err, token) => {
        if (err) {
            const clientId = global.settings.GOOGLEAPP_clientId;
            const clientSecret = global.settings.GOOGLEAPP_clientSecret;
            const redirectURI = global.settings.GOOGLEAPP_redirectURI;
            const scopes = global.settings.GOOGLEAPP_scopes;
            const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectURI);
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes,
            });
            res.writeHead(200, {});
            res.write('<a href="'+authUrl+'">'+authUrl+'</a>');
            res.end();
            return;
        }

        res.writeHead(200, {});
        res.write('Got token');
        res.end();
    });
};

exports.signInReturn = function(req, res) {
    var code = req.query.code;
    if (!code) {
        res.writeHead(200, {});
        res.write('Invalid request (no code)');
        res.end();
    }

    const fs = require('fs');
    const {google} = require('googleapis');

    const clientId = global.settings.GOOGLEAPP_clientId;
    const clientSecret = global.settings.GOOGLEAPP_clientSecret;
    const redirectURI = global.settings.GOOGLEAPP_redirectURI;
    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectURI);
    oAuth2Client.getToken(code, (err, token) => {
        if (err) {
            res.writeHead(200, {});
            res.write('Error retrieving access token');
            res.end();
            return;
        }

        const tokenPath = global.settings.GOOGLEAPP_tokenPath;
        fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
            if (err) {
                res.writeHead(200, {});
                res.write('Error retrieving access token');
                res.end();
                return;
            }

            res.writeHead(200, {});
            res.write('Got token');
            res.end();
        });
    });
};

exports.list = function(req, res) {
    res.writeHead(200, {});
    res.write(JSON.stringify({msgCode: 1000, msgResp: orders}));
    res.end();
};