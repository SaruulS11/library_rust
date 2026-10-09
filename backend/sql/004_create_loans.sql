CREATE TABLE loans (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    copy_id INTEGER NOT NULL
        REFERENCES book_copies(id) ON DELETE RESTRICT,

    member_id INTEGER NOT NULL
        REFERENCES members(id) ON DELETE RESTRICT,

    borrowed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    due_at TIMESTAMPTZ NOT NULL,

    returned_at TIMESTAMPTZ,

    CONSTRAINT loans_due_after_borrow
        CHECK (due_at > borrowed_at),

    CONSTRAINT loans_return_after_borrow
        CHECK (returned_at IS NULL OR returned_at >= borrowed_at)
);

CREATE UNIQUE INDEX loans_one_active_per_copy
    ON loans(copy_id)
    WHERE returned_at IS NULL;

CREATE INDEX idx_loans_member_id ON loans(member_id);

CREATE INDEX idx_loans_copy_id ON loans(copy_id);