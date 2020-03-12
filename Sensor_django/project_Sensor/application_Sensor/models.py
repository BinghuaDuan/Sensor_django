from django.db import models

# Create your models here.
class Service(models.Model):
    service_name = models.TextField()
    changefunction = models.TextField()
    changetype = models.TextField()
    content = models.TextField()
    source = models.TextField()
    contentype = models.TextField()
    time = models.DateField()
    objects = models.Manager()

    def __str__(self):
        return self.changefunction
