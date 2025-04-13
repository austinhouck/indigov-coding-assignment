CREATE TABLE IF NOT EXISTS representatives (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  district VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO representatives (name, email, district)
VALUES
  ('John Doe', 'john@example.com', 'District 7'),
  ('Jane Smith', 'jane@example.com', 'District 6')
ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS constituents (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  age INT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  street_address VARCHAR(100) NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(20) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  district VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'pending'))
);

CREATE INDEX idx_constituents_district ON constituents(district);
CREATE INDEX idx_constituents_last_name ON constituents(last_name);
CREATE INDEX idx_constituents_status ON constituents(status);

INSERT INTO constituents (
  first_name,
  last_name,
  age,
  phone,
  email,
  street_address,
  city,
  state,
  zip,
  district
) VALUES (
  'Jane',
  'Doe',
  33,
  '555-123-4567',
  'jane.doe@example.com',
  '123 Main Street',
  'Springfield',
  'IL',
  '62701',
  'District 7'
);
