# Lib imports
import pandas as pd
import numpy as np
import nltk as nlp
import matplotlib.pyplot as plt
import importlib
import re

# Custom modules
import database

# Reload custom modules
def reloadall():
    global database
    database = importlib.reload(database)
    
print("Begin Main")

# Initialize variables
db = database.InitializeDB()

# Import all stopwords from nltk
stopwords = set(nlp.corpus.stopwords.words())

# Derive the Tag table from Ancestor
tags = db.fetchData(db.query_Tag)

# Create connection character removing regex
# Compile improves speed through precompiling
# re.escape escapes all characters 
# The list needs to be a string which looks like this [/_-]
chars_removed = ["-","_","/","."]
rx_cr = re.compile("["+re.escape("".join(chars_removed))+"]")

# String processing 

# Creating a normlized text composed of all tags separated by points. 
text = ". ".join([re.sub(rx_cr, " ", t.lower()) for t in tags["Name"]])

subset = text[:200]

# Porter is the oldest stemmer
#porter = nlp.PorterStemmer()
# Lancaster is an very aggressive one
#lancaster = nlp.LancasterStemmer()
# English snowball is a better porter stemmer. (From nltk documentation)
snow = nlp.stem.snowball.EnglishStemmer(ignore_stopwords=True)
# Uses wordnet wo lemmatize known words
wnl = nlp.WordNetLemmatizer()

tokens = nlp.word_tokenize(subset)

# Oldest stemmer 
#ps = [porter.stem(t) for t in tokens]
# Aggressive stemmer
#ls = [lancaster.stem(t) for t in tokens]
# For english better than the porter stemmer (from nltk docu)
norm_t = [snow.stem(t) for t in tokens]
# Wordnet Lemmatizer: lemmatzies all known words
wn = [wnl.lemmatize(t) for t in tokens]

vocab = set(norm_t)

print(len(vocab))

#remove stopwords
vocab.discard(stopwords)

print(len(vocab))

ed = nlp.metrics.distance.edit_distance()

ed("a","b",transpositions=True)




