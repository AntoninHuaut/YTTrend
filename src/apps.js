const schedule = require('node-schedule');
const grabTrend = require('./task/grabTrend');
const sql = require('./sql');

sql.initTable().then(start);

function start() {
    grabTrend.requestYTTrend();
    schedule.scheduleJob('0 23 * * *', grabTrend.requestYTTrend);
}