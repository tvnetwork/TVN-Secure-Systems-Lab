-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table for systems
CREATE TABLE systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Advanced')),
    featured BOOLEAN DEFAULT FALSE,
    layers JSONB NOT NULL DEFAULT '{"perimeter": [], "detection": [], "access": [], "response": [], "asset": []}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for admin settings
CREATE TABLE admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    theme TEXT DEFAULT 'blue'
);

-- Create table for announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message TEXT NOT NULL,
    active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for features
CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT FALSE
);

-- Insert initial admin settings
INSERT INTO admin_settings (theme) VALUES ('blue');

-- Insert initial features
INSERT INTO features (name, enabled) VALUES
('enable_simulation', true),
('enable_builder', false);

-- Insert initial data
INSERT INTO systems (name, slug, category, description, difficulty, featured, layers) VALUES
('Fort Knox', 'fort-knox', 'Vault System', 'The world''s most famous gold depository.', 'Beginner', true, '{"perimeter": ["fences", "armed patrol", "minefields"], "detection": ["cameras", "motion sensors", "laser tripwires"], "access": ["vault door", "multi-person authentication", "biometrics"], "response": ["military response", "lockdown sequence"], "asset": ["gold reserves"]}'),
('Crown Jewels', 'crown-jewels', 'Vault System', 'Tower of London''s high-security jewel house.', 'Beginner', false, '{"perimeter": ["yeoman warders", "waterloo block"], "detection": ["cctv", "motion sensors"], "access": ["bomb proof glass", "steel doors"], "response": ["armed guards", "lockdown"], "asset": ["crown jewels"]}'),
('CIA Headquarters', 'cia', 'Intelligence System', 'Global intelligence and covert operations.', 'Advanced', true, '{"perimeter": ["cybersecurity", "classified access", "physical barricades"], "detection": ["global surveillance", "signals intelligence", "insider threat monitoring"], "access": ["clearance levels", "polygraph", "SCIFs"], "response": ["covert operations", "rapid response teams", "data purge"], "asset": ["intelligence data", "classified sources"]}'),
('Mossad', 'mossad', 'Intelligence System', 'Israeli national intelligence agency.', 'Advanced', false, '{"perimeter": ["secret location", "cyber defenses"], "detection": ["humint", "sigint"], "access": ["strict vetting", "compartmentalization"], "response": ["katsas", "kidon"], "asset": ["intelligence", "national security"]}'),
('Svalbard Seed Vault', 'seed-vault', 'Preservation System', 'Doomsday vault for global crop diversity.', 'Beginner', true, '{"perimeter": ["permafrost", "remote location", "mountainside"], "detection": ["temperature sensors", "motion cameras"], "access": ["steel doors", "airlocks", "keys"], "response": ["local authorities", "international agreements"], "asset": ["seed samples"]}'),
('Area 51', 'area-51', 'Isolation System', 'Highly classified USAF facility.', 'Advanced', false, '{"perimeter": ["desert isolation", "restricted airspace", "camo dudes"], "detection": ["motion sensors", "radar", "drones"], "access": ["top secret clearance", "janet flights"], "response": ["military police", "deadly force authorized"], "asset": ["experimental aircraft", "classified tech"]}');
