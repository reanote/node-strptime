# any-time
convert any string to time

#### Example

```javascript
const strptime = require('any-time').strptime;
let myDate1 = strptime("12分钟前") // return the time before 12minutes before
let myDate2 = strptime("2017年06月10日 13:54") // return the instance of Date which value is "2017-06-10日 13:54"
console.info(myDate2.getTime())
```

The `strptime` function has 3 parameters:
```
strptime(str, pattern, now)
```
Parameters:

* str: the time string;
* pattern: the time patterns, you can change the default value, the default value is:
  ```js
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
   ```

* now: the parameter `str` base on this time, default is Date()
