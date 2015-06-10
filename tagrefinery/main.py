# Lib imports
import pandas as pd
import numpy as np
import nltk as nlp
import matplotlib.pyplot as plt
import importlib

# Custom modulemodules
import database

# Reload custom modules
def reloadall():
    global database
    database = importlib.reload(database)
    
print("Begin Main")

db = database.InitializeDB()

ancestor = pd.read_sql_query(db.query_Ancestor, db.engine, index_col = "ID")

stopwords = nlp.corpus.stopwords.words()

       
