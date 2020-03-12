function time_select() {
    var start_year = parseInt(document.getElementById("start_year").value);
    var start_month = parseInt(document.getElementById("start_month").value);
    var start_day = parseInt(document.getElementById("start_day").value);

    var end_day = parseInt(document.getElementById("end_day").value);
    var end_month = parseInt(document.getElementById("end_month").value);
    var end_year = parseInt(document.getElementById("end_year").value);

    var start_date = new Date(start_year,start_month,start_day);
    var end_date = new Date(end_year,end_month,end_day);

}