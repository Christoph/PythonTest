mysql -u root tags -e "Drop table TT; Drop table Track; Drop table Tag; Drop table Artist"
mysql -u root tags < db_schema
