module.exports.find = function(search, sort, success, failure) {
    var dbo = global.mongoDB.db('dlp');
    dbo.collection('User').find(search).sort(sort).toArray(function(err, result) {
        if (err) {
            failure(err);
            return;
        } 

        success(result);
    });
};

module.exports.findWithPaging = function(search, sort, skip, limit, success, failure) {
    var dbo = global.mongoDB.db('dlp');
    dbo.collection('User').find(search).sort(sort).limit(limit).skip(skip).toArray(function(err, result) {
        if (err) {
            failure(err);
            return;
        } 

        success(result);
    });
};

module.exports.findById = function (_id, success, failure) {
    var dbo = global.mongoDB.db('dlp');
    var query = {_id: new require('mongodb').ObjectID(_id)};
    dbo.collection('User').findOne(query, function(err, result) {
        if (err) {
            failure(err);
            return;
        } 

        success(result);
    });
};

module.exports.create = function(item, success, failure) {
    var dbo = global.mongoDB.db('dlp');
    dbo.collection('User').insertOne(item, function(err, document) {
        if (err) {
            failure(err);
            return;
        } 

        success(document.ops[0]);
    });
};

module.exports.update = function(_id, item, success, failure) {
    var dbo = global.mongoDB.db('dlp');
    var query = {_id: new require('mongodb').ObjectID(_id)};
    var update = {"$set": item};
    dbo.collection('User').updateOne(query, update, function(err, udpated) {
        if (err) {
            failure(err);
            return;
        }
        
        success();
    });
};

module.exports.delete = function(_id, success, failure) {
    var dbo = global.mongoDB.db('dlp');
    var query = {_id: new require('mongodb').ObjectID(_id)};
    dbo.collection('User').deleteOne(query, function(err, deleted) {
        if (err) {
            failure(err);
            return;
        }

        success();
    });
};

module.exports.findByEmail = function (email, success, failure) {
    var dbo = global.mongoDB.db('dlp');
    var query = {email: email};
    dbo.collection('User').findOne(query, function(err, result) {
        if (err) {
            failure(err);
            return;
        } 

        success(result);
    });
};

module.exports.findByUsernameAndPassword = function(email, password, success, failure) {
    var dbo = global.mongoDB.db('dlp');
    var query = {
        email: email,
        password: password
    };
    dbo.collection('User').findOne(query, function(err, result) {
        if (err) {
            failure(err);
            return;
        } 

        success(result);
    });
};

module.exports.updatePassword = function(email, password, newPassword, success, failure) {
    var dbo = global.mongoDB.db('dlp');
    var query = {
        email: email,
        password: password
    };
    var set = {
        $set: {
            password: newPassword
        }
    };
    dbo.collection('User').updateOne(query, set, function(err, res) {
        if (err) {
            failure(err);
            return;
        }

        success();
    });
};