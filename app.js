/******
 *
 *  Genesis MQTT 服务器
 *
 *  说明: 用来控制和管理 Genesis Client 设备
 *  作者: T.T
 *
 *  MOSCA MQTT说明:
 *  绑定事件回调，mosca有下面几种事件，按需绑定。
 *
 *  clientConnected, 客户端已经连接，      参数：client；
 *  clientDisconnecting, 客户端正在断开连接， 参数：client；
 *  clientDisconnected, 客户端已经断开连接，  参数：client；
 *  published, 新消息发布，          参数：packet， client；
 *  subscribed, 客户端订阅信息，         参数：topic， client;
 *  unsubscribed, 客户端取消订阅信息，     参数：topic， client;
 *
 *  published事件单独拿出来说一下。packet包含了下面几个内容：
 *
 *  topic，主题
 *  payload，内容
 *  messageId
 *  qos
 *  retain
 *
 ******/

//Time
var time = require('./common/time');

//MQTT服务设置
var mosca = require('mosca');
var mqtt = new mosca.Server({
    port: 1883
});

//to save MQTT Clients
var clients = new Array();

//MQTT服务username与password验证
var authenticate = function (client, username, password, callback) {
    var authorized = (username === 'genesis' && password.toString() === 'degkut9w');
    if (authorized) client.user = username;
    callback(null, authorized);
}

/////////////////////////////////// 事件处理 /////////////////////////////////

mqtt.on('ready', function () {
    mqtt.authenticate = authenticate;
    console.log('genesis cc server is running at port 1883');
});

mqtt.on('clientConnected', function (client) {
    if (!clients.hasOwnProperty(client.id)) {
        clients[client.id] = client;
        console.log('[' + time.Now.getFull() + ' ' + time.Now.getTime() + '] client "' + client.id + '" connected');
    }
});

mqtt.on('clientDisconnected', function (client) {
    if (clients.hasOwnProperty(client.id)) {
        delete clients[client.id]
        console.log('[' + time.Now.getFull() + ' ' + time.Now.getTime() + '] client "' + client.id + '" disconnected');
    }
});

mqtt.on('published', function (packet, client) {
    switch (packet.topic) {
        /*
        获取客户端列表
        topic: "get client"
        */
        case 'get client':
            var clientList = new Array();
            for (var key in clients) {
                clientList.push(key);
            }
            if (client) {
                mqtt.publish({ topic: client.id + ' get client', payload: '{"type":"clientlist", "data": ' + JSON.stringify(clientList) + '}' });
            }
            break;

        default:
            console.log('[' + time.Now.getFull() + ' ' + time.Now.getTime() + '] published topic "' + packet.topic.toString() + '" / message "' + packet.payload.toString() + '"');
    }
});

process.on('uncaughtException', function (err) {
    console.log(err);
});