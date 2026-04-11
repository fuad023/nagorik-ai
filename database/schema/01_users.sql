DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    first_name        VARCHAR(128)    NOT NULL,
    last_name         VARCHAR(128)    NOT NULL,
    email             VARCHAR(255)    NOT NULL,
    email_verified_at TIMESTAMP           NULL DEFAULT NULL,
    
    phone             VARCHAR(20)         NULL DEFAULT NULL,
    location          VARCHAR(255)        NULL DEFAULT NULL,
    role              VARCHAR(50)     NOT NULL DEFAULT 'Citizen',

    password          VARCHAR(255)    NOT NULL,
    google_id         VARCHAR(255)        NULL DEFAULT NULL,
    remember_token    VARCHAR(100)        NULL DEFAULT NULL,

    created_at        TIMESTAMP           NULL DEFAULT NULL,
    updated_at        TIMESTAMP           NULL DEFAULT NULL,

    CONSTRAINT PK_users       PRIMARY KEY (id),
    CONSTRAINT UQ_users_email UNIQUE      (email),
    CONSTRAINT UQ_users_google_id UNIQUE  (google_id),
    INDEX IDX_users_name (first_name, last_name)
);

-- SANCTUM TOKENS
DROP TABLE IF EXISTS personal_access_tokens;
CREATE TABLE personal_access_tokens (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tokenable_type    VARCHAR(255)    NOT NULL,
    tokenable_id      BIGINT UNSIGNED NOT NULL,

    name              TEXT            NOT NULL,
    token             VARCHAR(64)     NOT NULL,
    abilities         TEXT                NULL DEFAULT NULL,

    last_used_at      TIMESTAMP           NULL DEFAULT NULL,
    expires_at        TIMESTAMP           NULL DEFAULT NULL,
    created_at        TIMESTAMP           NULL DEFAULT NULL,
    updated_at        TIMESTAMP           NULL DEFAULT NULL,

    CONSTRAINT PK_pat       PRIMARY KEY (id),
    CONSTRAINT UQ_pat_token UNIQUE      (token),
    INDEX IDX_pat_tokenable_type_tokenable_id (tokenable_type, tokenable_id),
    INDEX IDX_pat_expires_at (expires_at)
);

-- ALTER TABLE TO ADD GOOGLE_ID IF NOT EXISTS
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL UNIQUE;
