CREATE TABLE tasks (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    title VARCHAR(100) NOT NULL,

    description TEXT,

    status VARCHAR(20) NOT NULL
        CHECK (status IN ('Pending', 'In Progress', 'Completed')),

    project_id INTEGER NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);