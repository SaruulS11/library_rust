CREATE TABLE book_copies (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    inventory_code TEXT NOT NULL UNIQUE
        CHECK (length(trim(inventory_code)) > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_book_copies_book_id ON book_copies(book_id);