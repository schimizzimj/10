#!/usr/bin/env python2.7

import requests
import re
import sys
import datetime

REGEX = '<span data-reactid="62">.*<\/span>'
REGEX2 = 'id="Lead-2-QuoteHeader-Proxy".*'
REGEX3 = 'data-reactid="36".*'

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
cleaned_data = re.search(REGEX, data)
if cleaned_data:
	cleaned_data = cleaned_data.group(0)
	cleaned_data = re.sub("</span>.*", "", cleaned_data)
	closing = cleaned_data.split('>')[1]
	print closing
else:
	# get current price if day entered is today (no closing yet)
	cleaned_data = re.search(REGEX2, data)
	cleaned_data = cleaned_data.group(0)
	cleaned_data = re.search(REGEX3, cleaned_data)
	cleaned_data = cleaned_data.group(0)
	cleaned_data = re.sub("</span>.*", "", cleaned_data)
	closing = cleaned_data.split('>')[1]
	print closing
