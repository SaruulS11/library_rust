CREATE TABLE members (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    member_code TEXT NOT NULL UNIQUE
        CHECK (length(trim(member_code)) > 0),
    full_name TEXT NOT NULL
        CHECK (length(trim(full_name)) > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);