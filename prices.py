#!/usr/bin/env python2.7

import requests
import re
import sys

REGEX = '<span data-reactid="62">.*<\/span>'

def fetch(url):
	r = requests.get(url)
	if r.status_code != 200:
		sys.exit(1)
	return r.text.encode('utf-8')

args = sys.argv[1:]
symbol = args[0]
time = args[1]

data = fetch("https://finance.yahoo.com/quote/" + symbol + "/history?period1=" + time + "&period2=" + time + "&interval=1d&filter=history&frequency=1d")
data = re.search(REGEX, data)
if data:
	data = data.group(0)
	data = re.sub("</span>.*", "", data)
	closing = data.split('>')[1]
	print closing
else:
	print False
