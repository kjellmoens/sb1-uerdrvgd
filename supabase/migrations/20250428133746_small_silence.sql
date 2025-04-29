/*
  # Countries and Nationalities Schema

  1. Changes
    - Create countries table
    - Add foreign key constraints
    - Migrate existing data
    - Clean up old columns
*/

-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  code CHAR(2) PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  nationality TEXT NOT NULL UNIQUE
);

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read countries"
ON countries FOR SELECT
TO public
USING (true);

-- Insert countries data
INSERT INTO countries (code, name, nationality) VALUES
('AF', 'Afghanistan', 'Afghan'),
('AL', 'Albania', 'Albanian'),
('DZ', 'Algeria', 'Algerian'),
('AD', 'Andorra', 'Andorran'),
('AO', 'Angola', 'Angolan'),
('AG', 'Antigua and Barbuda', 'Antiguan'),
('AR', 'Argentina', 'Argentine'),
('AM', 'Armenia', 'Armenian'),
('AU', 'Australia', 'Australian'),
('AT', 'Austria', 'Austrian'),
('AZ', 'Azerbaijan', 'Azerbaijani'),
('BS', 'Bahamas', 'Bahamian'),
('BH', 'Bahrain', 'Bahraini'),
('BD', 'Bangladesh', 'Bangladeshi'),
('BB', 'Barbados', 'Barbadian'),
('BY', 'Belarus', 'Belarusian'),
('BE', 'Belgium', 'Belgian'),
('BZ', 'Belize', 'Belizean'),
('BJ', 'Benin', 'Beninese'),
('BT', 'Bhutan', 'Bhutanese'),
('BO', 'Bolivia', 'Bolivian'),
('BA', 'Bosnia and Herzegovina', 'Bosnian'),
('BW', 'Botswana', 'Botswanan'),
('BR', 'Brazil', 'Brazilian'),
('BN', 'Brunei', 'Bruneian'),
('BG', 'Bulgaria', 'Bulgarian'),
('BF', 'Burkina Faso', 'Burkinese'),
('BI', 'Burundi', 'Burundian'),
('KH', 'Cambodia', 'Cambodian'),
('CM', 'Cameroon', 'Cameroonian'),
('CA', 'Canada', 'Canadian'),
('CV', 'Cape Verde', 'Cape Verdean'),
('CF', 'Central African Republic', 'Central African'),
('TD', 'Chad', 'Chadian'),
('CL', 'Chile', 'Chilean'),
('CN', 'China', 'Chinese'),
('CO', 'Colombia', 'Colombian'),
('KM', 'Comoros', 'Comoran'),
('CG', 'Congo', 'Congolese'),
('CR', 'Costa Rica', 'Costa Rican'),
('HR', 'Croatia', 'Croatian'),
('CU', 'Cuba', 'Cuban'),
('CY', 'Cyprus', 'Cypriot'),
('CZ', 'Czech Republic', 'Czech'),
('DK', 'Denmark', 'Danish'),
('DJ', 'Djibouti', 'Djiboutian'),
('DM', 'Dominica', 'Dominican from Dominica'),
('DO', 'Dominican Republic', 'Dominican from Dominican Republic'),
('EC', 'Ecuador', 'Ecuadorean'),
('EG', 'Egypt', 'Egyptian'),
('SV', 'El Salvador', 'Salvadoran'),
('GQ', 'Equatorial Guinea', 'Equatorial Guinean'),
('ER', 'Eritrea', 'Eritrean'),
('EE', 'Estonia', 'Estonian'),
('ET', 'Ethiopia', 'Ethiopian'),
('FJ', 'Fiji', 'Fijian'),
('FI', 'Finland', 'Finnish'),
('FR', 'France', 'French'),
('GA', 'Gabon', 'Gabonese'),
('GM', 'Gambia', 'Gambian'),
('GE', 'Georgia', 'Georgian'),
('DE', 'Germany', 'German'),
('GH', 'Ghana', 'Ghanaian'),
('GR', 'Greece', 'Greek'),
('GD', 'Grenada', 'Grenadian'),
('GT', 'Guatemala', 'Guatemalan'),
('GN', 'Guinea', 'Guinean'),
('GW', 'Guinea-Bissau', 'Guinea-Bissauan'),
('GY', 'Guyana', 'Guyanese'),
('HT', 'Haiti', 'Haitian'),
('HN', 'Honduras', 'Honduran'),
('HU', 'Hungary', 'Hungarian'),
('IS', 'Iceland', 'Icelandic'),
('IN', 'India', 'Indian'),
('ID', 'Indonesia', 'Indonesian'),
('IR', 'Iran', 'Iranian'),
('IQ', 'Iraq', 'Iraqi'),
('IE', 'Ireland', 'Irish'),
('IL', 'Israel', 'Israeli'),
('IT', 'Italy', 'Italian'),
('JM', 'Jamaica', 'Jamaican'),
('JP', 'Japan', 'Japanese'),
('JO', 'Jordan', 'Jordanian'),
('KZ', 'Kazakhstan', 'Kazakhstani'),
('KE', 'Kenya', 'Kenyan'),
('KI', 'Kiribati', 'Kiribati'),
('KP', 'North Korea', 'North Korean'),
('KR', 'South Korea', 'South Korean'),
('KW', 'Kuwait', 'Kuwaiti'),
('KG', 'Kyrgyzstan', 'Kyrgyz'),
('LA', 'Laos', 'Laotian'),
('LV', 'Latvia', 'Latvian'),
('LB', 'Lebanon', 'Lebanese'),
('LS', 'Lesotho', 'Lesothan'),
('LR', 'Liberia', 'Liberian'),
('LY', 'Libya', 'Libyan'),
('LI', 'Liechtenstein', 'Liechtensteiner'),
('LT', 'Lithuania', 'Lithuanian'),
('LU', 'Luxembourg', 'Luxembourger'),
('MK', 'North Macedonia', 'Macedonian'),
('MG', 'Madagascar', 'Malagasy'),
('MW', 'Malawi', 'Malawian'),
('MY', 'Malaysia', 'Malaysian'),
('MV', 'Maldives', 'Maldivian'),
('ML', 'Mali', 'Malian'),
('MT', 'Malta', 'Maltese'),
('MH', 'Marshall Islands', 'Marshallese'),
('MR', 'Mauritania', 'Mauritanian'),
('MU', 'Mauritius', 'Mauritian'),
('MX', 'Mexico', 'Mexican'),
('FM', 'Micronesia', 'Micronesian'),
('MD', 'Moldova', 'Moldovan'),
('MC', 'Monaco', 'Monacan'),
('MN', 'Mongolia', 'Mongolian'),
('ME', 'Montenegro', 'Montenegrin'),
('MA', 'Morocco', 'Moroccan'),
('MZ', 'Mozambique', 'Mozambican'),
('MM', 'Myanmar', 'Burmese'),
('NA', 'Namibia', 'Namibian'),
('NR', 'Nauru', 'Nauruan'),
('NP', 'Nepal', 'Nepalese'),
('NL', 'Netherlands', 'Dutch'),
('NZ', 'New Zealand', 'New Zealand'),
('NI', 'Nicaragua', 'Nicaraguan'),
('NE', 'Niger', 'Nigerien'),
('NG', 'Nigeria', 'Nigerian'),
('NO', 'Norway', 'Norwegian'),
('OM', 'Oman', 'Omani'),
('PK', 'Pakistan', 'Pakistani'),
('PW', 'Palau', 'Palauan'),
('PA', 'Panama', 'Panamanian'),
('PG', 'Papua New Guinea', 'Papua New Guinean'),
('PY', 'Paraguay', 'Paraguayan'),
('PE', 'Peru', 'Peruvian'),
('PH', 'Philippines', 'Filipino'),
('PL', 'Poland', 'Polish'),
('PT', 'Portugal', 'Portuguese'),
('QA', 'Qatar', 'Qatari'),
('RO', 'Romania', 'Romanian'),
('RU', 'Russia', 'Russian'),
('RW', 'Rwanda', 'Rwandan'),
('KN', 'Saint Kitts and Nevis', 'Kittitian'),
('LC', 'Saint Lucia', 'Saint Lucian'),
('VC', 'Saint Vincent and the Grenadines', 'Vincentian'),
('WS', 'Samoa', 'Samoan'),
('SM', 'San Marino', 'San Marinese'),
('ST', 'Sao Tome and Principe', 'Sao Tomean'),
('SA', 'Saudi Arabia', 'Saudi'),
('SN', 'Senegal', 'Senegalese'),
('RS', 'Serbia', 'Serbian'),
('SC', 'Seychelles', 'Seychellois'),
('SL', 'Sierra Leone', 'Sierra Leonean'),
('SG', 'Singapore', 'Singaporean'),
('SK', 'Slovakia', 'Slovak'),
('SI', 'Slovenia', 'Slovenian'),
('SB', 'Solomon Islands', 'Solomon Islander'),
('SO', 'Somalia', 'Somali'),
('ZA', 'South Africa', 'South African'),
('SS', 'South Sudan', 'South Sudanese'),
('ES', 'Spain', 'Spanish'),
('LK', 'Sri Lanka', 'Sri Lankan'),
('SD', 'Sudan', 'Sudanese'),
('SR', 'Suriname', 'Surinamer'),
('SZ', 'Eswatini', 'Swazi'),
('SE', 'Sweden', 'Swedish'),
('CH', 'Switzerland', 'Swiss'),
('SY', 'Syria', 'Syrian'),
('TW', 'Taiwan', 'Taiwanese'),
('TJ', 'Tajikistan', 'Tajik'),
('TZ', 'Tanzania', 'Tanzanian'),
('TH', 'Thailand', 'Thai'),
('TL', 'Timor-Leste', 'Timorese'),
('TG', 'Togo', 'Togolese'),
('TO', 'Tonga', 'Tongan'),
('TT', 'Trinidad and Tobago', 'Trinidadian'),
('TN', 'Tunisia', 'Tunisian'),
('TR', 'Turkey', 'Turkish'),
('TM', 'Turkmenistan', 'Turkmen'),
('TV', 'Tuvalu', 'Tuvaluan'),
('UG', 'Uganda', 'Ugandan'),
('UA', 'Ukraine', 'Ukrainian'),
('AE', 'United Arab Emirates', 'Emirian'),
('GB', 'United Kingdom', 'British'),
('US', 'United States', 'American'),
('UY', 'Uruguay', 'Uruguayan'),
('UZ', 'Uzbekistan', 'Uzbek'),
('VU', 'Vanuatu', 'Vanuatuan'),
('VA', 'Vatican City', 'Vatican'),
('VE', 'Venezuela', 'Venezuelan'),
('VN', 'Vietnam', 'Vietnamese'),
('YE', 'Yemen', 'Yemeni'),
('ZM', 'Zambia', 'Zambian'),
('ZW', 'Zimbabwe', 'Zimbabwean');

-- Add foreign key constraints
ALTER TABLE companies
ADD COLUMN country_code CHAR(2) REFERENCES countries(code);

ALTER TABLE personal_info
ADD COLUMN country_code CHAR(2) REFERENCES countries(code);

ALTER TABLE education
ADD COLUMN country_code CHAR(2) REFERENCES countries(code);

-- Create function to migrate existing country data
CREATE OR REPLACE FUNCTION migrate_country_data()
RETURNS void AS $$
DECLARE
  company RECORD;
  person RECORD;
  edu RECORD;
  found_code CHAR(2);
BEGIN
  -- Migrate companies data
  FOR company IN 
    SELECT id, headquarters->>'country' as country_name 
    FROM companies 
    WHERE headquarters->>'country' IS NOT NULL
  LOOP
    SELECT code INTO found_code
    FROM countries
    WHERE name = company.country_name;

    IF found_code IS NOT NULL THEN
      UPDATE companies
      SET country_code = found_code
      WHERE id = company.id;
    END IF;
  END LOOP;

  -- Migrate personal_info data
  FOR person IN 
    SELECT id, country as country_name 
    FROM personal_info 
    WHERE country IS NOT NULL
  LOOP
    SELECT code INTO found_code
    FROM countries
    WHERE name = person.country_name;

    IF found_code IS NOT NULL THEN
      UPDATE personal_info
      SET country_code = found_code
      WHERE id = person.id;
    END IF;
  END LOOP;

  -- Migrate education data
  FOR edu IN 
    SELECT id, country as country_name 
    FROM education 
    WHERE country IS NOT NULL
  LOOP
    SELECT code INTO found_code
    FROM countries
    WHERE name = edu.country_name;

    IF found_code IS NOT NULL THEN
      UPDATE education
      SET country_code = found_code
      WHERE id = edu.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the migration
SELECT migrate_country_data();

-- Drop the migration function
DROP FUNCTION migrate_country_data();

-- Make the foreign key columns required after migration
ALTER TABLE companies
ALTER COLUMN country_code SET NOT NULL;

ALTER TABLE personal_info
ALTER COLUMN country_code SET NOT NULL;

ALTER TABLE education
ALTER COLUMN country_code SET NOT NULL;

-- Drop the old country columns
ALTER TABLE companies 
DROP COLUMN IF EXISTS country;

ALTER TABLE personal_info
DROP COLUMN IF EXISTS country;

ALTER TABLE education
DROP COLUMN IF EXISTS country;