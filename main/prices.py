#!/usr/bin/env python2.7

import requests
import re
import sys
import datetime

REGEX = '<span data-reactid="62">.*<\/span>'

def fetch(url):
	r = requests.get(url)
	if r.status_code != 200:
		sys.exit(1)
	return r.text.encode('utf-8')

args = sys.argv[1:]
symbol = args[0]
day_begin = int(args[1])

day_begin = day_begin - (day_begin % (24 * 60 * 60)) + (4 * 60 * 60)
day_date = datetime.datetime.fromtimestamp(day_begin)
day_of_week = datetime.date.weekday(day_date)
if day_of_week is 5:
	day_begin -= (60 * 60 * 24) # convert Saturday to Friday
elif day_of_week is 6:
	day_begin -= (2 * 60 * 60 *24) # convert Sunday to Friday
data = fetch("https://finance.yahoo.com/quote/" + symbol + "/history?period1=" + str(day_begin) + "&period2=" + str(day_begin) + "&interval=1d&filter=history&frequency=1d")
data = re.search(REGEX, data)
if data:
	data = data.group(0)
	data = re.sub("</span>.*", "", data)
	closing = data.split('>')[1]
	print closing
else:
	day_begin
