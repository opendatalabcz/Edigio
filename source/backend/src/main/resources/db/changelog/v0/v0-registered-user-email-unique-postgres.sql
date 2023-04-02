CREATE UNIQUE INDEX registered_user_email_partial_unique_index
ON user_account (email, registered)
WHERE registered = true