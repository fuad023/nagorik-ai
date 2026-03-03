INSERT INTO users (first_name, last_name, email, password, created_at, updated_at) VALUES 
('Sadman',   'Rahman Arnab',   'arnab@aib.com',  '$2y$10$uyFftoPRyu/H0rZhwwjOJuYZFs.CSuYlYx1h/i317l3KIRIBl2NEG', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rashedul', 'Hasan',          'rashed@aib.com', '$2y$10$uyFftoPRyu/H0rZhwwjOJuYZFs.CSuYlYx1h/i317l3KIRIBl2NEG', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sajid',    'Al Amin',        'sajid@aib.com',  '$2y$10$uyFftoPRyu/H0rZhwwjOJuYZFs.CSuYlYx1h/i317l3KIRIBl2NEG', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nafis',    'Fuad',           'fuad@aib.com',   '$2y$10$uyFftoPRyu/H0rZhwwjOJuYZFs.CSuYlYx1h/i317l3KIRIBl2NEG', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO reports (user_id, title, content, created_at, updated_at) VALUES
(1, 'First Post',  'This is Arnab''s first post.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Second Post', 'Another post by Arnab.',       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Jane Post',   'This is Rashed''s post.',      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
