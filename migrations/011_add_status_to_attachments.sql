-- Tracks the upload-processing lifecycle run by src/worker.js.
-- Existing attachments predate processing and are already usable, so they are
-- backfilled as 'ready'; new uploads start as 'processing'.
ALTER TABLE attachments
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ready'
    CHECK (status IN ('processing', 'ready', 'failed'));

ALTER TABLE attachments
ALTER COLUMN status SET DEFAULT 'processing';
