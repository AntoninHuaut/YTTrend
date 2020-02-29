const moment = require('moment');
const sql = require('./index');

exports.getAllTrend = () => {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query("SELECT * FROM TREND ORDER BY trendDate DESC", (err, result) => {
            if (err) return reject(err);
            resolve(result.map(trendDate => trendDate.trendDate));
        });
        con.end();
    });
}

exports.getAllVideoTrend_ByDate = (trendDate) => {
    return exports.getAllVideoTrend_BetweenDate(trendDate, trendDate);
}

exports.getAllVideoTrend_BetweenDate = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query(`SELECT * 
                   FROM VIDEOTREND JOIN VIDEO using(videoId) JOIN CHANNEL using(channelId) LEFT JOIN VIDEOTAG using(videoId) LEFT JOIN TAG using (tagId) 
                   WHERE trendDate between ? and ? ORDER BY position ASC`, [startDate, endDate], (err, result) => {
            if (err) return reject(err);
            resolve(groupByVideo(result));
        });
        con.end();
    });
}

exports.getFormatedTrendList = () => {
    return new Promise(async (resolve) => {
        const trendList = (await sql.api.getAllTrend()).map(trendDate => {
            const momentDate = moment(trendDate);
            return {
                date: trendDate,
                dateFormated: momentDate.format("DD/MM/YYYY"),
                hourFormated: momentDate.format("HH[h]mm"),
                dateTimeFormated: momentDate.format("DD/MM/YYYY HH[h]mm"),
            };
        });

        const finalTrendList = [];

        trendList.forEach(trend => {
            const date = moment(trend.date).format("DD/MM/YYYY");
            const resFinal = finalTrendList.filter(finalTrend => finalTrend.dateFormated === date);

            if (resFinal.length) resFinal[0].trendList.push(trend);
            else finalTrendList.push({
                dateFormated: date,
                trendList: [trend]
            });
        });

        resolve(finalTrendList);
    });
}

function groupByVideo(result) {
    if (!Array.isArray(result) || !result.length) return result;

    let res = [];
    result.forEach(video => res = handleVideo(res, video));
    return res;
}

function handleVideo(res, video) {
    const filtered = res.filter(resVid => resVid.videoId === video.videoId);
    if (filtered.length) {
        filtered[0].tags.push({
            tagId: video.tagId,
            tagName: video.tagName
        });
    } else {
        video.tags = [];
        if (video.tagId) video.tags.push({
            tagId: video.tagId,
            tagName: video.tagName
        });

        delete video.tagId;
        delete video.tagName;
        res.push(video);
    }

    return res;
}