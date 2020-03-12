from django.contrib import admin
from .models import Service
class ServiceAdmin(admin.ModelAdmin):
    search_fields = ('changefunction',)
# Register your models here.
admin.site.register(Service,ServiceAdmin)
