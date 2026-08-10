CREATE TABLE project_members (
    user_id INTEGER NOT NULL,

    project_id INTEGER NOT NULL,

    role VARCHAR(20) NOT NULL
        CHECK (role IN ('Owner', 'Admin', 'Member')),

    PRIMARY KEY (user_id, project_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);