async function GetCurrentDate() {
    const moment = require('moment');
    let current_date = new Date();
    current_date = moment(current_date).utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    return current_date;
}
module.exports = {
    GetCurrentDate
}