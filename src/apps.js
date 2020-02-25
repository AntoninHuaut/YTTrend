const hbs = require('express-hbs');
const web = require("express")();
const bodyParser = require("body-parser");
const schedule = require('node-schedule');
const path = require('path');

const grabTrend = require('./task/grabTrend');
const sql = require('./sql');
const config = require('./config');
global.__basedir = __dirname;
sql.initTable().then(start);

function start() {
    schedule.scheduleJob('0 0 2/6 * * *', grabTrend.requestYTTrend);
    initExpress();
}

function initExpress() {
    web.use(require('helmet')());
    web.use(bodyParser.urlencoded({
        extended: true
    }));
    web.use(bodyParser.json());

    web.engine('hbs', hbs.express4({
        partialsDir: path.join(__basedir, '/views/partials'),
        layoutsDir: path.join(__basedir, '/views/layouts'),
        defaultLayout: path.join(__basedir, "/views/layouts/main")
    }));
    web.set('view engine', 'hbs');
    web.set('views', path.join(__basedir, '/views/layouts'));
    web.set('views', path.join(__basedir, '/views/pages'));

    web.use(require("./routes"));

    web.listen(config.port, () => console.log("Express port : " + config.port));
}