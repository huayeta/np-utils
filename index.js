'use strict';

const fs = require('fs');
const util = require('util');
const events = require('events');
const crypto = require('crypto');
const stream = require('stream');
const utils = exports;

/**
 * 将字符串转换为 Buffer
 *
 * @param {String} data
 * @return {Buffer}
 */
 exports.toBuffer=function(data){
     if(Buffer.isBuffer(data))return data;
     if(typeof data ==='string')return new Buffer(data);
     throw new Error('invalid data type, must be string or buffer');
 }
/**
 * 40位SHA1值
 *
 * @param {String} text 文本
 * @return {String}
 */
 exports.sha1=function(text){
     return crypto.createHash('sha1').update(utils.toBuffer(text)).digest('hex');
 }
/**
* 32位MD5值
*
* @param {String} text 文本
* @return {String}
*/
exports.md5=function(text){
  return crypto.createHash('md5').update(utils.toBuffer(text)).digest('hex');
}
/**
* 取文件内容的SHA1
*
* @param {String} filename
* @param {Function} callback
*/
exports.fileSha1=function(filename,callback){
   fs.readFile(filename,function(err,data){
       if(err) return callback(err);
       callback(null,utils.sha1(data));
   })
}
/**
* 取文件内容的MD5
*
* @param {String} filename
* @param {Function} callback
*/
exports.fileMd5=function(filename,callback){
    fs.readFile(filename,function(err,data){
        if(err) return callback(err);
        callback(null,utils.md5(data));
    })
}
/**
 * 取哈希值
 *
 * @param {String} method 方法，如 md5, sha1, sha256
 * @param {String|Buffer} text 数据
 * @return {String}
 */
exports.hash=function(method,text){
 return crypto.createHash(method).update(utils.toBuffer(text)).digest('hex');
}
 /**
  * 加密密码
  *
  * @param {String} password
  * @return {String}
  */
exports.encryptPassword=function(password){
  const random=utils.md5(Math.random+''+Math.random).toUpperCase();
  const left=random.substr(0,2);
  const right=random.substr(-2);
  const newpassword=utils.md5(left+password+right).toUpperCase();
  return [left,newpassword,right].join(':');
}

// console.log(utils.encryptPassword('123456'));
/**
 * 验证密码
 *
 * @param {String} password 待验证的密码
 * @param {String} encrypted 密码加密字符串
 * @return {Boolean}
 */
exports.validatePassword=function(password){
    const random=password.toUpperCase().split(':');
    if(random.length<3)return false;
    const left=random[0];
    const right=random[2];
    const main=random[1];
    const newpassword=utils.md5(left+password+right).toUpperCase();
    return newpassword===main;
}
/**
 * 加密信息
 *
 * @param {Mixed} data
 * @param {String} secret
 * @return {String}
 */
 exports.encryptData = function encryptData(data, secret) {
    const str = JSON.stringify(data);
    const cipher = crypto.createCipher('aes192', secret);
    let enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
 };
 /**
  * 解密信息
  *
  * @param {String} str
  * @param {String} secret
  * @return {Mixed}
  */
 exports.decryptData = function decryptData(str, secret) {
    const decipher = crypto.createDecipher('aes192', secret);
    let dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    const data = JSON.parse(dec);
    return data;
 };
 /**
  * 产生随机字符串
  *
  * @param {Integer} size
  * @param {String} chars
  * @return {String}
  */
exports.randomString=function(size,chars){
    size=size||6;
    chars=chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const max=chars.length;
    let str='';
    for(let i=0;i<size;i++){
        str+=chars.charAt(Math.floor(Math.random()*max));
    }
    return str;
}
/**
 * 产生随机数字字符串
 *
 * @param {Integer} size
 * @return {String}
 */
exports.randomNumber = function randomNumber(size) {
    return utils.randomString(size,'0123456789');
};
/**
 * 产生随机字母字符串
 *
 * @param {Integer} size
 * @return {String}
 */
exports.randomString=function(size){
    return utils.random(size,'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
}
/**
 * 空白回调函数
 *
 * @param {Error} err
 */
exports.noop=function(err){
    if(err){
        console.error('noop callback:%s',err);
    }
}
/**
 * 是否为字符串
 *
 * @param {Mixed} str
 * @return {Boolean}
 */
exports.isString=function(str){
    return (typeof str === 'string');
}

/**
 * 是否为整数
 *
 * @param {Mixed} str
 * @return {Boolean}
 */
exports.isInteger=function(str){
    return (Math.floor(str)===Number(str));
}
/**
 * 是否为数字
 *
 * @param {Mixed} str
 * @return {Boolean}
 */
exports.isNumber=function(str){
    return (!isNaN(str));
}
/**
 * 复制对象
 *
 * @param {Object} obj
 * @return {Object}
 */
 exports.cloneObject=function(obj){
     return JSON.parse(JSON.stringify(obj));
 }
 /**
  * 将arguments对象转换成数组
  *
  * @param {Object} args
  * @return {Array}
  */
 exports.argumentsToArray=function(args){
     return Array.prototype.slice.call(args);
 }
 /**
  * 继承EventEmitter
  *
  * @param {Function} fn
  * @param {Object}
  */
 exports.inheritsEventEmitter=function(fn){
     return util.inherits(fn,events.EventEmitter);
 }
 /**
  * 继承
  *
  * @param {Function} fn
  * @param {Function} superConstructor
  * @return {Object}
  */
 exports.inherits=function(fn,superConstructor){
     return util.inherits(fn,superConstructor);
 }
 /**
  * 将IP地址转换为long值
  *
  * 例：   ipToInt('192.0.34.166')    ==> 3221234342
  *       ipToInt('255.255.255.256') ==> false
  *
  * @param {String} ip
  * @return {Number}
  */
exports.ipToInt = function ipToInt(ip) {
    const s = ip.split('.');
    if (s.length !== 4) return false;
    for (let i = 0; i < 4; i++) {
        const v = s[i] = parseInt(s[i], 10);
        if (v < 0 || v > 255) return false;
    }
    return s[0] * 16777216 + s[1] * 65536 + s[2] * 256 + s[3];
};
/**
 * 将字符串分割成数组
 */
export.strToArray=function (str){
    var reAstral = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    return str.match(reAstral);
}
