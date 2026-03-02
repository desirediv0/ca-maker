-- Seed Data for CA Maker
-- Run this in your PostgreSQL database or use Prisma Studio

-- 1. CREATE CATEGORIES
INSERT INTO "Category" (id, name, slug, description, "isActive", "isDefault", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'CA Inter Audit', 'ca-inter-audit', 'Comprehensive CA Inter Audit courses with Big 4 expertise', true, false, NOW(), NOW()),
  (gen_random_uuid(), 'CA Foundation', 'ca-foundation', 'Foundation level courses for CA aspirants', true, false, NOW(), NOW()),
  (gen_random_uuid(), 'CA Final', 'ca-final', 'Advanced CA Final level courses', true, false, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 2. CREATE ATTRIBUTES
INSERT INTO "Attribute" (id, name, "inputType", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Attempt', 'multiselect', NOW(), NOW()),
  (gen_random_uuid(), 'Mode', 'multiselect', NOW(), NOW()),
  (gen_random_uuid(), 'Book Option', 'select', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- 3. CREATE ATTRIBUTE VALUES
-- Get Attribute IDs first
WITH attr_ids AS (
  SELECT id, name FROM "Attribute" WHERE name IN ('Attempt', 'Mode', 'Book Option')
)
INSERT INTO "AttributeValue" (id, "attributeId", value, "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  (SELECT id FROM attr_ids WHERE name = 'Attempt'),
  unnest(ARRAY['May''26', 'Nov''26']),
  NOW(),
  NOW()
UNION ALL
SELECT 
  gen_random_uuid(),
  (SELECT id FROM attr_ids WHERE name = 'Mode'),
  unnest(ARRAY['online-live', 'recorded']),
  NOW(),
  NOW()
UNION ALL
SELECT 
  gen_random_uuid(),
  (SELECT id FROM attr_ids WHERE name = 'Book Option'),
  unnest(ARRAY['with-book', 'without-book']),
  NOW(),
  NOW()
ON CONFLICT (value) DO NOTHING;
