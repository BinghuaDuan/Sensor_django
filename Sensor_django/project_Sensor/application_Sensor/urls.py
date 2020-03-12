from . import views
from django.urls import path

urlpatterns = [
    path("writedata/", views.WriteData, name="writeData"),
    path("getdata/<str:service>/", views.getServiceData, name="getServiceData"),

]