const sql = require('./index');

exports.insertNewTrend = (trend) => {
    return new Promise(async (resolve, reject) => {
        try {
            await insertTrend(trend);

            const channelProms = [];
            const tagsProms = [];
            trend.videos.forEach(video => {
                channelProms.push(insertChannel(video));
                tagsProms.push(insertTags(video));
            });

            await Promise.all(channelProms.concat(tagsProms));

            const videoProms = [];
            trend.videos.forEach(video => videoProms.push(insertVideo(video)));

            await Promise.all(videoProms);

            const videoTrendProms = [];
            trend.videos.forEach(video => videoTrendProms.push(insertVideoTrend(trend, video)));

            await Promise.all(videoTrendProms);

            const videoTagsProms = [];
            trend.videos.forEach(video => videoTagsProms.push(insertVideoTags(video)));

            await Promise.all(videoTagsProms);
            resolve();
        } catch (err) {
            console.log(new Date().toISOString(), "Err: insertNewTrend()", err.code, err.sqlMessage);
        }
    })
}

function insertTrend(trend) {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query("INSERT INTO TREND (trendDate) VALUES(?)", [trend.date], (err, result) => {
            if (err && err.code !== 'ER_DUP_ENTRY') return reject(err);
            resolve(result);
        });
        con.end();
    });
}

function insertChannel(video) {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query("INSERT INTO CHANNEL (channelId, channelTitle) VALUES(?, ?) ON DUPLICATE KEY UPDATE channelTitle = VALUES(channelTitle)", [video.channelId, video.channelTitle], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
        con.end();
    });
}

function insertTags(video) {
    return new Promise((resolve) => {
        if (!video.tags) return resolve();

        const tagsProm = [];
        let con = sql.getConnection();
        video.tags.forEach(tag => tagsProm.push(insertTag(con, tag)));

        Promise.all(tagsProm).then(() => {
            con.end();
            resolve();
        });
    });
}

function insertTag(con, tag) {
    return new Promise((resolve, reject) => {
        con.query("INSERT INTO TAG (tagName) VALUES (?)", [tag], (err, result) => {
            if (err && err.code !== 'ER_DUP_ENTRY') return reject(err);
            resolve(result);
        });
    });
}

function insertVideo(video) {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query(`INSERT INTO VIDEO (videoId, channelId, videoTitle, videoDate, categoryId, thumbnail, viewCount, likeCount, dislikeCount, commentCount) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                   ON DUPLICATE KEY UPDATE 
                   videoTitle = VALUES(videoTitle), categoryId = VALUES(categoryId), thumbnail = VALUES(thumbnail), 
                   viewCount = VALUES(viewCount), likeCount = VALUES(likeCount), dislikeCount = VALUES(dislikeCount), commentCount = VALUES(commentCount)`,
            [video.videoId, video.channelId, video.videoTitle, video.videoDate, video.categoryId, video.thumbnail, video.viewCount, video.likeCount, video.dislikeCount, video.commentCount],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        con.end();
    });
}

function insertVideoTrend(trend, video) {
    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        con.query(`INSERT INTO VIDEOTREND (videoId, trendDate, position) VALUES (?, ?, ?) 
                   ON DUPLICATE KEY UPDATE videoId = VALUES(videoId)`, [video.videoId, trend.date, video.position], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
        con.end();
    });
}

function insertVideoTags(video) {
    if (!video.tags) return new Promise((resolve) => resolve());

    return new Promise((resolve, reject) => {
        let con = sql.getConnection();
        const values = [];
        let reqSQL = "INSERT INTO VIDEOTAG (videoId, tagId) VALUES ";

        for (let tagIndex in video.tags) {
            let tag = video.tags[tagIndex];
            let subSQL = "(";
            subSQL += `?, (SELECT tagId from TAG where tagName like ?)`;
            subSQL += ")";
            subSQL += tagIndex == video.tags.length - 1 ? ";" : ",";
            reqSQL += subSQL;

            values.push(video.videoId, tag);
        }

        con.query(reqSQL, values, (err, result) => {
            if (err && err.code !== 'ER_DUP_ENTRY') return reject(err);
            resolve(result);
        });
        con.end();
    });
}