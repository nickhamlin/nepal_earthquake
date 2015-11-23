__author__ = 'mandeepa'
import requests
import json
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.util import ngrams
import re
import uuid
url="https://otter.topsy.com/search.json?q=nepal earthquake&&mintime=1429786838&maxtime=1430996448&offset=10"

def tokenize(content):
    stop_words = stopwords.words('english')
    tokens=word_tokenize(content)
    tokens = [w for w in tokens if not w in stop_words]
    clean_tokens=[]
    for w in tokens:
        if not re.match(r'(http|https|:|,|\.|\/\/|\@)',w,re.UNICODE):
            if ',' in w or '"' in w:
                replaced = re.sub(r'(\,|\"|\;)','', w)
                clean_tokens.append(replaced)
            else:
                clean_tokens.append(w)
    return clean_tokens

def write_to_file(filename,content):
    with open(filename,"a") as file:
        file.write(content)
    file.close()


def get_result(keyword="nepal earthquake",apikey="09C43A9B270A470B8EB8F2946A9369F3",offset=0):
    url="https://otter.topsy.com/search.json?q="+keyword+"&"+"apikey="+apikey+"&mintime=1429786838&maxtime=1430996448&offset="+str(offset)
    r=requests.get(url)
    content_tokens=''
    if r.status_code==200:
        json_string=r.text
        parsed_json = json.loads(json_string)
        for res in parsed_json['response']['list']:
            if res['content'] is not None or len(res['content'])>0:
                content_tokens+=','.join(tokenize(res['content']))+"\n"
        return content_tokens


for i in range(0,100,10):
    res_tokens=get_result("nepal earthquake","09C43A9B270A470B8EB8F2946A9369F3",offset=i)
    res_token_unicode=res_tokens.encode("utf-8",errors="ignore")
    write_to_file('tweets_token',res_token_unicode)