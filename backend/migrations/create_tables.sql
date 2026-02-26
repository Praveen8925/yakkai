-- ============================================================
--  Yakkai Neri – Full Database Schema
--  Run this in phpMyAdmin or via MySQL CLI:
--  mysql -u root yakkai_neri < create_tables.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS yakkai_neri
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE yakkai_neri;

-- ── Users (admin + public) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          INT          PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(150) NOT NULL,
    email       VARCHAR(200) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        ENUM('admin','user') NOT NULL DEFAULT 'user',
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Default admin account  (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@yakkaineri.com',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
 'admin')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ── Programs ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programs (
    id          INT           PRIMARY KEY AUTO_INCREMENT,
    title       VARCHAR(200)  NOT NULL,
    slug        VARCHAR(200)  NOT NULL UNIQUE,
    icon        VARCHAR(100)  DEFAULT 'fas fa-leaf',
    image_url   VARCHAR(255),
    description TEXT,
    content     LONGTEXT,
    highlight   VARCHAR(255),
    status      ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug   (slug),
    INDEX idx_status (status)
);

INSERT INTO programs (title, slug, icon, description, status) VALUES
('Yoga as a Sport',       'yoga-as-sport',       'fas fa-trophy',    'Competitive yoga training at national and international level.',            'active'),
('Corporate Yoga',        'corporate-yoga',       'fas fa-briefcase', 'Workplace wellness programs for stress relief and team productivity.',       'active'),
('Yoga for Sport',        'yoga-for-sport',       'fas fa-running',   'Enhance athletic performance through flexibility and breath control.',       'active'),
('Women Wellness',        'women-wellness',       'fas fa-heart',     'Targeted programs for PCOS, PCOD, menstrual health and menopause care.',    'active'),
('Prenatal & Postnatal',  'prenatal-postnatal',   'fas fa-baby',      'Safe, nurturing yoga for every stage of pregnancy and motherhood.',         'active'),
('Handling Adolescence',  'adolescence',          'fas fa-star',      'Yoga for focus, emotional balance and exam stress in teens.',               'active'),
('Therapeutic Yoga',      'therapeutic-yoga',     'fas fa-clinic-medical', 'Evidence-based yoga for obesity, diabetes and hypertension management.','active'),
('Tech-Supported Yoga',   'tech-supported-yoga',  'fas fa-laptop',    'AI and app-powered yoga sessions with posture feedback.',                   'active')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- ── Gallery ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery (
    id            INT           PRIMARY KEY AUTO_INCREMENT,
    image_url     VARCHAR(255)  NOT NULL,
    caption       TEXT,
    display_order INT           DEFAULT 0,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO gallery (image_url, caption, display_order) VALUES
('/images/award.jpg',           'Honored by the Government of Puducherry',          1),
('/images/victory.jpg',         'With the Champion of Champions',                   2),
('/images/Champion-award.jpg',  'Anna University Yoga Team Coach',                  3),
('/images/Facultytraining.jpg', 'Faculty & Corporate Training Expert',              4),
('/images/Inthemedia.jpg',      'Covered by The Hindu – Yoga Championship Win',     5),
('/images/Kriya.jpg',           'Master of Shat Kriya',                             6),
('/images/recognition.jpg',     'Thanga Thamarai Yoga Award – International Day',  7),
('/images/KCT.jpg',             'Institution-Wide Women\'s Wellness Session',       8),
('/images/Adults Training.jpg', 'Adults Training Session',                          9),
('/images/one.jpg',             'Rooftop Corporate Yoga Program',                  10),
('/images/two.jpg',             'Young Champions at Competition',                  11),
('/images/three.jpg',           'State-Level Trophy Win',                          12)
ON DUPLICATE KEY UPDATE caption = VALUES(caption);

-- ── Contact Inquiries ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
    id         INT          PRIMARY KEY AUTO_INCREMENT,
    name       VARCHAR(150) NOT NULL,
    email      VARCHAR(200) NOT NULL,
    phone      VARCHAR(20),
    interest   VARCHAR(100),
    message    TEXT         NOT NULL,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email      (email),
    INDEX idx_created_at (created_at)
);

-- ── Wellness Assessments ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wellness_assessments (
    id               INT          PRIMARY KEY AUTO_INCREMENT,
    name             VARCHAR(150) NOT NULL,
    email            VARCHAR(200) NOT NULL,
    phone            VARCHAR(20),
    health_condition VARCHAR(200),
    sleep_hours      VARCHAR(50),
    energy_level     VARCHAR(50),
    stress_level     VARCHAR(50),
    notes            TEXT,
    created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- ── Page Content (CMS) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_content (
    id             INT          PRIMARY KEY AUTO_INCREMENT,
    page_slug      VARCHAR(100) NOT NULL UNIQUE,
    hero_title     VARCHAR(255),
    hero_subtitle  TEXT,
    intro_text     TEXT,
    content        JSON,
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_page_slug (page_slug)
);

INSERT INTO page_content (page_slug, hero_title, hero_subtitle, intro_text) VALUES
('meet-the-trainer',
 'Meet The Trainer',
 'Mr. Rathnavelpandian – Guiding Light of Yakkai Neri',
 'Mr. Rathnavelpandian, a celebrated yoga trainer and national-level coach, has dedicated his life to holistic well-being through yoga. His expertise in kriya, posture refinement, and mindfulness techniques has helped individuals unlock their inner potential and physical wellness.')
ON DUPLICATE KEY UPDATE hero_title = VALUES(hero_title);
