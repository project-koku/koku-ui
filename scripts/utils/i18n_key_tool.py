#!/usr/bin/env python3

import argparse
import glob
import json
import os
import sys

from functools import reduce
import operator

not_found_cnt = 0
found_cnt = 0
exclude_cnt = 0
key_vals = {}


def check_dir(dir_name):
    directory = os.path.join(os.getcwd(), dir_name)

    if os.path.isdir(directory):
        return directory
    else:
        raise NotADirectoryError(directory)


def check_file(filename):
    file = os.path.join(os.getcwd(), filename)

    if os.path.isfile(file):
        return file
    else:
        raise FileNotFoundError(file)


parser = argparse.ArgumentParser()
parser.add_argument('--search-path', type=check_dir, required=True, help='parent directory to start searching')
parser.add_argument('--json-file', type=check_file, required=True, help='i18n json file location')
parser.add_argument('--exclude-file', type=check_file, help='file that lists i18n tags in dot notation to exclude'
                                                            'from reporting')
parser.add_argument('--find-duplicates', action='store_true', help='report all duplicate values')
parser.add_argument('--validate-excludes', action='store_true', help='validate excluded in keys are valid')

parser.add_argument('--Xreport-found', action='store_false', help='do not report any "Found" keys')
parser.add_argument('--Xreport-not-found', action='store_false', help='do not report any "Not Found" keys')
args = parser.parse_args()


class Colors:
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    FAIL = '\033[91m'
    PASS = '\033[92m'
    WARN = '\033[93m'
    ENDC = '\033[0m'


# get keys from json file
def walk_keys(obj, path=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            for r in walk_keys(v, path + "." + k if path else k):
                yield r
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            s = ""
            for r in walk_keys(v, path if path else s):
                yield r
    else:
        yield path


# search all files starting at path for key
def search_for_key(path, key):
    results = []
    for file in glob.glob(os.path.join(path, "**", "**.ts*"), recursive=True):
        with open(file) as f:
            contents = f.read()
        if key in contents:
            results.append(f.name)

    return results


# find duplicate values from dictionary using set
def find_duplicate_values(data):
    val_checked = []
    total_dupes = 0

    print(Colors.OKBLUE + 'Checking for duplicate key values...' + Colors.ENDC)

    for k, v in sorted (data.items()):
        if v not in val_checked:
            res = []

            for key, value in data.items():
                if v == value:
                    res.append(key)

            if len(res) > 1:
                total_dupes += 1
#                 print(Colors.OKCYAN + '"' + v + '"' + Colors.ENDC)
                print('{:<80s}{:>10s}'.format(Colors.OKCYAN + '"' + v + '"', Colors.WARN + '[Found: ' + str(len(res)) +
                 ']') + Colors.ENDC)
                for dupe in res:
                    print(Colors.OKBLUE + "\tFOUND IN KEY: " + Colors.OKCYAN + dupe + Colors.ENDC)

            val_checked.append(v)

    print("\n")
    print(Colors.OKCYAN + "TOTAL DUPLICATES FOUND: ", Colors.OKBLUE + str(total_dupes) + Colors.ENDC)


# validate excludes are valid
def validate_excludes(elist, data):
    i18n_keys = list(set(walk_keys(json_data)))
    print('{:>30s}'.format(Colors.OKBLUE + "Validating exclude list..." + Colors.ENDC))
    for exclude in elist:
        if exclude not in i18n_keys and exclude:
            print('{:<80s}{:>10s}'.format(Colors.OKCYAN + exclude, Colors.FAIL + '[EXCLUDE NOT VALID]') + Colors.ENDC)


json_data = json.load(open(args.json_file))
previous_key_status = {}

# Check all i18n_keys to see if they are being used in the src code
if args.Xreport_not_found or args.Xreport_found:
    # check if exclude list is given
    exclude_data = []
    if args.exclude_file is not None:
        with open(args.exclude_file) as f:
            exclude_data = f.read().splitlines()
        validate_excludes(exclude_data, json_data)

    print(' ')
    print(Colors.OKBLUE + 'Checking for dead keys...' + Colors.ENDC)
    for i18n_key in sorted(list(set(walk_keys(json_data)))):
        found = False

        if exclude_data.__contains__(i18n_key):
            # key is on exclude list
            previous_key_status.clear()
            previous_key_status[i18n_key] = True
            print('{:<80s}{:>10s}'.format(Colors.OKCYAN + i18n_key, Colors.WARN + '[TAG EXCLUDED]') + Colors.ENDC)
            exclude_cnt += 1
        else:
            result = search_for_key(args.search_path, i18n_key)

            # check plurals and exclude if none plural is already found
            if len(previous_key_status) > 0:
                prev_key = next(iter(previous_key_status))
                if prev_key + "_plural" == i18n_key and previous_key_status[prev_key]:
                    previous_key_status.clear()
                    print(
                        '{:<80s}{:>10s}'.format(Colors.OKCYAN + i18n_key, Colors.WARN + '[TAG EXCLUDED]') + Colors.ENDC)
                    exclude_cnt += 1
                    continue

            # found status
            if len(result) <= 0:
                found = False
                previous_key_status.clear()
                previous_key_status[i18n_key] = False
                not_found_cnt += 1
            else:
                found = True
                previous_key_status.clear()
                previous_key_status[i18n_key] = True
                found_cnt += 1

            # report based on cli args
            if found is False and args.Xreport_not_found:
                print('{:<80s}{:>10s}'.format(Colors.OKCYAN + i18n_key, Colors.FAIL + '[NOT FOUND]') + Colors.ENDC)
                continue

            if args.Xreport_found:
                print('{:<80s}{:>10s}'.format(Colors.OKCYAN + i18n_key, Colors.PASS + '[FOUND]') + Colors.ENDC)
                for f in result:
                    print(Colors.OKBLUE + "\tFOUND IN: " + f + Colors.ENDC)

    # Dead Key Report Totals
    print("\n")
    print('{:>30s}'.format(Colors.OKCYAN + "DEAD KEY TOTALS" + Colors.ENDC))
    print('{:<30s}{:>10s}'.format(Colors.OKCYAN + "FOUND", Colors.OKBLUE + str(found_cnt) + Colors.ENDC))
    print('{:<30s}{:>10s}'.format(Colors.OKCYAN + "NOT FOUND", Colors.FAIL + str(not_found_cnt) + Colors.ENDC))
    print('{:<30s}{:>10s}'.format(Colors.OKCYAN + "EXCLUDED", Colors.WARN + str(exclude_cnt) + Colors.ENDC))
    print('{:<30s}{:>10s}'.format(Colors.OKCYAN + "TOTAL NUM OF KEYS", Colors.OKBLUE + str(found_cnt + not_found_cnt +
                                                                                           exclude_cnt) + Colors.ENDC))


class DictQuery(dict):
    def get(self, path, default=None):
        keys = path.split("/")
        val = None

        for key in keys:
            if val:
                if isinstance(val, list):
                    val = [v.get(key, default) if v else None for v in val]
                else:
                    val = val.get(key, default)
            else:
                val = dict.get(self, key, default)

            if not val:
                break

        return val


# Report all duplicate values in i18n file
if args.find_duplicates:
    for i18n_key in sorted(list(set(walk_keys(json_data)))):
        chg_key = i18n_key.replace('.', '/')
        key_val = DictQuery(json_data).get(chg_key)

        if not isinstance(key_val, (list, dict)):
            key_vals.update({i18n_key: key_val})

    print("\n")
    find_duplicate_values(key_vals)


# check excludes for validity
if args.validate_excludes:
    if args.exclude_file is not None:
        exclude_data = []
        with open(args.exclude_file) as f:
            exclude_data = f.read().splitlines()
        validate_excludes(exclude_data, json_data)
    else:
        sys.exit(Colors.FAIL + 'You must supply an exclude file' + Colors.ENDC)
