CREATE TABLE books (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    author TEXT NOT NULL CHECK (length(trim(author)) > 0),
    publication_year INTEGER
        CHECK (publication_year BETWEEN 1 AND 9999),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);