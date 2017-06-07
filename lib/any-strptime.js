'use strict';

let defaultPattern = {
    "(\\d\\d\\d\\d)年([\\d]{1,2})月([\\d]{0,2})日": ["year", "month", "day$"],
    "([\\d]{1,2})月([\\d]{0,2})日": ["month", "day$"],
    "^(前)天$": ["day-2$"],
    "^(昨)天$": ["day-1$"],
    "^(今)天$": ["day+0$"],
    "^今天(上午)$": ["hour=9$"],
    "^今天(下午)$": ["hour=12$"],
    "^今天(凌晨)$": ["hour=0$"],
    "^今天(晚上)$": ["hour=18$"],
    "^([\\d]{1,2})小时前$": ["hour-$"],
    "^([\\d]{1,2})分钟前$": ["minute-$"],
    "^([\\d]{1,2})秒前$": ["second-$"],
    "^(刚刚)$": ["second=0$"],
    "(\\d\\d\\d\\d)-([\\d]{1,2})-([\\d]{0,2})": ["year", "month", "day$"],
    "([\\d]{1,2})-([\\d]{0,2})": ["month", "day$"],
    "([\\d]{1,2}):([\\d]{0,2})": ["hour", "minute$"],
    "(\\d\\d\\d\\d)-([\\d]{1,2})-([\\d]{0,2}) ([\\d]{1,2}):([\\d]{0,2})": ["year", "month", "day$", "hour", "minute"]
};


function strptime(str, pattern, now){
    timePattern = pattern || defaultPattern;
    now = now || new Date();
    let dateMap = {
        "year": now.getFullYear(),
        "month": now.getMonth() + 1,
        "day": now.getDate(),
        "hour":  now.getHours(),
        "minute": now.getMinutes(),
        "second": now.getSeconds(),
        "millisecond": now.getMilliseconds()
    }
    for (let pattern in timePattern) {
        if (!timePattern.hasOwnProperty(pattern)) {
            continue;
        }
        if (Array.isArray(timePattern[pattern])) {
            timePattern[pattern] = {
                "groups": timePattern[pattern],
                "regexp": new RegExp(pattern, "m")
            }
        }
        let regexp = timePattern[pattern]["regexp"];
        let groups = timePattern[pattern]["groups"];
        let ret = regexp.exec(str);
        if (!ret) {
            continue;
        }
        let zeroItems = ["year", "month", "day", "hour", "minute", "second", "millisecond"];
        let zeroIndex = zeroItems.length + 1;
        groups.forEach(function (value, i) {
            if (typeof value === 'string') {
                let offset = 0;
                let zeroEnable = false;
                if (value.endsWith("$")){
                    value = value.substr(0, value.length - 1);
                    zeroEnable = true;
                }
                if (value.indexOf('-') > 0){
                    let temp = value.split('-');
                    value = temp[0];
                    temp[1] = temp[1].length === 0 ? ret[i + 1] : temp[1];
                    dateMap[value] = dateMap[value] - parseInt(temp[1])
                }
                else if (value.indexOf('+') > 0){
                    let temp = value.split('+');
                    value = temp[0];
                    temp[1] = temp[1].length === 0 ? ret[i + 1] : temp[1];
                    dateMap[value] = dateMap[value] + parseInt(temp[1])
                }
                else if (value.indexOf('=') > 0){
                    let temp = value.split('=');
                    value = temp[0];
                    temp[1] = temp[1].length === 0 ? ret[i + 1] : temp[1];
                    dateMap[value] = parseInt(temp[1])
                }
                else {
                    dateMap[value] = parseInt(ret[i + 1]);
                }

                if (zeroEnable){
                    zeroIndex = Math.min(zeroItems.indexOf(value), zeroIndex);
                }
            }
            else{
                value(ret[i + 1], dateItem);
            }
        })

        let date = new Date();

        for (let i = zeroIndex + 1; i < zeroItems.length; i++){
            let k = zeroItems[i];
            dateMap[k] = 0;
        }

        for (let k in dateMap){
            if (!dateMap.hasOwnProperty(k)){
                continue;
            }
            let v = dateMap[k];
            switch (k){
                case "year": date.setFullYear(v);break;
                case "month": date.setMonth(v - 1);break;
                case "day": date.setDate(v);break;
                case "hour":  date.setHours(v);break;
                case "minute": date.setMinutes(v);break;
                case "second": date.setSeconds(v);break;
                case "millisecond": date.setMilliseconds(v);break;
            }
        }
        return date;
    }
}


exports = module.export = {};
exports.strptime = strptime;
exports.timePattern = defaultPattern;
