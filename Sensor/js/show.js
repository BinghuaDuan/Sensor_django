function time_select(isFirstInit) {
    var start_year = parseInt(document.getElementById("start_year").value);
    var start_month = parseInt(document.getElementById("start_month").value);
    var start_day = parseInt(document.getElementById("start_day").value);

    var end_day = parseInt(document.getElementById("end_day").value);
    var end_month = parseInt(document.getElementById("end_month").value);
    var end_year = parseInt(document.getElementById("end_year").value);

    var start_date = new Date(start_year,start_month,start_day);
    var end_date = new Date(end_year,end_month,end_day);

    //1、根据起始时间段从table_sum_data筛选出在start_date和end_date之间的数据，
    //包括两部分，一部分是tablesum_data,另一部分是heatmap_data
    var period_data = [];
    for(var i=0;i<service_data.length;i++){
        var data_date = new Date(Date.parse(service_data[i].time));
        if (data_date < end_date && data_date > start_date){
            period_data.push(service_data[i]);
        }
    }
    //2、重新生成table_sum;
    init_table_sum(period_data);
    UpdatePageParam();
    firstPage();

    //3、重新生成heatmap;
    var start_date_str = start_year + '-' + start_month + '-' + start_day;
    var end_date_str = end_year + '-' + end_month + '-' + end_day;
    init_heat_map(isFirstInit,start_date_str,end_date_str,period_data,"新闻");
    init_heat_map(isFirstInit,start_date_str,end_date_str,period_data,"评论");

}
function init_table_sum(tablesum_data) {

    //1、动态生成表格table_sum；
    var tbody_sum = document.getElementById("tbody_sum");
    //删除除表头以外的内容。
    while(tbody_sum.hasChildNodes()){
        tbody_sum.removeChild(tbody_sum.lastChild);
    }
    for(var i=0;i<tablesum_data.length;i++){
        //生成新的行列
        var tr = document.createElement("tr");
        var td_no = document.createElement("td");
        var td_changefunction = document.createElement("td");
        var td_changetype = document.createElement("td");
        var td_content = document.createElement("td");
        var td_source = document.createElement("td");
        var td_time = document.createElement("td");

        //设置列的内容
        td_no.innerHTML = i+1 + "";
        td_changefunction.innerHTML = tablesum_data[i].changefunction;
        td_changetype.innerHTML = tablesum_data[i].changetype;
        td_content.innerHTML = tablesum_data[i].content;
        td_source.innerHTML = tablesum_data[i].source;
        td_time.innerHTML = tablesum_data[i].time;

        //添加新的内容到表中
        tr.append(td_no);
        tr.append(td_changefunction);
        tr.append(td_changetype);
        tr.append(td_content);
        tr.append(td_source);
        tr.append(td_time);
        tbody_sum.append(tr);

    }

}
function getheatmap_data(start_date_str,end_date_str,period_data,contentype) {
    //start_date、end_date:"2018-01-01"
    //1、筛选出符合contentype的数据
    var heatmap_data = [];
    for(var i=0;i<period_data.length;i++){
        if(period_data[i].contentype == contentype){
            heatmap_data.push(period_data[i]);
        }
    }
    //2、返回heatmap的原生数据格式：time+value；
    var date = +echarts.number.parseDate(start_date_str);
    var end = +echarts.number.parseDate(end_date_str);
    var dayTime = 3600 * 24 * 1000;
    var data = [];
    for (var time = date; time < end; time += dayTime) {
        var time2date = echarts.format.formatTime('yyyy-MM-dd', time);
        var value = 0;
        for(var i=0; i<heatmap_data.length;i++){
            if(heatmap_data[i].time == time2date){
                if(heatmap_data[i].changetype == "新增"){
                    value += 1;
                }
                else {
                    value -= 1;
                }
            }
        }
        data.push([time2date,value]);
    }
    return data;

}
function init_heat_map(IsFirstInit,start_date_str,end_date_str,period_data,contentype){
    //如果不是首次初始化图表实例，则删除原来的图表实例
    if(IsFirstInit == false){
        var originalchart;
        if(contentype == "新闻"){
            originalchart = echarts.getInstanceByDom(document.getElementById("news_heatmap"));
        }
        else {
            originalchart = echarts.getInstanceByDom(document.getElementById("views_heatmap"));
        }
        originalchart.dispose();
    }
    //1、基于准备好的dom，初始化echarts实例
    var mychart;
    if(contentype == "新闻"){
        mychart = echarts.init(document.getElementById('news_heatmap'));
    } else{
        mychart = echarts.init(document.getElementById('views_heatmap'));
    }

    //2、指定图表的配置项和数据:getheatmap_data(service,contentype)
    var option = {
        title: {
            top: 30,
            left: 'center',
            text: '功能增减变化示意图'
        },
        tooltip : {},
        visualMap: {
            // pieces:[{value: 0, label: '新增', color: 'red'},
            //     {value: 1, label: '减少', color: 'green'},
            //     {value: 2, label: '无变化', color: 'white'}],
            pieces:[
                {value: 0, label: '无变化', color: 'white'},
                {min: 1, max:5,label: '新增', color: 'red'},
                {min: -5,max:-1, label: '去除', color: 'green'}],
            type: 'piecewise',
            orient: 'horizontal',
            left: 'center',
            top: 65,
            textStyle: {
                color: '#000'
            }

        },
        calendar: {
            top: 120,
            left: 80,
            right: 80,
            cellSize: ['auto',20],
            range: [start_date_str,end_date_str],
            itemStyle: {
                normal: {borderWidth: 1}
            },
            yearLabel: {
                margin: 30,
                textStyle: {
                    fontSize: 30
                }
             },
            dayLabel: {
                firstDay: 1,
                margin:15,
                nameMap:'cn'
                // nameMap: ['周日','周一','周二','周三','周四','周五','周六']
            },
            monthLabel: {
                nameMap: 'cn',
                // margin: 15,
                // textStyle: {
                //     fontSize: 20,
                //     color: '#999'
                // }
            },
        },
        series: {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            // data: getVirtulData(2018)
            data:getheatmap_data(start_date_str,end_date_str,period_data,contentype),
        },
        toolbox: {
            show: true,
            feature: {
            dataZoom: {
            yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['heatmap']},
            restore: {},
            saveAsImage: {}
    }
},

    };
    //3、使用刚指定的配置项和数据显示图表；
    mychart.setOption(option);
    //4、为图表添加点击事件
    mychart.on('click',function(params){
        var time = (params.data)[0];
        console.log("time:"+time);
        popbox_init(contentype,time);
    })
}
/*弹出框初始化*/
function popbox_init(contentype,time) {

    var tableday_data = [];
    for(var i=0;i<service_data.length;i++){
        if(service_data[i].contentype==contentype && service_data[i].time == time){
           tableday_data.push(service_data[i]);
        }
    }
    console.log("table_data:"+tableday_data);
    //2、根据返回数据动态生成语料表格table_day_content，处理结果表格table_day_result；
    var tbody_content = document.getElementById("tbody_content");
    var tbody_result = document.getElementById("tbody_result");

    //删除所有的行，保留表头
    while(tbody_content.hasChildNodes()){
        tbody_content.removeChild(tbody_content.lastChild);
    }
    while(tbody_result.hasChildNodes()){
        tbody_result.removeChild(tbody_result.lastChild);
    }
    for(var i=0;i<tableday_data.length;i++){
        //创建新的行列；
        var tr_content = document.createElement("tr");
        var td_content_no = document.createElement("td");
        var td_content_time = document.createElement("td");
        var td_content_text = document.createElement("td");
        var td_source = document.createElement("td");



        var tr_result = document.createElement("tr");
        var td_result_no = document.createElement("td");
        var td_result_time = document.createElement("td");
        var td_changefunction = document.createElement("td");
        var td_changetype = document.createElement("td");

        //设置列内容
        td_content_no.innerHTML = i+1 + "";
        td_content_time.innerHTML = tableday_data[i].time;
        td_content_text.innerHTML = tableday_data[i].content;
        td_source.innerHTML = tableday_data[i].source;

        td_result_no = i+1 + "";
        td_result_time.innerHTML = tableday_data[i].time;
        td_changefunction.innerHTML = tableday_data[i].changefunction;
        td_changetype.innerHTML = tableday_data[i].changetype;

        //将内容添加到表格中
        tr_content.append(td_content_no);
        tr_content.append(td_content_time);
        tr_content.append(td_content_text);
        tr_content.append(td_source);
        tbody_content.append(tr_content);

        tr_result.append(td_result_no);
        tr_result.append(td_result_time);
        tr_result.append(td_changefunction);
        tr_result.append(td_changetype);
        tbody_result.append(tr_result);

    }
    //3、获取弹出框的id,并设置为可见：display:block；
    var popBox = document.getElementById("popBox");
    var popBack = document.getElementById("popBack");
    popBox.style.display = "block";
    popBack.style.display = "block";
    //4、获取处理结果表格的id,并设置为不可见
    var tabledayresult=document.getElementById('table_day_result');
    tabledayresult.style.display ="none";

}
 /*点击关闭按钮*/
function closeBox() {
    var popBox = document.getElementById("popBox");
    var popBack = document.getElementById("popBack");
    popBox.style.display = "none";
    popBack.style.display = "none";
}
function processbutton_click() {
    //1、获取处理结果表格的id;
    var tabledayresult = document.getElementById("table_day_result");
    //2、设置处理结果表格可见:display:table
    tabledayresult.style.display = "table";
}
