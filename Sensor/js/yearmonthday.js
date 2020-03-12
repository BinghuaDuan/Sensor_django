Mon_days =[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//年月日三级联动下拉框初始化：
function yearMonthDayInit(type) {
    //返回年月所对应的数字。
    var now_y = new Date().getFullYear();
    var now_m = new Date().getMonth();
    var now_d = new Date().getDate();
    //获取年、月、日的dom元素
    var year;
    var month;
    var day;

    var year_default;
    var month_default;
    var day_default;
    if(type=="start") {
        year = document.getElementById("start_year");
        month = document.getElementById("start_month");
        day = document.getElementById("start_day");
        year_default = 2019;
        month_default = 1;
        day_default = 1;
    }
    else {
        year = document.getElementById("end_year");
        month = document.getElementById("end_month");
        day = document.getElementById("end_day");
        year_default = now_y;
        month_default = now_m + 1;
        day_default = now_d;
    }
    //给年的下拉框赋值
    for(var i=now_y-2;i<now_y+1;i++){
        year.options.add(new Option(""+i+"年",i));
        var option_index = i - (now_y-2);
        if(year.options[option_index].value == year_default){
            year.options[option_index].selected=true;
        }
    }

    //给月的下拉框赋值
    for(var i=1;i<13;i++){
        month.options.add(new Option(""+i+"月", i));
        var option_index = i - 1;
        if(month.options[option_index].value==month_default){
            month.options[option_index].selected=true;
        }
    }

    //给日的下拉框赋值
    var days= Mon_days[now_m];
    if(now_m == 1 && IsPinYear(now_y)){
        days+=1;
    }
    for(var i=1;i<days+1;i++){
        day.options.add(new Option(""+i+"日",i));
        var option_index = i - 1;
        if(day.options[option_index].value == day_default){
            day.options[option_index].selected = true;
        }
    }

}
function writeDay(numberofdays,type) {
    // alert("days="+day);
    var day;
    if(type=="start"){
        day = document.getElementById("start_day");
    }else {
        day = document.getElementById("end_day");
    }
    day.innerHTML = "";
    // day.options.length = 0;
    for(var i=1; i<=numberofdays;i++){
        // var option_day = document.createElement("option");
        // option_day.setAttribute("value",i);
        // option_day.innerHTML = i;
        // day.appendChild(option_day);
        day.options.add(new Option(""+i+"日",i));
    }
}
//当年份或月份改变的时候，运行showDate()
function showDate(type){
    var month_value;
    var year_value;
    if(type=="start"){
        month_value = parseInt(document.getElementById("start_month").value);
        year_value = parseInt(document.getElementById("start_year").value);
    }else{
        month_value = parseInt(document.getElementById("end_month").value);
        year_value = parseInt(document.getElementById("end_year").value);
    }
    // alert("year_value:"+year_value);
    // alert("month_value:"+month_value);
    var numberofdays = Mon_days[month_value-1];
    if(IsPinYear(year_value))numberofdays++;
    writeDay(numberofdays,type);

}

//判断是否闰平年
function IsPinYear(year)
{
    return (0 == year % 4 && (year % 100 != 0 || year % 400 == 0));
}