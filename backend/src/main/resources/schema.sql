CREATE DATABASE IF NOT EXISTS secondhand_trade DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE secondhand_trade;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT 'Username',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT 'Email address',
    password VARCHAR(255) NOT NULL COMMENT 'BCrypt hashed password',
    avatar VARCHAR(255) COMMENT 'Avatar URL',
    nickname VARCHAR(50) COMMENT 'Display name',
    bio VARCHAR(200) COMMENT 'Bio',
    credit_score INT DEFAULT 100 COMMENT 'Credit score',
    role VARCHAR(10) NOT NULL DEFAULT 'USER' COMMENT 'Role: USER or ADMIN',
    created_at DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT 'Category name',
    icon VARCHAR(100) COMMENT 'Icon'
);

CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT 'Seller ID',
    category_id INT COMMENT 'Category ID',
    title VARCHAR(100) NOT NULL COMMENT 'Item title',
    description TEXT COMMENT 'Item description',
    price DECIMAL(10,2) NOT NULL COMMENT 'Price',
    condition_level TINYINT DEFAULT 5 COMMENT 'Condition 1-5',
    status TINYINT DEFAULT 0 COMMENT '0=available 1=sold 2=unlisted',
    cover_image VARCHAR(255) COMMENT 'Cover image',
    view_count INT DEFAULT 0 COMMENT 'View count',
    created_at DATETIME DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS product_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL COMMENT 'Product ID',
    url VARCHAR(255) NOT NULL COMMENT 'Image URL',
    sort INT DEFAULT 0 COMMENT 'Sort order',
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sender_id BIGINT NOT NULL COMMENT 'Sender ID',
    receiver_id BIGINT NOT NULL COMMENT 'Receiver ID',
    product_id BIGINT COMMENT 'Related product ID',
    content TEXT NOT NULL COMMENT 'Message content',
    is_read TINYINT DEFAULT 0 COMMENT 'Read status',
    created_at DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT 'User ID',
    product_id BIGINT NOT NULL COMMENT 'Product ID',
    created_at DATETIME DEFAULT NOW(),
    UNIQUE KEY uk_user_product (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    reviewer_id BIGINT NOT NULL COMMENT 'Reviewer ID',
    reviewee_id BIGINT NOT NULL COMMENT 'Reviewee ID',
    product_id BIGINT NOT NULL COMMENT 'Related product ID',
    score TINYINT NOT NULL COMMENT 'Rating 1-5',
    content VARCHAR(500) COMMENT 'Review content',
    created_at DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL COMMENT 'Product ID',
    user_id BIGINT NOT NULL COMMENT 'Author ID',
    content VARCHAR(500) NOT NULL COMMENT 'Comment content',
    created_at DATETIME DEFAULT NOW(),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Seed category data
INSERT IGNORE INTO categories (id, name, icon) VALUES
(1, 'Electronics', 'laptop'),
(2, 'Clothing & Shoes', 'shirt'),
(3, 'Books & Textbooks', 'book'),
(4, 'Home & Appliances', 'home'),
(5, 'Sports & Outdoors', 'bicycle'),
(6, 'Beauty & Skincare', 'sparkles'),
(7, 'Gaming & Anime', 'gamepad'),
(8, 'Other', 'tag');
