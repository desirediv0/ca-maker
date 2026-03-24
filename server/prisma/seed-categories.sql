-- Seed Data for CA Maker
-- Run this in your PostgreSQL database or use Prisma Studio

-- 1. CREATE CATEGORIES (slug is unique)
INSERT INTO "Category" (id, name, slug, description, "isActive", "isDefault", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'CA Inter Audit', 'ca-inter-audit', 'Comprehensive CA Inter Audit courses with Big 4 expertise', true, false, NOW(), NOW()),
  (gen_random_uuid(), 'CA Foundation', 'ca-foundation', 'Foundation level courses for CA aspirants', true, false, NOW(), NOW()),
  (gen_random_uuid(), 'CA Final', 'ca-final', 'Advanced CA Final level courses', true, false, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 2. CREATE ATTRIBUTES (no unique on name - insert only if not exists)
INSERT INTO "Attribute" (id, name, "inputType", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Attempt', 'multiselect', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Attribute" WHERE name = 'Attempt');

INSERT INTO "Attribute" (id, name, "inputType", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Mode', 'multiselect', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Attribute" WHERE name = 'Mode');

INSERT INTO "Attribute" (id, name, "inputType", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'Book Option', 'select', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Attribute" WHERE name = 'Book Option');

-- 3. CREATE ATTRIBUTE VALUES (unique on attributeId + value)
INSERT INTO "AttributeValue" (id, "attributeId", value)
SELECT gen_random_uuid(), a.id, v
FROM "Attribute" a, unnest(ARRAY['May''26', 'Nov''26']) AS v
WHERE a.name = 'Attempt'
ON CONFLICT ("attributeId", value) DO NOTHING;

INSERT INTO "AttributeValue" (id, "attributeId", value)
SELECT gen_random_uuid(), a.id, v
FROM "Attribute" a, unnest(ARRAY['online-live', 'recorded']) AS v
WHERE a.name = 'Mode'
ON CONFLICT ("attributeId", value) DO NOTHING;

INSERT INTO "AttributeValue" (id, "attributeId", value)
SELECT gen_random_uuid(), a.id, v
FROM "Attribute" a, unnest(ARRAY['with-book', 'without-book']) AS v
WHERE a.name = 'Book Option'
ON CONFLICT ("attributeId", value) DO NOTHING;
