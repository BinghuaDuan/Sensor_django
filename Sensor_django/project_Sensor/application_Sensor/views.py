from django.http import HttpResponse
from .models import Service
import xlrd
import json,os
# Create your views here.
def getServiceData(request,service):
    service_data = Service.objects.filter(service_name=service).order_by("time")
    return_data = []
    for entry in service_data:
        entry_dict = {'service_name':entry.service_name,
                      'changefunction':entry.changefunction,
                      'changetype':entry.changetype,
                      'content':entry.content,
                      'source':entry.source,
                      'contentype':entry.contentype,
                      'time':entry.time.strftime('%Y-%m-%d')}
        return_data.append(entry_dict)

    return_data = json.dumps(return_data)
    return HttpResponse(return_data)

def WriteData(request):
    #1、打开文件
    filepath = os.path.join(os.getcwd(), "data.xlsx")
    print("filpath={}".format(filepath))
    xl = xlrd.open_workbook(filepath)
    #2、获取Sheet对象
    sheet1 = xl.sheet_by_name("Sheet1")
    #3、获取行数和列数
    rows = sheet1.nrows
    print("rows:{}".format(rows))
    cols = sheet1.ncols
    #4、读取第一行的表头
    head = sheet1.row_values(0)
    for r in range(1, rows):
        data_item = {}
        row_values = sheet1.row_values(r)
        for c in range(0, cols):
            data_item[head[c]] = row_values[c]
        Service.objects.create(**data_item)

    return HttpResponse("write sucecess!")








