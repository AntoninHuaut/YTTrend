const sql = require('../sql');

module.exports = class TagStats {
    constructor(startDate, endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }

    getStats() {
        return this.tagsStats;
    }

    refresh() {
        return new Promise(async (resolve) => {
            const videosTrend = await sql.api.getAllVideoTrend_BetweenDate(this.startDate, this.endDate);
            const videoIdCheck = [];
            let tagsStats = [];

            videosTrend.forEach(videoTrend => {
                const videoId = videoTrend.videoId;
                const trendDate = videoTrend.trendDate;

                if (videoIdCheck.filter(videoCheck => videoCheck.videoId === videoId && videoCheck.trendDate !== trendDate).length) return;
                videoIdCheck.push({
                    videoId: videoId,
                    trendDate: trendDate
                });

                videoTrend.tags.forEach(tagInfo => {
                    if (!tagInfo.tagId) return;

                    const tagObject = tagsStats.filter(tagStats => tagStats.tagId === tagInfo.tagId);

                    if (tagObject.length) {
                        tagObject[0].totalViews += videoTrend.viewCount;
                        tagObject[0].occurences++;
                    } else
                        tagsStats.push({
                            tagId: tagInfo.tagId,
                            tagName: tagInfo.tagName,
                            totalViews: videoTrend.viewCount,
                            occurences: 1
                        });
                });
            });

            this.tagsStats = tagsStats;
            resolve(tagsStats);
        });
    }
}