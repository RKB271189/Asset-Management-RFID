const moment = require('moment');
async function GetCurrentDate() {
    let current_date = new Date();
    current_date = moment(current_date).utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    return current_date;
}
async function GetCurrentOnlyDate() {
    let current_date = new Date();
    current_date = moment(current_date).utcOffset("+05:30").format('YYYY-MM-DD');
    return current_date;
}
async function GetTommorowsDate() {
    let next_date = new Date();
    next_date = moment(next_date).add(1, 'days').utcOffset("+05:30").format('YYYY-MM-DD');
    return next_date;
}
async function FormatDate(supply_date) {
    supply_date = moment(supply_date).format('YYYY-MM-DD HH:mm:ss');
    return supply_date;
}
async function AppFormatDate(supply_date) {
    supply_date = moment(supply_date).format('YYYY-MM-DD HH:mm:ss');
    return supply_date;
}
module.exports = {
    GetCurrentDate,
    GetCurrentOnlyDate,
    GetTommorowsDate,
    FormatDate,
    AppFormatDate
}