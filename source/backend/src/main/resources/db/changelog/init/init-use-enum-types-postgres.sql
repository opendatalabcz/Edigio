ALTER TABLE project
    ALTER COLUMN status TYPE project_status,
    ALTER COLUMN catastrophe_type TYPE catastrophe_type;

ALTER TABLE advertisement
    ALTER COLUMN type TYPE advertisement_type,
    ALTER COLUMN status TYPE advertisement_status,
    ALTER COLUMN help_type TYPE advertisement_help_type;

ALTER TABLE advertisement_response
    ALTER COLUMN response_status TYPE response_status;

ALTER TABLE advertisement_template_catastrophe_types
    ALTER COLUMN catastrophe_type TYPE catastrophe_type;

ALTER TABLE advertisement_template_advertisement_help_types
    ALTER COLUMN help_type TYPE advertisement_help_type;

ALTER TABLE advertisement_template_advertisement_types
    ALTER COLUMN advertisement_type TYPE advertisement_type;

ALTER TABLE user_account
    ALTER COLUMN role TYPE user_role;