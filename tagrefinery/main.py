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
stopwords = nlp.corpus.stopwords.words()

# Derive the Tag table from Ancestor

subset = db.ancestor.head(10)

# Create connection character removing regex
chars_removed = ["-","_","/"]

# Compile improves speed through precompiling
# re.escape escapes all characters 
# The list needs to be a string which looks like this [/_-]
rx_cr = re.compile("["+re.escape("".join(chars_removed))+"]")

# String processing and splitting
# re.subs uses the precompiled regex and replaces the chars from there with spaces
temp = subset["Name"].apply(lambda x: re.sub(rx_cr," ",x.lower()).split())

# Generating AT table data
# Using nested list comprehension to expand the lists
# stack and reset_index sets merges the multi index
# drop removes temp index
linking = pd.DataFrame([[w for w in row] for row in temp], index=temp.index).stack().reset_index().drop("level_1",1)
linking.columns = ["AncestorID","Name"]

# Generating Tag table data
# grouping.count gives total occurrence and reset_index creates new index
# shifting index to from 0:n to 1:x
# Adding new column with TagID info
tag = linking.groupby(["Name"]).count().reset_index()
tag.index += 1
tag.columns = ["Name","Occurrence"]
tag['TagID'] = pd.Series(tag.index, index=tag.index)

# Filling Tag table
db.insertTable(db.Tag, tag[["Name","Occurrence"]])

#Preparing at table data
at = pd.merge(linking,tag)[["AncestorID","TagID"]]
at.index += 1

# Filling AT table
db.insertTable(db.AT, at.astype(object))




