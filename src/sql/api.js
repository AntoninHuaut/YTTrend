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
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query(`SELECT * 
                   FROM VIDEOTREND JOIN VIDEO using(videoId) JOIN CHANNEL using(channelId) LEFT JOIN VIDEOTAG using(videoId) LEFT JOIN TAG using (tagId) 
                   WHERE trendDate = ? ORDER BY position ASC`, [trendDate], (err, result) => {
            if (err) return reject(err);
            resolve(groupByVideo(result));
        });
        con.end();
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
        filtered[0].tagsId.push(video.tagId);
        filtered[0].tagsName.push(video.tagName);
    } else {
        video.tagsId = [];
        video.tagsName = [];
        video.tagsId.push(video.tagId);
        video.tagsName.push(video.tagName);
        delete video.tagId;
        delete video.tagName;
        res.push(video);
    }

    return res;
}