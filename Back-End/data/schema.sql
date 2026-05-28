CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin') DEFAULT 'admin',
    PRIMARY KEY (id)
);

CREATE TABLE rules (
    id INT NOT NULL AUTO_INCREMENT,
    rule_name VARCHAR(100),
    pattern TEXT,
    threat_type VARCHAR(50),
    action ENUM('BLOCK','LOG','ALLOW') DEFAULT 'BLOCK',
    enabled TINYINT(1) DEFAULT 1,
    PRIMARY KEY (id)
);

CREATE TABLE logs (
    id INT NOT NULL AUTO_INCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    source_ip VARCHAR(45),
    dest_ip VARCHAR(45),
    port_number INT,
    request_method VARCHAR(10),
    request_path TEXT,
    request_headers TEXT,
    request_body TEXT,
    threat_type VARCHAR(50),
    action VARCHAR(10),
    details TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE admin_logs (
    id INT NOT NULL AUTO_INCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    admin_username VARCHAR(50),
    action VARCHAR(50),
    status VARCHAR(20),
    ip VARCHAR(45),
    user_agent TEXT,
    PRIMARY KEY (id)
);