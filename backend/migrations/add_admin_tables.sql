-- Add image_url and icon columns to programs table if not exists
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(255) AFTER description,
ADD COLUMN IF NOT EXISTS icon VARCHAR(100) AFTER image_url;

-- Create gallery table for Meet the Trainer images
CREATE TABLE IF NOT EXISTS gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(255) NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create page_content table for managing page content
CREATE TABLE IF NOT EXISTS page_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_slug VARCHAR(100) UNIQUE NOT NULL,
    hero_title VARCHAR(255),
    hero_subtitle TEXT,
    intro_text TEXT,
    content JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_page_slug (page_slug)
);

-- Insert default gallery images (Meet the Trainer)
INSERT INTO gallery (image_url, caption, display_order) VALUES
('/images/award.jpg', 'Honored by the Government of Puducherry', 1),
('/images/victory.jpg', 'With the Champion of Champions', 2),
('/images/Champion-award.jpg', 'Anna University Yoga Team Coach', 3),
('/images/Facultytraining.jpg', 'Corporate Training Expert', 4),
('/images/Inthemedia.jpg', 'In the Media Spotlight', 5),
('/images/Kriya.jpg', 'Master of Shat Kriya', 6),
('/images/recognition.jpg', 'Recognized on International Yoga Day', 7),
('/images/KCT.jpg', 'At Youth Development Camp – Strengthening Youths', 8),
('/images/Adults Training.jpg', 'Adults Training', 9),
('/images/one.jpg', 'Yoga Excellence', 10),
('/images/two.jpg', 'Community Engagement', 11),
('/images/three.jpg', 'Training & Development', 12)
ON DUPLICATE KEY UPDATE caption=VALUES(caption);

-- Insert default page content
INSERT INTO page_content (page_slug, hero_title, hero_subtitle, intro_text) VALUES
('meet-the-trainer', 'Meet The Trainer', 'Mr. Rathnavelpandian - Guiding Light of Yakkai Neri', 
'Mr. Rathnavelpandian, a celebrated yoga trainer, has dedicated his life to holistic well-being through yoga. His expertise in kriya, posture refinement, and mindfulness techniques has helped individuals unlock their inner potential and physical wellness.')
ON DUPLICATE KEY UPDATE hero_title=VALUES(hero_title);
