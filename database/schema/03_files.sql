CREATE TABLE files (
    report_id         BIGINT UNSIGNED             NOT NULL,

    public_id         VARCHAR(255)                NOT NULL,
    url               VARCHAR(255)                NOT NULL,
    original_name     VARCHAR(255)                NOT NULL,
    type              ENUM('image','video','raw') NOT NULL, -- raw = documents, pdf, etc.
    mime_type         VARCHAR(32)                 NOT NULL,
    size              BIGINT UNSIGNED             NOT NULL,

    created_at        TIMESTAMP                       NULL DEFAULT NULL,
    updated_at        TIMESTAMP                       NULL DEFAULT NULL,

    CONSTRAINT PK_files PRIMARY KEY (public_id),
    CONSTRAINT FK_files_reports FOREIGN KEY (report_id)
        REFERENCES reports(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
