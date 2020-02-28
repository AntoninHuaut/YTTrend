const moment = require('moment');
const sql = require('../sql');

exports.home = async function (req, res) {
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
    const latestTrendList = [];

    trendList.forEach(trend => {
        const date = moment(trend.date).format("DD/MM/YYYY");
        const resFinal = finalTrendList.filter(finalTrend => finalTrend.dateFormated === date);

        if (resFinal.length) resFinal[0].trendList.push(trend);
        else finalTrendList.push({
            dateFormated: date,
            trendList: [trend]
        });
    });

    finalTrendList.forEach(trend => latestTrendList.push(trend.trendList[0]));

    res.render('home', {
        finalTrendList: finalTrendList,
        latestTrendList: latestTrendList
    });
}