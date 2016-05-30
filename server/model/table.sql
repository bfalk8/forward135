DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE users (
    id    SERIAL PRIMARY KEY,
    name  TEXT NOT NULL UNIQUE,
    role  char(1) NOT NULL,
    age   INTEGER NOT NULL,
    state char(2) NOT NULL
);

CREATE TABLE categories (
    id  SERIAL PRIMARY KEY,
    name  TEXT NOT NULL UNIQUE,
    description  TEXT NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    sku CHAR(10) NOT NULL UNIQUE,
    category_id INTEGER REFERENCES categories (id) NOT NULL,
    price FLOAT NOT NULL CHECK (price >= 0),
    is_delete BOOLEAN NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) NOT NULL,
    product_id INTEGER REFERENCES products (id) NOT NULL,
    quantity INTEGER NOT NULL,
    price FLOAT NOT NULL CHECK (price >= 0),
    is_cart BOOLEAN NOT NULL
);

-- Fact Table Trigger
-- insert, update, delete

CREATE OR REPLACE FUNCTION
    notify_fact_table()
    RETURNS TRIGGER AS $$
DECLARE
BEGIN
    PERFORM pg_notify('watchers', json_build_object('type', TG_OP, 'table', TG_TABLE_NAME, 'id', NEW.id)::text);
    RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS watch_fact_table_insert ON orders;
CREATE TRIGGER watch_fact_table_insert AFTER INSERT ON orders
FOR EACH ROW EXECUTE PROCEDURE notify_fact_table();

-- FIXME Change the filepath
-- COPY users(name, role, age, state) FROM 'C:\Users\Brandon\dev\projects\school\forward135\server\model\users.txt' DELIMITER ',' CSV;
-- COPY categories(name, description) FROM 'C:\Users\Brandon\dev\projects\school\forward135\server\model\categories.txt' DELIMITER ',' CSV;
-- COPY products(name, sku, category_id, price, is_delete) FROM 'C:\Users\Brandon\dev\projects\school\forward135\server\model\products.txt' DELIMITER ',' CSV;
-- COPY orders(user_id, product_id, quantity, price, is_cart) FROM 'C:\Users\Brandon\dev\projects\school\forward135\server\model\orders.txt' DELIMITER ',' CSV;

INSERT INTO categories ( name, description) VALUES ('tech', 'techy McTechface');
INSERT INTO products (name, sku, category_id, price, is_delete) VALUES ('surface', 'fucksku',1,10, false);
INSERT INTO orders (user_id, product_id, quantity, price, is_cart) VALUES (5, 2, 2, 3.5, false);

-- FIXME Change the filepath
-- COPY users(name, role, age, state) FROM '/Users/alxrsngrtn/Github/forward135/server/model/users.txt' DELIMITER ',' CSV;
-- COPY categories(name, description) FROM '/Users/alxrsngrtn/Github/forward135/server/model/categories.txt' DELIMITER ',' CSV;
-- COPY products(name, sku, category_id, price, is_delete) FROM '/Users/alxrsngrtn/Github/forward135/server/model/products.txt' DELIMITER ',' CSV;
-- COPY orders(user_id, product_id, quantity, price, is_cart) FROM '/Users/alxrsngrtn/Github/forward135/server/model/orders.txt' DELIMITER ',' CSV;

---- users
------ functions
-- CREATE OR REPLACE FUNCTION
--     notify_users()
--     RETURNS TRIGGER AS $$
-- DECLARE
-- BEGIN
--     PERFORM pg_notify('watchers', 'id,' || NEW.id || ',name,' || NEW.name || ',role,' || NEW.role || ',age,' || NEW.age || ',state,' || NEW.state);
--     RETURN new;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE OR REPLACE FUNCTION
--     notify_users_id()
--     RETURNS TRIGGER AS $$
--     DECLARE
--     BEGIN
--         PERFORM pg_notify('watch_users_id', 'id,' || NEW.id);
--         RETURN new;
--     END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE OR REPLACE FUNCTION
--     notify_users_name()
--     RETURNS TRIGGER AS $$
-- DECLARE
-- BEGIN
--     PERFORM pg_notify('watch_users_name', 'name,' || NEW.name);
--     RETURN new;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE OR REPLACE FUNCTION
--     notify_users_role()
--     RETURNS TRIGGER AS $$
-- DECLARE
-- BEGIN
--     PERFORM pg_notify('watch_users_role', 'role,' || NEW.role);
--     RETURN new;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE OR REPLACE FUNCTION
--     notify_users_age()
--     RETURNS TRIGGER AS $$
-- DECLARE
-- BEGIN
--     PERFORM pg_notify('watch_users_age', 'age,' || NEW.age);
--     RETURN new;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE OR REPLACE FUNCTION
--     notify_users_state()
--     RETURNS TRIGGER AS $$
-- DECLARE
-- BEGIN
--     PERFORM pg_notify('watch_users_state', 'state,' || NEW.state);
--     RETURN new;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- ------ triggers
-- -------- update
-- CREATE TRIGGER watch_user_update_id AFTER UPDATE OF id ON users
-- FOR EACH STATEMENT EXECUTE PROCEDURE notify_users_id();
-- CREATE TRIGGER watch_user_update_name AFTER UPDATE OF name ON users
-- FOR EACH STATEMENT EXECUTE PROCEDURE notify_users_name();
-- CREATE TRIGGER watch_user_update_role AFTER UPDATE OF role ON users
-- FOR EACH STATEMENT EXECUTE PROCEDURE notify_users_role();
-- CREATE TRIGGER watch_user_update_age AFTER UPDATE OF age ON users
-- FOR EACH STATEMENT EXECUTE PROCEDURE notify_users_age();
-- CREATE TRIGGER watch_user_update_state AFTER UPDATE OF state ON users
-- FOR EACH STATEMENT EXECUTE PROCEDURE notify_users_state();
-- CREATE TRIGGER watch_user_update_state AFTER UPDATE ON users
-- FOR EACH STATEMENT EXECUTE PROCEDURE notify_users();
-- -------- insert
-- CREATE TRIGGER watch_user_insert AFTER INSERT ON users
-- FOR EACH STATEMENT EXECUTE PROCEDURE notify_users();
-- -------- delete
-- CREATE TRIGGER watch_user_delete AFTER DELETE ON users
-- FOR EACH STATEMENT EXECUTE PROCEDURE notify_users();
