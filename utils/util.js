/**
 * 时间格式化
 * @param timestamp 时间戳
 * @param type 类型
 */
function checkTime(i) {
    if (i < 10) { i = "0" + i }
    return i
}
var formatTime = function (timestamp, type) {
    var d = new Date(timestamp * 1);
    switch (type) {
        case 1:// 2018-6-12 00:00:00 
            var s = this.checkTime(d.getFullYear()) + "-" + this.checkTime((d.getMonth() + 1)) + "-" + this.checkTime(d.getDate());
            s += " " + this.checkTime(d.getHours()) + ":" + this.checkTime(d.getMinutes()) + ":" + this.checkTime(d.getSeconds());
            break;
        case 2:// 2018-6-12
            var s = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            break;
        case 3:// 6月12日 
            var s = (d.getMonth() + 1) + "月" + d.getDate() + "日";
            break;
        case 4:// 2018.6.12
            var s = d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate();
            break;
        case 5:// 6.12
            var s = (d.getMonth() + 1) + "." + d.getDate();
            break;
        default:
            var s = (d.getMonth() + 1) + "月" + d.getDate() + "日";
    }
    return s;
};
var checkCodeIsReLogin = function (code) {
    switch (code) {
        case 10112://第三方平台授权失败
        case 10114://信息解密失败
        case 10115://登录出错，请再试一次
        case 10116://注册用户失败
        case 10201://token过期
        case 11001://请重新登录
        case 10203://token非法
        case 10204://请重新登录
        case 11002://请重新登录
        case 26011://token过期
        case 28101://用户不存在
            return true;
            break;
        default:
            return false;
    }
};
module.exports = {
    formatTime: formatTime,
    checkTime: checkTime,
    checkCodeIsReLogin: checkCodeIsReLogin
}