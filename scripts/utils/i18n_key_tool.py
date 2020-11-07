#!/usr/bin/env python3

import argparse
import glob
import json
import os

not_found_cnt = 0
found_cnt = 0
exclude_cnt = 0

def check_dir(dir_name):
    dir = os.path.join(os.getcwd(), dir_name)

    if os.path.isdir(dir):
        return dir
    else:
        raise NotADirectoryError(dir)


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
parser.add_argument('--Xreport-found', action='store_false', help='do not report any "Found" keys')
parser.add_argument('--Xreport-not-found', action='store_false', help='do not report any "Not Found" keys')
args = parser.parse_args()


class Colors:
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    FAIL = '\033[91m'
    WARN = '\033[93m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


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
    for file in glob.glob(os.path.join(path, "**", "*.ts*"), recursive=True):
        with open(file) as f:
            contents = f.read()
        if key in contents:
            results.append(f.name)

    return results


json_data = json.load(open(args.json_file))

for i18n_key in sorted(list(set(walk_keys(json_data)))):
    exclude_data = []

    if args.exclude_file is not None:
        with open(args.exclude_file) as f:
            exclude_data = f.read().splitlines()

    if exclude_data.__contains__(i18n_key):
        print('{:<80s}{:>10s}'.format(Colors.OKCYAN + i18n_key, Colors.WARN + '[TAG EXCLUDED]') + Colors.ENDC)
        exclude_cnt += 1
    else:
        result = search_for_key(args.search_path, i18n_key)

        if len(result) <= 0 and args.Xreport_not_found:
            print('{:<80s}{:>10s}'.format(Colors.OKCYAN + i18n_key, Colors.FAIL + '[NOT FOUND]') + Colors.ENDC)
            not_found_cnt += 1

        if args.Xreport_found:
            print(Colors.OKCYAN + i18n_key + Colors.ENDC)
            found_cnt += 1
            for f in result:
                print(Colors.OKBLUE + "\tFOUND IN: " + f + Colors.ENDC)

print("\n")
print('{:>25s}'.format(Colors.OKCYAN + "TOTALS" + Colors.ENDC))
print('{:<30s}{:>10s}'.format(Colors.OKCYAN + "FOUND", Colors.OKBLUE + str(found_cnt) + Colors.ENDC))
print('{:<30s}{:>10s}'.format(Colors.OKCYAN + "NOT FOUND", Colors.FAIL + str(not_found_cnt) + Colors.ENDC))
print('{:<30s}{:>10s}'.format(Colors.OKCYAN + "EXCLUDED", Colors.WARN + str(exclude_cnt) + Colors.ENDC))
