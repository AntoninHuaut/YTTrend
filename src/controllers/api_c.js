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

    const recent = resultTrend[0];
    const old = resultTrend[resultTrend.length - 1];

    let startDate = req.params.startDate;
    let endDate = req.params.endDate;
    if (startDate === 'recent') startDate = recent;
    else if (startDate === 'old') startDate = old;

    if (!endDate) endDate = startDate;
    if (endDate === 'recent') endDate = recent;
    else if (endDate === 'old') endDate = old;

    const resultVideoTrend = await sql.api.getAllVideoTrend_BetweenDate(new Date(startDate), new Date(endDate));
    res.send(resultVideoTrend);
}