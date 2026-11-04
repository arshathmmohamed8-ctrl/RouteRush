-- ============================================================
-- RouteRush Seed Data
-- ============================================================

-- Cities
INSERT INTO public.cities (name, state, code, popular) VALUES
  ('Chennai', 'Tamil Nadu', 'MAA', true),
  ('Bangalore', 'Karnataka', 'BLR', true),
  ('Mumbai', 'Maharashtra', 'BOM', true),
  ('Delhi', 'Delhi', 'DEL', true),
  ('Hyderabad', 'Telangana', 'HYD', true),
  ('Coimbatore', 'Tamil Nadu', 'CBE', true),
  ('Madurai', 'Tamil Nadu', 'IXM', true),
  ('Kochi', 'Kerala', 'COK', true),
  ('Pune', 'Maharashtra', 'PNQ', false),
  ('Kolkata', 'West Bengal', 'CCU', false),
  ('Ahmedabad', 'Gujarat', 'AMD', false),
  ('Jaipur', 'Rajasthan', 'JAI', false),
  ('Trivandrum', 'Kerala', 'TRV', false),
  ('Vijayawada', 'Andhra Pradesh', 'VGA', false),
  ('Tirupati', 'Andhra Pradesh', 'TIR', false),
  ('Pondicherry', 'Puducherry', 'PNY', false),
  ('Salem', 'Tamil Nadu', 'SXV', false),
  ('Trichy', 'Tamil Nadu', 'TRZ', false)
ON CONFLICT (code) DO NOTHING;

-- Operators
INSERT INTO public.operators (company_name, description, phone, email, rating, verified, established_year) VALUES
  ('Orange Travels', 'Premium bus service with luxury fleet and exceptional comfort', '+91 9876543210', 'info@orangetravels.com', 4.7, true, 2008),
  ('KPN Travels', 'Reliable and affordable intercity bus service across South India', '+91 9876543211', 'info@kpntravels.com', 4.5, true, 1995),
  ('SRS Travels', 'Comfort and safety with modern AC and Non-AC fleet', '+91 9876543212', 'info@srstravels.com', 4.3, true, 2001),
  ('VRL Travels', 'Extensive network covering Karnataka and neighboring states', '+91 9876543213', 'info@vrltravels.com', 4.4, true, 1988),
  ('Parveen Travels', 'Affordable travel with good amenities across Tamil Nadu', '+91 9876543214', 'info@parveentravels.com', 4.2, true, 2003),
  ('TNSTC', 'Tamil Nadu State Transport Corporation - Government operated', '+91 9876543215', 'info@tnstc.com', 4.0, true, 1972),
  ('IntrCity SmartBus', 'Smart and modern bus travel with live tracking', '+91 9876543216', 'info@intrcity.com', 4.6, true, 2015),
  ('Kallada Tours', 'Kerala-based premium operator with sleeper coaches', '+91 9876543217', 'info@kallada.com', 4.5, true, 1998)
ON CONFLICT DO NOTHING;

-- Routes (Chennai=1, Bangalore=2, Mumbai=3, Delhi=4, Hyderabad=5, Coimbatore=6, Madurai=7, Kochi=8)
INSERT INTO public.routes (from_city_id, to_city_id, distance_km, estimated_duration_min, popular) VALUES
  (1, 2, 350, 390, true),   -- Chennai to Bangalore
  (2, 1, 350, 390, true),   -- Bangalore to Chennai
  (1, 6, 500, 480, true),   -- Chennai to Coimbatore
  (6, 1, 500, 480, true),   -- Coimbatore to Chennai
  (1, 7, 460, 450, true),   -- Chennai to Madurai
  (7, 1, 460, 450, true),   -- Madurai to Chennai
  (2, 5, 570, 540, true),   -- Bangalore to Hyderabad
  (5, 2, 570, 540, true),   -- Hyderabad to Bangalore
  (3, 9, 150, 180, false),  -- Mumbai to Pune
  (9, 3, 150, 180, false),  -- Pune to Mumbai
  (1, 8, 680, 600, false),  -- Chennai to Kochi
  (8, 1, 680, 600, false),  -- Kochi to Chennai
  (2, 6, 350, 330, false),  -- Bangalore to Coimbatore
  (6, 2, 350, 330, false)   -- Coimbatore to Bangalore
ON CONFLICT DO NOTHING;

-- Offers
INSERT INTO public.offers (code, title, description, discount_type, discount_value, min_amount, valid_until, active, banner_color) VALUES
  ('RUSH10', 'RouteRush Special', 'Get 10% off on your first booking', 'percentage', 10, 300, NOW() + INTERVAL '90 days', true, '#E76F51'),
  ('FLAT100', 'Flat ₹100 Off', 'Save ₹100 on bookings above ₹500', 'flat', 100, 500, NOW() + INTERVAL '60 days', true, '#2A9D8F'),
  ('SUMMER25', 'Summer Sale', '25% off on selected routes this summer', 'percentage', 25, 400, NOW() + INTERVAL '30 days', true, '#F4A261'),
  ('NEWUSER', 'New User Bonus', 'Welcome aboard! ₹150 off on first booking', 'flat', 150, 0, NOW() + INTERVAL '7 days', true, '#6C63FF')
ON CONFLICT (code) DO NOTHING;
