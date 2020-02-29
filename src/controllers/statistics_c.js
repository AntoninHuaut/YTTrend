const moment = require('moment');
const sql = require('../sql');
const statsManager = require('../utils/statsManager');

exports.selectDateInterval = async function (req, res) {
    const finalTrendList = await sql.api.getFormatedTrendList();

    const startTrendList = [];
    const endTrendList = [];

    finalTrendList.forEach(trend => {
        startTrendList.push(trend.trendList[trend.trendList.length - 1]);
        endTrendList.push(trend.trendList[0]);
    });

    res.render('stats/select', {
        startTrendList: startTrendList,
        endTrendList: endTrendList
    })
}

exports.showStats = async function (req, res) {
    const dateStart = new Date(req.body.dateStart);
    const dateEnd = new Date(req.body.dateEnd);
    const tagStats = await statsManager.getTagsStats(dateStart, dateEnd);

    res.render('stats/stats', {
        tagStats: tagStats,
        tagSort: ['totalViews', 'occurences'],
        dateStart: moment(dateStart).format("DD/MM/YYYY HH[h]mm"),
        dateEnd: moment(dateEnd).format("DD/MM/YYYY HH[h]mm")
    });
}

exports.redirectStatsPost = async function (req, res) {
    res.redirect('/statistics/select');
}