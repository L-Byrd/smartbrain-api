BEGIN TRANSACTION;

CREATE TABLE login (
    id serial PRIMARY KEY, 
    hash varchar(100),
    email text UNIQUE NOT NULL 
);

COMMIT;