mysql -u root tags -e "Drop table TT; Drop table AT; Drop table Ancestor; Drop table Track; Drop table Tag; Drop table Artist"
mysql -u root tags < db_schema
