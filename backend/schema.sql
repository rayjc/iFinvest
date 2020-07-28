DROP TABLE IF EXISTS investments;
DROP TABLE IF EXISTS portfolios;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS stocks;


CREATE TABLE stocks (
    symbol text PRIMARY KEY,
    name text NOT NULL,
    exchange text NOT NULL,
    ipo_date date NOT NULL,
    region text NOT NULL,
    currency text NOT NULL,
    type text
);

CREATE TABLE users (
    id serial PRIMARY KEY,
    username text NOT NULL UNIQUE,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE
);

CREATE TABLE portfolios (
    id serial PRIMARY KEY,
    name text NOT NULL,
    created_at date NOT NULL DEFAULT CURRENT_DATE,
    user_id integer NOT NULL REFERENCES users ON DELETE CASCADE,
    CONSTRAINT unique_portfolio UNIQUE (user_id, name)
);

CREATE TABLE investments (
    id serial PRIMARY KEY,
    start_date date NOT NULL DEFAULT CURRENT_DATE,
    end_date date,
    initial_value float NOT NULL,
    initial_price float,
    symbol text NOT NULL REFERENCES stocks ON DELETE CASCADE,
    portfolio_id integer NOT NULL REFERENCES portfolios ON DELETE CASCADE,
    CONSTRAINT unique_investment UNIQUE (portfolio_id, symbol)
);


/*
INSERT INTO stocks (symbol, name, exchange, ipo_date, region, currency, type)
    VALUES ('GOOG', 'Google', 'NASDAQ', '2000-01-01', 'us', 'USD', 'te');
INSERT INTO stocks (symbol, name, exchange, ipo_date, region, currency, type)
    VALUES ('AAPL', 'Apple', 'NASDAQ', '2000-12-30', 'us', 'USD', 'te');

INSERT INTO users (username, password, first_name, last_name, email)
    VALUES ('test1', 'testing', 'test1', 'user', 'test1@test.com');
INSERT INTO users (username, password, first_name, last_name, email)
    VALUES ('test2', 'testing', 'test2', 'user', 'test2@test.com');

INSERT INTO portfolios (name, created_at, user_id)
    VALUES ('alpha', '2020-01-20', 1);
INSERT INTO portfolios (name, user_id)
    VALUES ('beta', 2);
INSERT INTO portfolios (name, user_id)
    VALUES ('gamma', 2);

INSERT INTO investments (start_date, end_date, initial_value, symbol, portfolio_id)
    VALUES ('2010-02-25', '2020-01-01', 1000, 'GOOG', 1);
INSERT INTO investments (start_date, initial_value, symbol, portfolio_id)
    VALUES ('2010-03-25', 1000, 'AAPL', 1);
INSERT INTO investments (start_date, initial_value, symbol, portfolio_id)
    VALUES ('2010-04-10', 1000, 'GOOG', 2);
*/