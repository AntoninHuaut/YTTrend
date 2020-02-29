const sql = require('../sql');

exports.home = async function (req, res) {
    const finalTrendList = await sql.api.getFormatedTrendList();
    const latestTrendList = [];
    finalTrendList.forEach(trend => latestTrendList.push(trend.trendList[0]));

    res.render('home', {
        finalTrendList: finalTrendList,
        latestTrendList: latestTrendList
    });
}