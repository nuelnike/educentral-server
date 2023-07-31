select * from pg_stat_activity where datname = 'DataHive' and state ='active'; -- get current active connections
SET session_replication_role = 'replica'; -- disable constraints
SET session_replication_role = 'origin'; -- enable constraints

CREATE DATABASE "DataHive" WITH OWNER = postgres ENCODING = 'UTF8' CONNECTION LIMIT = 25 IS_TEMPLATE = False;
COMMENT ON DATABASE "DataHive" IS 'database with core system data';

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
COMMENT ON SCHEMA public IS 'standard public schema';