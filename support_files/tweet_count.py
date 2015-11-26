__author__ = 'mandeepak'

from mrjob.job import MRJob
from mrjob.protocol import JSONValueProtocol
import re
WORD_RE = re.compile(r"[\w']+")

class TweetWordFrequency(MRJob):
    # OUTPUT_PROTOCOL = JSONValueProtocol
    count=0
    def mapper(self, _, line):
        for word in WORD_RE.findall(line):
            if len(word)>1 and "'" not in word and not word.startswith("0"):
                yield word.lower(), 1

    def combiner(self, word, counts):
        yield word, sum(counts)

    def reducer(self, word, counts):
        #{'term': term, 'count': sum(occurrences)}
        yield word,sum(counts)

if __name__ == '__main__':
    TweetWordFrequency.run()
