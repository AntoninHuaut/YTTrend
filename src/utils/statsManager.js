const TagStats = require('../model/TagStats');
const cache = {};

exports.getTagsStats = (startDate, endDate) => {
    return new Promise(async (resolve) => {
        if (!cache[startDate] || !cache[startDate][endDate]) {
            if (!cache[startDate]) cache[startDate] = {};

            cache[startDate][endDate] = new TagStats(startDate, endDate);
            const gett = await cache[startDate][endDate].refresh();
            return resolve(gett);
        }

        resolve(cache[startDate][endDate].getStats());
    });
}