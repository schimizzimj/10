#!/usr/bin/env python2.7

import requests
import re
import os
import sys

# global variables
SYMBOL = ""
base_url = "https://finance.yahoo.com/quote/"
query = "?p="
REGEX="<h1.*>.*</h1>"

def usage(status=0):
    print 'Usage: {} STOCK_SYMBOL'.format(os.path.basename(sys.argv[0]))
    sys.exit(status)

def fetch(url):
	r = requests.get(url)
	if r.status_code != 200:
		sys.exit(1)
	return r.text.encode('utf-8')


# parse command line options
args = sys.argv[1:]
if len(args) > 0:
	SYMBOL = args[0]
else:
	usage(1)

# fetch data for SYMBOL
url = base_url + SYMBOL + query + SYMBOL
data = fetch(url)
data = re.search(REGEX, data)
if data:
	name = data.group(0).split(">", 1)[1]
	name = name.split("(", 1)[0]
	print name
else:
	print False
