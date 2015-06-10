import sqlalchemy as sql
import pymysql

#  SQL stuff
engine = sql.create_engine('mysql+pymysql://root:@localhost/tags', echo=True)
metadata = sql.MetaData(bind=engine)

# Autoloading tables
metadata.reflect()

Artist = metadata.tables['Artist']
TT = metadata.tables["TT"]
Track = metadata.tables["Track"]
Tag = metadata.tables["Tag"]

s = sql.select([Artist])
result = engine.execute(s)
