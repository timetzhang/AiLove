/**
 * Database Connection
 * Author: tt
 * Time: 01-16-2018
 * 
 * Desc:
 * let pagesize = parseInt(req.query.pagesize)
    let pagenum = parseInt(req.query.pagenum)
    let query = {
        collection: 'blog_article',
        condition: {},
        projection: { "details": 0 },
        sort: { time: -1 },
        limit: pagesize,
        skip: pagenum * pagesize
    };
    if (req.query.category) {
        query.condition = {
            "category": req.query.category
        }
    }
    if (req.query.keyword) {
        query.condition = {
            "keywords": req.query.keyword
        }
    }
    let articles = await db.find(query)
 */

const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017/zhangtt';

module.exports = {
    find: function (query) {
        return new Promise(
            function (resolve) {
                MongoClient.connect(DB_CONN_STR, function (err, db) {
                    //连接到表 site
                    var col = db.collection(query.collection);
                    col.find(query.condition, query.projection).limit(query.limit).skip(query.skip).sort(query.sort).toArray(
                        function (err, result) {
                            if (err) {
                                console.log('Error:' + err);
                                return;
                            }
                            resolve(result);
                            db.close();
                        });
                });
            }
        );
    },
    insert: function (query) {
        return new Promise(
            function (resolve) {
                MongoClient.connect(DB_CONN_STR, function (err, db) {
                    //连接到表 site
                    var col = db.collection(query.collection);
                    col.insert(query.data, function (err, result) {
                        if (err) {
                            console.log('Error:' + err);
                            return;
                        }
                        resolve(result);
                        db.close();
                    });
                });
            }
        )
    },
    update: function (query) {
        return new Promise(
            function (resolve) {
                MongoClient.connect(DB_CONN_STR, function (err, db) {
                    //连接到表 site
                    var col = db.collection(query.collection);
                    col.update(query.condition, {
                        '$set': query.data
                    }, function (err, result) {
                        if (err) {
                            console.log('Error:' + err);
                            return;
                        }
                        resolve(result);
                        db.close();
                    });
                });
            }
        )
    },
}