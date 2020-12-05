var cron = require('node-cron');

cron.schedule('*/28 * * * *', () => {
	refreshToken();
});

function refreshToken() {
    const https = require('https');
    const options = {
        hostname: 'ai-designer.io',
        port: 443,
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