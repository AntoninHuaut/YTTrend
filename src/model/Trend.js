const moment = require('moment');

module.exports = class Trend {
    constructor(date, videos) {
        this.date = moment(date).format('YYYY-MM-DD');
        this.videos = videos;
    }
}