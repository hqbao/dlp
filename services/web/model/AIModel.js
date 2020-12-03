module.exports.find = function(search, sort, skip, limit, success, failure) {
   	const dbo = global.mongoDB.db('dlp');
    dbo.collection('AIModel').find(search).sort(sort).limit(limit).skip(skip).toArray(function(err, result) {
        if (err) {
            failure(err);
            return;
        }

        success(result);
    });
};

module.exports.findById = function (_id, success, failure) {
    const dbo = global.mongoDB.db('dlp');
    var query = {_id: new require('mongodb').ObjectID(_id)};
    dbo.collection('AIModel').findOne(query, function(err, result) {
        if (err) {
            failure(err);
            return;
        } 

        success(result);
    });
};

module.exports.create = function(item, success, failure) {
    const dbo = global.mongoDB.db('dlp');
    dbo.collection('AIModel').insertOne(item, function(err, document) {
        if (err) {
            failure(err);
            return;
        }

        success(document.ops[0]);
    });
};

module.exports.update = function(_id, item, success, failure) {
    const dbo = global.mongoDB.db('dlp');
    var query = {_id: new require('mongodb').ObjectID(_id)};
    var update = {"$set": item};
    dbo.collection('AIModel').updateOne(query, update, function(err, udpated) {
        if (err) {
            failure(err);
            return;
        }

        success();
    });
};

module.exports.delete = function(_id, success, failure) {
    const dbo = global.mongoDB.db('dlp');
    var query = {_id: new require('mongodb').ObjectID(_id)};
    dbo.collection('AIModel').deleteOne(query, function(err, deleted) {
        if (err) {
            failure(err);
            return;
        }

        success();
    });
};
