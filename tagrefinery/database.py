import pymysql
import sqlalchemy as sql


class InitializeDB:
    engine = sql.create_engine('mysql+pymysql://root:@localhost/tags', echo=True)
    
    # Metadata and autoload tables
    metadata = sql.MetaData(bind=engine)

    metadata.reflect()

    # Get table opjects
    Ancestor = metadata.tables['Ancestor']
    AT = metadata.tables['AT']
    Tag = metadata.tables['Tag']
    TT = metadata.tables['TT']
    Track = metadata.tables['Track']
    Artist = metadata.tables['Artist']

    # Querys
    query_Ancestor = "select * from Ancestor"
    query_AT = "select * from AT"
    query_Tag = "select * from Tag"
    query_TT = "select * from TT"
    query_Track = "select * from Track"
    query_Artist = "select * from Artist"

    # Update table with pandas dataframe
    def updateTable(table, data, conn = engine):
        for i,r in data.iterrows():
            conn.execute(table.update()
                    .where(table.c.ID==int(i))
                    .values(r.to_dict()))
