# coding: utf-8
"""
Tiny script importing and formatting data for mongo insertion.
"""
import os

from ast import literal_eval
import csv

import arrow
from pymongo import MongoClient, InsertOne


def ignore(f):
    return f


def get_datetime(value):
    return arrow.get(value).datetime


FORMATTER = {
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
    'year': ignore,
    'month': literal_eval,
    'day_week': ignore,
    'ucrpart': ignore,
    'x': literal_eval,
    'y': literal_eval,
    'streetname': ignore,
    'xstreetname': ignore,
    'location': ignore,
}

FILE = os.environ.get('CSV_FILE', 'data.csv')
DATABASE = MongoClient(
    os.environ.get(
        'MONGO_URI',
    )
).get_database()
COLLECTION = 'crimes'


def format_row(row):
    return {k: FORMATTER[k](v) for k, v in row.items()}


def get_rows():
    with open(FILE) as f:
        reader = csv.DictReader(f=f)
        for row in reader:
            yield format_row(row)


def prepare_row(row):
    return InsertOne(row)


def create_indexes(collection):
    for field in FORMATTER.keys():
        collection.create_index(field)


def main():
    print('processing rows')
    rows = get_rows()
    res = DATABASE[COLLECTION].bulk_write([prepare_row(row) for row in rows])
    print(res)
    create_indexes(DATABASE[COLLECTION])


if __name__ == '__main__':
    main()
