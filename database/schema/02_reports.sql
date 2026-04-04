DROP TABLE IF EXISTS reports;
CREATE TABLE reports (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    reporter_id       BIGINT UNSIGNED NOT NULL,

    title             VARCHAR(255)    NOT NULL,
    description       TEXT                NULL,
    status            ENUM('pending', 'assigned', 'in_progress', 'resolved')
        NOT NULL DEFAULT 'pending',

    created_at        TIMESTAMP           NULL DEFAULT NULL,
    updated_at        TIMESTAMP           NULL DEFAULT NULL,

    CONSTRAINT PK_reports       PRIMARY KEY (id),
    CONSTRAINT FK_reports_users FOREIGN KEY (reporter_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);
