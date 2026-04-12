CREATE TABLE team_members (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    occupation VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id)
);

INSERT INTO team_members (name, occupation, created_at, updated_at) VALUES
('Amit Sharma', 'Field Inspector', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Neha Patel', 'Data Analyst', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rajesh Verma', 'Surveyor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sara Khan', 'Team Coordinator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);