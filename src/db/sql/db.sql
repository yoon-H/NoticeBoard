USE POST_DB

CREATE TABLE IF NOT EXISTS users
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) UNIQUE,
    login_id        VARCHAR(255) UNIQUE,
    password        VARCHAR(255),
    create_dt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_dt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(255),
    author          INT,
    content         TEXT,
    create_dt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_dt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS comments
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    author          INT,
    content         TEXT,
    post_id         INT,
    create_dt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_dt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS images
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT,
    post_id         INT DEFAULT NULL,
    stored_name     VARCHAR(255),
    url             VARCHAR(255),
    create_dt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_temp         BOOLEAN DEFAULT TRUE,
    is_deleted      BOOLEAN DEFAULT FALSE,
    delete_dt       TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attachments
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT,
    post_id         INT DEFAULT NULL,
    original_name   VARCHAR(255),
    stored_name     VARCHAR(255),
    url             VARCHAR(255),
    create_dt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_temp         BOOLEAN DEFAULT TRUE,
    is_deleted      BOOLEAN DEFAULT FALSE,
    delete_dt       TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE
);
