# coding: utf-8
"""
Tiny script importing and formatting data for mongo insertion.
"""
import os

from ast import literal_eval
import csv

import arrow
from pymongo import MongoClient, InsertOne


FILE = os.environ.get('CSV_FILE', 'data.csv')
DATABASE = MongoClient(
    os.environ.get(
        'MONGO_URI',
        'mongodb://localhost:27017/hapivue'
    )
).get_database()
COLLECTION = 'crimes'


def ignore(f):
    return f


def get_datetime(value):
    return arrow.get(value).datetime


def format_row(row):
    formatter = {
        'compnos': literal_eval,
        'naturecode': ignore,
        'incident_type_description': ignore,
        'main_crimecode': ignore,
        'reptdistrict': ignore,
        'reportingarea': literal_eval,
        'fromdate': get_datetime,
        'weapontype': ignore,
        'shooting': literal_eval,
        'domestic': literal_eval,
        'shift': ignore,
        'year': literal_eval,
        'month': literal_eval,
        'day_week': ignore,
        'ucrpart': ignore,
        'x': literal_eval,
        'y': literal_eval,
        'streetname': ignore,
        'xstreetname': ignore,
        'location': literal_eval,
    }
    return {k: formatter[k](v) for k, v in row.items()}


def get_rows():
    with open(FILE) as f:
        reader = csv.DictReader(f=f)
        for row in reader:
            yield format_row(row)


def prepare_row(row):
    return InsertOne(row)


def main():
    print('processing rows')
    rows = get_rows()
    res = DATABASE[COLLECTION].bulk_write([prepare_row(row) for row in rows])
    print(res)


if __name__ == '__main__':
    main()
