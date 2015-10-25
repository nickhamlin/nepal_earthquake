__author__ = 'mandeepak'

import csv
import json

csvfilename = 'output.tsv'
jsonfilename = csvfilename.split('.')[0] + '.json'
csvfile = open(csvfilename, 'r')
jsonfile = open(jsonfilename, 'w')
data={}
with jsonfile as outfile,csvfile as inputfile:
    for line in inputfile:
       stream=line.split()
       if int(stream[-1])>1:
           data.setdefault("data",[]).append({"weight": int(stream[-1]),"word": stream[0][1:-1]})
    json.dump(data, outfile)