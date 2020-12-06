module.exports.get = function(host, port, path, token, success, failure) {
    var headers = {
        'User-Agent': 'DLP-web-server/1.0'
    };
    if (token) {
        headers['Authorization'] = token;
    }

    const https = require('https');
    // const https = require('http');
    const options = {
        hostname: host,
        port: port,
        path: path,
        method: 'GET',
        headers: headers
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
                failure(1999);
                return;
            }

            if (~~(response.statusCode/100) == 2) {
                success(body);
            }
            else {
                failure(body);
            }
        });
    });

    request.on('error', err => {
        failure(1998);
    });

    request.end();
};

module.exports.post = function(host, port, path, token, jBdyStr, success, failure) {
    var headers = {
        'User-Agent': 'DLP-web-server/1.0',
        'Content-Type': 'application/json',
        'Content-Length': jBdyStr.length
    };
    if (token) {
        headers['Authorization'] = token;
    }

    const https = require('https');
    // const https = require('http');
    const options = {
        hostname: host,
        port: port,
        path: path,
        method: 'POST',
        headers: headers
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
                failure(1999);
                return;
            }

            if (~~(response.statusCode/100) == 2) {
                success(body);
            }
            else {
                failure(body);
            }
        });
    });

    request.on('error', err => {
        failure(1998);
    });

    request.write(jBdyStr);
    request.end();
};

module.exports.postFile = function(host, port, path, token, fileData, success, failure) {
    var headers = {
        'User-Agent': 'DLP-web-server/1.0',
        'Content-Type': 'application/octet-stream',
    };
    if (token) {
        headers['Authorization'] = token;
    }

    const https = require('https');
    // const https = require('http');
    const options = {
        hostname: host,
        port: port,
        path: path,
        method: 'POST',
        headers: headers
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
                failure(1999);
                return;
            }

            if (~~(response.statusCode/100) == 2) {
                success(body);
            }
            else {
                failure(body);
            }
        });
    });

    request.on('error', err => {
        failure(1998);
    });

    request.write(fileData);
    request.end();
};

module.exports.put = function(host, port, path, token, jBdyStr, success, failure) {
    var headers = {
        'User-Agent': 'DLP-web-server/1.0',
        'Content-Type': 'application/json',
        'Content-Length': jBdyStr.length
    };
    if (token) {
        headers['Authorization'] = token;
    }

    const https = require('https');
    // const https = require('http');
    const options = {
        hostname: host,
        port: port,
        path: path,
        method: 'PUT',
        headers: headers
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
                failure(1999);
                return;
            }

            if (~~(response.statusCode/100) == 2) {
                success(body);
            }
            else {
                failure(body);
            }
        });
    });

    request.on('error', err => {
        failure(1998);
    });

    request.write(jBdyStr);
    request.end();
};

module.exports.patch = function(host, port, path, token, jBdyStr, success, failure) {
    var headers = {
        'User-Agent': 'DLP-web-server/1.0',
        'Content-Type': 'application/json',
        'Content-Length': jBdyStr.length
    };
    if (token) {
        headers['Authorization'] = token;
    }

    const https = require('https');
    // const https = require('http');
    const options = {
        hostname: host,
        port: port,
        path: path,
        method: 'PATCH',
        headers: headers
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
                failure(1999);
                return;
            }

            if (~~(response.statusCode/100) == 2) {
                success(body);
            }
            else {
                failure(body);
            }
        });
    });

    request.on('error', err => {
        failure(1998);
    });

    request.write(jBdyStr);
    request.end();
};

module.exports.patchFile = function(host, port, path, token, fileData, success, failure) {
    var headers = {
        'User-Agent': 'DLP-web-server/1.0',
        'Content-Type': 'application/octet-stream',
    };
    if (token) {
        headers['Authorization'] = token;
    }

    const https = require('https');
    // const https = require('http');
    const options = {
        hostname: host,
        port: port,
        path: path,
        method: 'PATCH',
        headers: headers
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
                failure(1999);
                return;
            }

            if (~~(response.statusCode/100) == 2) {
                success(body);
            }
            else {
                failure(body);
            }
        });
    });

    request.on('error', err => {
        failure(1998);
    });

    request.write(fileData);
    request.end();
};

module.exports.delete = function(host, port, path, token, success, failure) {
    var headers = {
        'User-Agent': 'DLP-web-server/1.0'
    };
    if (token) {
        headers['Authorization'] = token;
    }

    const https = require('https');
    // const https = require('http');
    const options = {
        hostname: host,
        port: port,
        path: path,
        method: 'DELETE',
        headers: headers
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
                failure(1999);
                return;
            }

            if (~~(response.statusCode/100) == 2) {
                success(body);
            }
            else {
                failure(body);
            }
        });
    });

    request.on('error', err => {
        failure(1998);
    });

    request.end();
};
