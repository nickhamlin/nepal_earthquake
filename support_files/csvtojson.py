__author__ = 'mandeepak'

import csv
import json

csvfilename = 'output.csv'
jsonfilename = csvfilename.split('.')[0] + '.json'
csvfile = open(csvfilename, 'r')
jsonfile = open(jsonfilename, 'w')
data={}
with jsonfile as outfile,csvfile as inputfile:
    for line in inputfile:
       stream=line.split()
       data.setdefault("data",[]).append({"count": stream[-1],"word": stream[0][1:-1]})
    json.dump(data, outfile)
