exports.signIn = function(req, res) {
    const fs = require('fs');
    const {google} = require('googleapis');

    const tokenPath = global.settings.GOOGLEAPP_tokenPath;
    fs.readFile(tokenPath, (err, jtokenStr) => {
        if (err) {
            fs.readFile(global.settings.GOOGLEAPP_clientPath, 'utf8', (err, jClientSettingsStr) => {
                if (err) {
                    res.writeHead(400, {});
                    res.write(JSON.stringify({msgCode: 1001, msgResp: 'Can not read client settings file'}));
                    res.end();
                    return;
                }

                var clientSettings = undefined;
                try { var clientSettings = JSON.parse(jClientSettingsStr); }
                catch (e) {}
                if (!clientSettings) {
                    res.writeHead(400, {});
                    res.write(JSON.stringify({msgCode: 1003, msgResp: 'Can not parse JSON'}));
                    res.end();
                    return;
                }

                const scopes = global.settings.GOOGLEAPP_scopes;
                const oAuth2Client = new google.auth.OAuth2(
                    clientSettings.web.client_id, 
                    clientSettings.web.client_secret, 
                    clientSettings.web.redirect_uris[0]);
                const authUrl = oAuth2Client.generateAuthUrl({
                    access_type: 'offline',
                    scope: scopes,
                    prompt: 'consent', // Always first time authorize
                });

                res.writeHead(200, {});
                res.write('<a href="'+authUrl+'">'+authUrl+'</a>');
                res.end();
            });
            return;
        }

        res.writeHead(200, {});
        res.write('Token available');
        res.end();
    });
};

exports.signInReturn = function(req, res) {
    var code = req.query.code;
    if (!code) {
        res.writeHead(400, {});
        res.write('Invalid request (no code)');
        res.end();
    }

    const fs = require('fs');
    const {google} = require('googleapis');

    fs.readFile(global.settings.GOOGLEAPP_clientPath, 'utf8', (err, jClientSettingsStr) => {
        if (err) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1001, msgResp: 'Can not read client settings file'}));
            res.end();
            return;
        }

        var clientSettings = undefined;
        try { var clientSettings = JSON.parse(jClientSettingsStr); }
        catch (e) {}
        if (!clientSettings) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Can not parse JSON'}));
            res.end();
            return;
        }

        const scopes = global.settings.GOOGLEAPP_scopes;
        const oAuth2Client = new google.auth.OAuth2(
            clientSettings.web.client_id, 
            clientSettings.web.client_secret, 
            clientSettings.web.redirect_uris[0]);
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                res.writeHead(400, {});
                res.write('Error when retrieving access token');
                res.end();
                return;
            }

            const tokenPath = global.settings.GOOGLEAPP_tokenPath;
            fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
                if (err) {
                    res.writeHead(400, {});
                    res.write('Error when saving token');
                    res.end();
                    return;
                }

                res.writeHead(302, {location: "/gdrive/refresh"});
                res.end();
            });
        });
    });
};

exports.refresh = function(req, res) {
    const https = require('https');
    const options = {
        hostname: 'oauth2.googleapis.com',
        port: 443,
        path: '/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
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
            
            const tokenPath = global.settings.GOOGLEAPP_refreshTokenPath;
            fs.writeFile(tokenPath, JSON.stringify(body), (err) => {
                if (err) {
                    res.writeHead(400, {});
                    res.write('Error when saving token');
                    res.end();
                    return;
                }

                res.writeHead(200, {});
                res.write(JSON.stringify({msgCode: 1001, msgResp: 'Token refreshed'}));
                res.end();
            });
        });
    });

    request.on('error', err => {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1001, msgResp: 'Error'}));
        res.end();
    });

    const fs = require('fs');
    fs.readFile(global.settings.GOOGLEAPP_clientPath, 'utf8', (err, jClientSettingsStr) => {
        if (err) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Can not read client settings file'}));
            res.end();
            return;
        }

        var clientSettings = undefined;
        try { var clientSettings = JSON.parse(jClientSettingsStr); }
        catch (e) {}
        if (!clientSettings) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1005, msgResp: 'Can not parse JSON'}));
            res.end();
            return;
        }

        fs.readFile(global.settings.GOOGLEAPP_tokenPath, 'utf8', (err, jTokenStr) => {
            if (err) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1007, msgResp: 'Can not read token file'}));
                res.end();
                return;
            }

            var token = undefined;
            try { var token = JSON.parse(jTokenStr); }
            catch (e) {}
            if (!token) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1009, msgResp: 'Can not parse JSON'}));
                res.end();
                return;
            }

            request.write('client_id='+clientSettings.web.client_id+'&client_secret='+clientSettings.web.client_secret+'&refresh_token='+token.refresh_token+'&grant_type=refresh_token');
            request.end();
        });
    });
};
