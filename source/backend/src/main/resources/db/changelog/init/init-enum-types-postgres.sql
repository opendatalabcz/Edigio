CREATE TYPE project_status AS ENUM (
    'PREPARED',
    'PUBLISHED',
    'ARCHIVED'
);

CREATE TYPE catastrophe_type AS ENUM (
    'DROUGHT',
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
    'OTHER',
);

CREATE TYPE advertisement_status AS ENUM (
    'CREATED',
    'PUBLISHED',
    'EDITED',
    'CANCELED',
    'RESOLVED'
)

CREATE TYPE advertisement_help_type AS ENUM (
    'ACCOMMODATIONS',
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
    'OTHER'
);

CREATE TYPE response_status AS ENUM (
    'WAITING_FOR_CONTACT_CONFIRMATION',
    'WAITING_FOR_RESOLVE',
    'REJECTED',
    'ACCEPTED',
    'REJECTED_ON_ADVERTISEMENT_RESOLVE'
)

CREATE TYPE user_role AS ENUM (
    'ANONYMOUS_USER',
    'USER',
    'COORDINATOR',
    'ADMIN'
);