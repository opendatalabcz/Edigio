CREATE DOMAIN project_status AS varchar
    CHECK ( VALUE IN ('PREPARED'::varchar,
                      'PUBLISHED'::varchar,
                      'ARCHIVED'::varchar));

CREATE DOMAIN catastrophe_type AS varchar
    CHECK ( VALUE IN ('DROUGHT',
                      'HIGH_TEMPERATURES',
                      'WIND',
                      'HEAVY_RAINFALL',
                      'FLOODING',
                      'FOOD_AND_WATER_OUTAGE',
                      'BIOTIC_EMERGENCY',
                      'CHEMICAL_EMERGENCY',
                      'ENERGY_OUTAGE',
                      'MIGRATION',
                      'CRIMINALITY',
                      'OTHER' ));

CREATE DOMAIN advertisement_status AS varchar
    CHECK ( VALUE IN ('CREATED',
                      'PUBLISHED',
                      'EDITED',
                      'CANCELED',
                      'RESOLVED'));

CREATE DOMAIN advertisement_help_type AS varchar
    CHECK ( VALUE IN ('ACCOMMODATIONS',
                      'MATERIAL',
                      'FOOD_AND_WATER',
                      'EMERGENCY_RESPONSE_EQUIPMENT',
                      'MEDICAL_SUPPLIES',
                      'VOLUNTEERING',
                      'SPECIALIST',
                      'CRAFTSMAN',
                      'RIDE',
                      'MEDICAL_ASSISTANCE',
                      'PSYCHOLOGICAL_HELP',
                      'ADMINISTRATION',
                      'OTHER'));

CREATE DOMAIN advertisement_type AS varchar
    CHECK ( VALUE IN ('OFFER', 'REQUEST') );

CREATE DOMAIN response_status AS varchar
    CHECK ( VALUE IN ('WAITING_FOR_CONTACT_CONFIRMATION',
                      'WAITING_FOR_RESOLVE',
                      'REJECTED',
                      'ACCEPTED',
                      'REJECTED_ON_ADVERTISEMENT_RESOLVE'));

CREATE DOMAIN user_role AS varchar
    CHECK ( VALUE IN ('NON_REGISTERED_USER',
                      'USER',
                      'COORDINATOR',
                      'ADMIN'));