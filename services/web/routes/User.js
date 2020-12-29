exports.login = function(req, res) {
    const jwt = require('jsonwebtoken');
    const fs = require('fs');
    const { v4: uuidv4 } = require('uuid');
    const md5 = require('md5');
    const moment = require('moment');
    const userModel = require('../model/User');

    var email = req.body.email;
    var password = req.body.password;

    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email || !emailRegexp.test(email)) {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1001, msgResp: 'Invalid account ID/password'}));
        res.end();
        return;
    }

    if (!password || password.length < 6) {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1003, msgResp: 'Invalid account ID/password'}));
        res.end();
        return;
    }
    
    userModel.find({email: email}, {}, function(users) {
        // No user found
        if (!users || users.length < 1) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1005, msgResp: 'Invalid account ID/password'}));
            res.end();
            return;
        }

        var user = users[0];
        var lockedTimeCoeff = global.settings.loginLockedTimeCoefficient;
        var allowedRetries = global.settings.loginAllowedRetries;

        // User account got locked
        if (moment().unix() <= user.loginLockedTime) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1007, msgResp: 'User account got locked in '+(lockedTimeCoeff*(user.loginTryCount-allowedRetries))+' seconds'}));
            res.end();
            return;
        }

        // Found user but incorrect password
        if (user.password != md5(password)) {
            var loginLockedTime = 0;
            if (user.loginTryCount >= allowedRetries) {
                loginLockedTime = moment().unix()+lockedTimeCoeff*(user.loginTryCount-allowedRetries+1);
            }

            var update = {
                loginTryCount: user.loginTryCount+1, 
                loginLockedTime: loginLockedTime,
            };

            userModel.update(user._id, update, function() {
                var leftRetries = allowedRetries-user.loginTryCount > 0 ? allowedRetries-user.loginTryCount : 0;
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1009, msgResp: {'leftRetries': leftRetries+1}}));
                res.end();
            }, function(e) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1011, msgResp: 'Unknown error'}));
                res.end();
            });
            return;
        }

        var ip = req.headers['x-forwarded-for'] || 
        req.connection.remoteAddress ||
        req.socket.remoteAddress || 
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
        var ipSet = new Set(user.ipSet);
        ipSet.add(ip);

        var update = {
            loginTryCount: 0, 
            ipSet: Array.from(ipSet),
        };

        userModel.update(user._id, update, function() {
            var privKey = fs.readFileSync(global.settings.loginJwtPrivateKeyPath);
            var header = {algorithm: 'ES256'};
            var payload = {
                iss: 'Cobee',
                sub: 'O=ai-designer.io,E='+user.email,
                aud: user.email,
                jti: uuidv4(),
                exp: Math.floor(Date.now()/1000)+global.settings.loginJwtPeriod,
                iat: Math.floor(Date.now()/1000),
                uid: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                postalCode: user.postalCode,
                photoUrl: user.photoUrl,
            };
            token = jwt.sign(payload, privKey, header);

            res.writeHead(200, {});
            res.write(JSON.stringify({msgCode: 1000, msgResp: {token: token}}));
            res.end();
        }, function(e) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1013, msgResp: 'Unknown error'}));
            res.end();
        });
    }, function(e) {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1014, msgResp: 'Unknown error'}));
        res.end();
    });
};

exports.register = function(req, res) {
    const jwt = require('jsonwebtoken');
    const fs = require('fs');
    const { v4: uuidv4 } = require('uuid');
    const md5 = require('md5');
    const moment = require('moment');
    const userModel = require('../model/User');

    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var phone = req.body.phone;
    var postalCode = req.body.postal_code;
    var photoUrl = req.body.photo_url;

    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email || !emailRegexp.test(email)) {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1001, msgResp: 'Invalid email'}));
        res.end();
        return;
    }

    if (!password || password.length < 6) {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1003, msgResp: 'Invalid password'}));
        res.end();
        return;
    }

    if (!name) {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1005, msgResp: 'Name is mandatory'}));
        res.end();
        return;
    }

    const phoneRegexp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (phone && !phoneRegexp.test(phone)) {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1007, msgResp: 'Invalid phone'}));
        res.end();
        return;
    }

    if (postalCode && postalCode.length > 6) {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1009, msgResp: 'Invalid postal code'}));
        res.end();
        return;
    }

    userModel.findByEmail(email, function(item) {
        if (item) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1011, msgResp: 'Email is taken'}));
            res.end();
            return;
        }

        var ip = req.headers['x-forwarded-for'] || 
        req.connection.remoteAddress ||
        req.socket.remoteAddress || 
        (req.connection.socket ? req.connection.socket.remoteAddress : null);

        var doc = {
            email: email,
            password: md5(password),
            name: name,
            phone: phone,
            postalCode: postalCode,
            photoUrl: photoUrl,
            createdAt: moment().unix(),
            loginTryCount: 0,
            loginLockedTime: 0,
            codeToResetPassword: 0,
            resetPasswordRequestTime: 0,
            ipSet: [ip],
        };

        userModel.create(doc, function(item) {
            var privKey = fs.readFileSync(global.settings.loginJwtPrivateKeyPath);
            var header = {algorithm: 'ES256'};
            var payload = {
                iss: 'Cobee',
                sub: 'O=ai-designer.io,E='+item.email,
                aud: item.email,
                jti: uuidv4(),
                exp: Math.floor(Date.now()/1000)+global.settings.loginJwtPeriod,
                iat: Math.floor(Date.now()/1000),
                uid: item._id,
                name: item.name,
                email: item.email,
                phone: item.phone,
                postalCode: item.postalCode,
                photoUrl: item.photoUrl,
            };
            token = jwt.sign(payload, privKey, header);

            res.writeHead(201, {});
            res.write(JSON.stringify({msgCode: 1000, msgResp: {token: token}}));
            res.end();
        }, function(e) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1013, msgResp: 'Unknown error'}));
            res.end();
        });
    }, function(e) {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1015, msgResp: 'Unknown error'}));
        res.end();
    });
};

exports.update = function(req, res) {
    const fs = require('fs');
    const jwt = require('jsonwebtoken');
    
    var token = req.header('Authorization');
    if (token) { token = token.replace('Bearer ', ''); }
    var cert = fs.readFileSync(global.settings.loginJwtCertPath);
    jwt.verify(token, cert, function(err, decoded) {
        if (err) {
            res.writeHead(401, {});
            res.write(JSON.stringify({msgCode: 1001, msgResp: 'Unauthorized'}));
            res.end();
            return;
        }

        var doc = {};

        var name = req.body.name;
        if (name) {
            if (name.length > 64) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1005, msgResp: 'Invalid'}));
                res.end();
                return;
            }
            
            doc['name'] = name;
        }

        var phone = req.body.phone;
        if (phone) {
            const phoneRegexp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
            if (phone.length > 16 || !phoneRegexp.test(phone)) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1007, msgResp: 'Invalid phone'}));
                res.end();
                return;
            }

            doc['phone'] = phone;
        }

        var postalCode = req.body.postal_code;
        if (postalCode) {
            if (postalCode.length > 6) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1009, msgResp: 'Invalid postal code'}));
                res.end();
                return;
            }
            
            doc['postalCode'] = postalCode;
        }

        var photoUrl = req.body.photo_url;
        if (photoUrl) {
            if (photoUrl.length > 1024) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1011, msgResp: 'Photo URL must not exceed 1024 characters'}));
                res.end();
                return;
            }
            
            doc['photoUrl'] = photoUrl;
        }

        const userModel = require('../model/User');
        userModel.update(decoded.uid, doc, function() {
            res.writeHead(200, {});
            res.write(JSON.stringify({msgCode: 1000, msgResp: 'Success'}));
            res.end();
        }, function(e) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1013, msgResp: 'Unknown error'}));
            res.end();
        });
    });
};

exports.detail = function(req, res) {
    const fs = require('fs');
    const jwt = require('jsonwebtoken');
    
    var token = req.header('Authorization');
    if (token) { token = token.replace('Bearer ', ''); }
    var cert = fs.readFileSync(global.settings.loginJwtCertPath);
    jwt.verify(token, cert, function(err, decoded) {
        var userId = req.query.id;
        if (!userId) { userId = decoded.uid; }
        if (!userId || ![12, 24].includes(userId.length)) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1001, msgResp: 'Invalid user ID'}));
            res.end();
            return;
        }

        const userModel = require('../model/User');
        userModel.findById(userId, function(user) {
            if (!user) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1003, msgResp: 'User not found'}));
                res.end();
                return;
            }

            var respUser = {
                _id: user['_id'],
                email: user['email'],
                name: user['name'],
                phone: user['phone'],
                postalCode: user['postalCode'],
                photoUrl: user['photoUrl'],
            };
            
            res.writeHead(200, {});
            res.write(JSON.stringify({msgCode: 1000, msgResp: respUser}));
            res.end();
        }, function(e) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1005, msgResp: 'Unknown error'}));
            res.end();
        });
    });
};

exports.resetPassword = function(req, res) {
    const moment = require('moment');
    const { v4: uuidv4 } = require('uuid');
    const md5 = require('md5');

    var step = req.body.step;
    if (!step || ![1, 2].includes(step)) {
        res.writeHead(401, {});
        res.write(JSON.stringify({msgCode: 1001, msgResp: 'Missing step'}));
        res.end();
        return;
    }

    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    var email = req.body.email;
    if (!email || !emailRegexp.test(email)) {
        res.writeHead(400, {});
        res.write(JSON.stringify({msgCode: 1003, msgResp: 'Invalid account ID'}));
        res.end();
        return;
    }

    if (step === 1) {
        const userModel = require('../model/User');
        userModel.find({email: email}, {}, function(users) {
            var user = users[0];
            if (!user) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1005, msgResp: 'User not found'}));
                res.end();
                return;
            }

            if (moment().unix() - user.resetPasswordRequestTime < global.settings.resetPasswordPeriod) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1007, msgResp: 'One request per hour'}));
                res.end();
                return;
            }

            var min = Math.ceil(100000);
            var max = Math.floor(999999);
            var codeToResetPassword = Math.floor(Math.random() * (max - min + 1)) + min;

            var nodemailer = require('nodemailer');
            var transporter = nodemailer.createTransport({
                service: global.settings.mailService,
                auth: {
                    user: global.settings.mailTransporterID,
                    pass: global.settings.mailSenderPass
                }
            });
            var mailOptions = {
                from: global.settings.mailSenderID,
                to: email,
                subject: 'Reset PIN',
                text: 'Code: '+codeToResetPassword,
            };

            transporter.sendMail(mailOptions, function(err, info){
                if (err) {
                    res.writeHead(400, {});
                    res.write(JSON.stringify({msgCode: 1009, msgResp: 'Can not send email to '+email}));
                    res.end();
                    return;
                }

                var update = {
                    codeToResetPassword: codeToResetPassword,
                    resetPasswordRequestTime: moment().unix(),
                };
                userModel.update(user._id, update, function() {
                    res.writeHead(200, {});
                    res.write(JSON.stringify({msgCode: 1000, msgResp: 'Sending email to '+email}));
                    res.end();
                }, function(e) {
                    res.writeHead(400, {});
                    res.write(JSON.stringify({msgCode: 1011, msgResp: 'Unknown error'}));
                    res.end();
                });
            });
        }, function(e) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1013, msgResp: 'Unknown error'}));
            res.end();
        });
        return;
    } else {
        var code = parseInt(req.body.code);
        if (!code) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1015, msgResp: 'Invalid code'}));
            res.end();
            return;
        }

        var password = req.body.new_password;
        if (!password || password.length < 6) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1017, msgResp: 'Invalid password'}));
            res.end();
            return;
        }

        const userModel = require('../model/User');
        userModel.find({email: email, codeToResetPassword: code}, {}, function(users) {
            var user = users[0];
            if (!user) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1019, msgResp: 'Icorrect ID/code'}));
                res.end();
                return;
            }

            if (moment().unix() - user.resetPasswordRequestTime > global.settings.resetPasswordPeriod) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1021, msgResp: 'Invalid request'}));
                res.end();
                return;
            }

            userModel.update(user._id, {password: md5(password), codeToResetPassword: 0}, function() {
                res.writeHead(200, {});
                res.write(JSON.stringify({msgCode: 1000, msgResp: 'Success'}));
                res.end();
            }, function(e) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1023, msgResp: 'Unknown error'}));
                res.end();
            });
        }, function(e) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1025, msgResp: 'Unknown error'}));
            res.end();
        });
    }
};

exports.changePassword = function(req, res) {
    const fs = require('fs');
    const jwt = require('jsonwebtoken');
    
    var token = req.header('Authorization');
    if (token) { token = token.replace('Bearer ', ''); }
    var cert = fs.readFileSync(global.settings.loginJwtCertPath);
    jwt.verify(token, cert, function(err, decoded) {
        if (err) {
            res.writeHead(401, {});
            res.write(JSON.stringify({msgCode: 1001, msgResp: 'Unauthorized'}));
            res.end();
            return;
        }

        var oldPassword = req.body.old_password;
        var newPassword = req.body.new_password;

        if (!oldPassword || oldPassword.length < 6) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Invalid old password'}));
            res.end();
            return;
        }

        if (!newPassword || newPassword.length < 6) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1005, msgResp: 'Invalid new password'}));
            res.end();
            return;
        }

        if (oldPassword == newPassword) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1007, msgResp: 'New password must be different from old password'}));
            res.end();
            return;
        }

        const md5 = require('md5');
        const userModel = require('../model/User');
        userModel.findByUsernameAndPassword(decoded.email, md5(oldPassword), function(item) {
            if (!item) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1009, msgResp: 'Incorrect password'}));
                res.end();
                return;
            }
            
            userModel.update(decoded.uid, {password: md5(newPassword)}, function() {
                res.writeHead(200, {});
                res.write(JSON.stringify({msgCode: 1000, msgResp: 'Success'}));
                res.end();
            }, function(e) {
                res.writeHead(400, {});
                res.write(JSON.stringify({msgCode: 1011, msgResp: 'Unknown error'}));
                res.end();
            });
        }, function(e) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1013, msgResp: 'Unknown error'}));
            res.end();
        });
    });
};

exports.delete = function(req, res) {
    const fs = require('fs');
    const jwt = require('jsonwebtoken');
    
    var token = req.header('Authorization');
    if (token) { token = token.replace('Bearer ', ''); }
    var cert = fs.readFileSync(global.settings.loginJwtCertPath);
    jwt.verify(token, cert, function(err, decoded) {
        if (err) {
            res.writeHead(401, {});
            res.write(JSON.stringify({msgCode: 1001, msgResp: 'Unauthorized'}));
            res.end();
            return;
        }

        const userModel = require('../model/User');
        userModel.delete(decoded.uid, function() {
            res.writeHead(200, {});
            res.write(JSON.stringify({msgCode: 1000, msgResp: 'Success'}));
            res.end();
        }, function(e) {
            res.writeHead(400, {});
            res.write(JSON.stringify({msgCode: 1003, msgResp: 'Unknown error'}));
            res.end();
        });
    });
};
