CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    email VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL DEFAULT NULL,

    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL DEFAULT NULL,

    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT PK_user PRIMARY KEY (id),
    CONSTRAINT UQ_user_email UNIQUE (email),
);

-- SANCTUM TOKENS
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,

    name TEXT NOT NULL,
    token VARCHAR(64) NOT NULL,
    abilities TEXT NULL DEFAULT NULL,

    last_used_at TIMESTAMP NULL DEFAULT NULL,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT PK_pat PRIMARY KEY (id),
    CONSTRAINT UQ_pat_token UNIQUE (token),
    INDEX IDX_pat_tokenable_type_tokenable_id (tokenable_type, tokenable_id),
    INDEX IDX_pat_expires_at (expires_at),
);
