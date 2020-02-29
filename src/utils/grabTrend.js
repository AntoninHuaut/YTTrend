const fetch = require('node-fetch');

const Trend = require('../model/Trend');
const Video = require('../model/Video');

const sql = require('../sql');
const config = require('../config.json');

const URL_TEMPLATE = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode={REGION_CODE}&maxResults={MAX_RESULTS}&key={API_KEY}';

exports.requestYTTrend = () => {
    console.log(new Date().toISOString(), "Start Refresh...");

    const url = set([{
        key: "REGION_CODE",
        value: config.youtube.regionCode
    }, {
        key: "MAX_RESULTS",
        value: config.youtube.maxResults
    }, {
        key: "API_KEY",
        value: config.youtube.apiKey
    }]);

    fetch(url)
        .then(res => res.json())
        .then(res => {
            const videos = res.items.map((item, position) => new Video(item, position));
            const trend = new Trend(new Date(), videos);
            
            sql.manageTrend.insertNewTrend(trend).then(() => console.log(new Date().toISOString(), "Refresh OK"));
        })
        .catch(err => console.error(new Date().toISOString(), "Err: requestYTTrend()", err));
}

function set(items) {
    let url = URL_TEMPLATE;
    items.forEach(item => url = url.replace(`{${item.key}}`, item.value));
    return url;
}