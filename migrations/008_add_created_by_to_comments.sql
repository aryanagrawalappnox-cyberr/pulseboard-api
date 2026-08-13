ALTER TABLE comments
ADD COLUMN created_by INTEGER REFERENCES users(id);