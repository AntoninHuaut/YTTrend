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

    trendList.forEach(trend => {
        const date = moment(trend.date).format("DD/MM/YYYY");
        const res = finalTrendList.filter(finalTrend => finalTrend.dateFormated === date);

        if (res.length) res[0].trendList.push(trend);
        else finalTrendList.push({
            dateFormated: date,
            trendList: [trend]
        });
    });

    res.render('home', {
        finalTrendList: finalTrendList
    });
}