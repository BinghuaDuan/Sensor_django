# Generated by Django 2.2 on 2019-12-13 10:59

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('service_name', models.TextField()),
                ('changefunction', models.TextField()),
                ('changetype', models.TextField()),
                ('content', models.TextField()),
                ('source', models.TextField()),
                ('contentype', models.TextField()),
                ('time', models.DateField()),
            ],
        ),
    ]
