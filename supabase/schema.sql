

-- Centers Table
CREATE TABLE IF NOT EXISTS centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_id UUID NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- duration in minutes
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_id UUID NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  scheduled TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_center_id ON services(center_id);
CREATE INDEX IF NOT EXISTS idx_bookings_center_id ON bookings(center_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled ON bookings(scheduled);

-- Sample Data: Centers
INSERT INTO centers (name, description, slug, image_url) 
VALUES 
  ('Glamour Beauty Salon', 'A luxury beauty salon offering premium services for hair, skin, and nails.', 'glamour-beauty', 'https://images.unsplash.com/photo-1560066984-138dadb4c035'),
  ('Wellness Spa Center', 'Relax and rejuvenate with our range of wellness and spa treatments.', 'wellness-spa', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef'),
  ('Radiance Hair Studio', 'Specialized hair treatments and styling by expert professionals.', 'radiance-hair', 'https://images.unsplash.com/photo-1562322140-8baeececf3df');

-- Sample Data: Services for Glamour Beauty Salon
INSERT INTO services (center_id, name, description, duration, price)
VALUES 
  ((SELECT id FROM centers WHERE slug = 'glamour-beauty'), 'Classic Manicure', 'A traditional manicure including nail shaping, cuticle care, and polish application.', 30, 35.00),
  ((SELECT id FROM centers WHERE slug = 'glamour-beauty'), 'Deluxe Facial', 'A comprehensive facial treatment to cleanse, exfoliate, and hydrate your skin.', 60, 85.00),
  ((SELECT id FROM centers WHERE slug = 'glamour-beauty'), 'Hair Styling', 'Professional hair styling for any occasion.', 45, 50.00),
  ((SELECT id FROM centers WHERE slug = 'glamour-beauty'), 'Full Makeup', 'Complete makeup application by a professional makeup artist.', 60, 75.00);

-- Sample Data: Services for Wellness Spa Center
INSERT INTO services (center_id, name, description, duration, price)
VALUES 
  ((SELECT id FROM centers WHERE slug = 'wellness-spa'), 'Swedish Massage', 'A gentle full body massage to relax and energize.', 60, 90.00),
  ((SELECT id FROM centers WHERE slug = 'wellness-spa'), 'Deep Tissue Massage', 'Focused massage to release chronic muscle tension.', 60, 110.00),
  ((SELECT id FROM centers WHERE slug = 'wellness-spa'), 'Aromatherapy Session', 'Therapeutic massage with essential oils to enhance relaxation.', 45, 75.00),
  ((SELECT id FROM centers WHERE slug = 'wellness-spa'), 'Hot Stone Therapy', 'Placement of hot stones on specific areas to promote relaxation and ease muscle tension.', 75, 120.00);

-- Sample Data: Services for Radiance Hair Studio
INSERT INTO services (center_id, name, description, duration, price)
VALUES 
  ((SELECT id FROM centers WHERE slug = 'radiance-hair'), 'Haircut & Style', 'Professional haircut and styling service.', 45, 55.00),
  ((SELECT id FROM centers WHERE slug = 'radiance-hair'), 'Color Treatment', 'Full hair coloring service with professional products.', 90, 120.00),
  ((SELECT id FROM centers WHERE slug = 'radiance-hair'), 'Keratin Treatment', 'Smoothing treatment to eliminate frizz and add shine.', 120, 180.00),
  ((SELECT id FROM centers WHERE slug = 'radiance-hair'), 'Hair Extensions', 'Professional application of hair extensions for added length and volume.', 150, 250.00);
