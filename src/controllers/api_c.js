const sql = require('../sql');

exports.listTrend = async function (req, res) {
    const result = await sql.api.getAllTrend();
    res.send(result);
}

exports.listVideoTrend = async function (req, res) {
    const resultTrend = await sql.api.getAllTrend();
    if (!resultTrend.length) return res.send({
        error: "No trend recorded"
    });

    let trendDate = req.params.trendDate;
    if (trendDate === 'recent') trendDate = resultTrend[0];

    trendDate = new Date(trendDate);

    const filtered = resultTrend.filter(date => date.getTime() === trendDate.getTime());
    if (isNaN(trendDate.getTime()) || !filtered.length) return res.send({
        error: "Invalid parameter"
    });

    trendDate = filtered[0];
    
    const resultVideoTrend = await sql.api.getAllVideoTrend_ByDate(trendDate);
    res.send(resultVideoTrend);
}