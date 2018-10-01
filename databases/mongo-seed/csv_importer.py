# coding: utf-8
"""
Tiny script importing and formatting data for mongo insertion.
"""
import os

from ast import literal_eval
import csv

import arrow


FILE = os.environ.get('CSV_FILE', 'data.csv')


def ignore(f):
    return f


def get_datetime(value):
    return arrow.get(value).datetime


def main():

    fieldsnames = {
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
 
    with open(FILE) as f:
        d = csv.dictreader(f=f)
