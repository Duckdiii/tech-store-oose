--
-- PostgreSQL database dump
--

\restrict og9zMK6Fo9V8eq3ZfzwCRZfc7vGugcg3JZnCclvbRqnNcH1fS7cefqDKMlKq7Fw

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-03 01:32:10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP EVENT TRIGGER IF EXISTS pgrst_drop_watch;
DROP EVENT TRIGGER IF EXISTS pgrst_ddl_watch;
DROP EVENT TRIGGER IF EXISTS issue_pg_net_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_graphql_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_cron_access;
DROP EVENT TRIGGER IF EXISTS issue_graphql_placeholder;
DROP PUBLICATION IF EXISTS supabase_realtime;
ALTER TABLE IF EXISTS ONLY storage.vector_indexes DROP CONSTRAINT IF EXISTS vector_indexes_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_upload_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY public.order_item_bundle_services DROP CONSTRAINT IF EXISTS fks06sgt5fjn3lvp0g0ovy7vale;
ALTER TABLE IF EXISTS ONLY public.purchase_orders DROP CONSTRAINT IF EXISTS fkrpdasmb8y8xs5tiy4369xpinq;
ALTER TABLE IF EXISTS ONLY public.import_log_items DROP CONSTRAINT IF EXISTS fkr93l6mp8oe1xl7mf9ypb0xxn1;
ALTER TABLE IF EXISTS ONLY public.product_images DROP CONSTRAINT IF EXISTS fkqnq71xsohugpqwf3c9gxmsuy;
ALTER TABLE IF EXISTS ONLY public.product_promotions DROP CONSTRAINT IF EXISTS fkqmcm2exr3u4h8gxekpru47vqb;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS fkpxtb8awmi0dk6smoh2vp1litg;
ALTER TABLE IF EXISTS ONLY public.purchase_order_items DROP CONSTRAINT IF EXISTS fkpv8lwyeahhx6u568gy3qlpfro;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS fkpog72rpahj62h7nod9wwc28if;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS fkpcttvuq4mxppo8sxggjtn5i2c;
ALTER TABLE IF EXISTS ONLY public.product_variants DROP CONSTRAINT IF EXISTS fkosqitn4s405cynmhb87lkvuau;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS fkog2rp4qthbtt2lfyhfo32lsw9;
ALTER TABLE IF EXISTS ONLY public.login_logs DROP CONSTRAINT IF EXISTS fkofjfbi0tlitaqkibvevc0w8sm;
ALTER TABLE IF EXISTS ONLY public.managers DROP CONSTRAINT IF EXISTS fko602exy2392s7gi9as93mio60;
ALTER TABLE IF EXISTS ONLY public.purchase_order_items DROP CONSTRAINT IF EXISTS fko3yj8ocbw2kav38548t22hgh8;
ALTER TABLE IF EXISTS ONLY public.accounts DROP CONSTRAINT IF EXISTS fknjuop33mo69pd79ctplkck40n;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS fkn1s4l7h0vm4o259wpu7ft0y2y;
ALTER TABLE IF EXISTS ONLY public.notification_channels DROP CONSTRAINT IF EXISTS fkmpsidir1onjqphb9jl5a0ie2s;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS fkltmtlue0wixrg1cf0xo7x0l4d;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS fkiw47pt4gy5y5ehe4604fqheas;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS fkhlglkvf5i60dv6dn397ethgpt;
ALTER TABLE IF EXISTS ONLY public.export_log_items DROP CONSTRAINT IF EXISTS fkgrepohyv6beoy3yqn5q7wf1w1;
ALTER TABLE IF EXISTS ONLY public.memberships DROP CONSTRAINT IF EXISTS fkg5el0m85hil6ht13udpiiciys;
ALTER TABLE IF EXISTS ONLY public.export_log_items DROP CONSTRAINT IF EXISTS fkfrkkwueenkqr6a9gwdhosjkmv;
ALTER TABLE IF EXISTS ONLY public.import_log_items DROP CONSTRAINT IF EXISTS fkeyvvme4kvf618rhbbkmgfy83q;
ALTER TABLE IF EXISTS ONLY public.staffs DROP CONSTRAINT IF EXISTS fkdrcbb0t4jyjslw24sf1tkfk2p;
ALTER TABLE IF EXISTS ONLY public.order_item_bundle_services DROP CONSTRAINT IF EXISTS fkd9uwye7i79ymyv9i7o0y8a9g0;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS fkbioxgbv59vetrxe0ejfubep1w;
ALTER TABLE IF EXISTS ONLY public.favorite_products DROP CONSTRAINT IF EXISTS fkabyewuy5ayp1e7lky979l3bs6;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS fka3a4mpsfdf4d2y6r8ra3sc8mv;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS fka05wbib8rj9goai658v5g7ce4;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS fk9p0hwbmw3oxj0kdpb8f1dfsr5;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS fk8ba3sryid5k8a9kidpkvqipyt;
ALTER TABLE IF EXISTS ONLY public.cart_item_bundle_services DROP CONSTRAINT IF EXISTS fk5tjgm95vsh3a2lsbhpllxmh9u;
ALTER TABLE IF EXISTS ONLY public.product_promotions DROP CONSTRAINT IF EXISTS fk5li9b7on7wrh01p4ikflvjvx6;
ALTER TABLE IF EXISTS ONLY public.receipts DROP CONSTRAINT IF EXISTS fk4riagxynetvo7t2tv9qxqsk9w;
ALTER TABLE IF EXISTS ONLY public.invoices DROP CONSTRAINT IF EXISTS fk4ko3y00tkkk2ya3p6wnefjj2f;
ALTER TABLE IF EXISTS ONLY public.favorite_products DROP CONSTRAINT IF EXISTS fk45ettyo1mpwr769wk47cdxhl4;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS fk42bki7v5u9s62olp5is82sd74;
ALTER TABLE IF EXISTS ONLY public.cart_item_bundle_services DROP CONSTRAINT IF EXISTS fk3t585kwojlacboxwd0px1fc8v;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS fk30dp6ycner3dgso3scgc9vghy;
ALTER TABLE IF EXISTS ONLY public.payment_logs DROP CONSTRAINT IF EXISTS fk29ygux4a0q924wl7gs0h7l99g;
ALTER TABLE IF EXISTS ONLY public.addresses DROP CONSTRAINT IF EXISTS fk1fa36y2oqhao3wgg2rw1pi459;
ALTER TABLE IF EXISTS ONLY auth.webauthn_credentials DROP CONSTRAINT IF EXISTS webauthn_credentials_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.webauthn_challenges DROP CONSTRAINT IF EXISTS webauthn_challenges_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_oauth_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_flow_state_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_auth_factor_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_user_id_fkey;
DROP TRIGGER IF EXISTS update_objects_updated_at ON storage.objects;
DROP TRIGGER IF EXISTS protect_objects_delete ON storage.objects;
DROP TRIGGER IF EXISTS protect_buckets_delete ON storage.buckets;
DROP TRIGGER IF EXISTS enforce_bucket_name_length_trigger ON storage.buckets;
DROP TRIGGER IF EXISTS tr_check_filters ON realtime.subscription;
DROP INDEX IF EXISTS storage.vector_indexes_name_bucket_id_idx;
DROP INDEX IF EXISTS storage.name_prefix_search;
DROP INDEX IF EXISTS storage.idx_objects_bucket_id_name;
DROP INDEX IF EXISTS storage.idx_multipart_uploads_list;
DROP INDEX IF EXISTS storage.buckets_analytics_unique_name_idx;
DROP INDEX IF EXISTS storage.bucketid_objname;
DROP INDEX IF EXISTS storage.bname;
DROP INDEX IF EXISTS realtime.subscription_subscription_id_entity_filters_action_filter_selec;
DROP INDEX IF EXISTS realtime.messages_inserted_at_topic_index;
DROP INDEX IF EXISTS realtime.ix_realtime_subscription_entity;
DROP INDEX IF EXISTS auth.webauthn_credentials_user_id_idx;
DROP INDEX IF EXISTS auth.webauthn_credentials_credential_id_key;
DROP INDEX IF EXISTS auth.webauthn_challenges_user_id_idx;
DROP INDEX IF EXISTS auth.webauthn_challenges_expires_at_idx;
DROP INDEX IF EXISTS auth.users_is_anonymous_idx;
DROP INDEX IF EXISTS auth.users_instance_id_idx;
DROP INDEX IF EXISTS auth.users_instance_id_email_idx;
DROP INDEX IF EXISTS auth.users_email_partial_key;
DROP INDEX IF EXISTS auth.user_id_created_at_idx;
DROP INDEX IF EXISTS auth.unique_phone_factor_per_user;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_pattern_idx;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_domain_idx;
DROP INDEX IF EXISTS auth.sessions_user_id_idx;
DROP INDEX IF EXISTS auth.sessions_oauth_client_id_idx;
DROP INDEX IF EXISTS auth.sessions_not_after_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_for_email_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_created_at_idx;
DROP INDEX IF EXISTS auth.saml_providers_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_updated_at_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_session_id_revoked_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_parent_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_user_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_idx;
DROP INDEX IF EXISTS auth.recovery_token_idx;
DROP INDEX IF EXISTS auth.reauthentication_token_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_user_id_token_type_key;
DROP INDEX IF EXISTS auth.one_time_tokens_token_hash_hash_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_relates_to_hash_idx;
DROP INDEX IF EXISTS auth.oauth_consents_user_order_idx;
DROP INDEX IF EXISTS auth.oauth_consents_active_user_client_idx;
DROP INDEX IF EXISTS auth.oauth_consents_active_client_idx;
DROP INDEX IF EXISTS auth.oauth_clients_deleted_at_idx;
DROP INDEX IF EXISTS auth.oauth_auth_pending_exp_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_id_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_friendly_name_unique;
DROP INDEX IF EXISTS auth.mfa_challenge_created_at_idx;
DROP INDEX IF EXISTS auth.idx_users_name;
DROP INDEX IF EXISTS auth.idx_users_last_sign_in_at_desc;
DROP INDEX IF EXISTS auth.idx_users_email;
DROP INDEX IF EXISTS auth.idx_users_created_at_desc;
DROP INDEX IF EXISTS auth.idx_user_id_auth_method;
DROP INDEX IF EXISTS auth.idx_oauth_client_states_created_at;
DROP INDEX IF EXISTS auth.idx_auth_code;
DROP INDEX IF EXISTS auth.identities_user_id_idx;
DROP INDEX IF EXISTS auth.identities_email_idx;
DROP INDEX IF EXISTS auth.flow_state_created_at_idx;
DROP INDEX IF EXISTS auth.factor_id_created_at_idx;
DROP INDEX IF EXISTS auth.email_change_token_new_idx;
DROP INDEX IF EXISTS auth.email_change_token_current_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_provider_type_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_identifier_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_enabled_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_created_at_idx;
DROP INDEX IF EXISTS auth.confirmation_token_idx;
DROP INDEX IF EXISTS auth.audit_logs_instance_id_idx;
ALTER TABLE IF EXISTS ONLY storage.vector_indexes DROP CONSTRAINT IF EXISTS vector_indexes_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_pkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS objects_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_name_key;
ALTER TABLE IF EXISTS ONLY storage.buckets_vectors DROP CONSTRAINT IF EXISTS buckets_vectors_pkey;
ALTER TABLE IF EXISTS ONLY storage.buckets DROP CONSTRAINT IF EXISTS buckets_pkey;
ALTER TABLE IF EXISTS ONLY storage.buckets_analytics DROP CONSTRAINT IF EXISTS buckets_analytics_pkey;
ALTER TABLE IF EXISTS ONLY realtime.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY realtime.subscription DROP CONSTRAINT IF EXISTS pk_subscription;
ALTER TABLE IF EXISTS ONLY realtime.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS realtime.messages DROP CONSTRAINT IF EXISTS messages_payload_exclusive;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.promotions DROP CONSTRAINT IF EXISTS uk_promotions_code;
ALTER TABLE IF EXISTS ONLY public.memberships DROP CONSTRAINT IF EXISTS uk_memberships_tier;
ALTER TABLE IF EXISTS ONLY public.favorite_products DROP CONSTRAINT IF EXISTS uk_favorite_products_customer_variant;
ALTER TABLE IF EXISTS ONLY public.accounts DROP CONSTRAINT IF EXISTS uk_accounts_user;
ALTER TABLE IF EXISTS ONLY public.accounts DROP CONSTRAINT IF EXISTS uk_accounts_email;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_tax_code_key;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_pkey;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_email_key;
ALTER TABLE IF EXISTS ONLY public.staffs DROP CONSTRAINT IF EXISTS staffs_staff_code_key;
ALTER TABLE IF EXISTS ONLY public.staffs DROP CONSTRAINT IF EXISTS staffs_pkey;
ALTER TABLE IF EXISTS ONLY public.receipts DROP CONSTRAINT IF EXISTS receipts_pkey;
ALTER TABLE IF EXISTS ONLY public.receipts DROP CONSTRAINT IF EXISTS receipts_export_log_id_key;
ALTER TABLE IF EXISTS ONLY public.purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_pkey;
ALTER TABLE IF EXISTS ONLY public.purchase_order_items DROP CONSTRAINT IF EXISTS purchase_order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.promotions DROP CONSTRAINT IF EXISTS promotions_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.product_variants DROP CONSTRAINT IF EXISTS product_variants_pkey;
ALTER TABLE IF EXISTS ONLY public.product_images DROP CONSTRAINT IF EXISTS product_images_pkey;
ALTER TABLE IF EXISTS ONLY public.payment_methods DROP CONSTRAINT IF EXISTS payment_methods_pkey;
ALTER TABLE IF EXISTS ONLY public.payment_logs DROP CONSTRAINT IF EXISTS payment_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_pkey;
ALTER TABLE IF EXISTS ONLY public.memberships DROP CONSTRAINT IF EXISTS memberships_pkey;
ALTER TABLE IF EXISTS ONLY public.memberships DROP CONSTRAINT IF EXISTS memberships_benefit_id_key;
ALTER TABLE IF EXISTS ONLY public.membership_benefits DROP CONSTRAINT IF EXISTS membership_benefits_pkey;
ALTER TABLE IF EXISTS ONLY public.managers DROP CONSTRAINT IF EXISTS managers_pkey;
ALTER TABLE IF EXISTS ONLY public.login_logs DROP CONSTRAINT IF EXISTS login_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.invoices DROP CONSTRAINT IF EXISTS invoices_pkey;
ALTER TABLE IF EXISTS ONLY public.invoices DROP CONSTRAINT IF EXISTS invoices_order_id_key;
ALTER TABLE IF EXISTS ONLY public.import_logs DROP CONSTRAINT IF EXISTS import_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.import_log_items DROP CONSTRAINT IF EXISTS import_log_items_pkey;
ALTER TABLE IF EXISTS ONLY public.favorite_products DROP CONSTRAINT IF EXISTS favorite_products_pkey;
ALTER TABLE IF EXISTS ONLY public.export_logs DROP CONSTRAINT IF EXISTS export_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.export_log_items DROP CONSTRAINT IF EXISTS export_log_items_pkey;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_name_key;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_pkey;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_customer_id_key;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_pkey;
ALTER TABLE IF EXISTS ONLY public.bundle_services DROP CONSTRAINT IF EXISTS bundle_services_pkey;
ALTER TABLE IF EXISTS ONLY public.brands DROP CONSTRAINT IF EXISTS brands_pkey;
ALTER TABLE IF EXISTS ONLY public.brands DROP CONSTRAINT IF EXISTS brands_name_key;
ALTER TABLE IF EXISTS ONLY public.addresses DROP CONSTRAINT IF EXISTS addresses_pkey;
ALTER TABLE IF EXISTS ONLY public.accounts DROP CONSTRAINT IF EXISTS accounts_user_id_key;
ALTER TABLE IF EXISTS ONLY public.accounts DROP CONSTRAINT IF EXISTS accounts_pkey;
ALTER TABLE IF EXISTS ONLY auth.webauthn_credentials DROP CONSTRAINT IF EXISTS webauthn_credentials_pkey;
ALTER TABLE IF EXISTS ONLY auth.webauthn_challenges DROP CONSTRAINT IF EXISTS webauthn_challenges_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_phone_key;
ALTER TABLE IF EXISTS ONLY auth.sso_providers DROP CONSTRAINT IF EXISTS sso_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_pkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY auth.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_entity_id_key;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_token_unique;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_user_client_unique;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_clients DROP CONSTRAINT IF EXISTS oauth_clients_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_client_states DROP CONSTRAINT IF EXISTS oauth_client_states_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_authorization_id_key;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_authorization_code_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_last_challenged_at_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_authentication_method_pkey;
ALTER TABLE IF EXISTS ONLY auth.instances DROP CONSTRAINT IF EXISTS instances_pkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_provider_id_provider_unique;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_pkey;
ALTER TABLE IF EXISTS ONLY auth.flow_state DROP CONSTRAINT IF EXISTS flow_state_pkey;
ALTER TABLE IF EXISTS ONLY auth.custom_oauth_providers DROP CONSTRAINT IF EXISTS custom_oauth_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.custom_oauth_providers DROP CONSTRAINT IF EXISTS custom_oauth_providers_identifier_key;
ALTER TABLE IF EXISTS ONLY auth.audit_log_entries DROP CONSTRAINT IF EXISTS audit_log_entries_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS amr_id_pk;
ALTER TABLE IF EXISTS auth.refresh_tokens ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS storage.vector_indexes;
DROP TABLE IF EXISTS storage.s3_multipart_uploads_parts;
DROP TABLE IF EXISTS storage.s3_multipart_uploads;
DROP TABLE IF EXISTS storage.objects;
DROP TABLE IF EXISTS storage.migrations;
DROP TABLE IF EXISTS storage.buckets_vectors;
DROP TABLE IF EXISTS storage.buckets_analytics;
DROP TABLE IF EXISTS storage.buckets;
DROP TABLE IF EXISTS realtime.subscription;
DROP TABLE IF EXISTS realtime.schema_migrations;
DROP TABLE IF EXISTS realtime.messages;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.suppliers;
DROP TABLE IF EXISTS public.staffs;
DROP TABLE IF EXISTS public.receipts;
DROP TABLE IF EXISTS public.purchase_orders;
DROP TABLE IF EXISTS public.purchase_order_items;
DROP TABLE IF EXISTS public.promotions;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.product_variants;
DROP TABLE IF EXISTS public.product_promotions;
DROP TABLE IF EXISTS public.product_images;
DROP TABLE IF EXISTS public.payment_methods;
DROP TABLE IF EXISTS public.payment_logs;
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.order_item_bundle_services;
DROP TABLE IF EXISTS public.notifications;
DROP TABLE IF EXISTS public.notification_channels;
DROP TABLE IF EXISTS public.memberships;
DROP TABLE IF EXISTS public.membership_benefits;
DROP TABLE IF EXISTS public.managers;
DROP TABLE IF EXISTS public.login_logs;
DROP TABLE IF EXISTS public.invoices;
DROP TABLE IF EXISTS public.import_logs;
DROP TABLE IF EXISTS public.import_log_items;
DROP TABLE IF EXISTS public.favorite_products;
DROP TABLE IF EXISTS public.export_logs;
DROP TABLE IF EXISTS public.export_log_items;
DROP TABLE IF EXISTS public.customers;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.carts;
DROP TABLE IF EXISTS public.cart_items;
DROP TABLE IF EXISTS public.cart_item_bundle_services;
DROP TABLE IF EXISTS public.bundle_services;
DROP TABLE IF EXISTS public.brands;
DROP TABLE IF EXISTS public.addresses;
DROP TABLE IF EXISTS public.accounts;
DROP TABLE IF EXISTS auth.webauthn_credentials;
DROP TABLE IF EXISTS auth.webauthn_challenges;
DROP TABLE IF EXISTS auth.users;
DROP TABLE IF EXISTS auth.sso_providers;
DROP TABLE IF EXISTS auth.sso_domains;
DROP TABLE IF EXISTS auth.sessions;
DROP TABLE IF EXISTS auth.schema_migrations;
DROP TABLE IF EXISTS auth.saml_relay_states;
DROP TABLE IF EXISTS auth.saml_providers;
DROP SEQUENCE IF EXISTS auth.refresh_tokens_id_seq;
DROP TABLE IF EXISTS auth.refresh_tokens;
DROP TABLE IF EXISTS auth.one_time_tokens;
DROP TABLE IF EXISTS auth.oauth_consents;
DROP TABLE IF EXISTS auth.oauth_clients;
DROP TABLE IF EXISTS auth.oauth_client_states;
DROP TABLE IF EXISTS auth.oauth_authorizations;
DROP TABLE IF EXISTS auth.mfa_factors;
DROP TABLE IF EXISTS auth.mfa_challenges;
DROP TABLE IF EXISTS auth.mfa_amr_claims;
DROP TABLE IF EXISTS auth.instances;
DROP TABLE IF EXISTS auth.identities;
DROP TABLE IF EXISTS auth.flow_state;
DROP TABLE IF EXISTS auth.custom_oauth_providers;
DROP TABLE IF EXISTS auth.audit_log_entries;
DROP FUNCTION IF EXISTS storage.update_updated_at_column();
DROP FUNCTION IF EXISTS storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text);
DROP FUNCTION IF EXISTS storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text);
DROP FUNCTION IF EXISTS storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION IF EXISTS storage.protect_delete();
DROP FUNCTION IF EXISTS storage.operation();
DROP FUNCTION IF EXISTS storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text);
DROP FUNCTION IF EXISTS storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text);
DROP FUNCTION IF EXISTS storage.get_size_by_bucket();
DROP FUNCTION IF EXISTS storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text);
DROP FUNCTION IF EXISTS storage.foldername(name text);
DROP FUNCTION IF EXISTS storage.filename(name text);
DROP FUNCTION IF EXISTS storage.extension(name text);
DROP FUNCTION IF EXISTS storage.enforce_bucket_name_length();
DROP FUNCTION IF EXISTS storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb);
DROP FUNCTION IF EXISTS storage.allow_only_operation(expected_operation text);
DROP FUNCTION IF EXISTS storage.allow_any_operation(expected_operations text[]);
DROP FUNCTION IF EXISTS realtime.wal2json_escape_identifier(name text);
DROP FUNCTION IF EXISTS realtime.topic();
DROP FUNCTION IF EXISTS realtime.to_regrole(role_name text);
DROP FUNCTION IF EXISTS realtime.subscription_check_filters();
DROP FUNCTION IF EXISTS realtime.send_binary(payload bytea, event text, topic text, private boolean);
DROP FUNCTION IF EXISTS realtime.send(payload jsonb, event text, topic text, private boolean);
DROP FUNCTION IF EXISTS realtime.quote_wal2json(entity regclass);
DROP FUNCTION IF EXISTS realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer);
DROP FUNCTION IF EXISTS realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]);
DROP FUNCTION IF EXISTS realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean);
DROP FUNCTION IF EXISTS realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text);
DROP FUNCTION IF EXISTS realtime."cast"(val text, type_ regtype);
DROP FUNCTION IF EXISTS realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]);
DROP FUNCTION IF EXISTS realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text);
DROP FUNCTION IF EXISTS realtime.apply_rls(wal jsonb, max_record_bytes integer);
DROP FUNCTION IF EXISTS pgbouncer.get_auth(p_usename text);
DROP FUNCTION IF EXISTS graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb);
DROP FUNCTION IF EXISTS extensions.set_graphql_placeholder();
DROP FUNCTION IF EXISTS extensions.pgrst_drop_watch();
DROP FUNCTION IF EXISTS extensions.pgrst_ddl_watch();
DROP FUNCTION IF EXISTS extensions.grant_pg_net_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_graphql_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_cron_access();
DROP FUNCTION IF EXISTS auth.uid();
DROP FUNCTION IF EXISTS auth.role();
DROP FUNCTION IF EXISTS auth.jwt();
DROP FUNCTION IF EXISTS auth.email();
DROP TYPE IF EXISTS storage.buckettype;
DROP TYPE IF EXISTS realtime.wal_rls;
DROP TYPE IF EXISTS realtime.wal_column;
DROP TYPE IF EXISTS realtime.user_defined_filter;
DROP TYPE IF EXISTS realtime.equality_op;
DROP TYPE IF EXISTS realtime.action;
DROP TYPE IF EXISTS auth.one_time_token_type;
DROP TYPE IF EXISTS auth.oauth_response_type;
DROP TYPE IF EXISTS auth.oauth_registration_type;
DROP TYPE IF EXISTS auth.oauth_client_type;
DROP TYPE IF EXISTS auth.oauth_authorization_status;
DROP TYPE IF EXISTS auth.factor_type;
DROP TYPE IF EXISTS auth.factor_status;
DROP TYPE IF EXISTS auth.code_challenge_method;
DROP TYPE IF EXISTS auth.aal_level;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS supabase_vault;
DROP EXTENSION IF EXISTS pgcrypto;
DROP EXTENSION IF EXISTS pg_stat_statements;
DROP SCHEMA IF EXISTS vault;
DROP SCHEMA IF EXISTS storage;
DROP SCHEMA IF EXISTS realtime;
DROP SCHEMA IF EXISTS pgbouncer;
DROP SCHEMA IF EXISTS graphql_public;
DROP SCHEMA IF EXISTS graphql;
DROP SCHEMA IF EXISTS extensions;
DROP SCHEMA IF EXISTS auth;
--
-- TOC entry 35 (class 2615 OID 16498)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- TOC entry 21 (class 2615 OID 16392)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- TOC entry 33 (class 2615 OID 16578)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- TOC entry 32 (class 2615 OID 16567)
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- TOC entry 10 (class 2615 OID 16390)
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- TOC entry 8 (class 2615 OID 16559)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- TOC entry 36 (class 2615 OID 16546)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- TOC entry 30 (class 2615 OID 16607)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- TOC entry 2 (class 3079 OID 16393)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- TOC entry 4591 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 4 (class 3079 OID 16447)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- TOC entry 4592 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 5 (class 3079 OID 16608)
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- TOC entry 4593 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- TOC entry 3 (class 3079 OID 16436)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- TOC entry 4594 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1189 (class 1247 OID 16744)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- TOC entry 1213 (class 1247 OID 16885)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- TOC entry 1186 (class 1247 OID 16738)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- TOC entry 1183 (class 1247 OID 16732)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1231 (class 1247 OID 16988)
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- TOC entry 1243 (class 1247 OID 17061)
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1225 (class 1247 OID 16966)
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1234 (class 1247 OID 16998)
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1219 (class 1247 OID 16927)
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1270 (class 1247 OID 17216)
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- TOC entry 1261 (class 1247 OID 17176)
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in',
    'like',
    'ilike',
    'is',
    'match',
    'imatch',
    'isdistinct'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- TOC entry 1264 (class 1247 OID 17191)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text,
	negate boolean
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- TOC entry 1276 (class 1247 OID 17258)
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- TOC entry 1273 (class 1247 OID 17229)
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- TOC entry 1297 (class 1247 OID 17490)
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- TOC entry 491 (class 1255 OID 16544)
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- TOC entry 4595 (class 0 OID 0)
-- Dependencies: 491
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 504 (class 1255 OID 16714)
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- TOC entry 490 (class 1255 OID 16543)
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- TOC entry 4598 (class 0 OID 0)
-- Dependencies: 490
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 489 (class 1255 OID 16542)
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- TOC entry 4600 (class 0 OID 0)
-- Dependencies: 489
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 492 (class 1255 OID 16551)
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- TOC entry 4616 (class 0 OID 0)
-- Dependencies: 492
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- TOC entry 496 (class 1255 OID 16572)
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
begin
    if not exists (
        select 1
        from pg_event_trigger_ddl_commands() ev
        join pg_catalog.pg_extension e on ev.objid = e.oid
        where e.extname = 'pg_graphql'
    ) then
        return;
    end if;

    drop function if exists graphql_public.graphql;
    create or replace function graphql_public.graphql(
        "operationName" text default null,
        query text default null,
        variables jsonb default null,
        extensions jsonb default null
    )
        returns jsonb
        language sql
    as $$
        select graphql.resolve(
            query := query,
            variables := coalesce(variables, '{}'),
            "operationName" := "operationName",
            extensions := extensions
        );
    $$;

    -- Attach the wrapper to the extension so DROP EXTENSION cascades to it,
    -- which in turn triggers set_graphql_placeholder to reinstall the "not enabled" stub.
    alter extension pg_graphql add function graphql_public.graphql(text, text, jsonb, jsonb);

    grant usage on schema graphql to postgres, anon, authenticated, service_role;
    grant execute on function graphql.resolve to postgres, anon, authenticated, service_role;
    grant usage on schema graphql to postgres with grant option;
    grant usage on schema graphql_public to postgres with grant option;
end;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- TOC entry 4618 (class 0 OID 0)
-- Dependencies: 496
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- TOC entry 493 (class 1255 OID 16553)
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- TOC entry 4620 (class 0 OID 0)
-- Dependencies: 493
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- TOC entry 494 (class 1255 OID 16563)
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- TOC entry 495 (class 1255 OID 16564)
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- TOC entry 497 (class 1255 OID 16574)
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- TOC entry 4649 (class 0 OID 0)
-- Dependencies: 497
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 503 (class 1255 OID 16665)
-- Name: graphql(text, text, jsonb, jsonb); Type: FUNCTION; Schema: graphql_public; Owner: supabase_admin
--

CREATE FUNCTION graphql_public.graphql("operationName" text DEFAULT NULL::text, query text DEFAULT NULL::text, variables jsonb DEFAULT NULL::jsonb, extensions jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;


ALTER FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) OWNER TO supabase_admin;

--
-- TOC entry 439 (class 1255 OID 16391)
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- TOC entry 510 (class 1255 OID 17251)
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
    -- Regclass of the table e.g. public.notes
    entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

    -- I, U, D, T: insert, update ...
    action realtime.action = (
        case wal ->> 'action'
            when 'I' then 'INSERT'
            when 'U' then 'UPDATE'
            when 'D' then 'DELETE'
            else 'ERROR'
        end
    );

    -- Is row level security enabled for the table
    is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

    subscriptions realtime.subscription[] = array_agg(subs)
        from
            realtime.subscription subs
        where
            subs.entity = entity_
            -- Filter by action early - only get subscriptions interested in this action
            -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
            and (subs.action_filter = '*' or subs.action_filter = action::text);

    -- Subscription vars
    working_role regrole;
    working_selected_columns text[];
    claimed_role regrole;
    claims jsonb;

    subscription_id uuid;
    subscription_has_access bool;
    visible_to_subscription_ids uuid[] = '{}';

    -- structured info for wal's columns
    columns realtime.wal_column[];
    -- previous identity values for update/delete
    old_columns realtime.wal_column[];

    error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

    -- Primary jsonb output for record
    output jsonb;

    -- Loop record for iterating unique roles (outer loop)
    role_record record;
    -- Loop record for iterating unique selected_columns within a role (inner loop)
    cols_record record;
    -- Subscription ids visible at the role level (before fanning out by selected_columns)
    visible_role_sub_ids uuid[] = '{}';

begin
    perform set_config('role', null, true);

    columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'columns') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    old_columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'identity') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    for role_record in
        select claims_role
        from (select distinct claims_role from unnest(subscriptions)) t
        order by claims_role::text
    loop
        working_role := role_record.claims_role;

        -- Update `is_selectable` for columns and old_columns (once per role)
        columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(columns) c;

        old_columns =
                array_agg(
                    (
                        c.name,
                        c.type_name,
                        c.type_oid,
                        c.value,
                        c.is_pkey,
                        pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                    )::realtime.wal_column
                )
                from
                    unnest(old_columns) c;

        if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
            -- Fan out 400 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 400: Bad Request, no primary key']
                )::realtime.wal_rls;
            end loop;

        -- The claims role does not have SELECT permission to the primary key of entity
        elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
            -- Fan out 401 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 401: Unauthorized']
                )::realtime.wal_rls;
            end loop;

        else
            -- Create the prepared statement (once per role)
            if is_rls_enabled and action <> 'DELETE' then
                if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                    deallocate walrus_rls_stmt;
                end if;
                execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
            end if;

            -- Collect all visible subscription IDs for this role (filter check + RLS check)
            visible_role_sub_ids = '{}';

            for subscription_id, claims in (
                    select
                        subs.subscription_id,
                        subs.claims
                    from
                        unnest(subscriptions) subs
                    where
                        subs.entity = entity_
                        and subs.claims_role = working_role
                        and (
                            realtime.is_visible_through_filters(columns, subs.filters)
                            or (
                              action = 'DELETE'
                              and realtime.is_visible_through_filters(old_columns, subs.filters)
                            )
                        )
            ) loop

                if not is_rls_enabled or action = 'DELETE' then
                    visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                else
                    -- Check if RLS allows the role to see the record
                    perform
                        -- Trim leading and trailing quotes from working_role because set_config
                        -- doesn't recognize the role as valid if they are included
                        set_config('role', trim(both '"' from working_role::text), true),
                        set_config('request.jwt.claims', claims::text, true);

                    execute 'execute walrus_rls_stmt' into subscription_has_access;

                    if subscription_has_access then
                        visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                    end if;
                end if;
            end loop;

            perform set_config('role', null, true);

            -- Inner loop: per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;

                output = jsonb_build_object(
                    'schema', wal ->> 'schema',
                    'table', wal ->> 'table',
                    'type', action,
                    'commit_timestamp', to_char(
                        ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                        'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
                    ),
                    'columns', (
                        select
                            jsonb_agg(
                                jsonb_build_object(
                                    'name', pa.attname,
                                    'type', pt.typname
                                )
                                order by pa.attnum asc
                            )
                        from
                            pg_attribute pa
                            join pg_type pt
                                on pa.atttypid = pt.oid
                            left join (
                                select unnest(conkey) as pkey_attnum
                                from pg_constraint
                                where conrelid = entity_ and contype = 'p'
                            ) pk on pk.pkey_attnum = pa.attnum
                        where
                            attrelid = entity_
                            and attnum > 0
                            and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
                            and (working_selected_columns is null or pa.attname = any(working_selected_columns) or pk.pkey_attnum is not null)
                    )
                )
                -- Add "record" key for insert and update
                || case
                    when action in ('INSERT', 'UPDATE') then
                        jsonb_build_object(
                            'record',
                            (
                                select
                                    jsonb_object_agg(
                                        -- if unchanged toast, get column name and value from old record
                                        coalesce((c).name, (oc).name),
                                        case
                                            when (c).name is null then (oc).value
                                            else (c).value
                                        end
                                    )
                                from
                                    unnest(columns) c
                                    full outer join unnest(old_columns) oc
                                        on (c).name = (oc).name
                                where
                                    coalesce((c).is_selectable, (oc).is_selectable)
                                    and (working_selected_columns is null or coalesce((c).name, (oc).name) = any(working_selected_columns) or coalesce((c).is_pkey, (oc).is_pkey))
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            )
                        )
                    else '{}'::jsonb
                end
                -- Add "old_record" key for update and delete
                || case
                    when action = 'UPDATE' then
                        jsonb_build_object(
                                'old_record',
                                (
                                    select jsonb_object_agg((c).name, (c).value)
                                    from unnest(old_columns) c
                                    where
                                        (c).is_selectable
                                        and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                        and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                )
                            )
                    when action = 'DELETE' then
                        jsonb_build_object(
                            'old_record',
                            (
                                select jsonb_object_agg((c).name, (c).value)
                                from unnest(old_columns) c
                                where
                                    (c).is_selectable
                                    and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                    and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                            )
                        )
                    else '{}'::jsonb
                end;

                -- Filter visible_role_sub_ids to those matching the current selected_columns group
                visible_to_subscription_ids = coalesce(
                    (
                        select array_agg(s.subscription_id)
                        from unnest(subscriptions) s
                        where s.claims_role = working_role
                          and (s.selected_columns is not distinct from working_selected_columns)
                          and s.subscription_id = any(visible_role_sub_ids)
                    ),
                    '{}'::uuid[]
                );

                return next (
                    output,
                    is_rls_enabled,
                    visible_to_subscription_ids,
                    case
                        when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                        else '{}'
                    end
                )::realtime.wal_rls;
            end loop;

        end if;
    end loop;

    perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 515 (class 1255 OID 17330)
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- TOC entry 512 (class 1255 OID 17263)
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- TOC entry 508 (class 1255 OID 17213)
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- TOC entry 507 (class 1255 OID 17208)
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
/*
Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
*/
declare
    op_symbol text = (
        case
            when op = 'eq' then '='
            when op = 'neq' then '!='
            when op = 'lt' then '<'
            when op = 'lte' then '<='
            when op = 'gt' then '>'
            when op = 'gte' then '>='
            when op = 'in' then '= any'
            else 'UNKNOWN OP'
        end
    );
    res boolean;
begin
    execute format(
        'select %L::'|| type_::text || ' ' || op_symbol
        || ' ( %L::'
        || (
            case
                when op = 'in' then type_::text || '[]'
                else type_::text end
        )
        || ')', val_1, val_2) into res;
    return res;
end;
$$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- TOC entry 536 (class 1255 OID 27134)
-- Name: check_equality_op(realtime.equality_op, regtype, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) RETURNS boolean
    LANGUAGE plpgsql STABLE
    AS $$
declare
    op_symbol text;
    res boolean;
begin
    -- IS DISTINCT FROM / IS NOT DISTINCT FROM: infix, both sides typed literals
    if op = 'isdistinct' then
        execute format(
            'select %L::%s %s %L::%s',
            val_1,
            type_::text,
            case when negate then 'IS NOT DISTINCT FROM' else 'IS DISTINCT FROM' end,
            val_2,
            type_::text
        ) into res;
        return res;
    end if;

    -- IS requires a keyword RHS (NULL, TRUE, FALSE, UNKNOWN), not a typed literal
    if op = 'is' then
        if val_2 not in ('null', 'true', 'false', 'unknown') then
            raise exception 'invalid value for is filter: must be null, true, false, or unknown';
        end if;
        execute format(
            'select %L::%s %s %s',
            val_1,
            type_::text,
            case when negate then 'IS NOT' else 'IS' end,
            upper(val_2)
        ) into res;
        return res;
    end if;

    op_symbol = case
        when op = 'eq'    then '='
        when op = 'neq'   then '!='
        when op = 'lt'    then '<'
        when op = 'lte'   then '<='
        when op = 'gt'    then '>'
        when op = 'gte'   then '>='
        when op = 'in'    then '= any'
        when op = 'like'   then 'LIKE'
        when op = 'ilike'  then 'ILIKE'
        when op = 'match'  then '~'
        when op = 'imatch' then '~*'
        else null
    end;

    if op_symbol is null then
        raise exception 'unsupported equality operator: %', op::text;
    end if;

    execute format(
        'select %L::%s %s (%L::%s)',
        val_1,
        type_::text,
        op_symbol,
        val_2,
        case when op = 'in' then type_::text || '[]' else type_::text end
    ) into res;

    return case when negate then not res else res end;
end;
$$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) OWNER TO supabase_admin;

--
-- TOC entry 511 (class 1255 OID 17259)
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
    select
        filters is null
        or array_length(filters, 1) is null
        or coalesce(
            count(col.name) = count(1)
            and sum(
                realtime.check_equality_op(
                    op:=f.op,
                    type_:=coalesce(col.type_oid::regtype, col.type_name::regtype),
                    val_1:=col.value #>> '{}',
                    val_2:=f.value,
                    negate:=coalesce(f.negate, false)
                )::int
            ) filter (where col.name is not null) = count(col.name),
            false
        )
    from
        unnest(filters) f
        left join unnest(columns) col
            on f.column_name = col.name;
$$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- TOC entry 517 (class 1255 OID 17366)
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 506 (class 1255 OID 17207)
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  SELECT
    realtime.wal2json_escape_identifier(nsp.nspname::text)
    || '.'
    || realtime.wal2json_escape_identifier(pc.relname::text)
  FROM pg_class pc
  JOIN pg_namespace nsp ON pc.relnamespace = nsp.oid
  WHERE pc.oid = entity
$$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- TOC entry 514 (class 1255 OID 17329)
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- TOC entry 518 (class 1255 OID 17367)
-- Name: send_binary(bytea, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, binary_payload, event, topic, private, extension)
    VALUES (generated_id, payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- TOC entry 505 (class 1255 OID 17205)
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
    col_names text[] = coalesce(
            array_agg(a.attname order by a.attnum),
            '{}'::text[]
        )
        from
            pg_catalog.pg_attribute a
        where
            a.attrelid = new.entity
            and a.attnum > 0
            and not a.attisdropped
            and pg_catalog.has_column_privilege(
                (new.claims ->> 'role'),
                a.attrelid,
                a.attnum,
                'SELECT'
            );
    filter realtime.user_defined_filter;
    col_type regtype;
    in_val jsonb;
    selected_col text;
begin
    for filter in select * from unnest(new.filters) loop
        if not filter.column_name = any(col_names) then
            raise exception 'invalid column for filter %', filter.column_name;
        end if;

        col_type = (
            select atttypid::regtype
            from pg_catalog.pg_attribute
            where attrelid = new.entity
                  and attname = filter.column_name
        );
        if col_type is null then
            raise exception 'failed to lookup type for column %', filter.column_name;
        end if;

        if filter.op = 'in'::realtime.equality_op then
            in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
            if coalesce(jsonb_array_length(in_val), 0) > 100 then
                raise exception 'too many values for `in` filter. Maximum 100';
            end if;
        elsif filter.op = 'is'::realtime.equality_op then
            -- `is` requires a keyword RHS rather than a typed literal
            if filter.value not in ('null', 'true', 'false', 'unknown') then
                raise exception 'invalid value for is filter: must be null, true, false, or unknown';
            end if;
            -- IS NULL works for any type, but IS TRUE/FALSE/UNKNOWN require a boolean
            -- operand. Reject the non-null keywords on non-boolean columns here so they
            -- don't abort apply_rls at WAL time.
            if filter.value <> 'null' and col_type <> 'boolean'::regtype then
                raise exception 'is % filter requires a boolean column, got %', filter.value, col_type::text;
            end if;
        elsif filter.op in ('like'::realtime.equality_op, 'ilike'::realtime.equality_op) then
            -- like/ilike apply the text pattern operator (~~); reject column types that
            -- have no such operator instead of failing at WAL time
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = '~~' and oprleft = col_type
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
        elsif filter.op in ('match'::realtime.equality_op, 'imatch'::realtime.equality_op) then
            -- match/imatch apply the regex operators ~ / ~*; reject column types that have
            -- no such operator (e.g. integer) instead of failing at WAL time, mirroring the
            -- like/ilike guard above.
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = case when filter.op = 'imatch'::realtime.equality_op then '~*' else '~' end
                  and oprleft = col_type
                  and oprright = col_type
                  and oprresult = 'boolean'::regtype
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
            -- validate the regex eagerly so a bad pattern is rejected here, not inside
            -- apply_rls where it would abort the WAL stream for the entity
            begin
                perform '' ~ filter.value;
            exception when others then
                raise exception 'invalid regular expression for % filter: %', filter.op::text, sqlerrm;
            end;
        else
            -- eq/neq/lt/lte/gt/gte: value must be coercable to the type
            perform realtime.cast(filter.value, col_type);
        end if;
    end loop;

    if new.selected_columns is not null then
        for selected_col in select * from unnest(new.selected_columns) loop
            if not selected_col = any(col_names) then
                raise exception 'invalid column for select %', selected_col;
            end if;
        end loop;
    end if;

    -- Apply consistent order to filters so the unique constraint can't be tricked by a
    -- different filter order. negate is part of the sort key.
    new.filters = coalesce(
        array_agg(f order by f.column_name, f.op, f.value, f.negate),
        '{}'
    ) from unnest(new.filters) f;

    new.selected_columns = (
        select array_agg(c order by c)
        from unnest(new.selected_columns) c
    );

    return new;
end;
$$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- TOC entry 509 (class 1255 OID 17240)
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- TOC entry 513 (class 1255 OID 17323)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- TOC entry 516 (class 1255 OID 17365)
-- Name: wal2json_escape_identifier(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.wal2json_escape_identifier(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Prefix `\`, `,`, `.`, and any whitespace with `\`
  SELECT regexp_replace(name, '([\\,.[:space:]])', '\\\1', 'g')
$$;


ALTER FUNCTION realtime.wal2json_escape_identifier(name text) OWNER TO supabase_admin;

--
-- TOC entry 535 (class 1255 OID 17556)
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


ALTER FUNCTION storage.allow_any_operation(expected_operations text[]) OWNER TO supabase_storage_admin;

--
-- TOC entry 534 (class 1255 OID 17555)
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


ALTER FUNCTION storage.allow_only_operation(expected_operation text) OWNER TO supabase_storage_admin;

--
-- TOC entry 525 (class 1255 OID 17431)
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- TOC entry 528 (class 1255 OID 17487)
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- TOC entry 521 (class 1255 OID 17406)
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Get the last path segment (the actual filename)
    SELECT _parts[array_length(_parts, 1)] INTO _filename;
    -- Extract extension: reverse, split on '.', then reverse again
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 520 (class 1255 OID 17405)
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 519 (class 1255 OID 17404)
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 529 (class 1255 OID 17544)
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- TOC entry 522 (class 1255 OID 17418)
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint)::bigint as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- TOC entry 526 (class 1255 OID 17470)
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- TOC entry 530 (class 1255 OID 17545)
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- TOC entry 527 (class 1255 OID 17486)
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- TOC entry 533 (class 1255 OID 17551)
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- TOC entry 523 (class 1255 OID 17420)
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 532 (class 1255 OID 17549)
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- TOC entry 531 (class 1255 OID 17548)
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- TOC entry 524 (class 1255 OID 17421)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 353 (class 1259 OID 16529)
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- TOC entry 4682 (class 0 OID 0)
-- Dependencies: 353
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 372 (class 1259 OID 17084)
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    custom_claims_allowlist text[] DEFAULT '{}'::text[] NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 366 (class 1259 OID 16889)
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- TOC entry 4685 (class 0 OID 0)
-- Dependencies: 366
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- TOC entry 357 (class 1259 OID 16686)
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- TOC entry 4687 (class 0 OID 0)
-- Dependencies: 357
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 4688 (class 0 OID 0)
-- Dependencies: 357
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 352 (class 1259 OID 16522)
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- TOC entry 4690 (class 0 OID 0)
-- Dependencies: 352
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 361 (class 1259 OID 16776)
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- TOC entry 4692 (class 0 OID 0)
-- Dependencies: 361
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 360 (class 1259 OID 16764)
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- TOC entry 4694 (class 0 OID 0)
-- Dependencies: 360
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 359 (class 1259 OID 16751)
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- TOC entry 4696 (class 0 OID 0)
-- Dependencies: 359
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- TOC entry 4697 (class 0 OID 0)
-- Dependencies: 359
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- TOC entry 369 (class 1259 OID 17001)
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- TOC entry 371 (class 1259 OID 17074)
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- TOC entry 4700 (class 0 OID 0)
-- Dependencies: 371
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- TOC entry 368 (class 1259 OID 16971)
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- TOC entry 370 (class 1259 OID 17034)
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- TOC entry 367 (class 1259 OID 16939)
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 351 (class 1259 OID 16511)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 4705 (class 0 OID 0)
-- Dependencies: 351
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 350 (class 1259 OID 16510)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- TOC entry 4707 (class 0 OID 0)
-- Dependencies: 350
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- TOC entry 364 (class 1259 OID 16818)
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 4709 (class 0 OID 0)
-- Dependencies: 364
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 365 (class 1259 OID 16836)
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- TOC entry 4711 (class 0 OID 0)
-- Dependencies: 365
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 354 (class 1259 OID 16537)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- TOC entry 4713 (class 0 OID 0)
-- Dependencies: 354
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 358 (class 1259 OID 16716)
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- TOC entry 4715 (class 0 OID 0)
-- Dependencies: 358
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 4716 (class 0 OID 0)
-- Dependencies: 358
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 4717 (class 0 OID 0)
-- Dependencies: 358
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- TOC entry 4718 (class 0 OID 0)
-- Dependencies: 358
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- TOC entry 363 (class 1259 OID 16803)
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- TOC entry 4720 (class 0 OID 0)
-- Dependencies: 363
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 362 (class 1259 OID 16794)
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 4722 (class 0 OID 0)
-- Dependencies: 362
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 4723 (class 0 OID 0)
-- Dependencies: 362
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 349 (class 1259 OID 16499)
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- TOC entry 4725 (class 0 OID 0)
-- Dependencies: 349
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 4726 (class 0 OID 0)
-- Dependencies: 349
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 374 (class 1259 OID 17149)
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


ALTER TABLE auth.webauthn_challenges OWNER TO supabase_auth_admin;

--
-- TOC entry 373 (class 1259 OID 17126)
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE auth.webauthn_credentials OWNER TO supabase_auth_admin;

--
-- TOC entry 390 (class 1259 OID 26500)
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    status character varying(30) NOT NULL,
    id character varying(36) NOT NULL,
    user_id character varying(36) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    CONSTRAINT accounts_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'BLOCKED'::character varying, 'DELETED'::character varying])::text[])))
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- TOC entry 391 (class 1259 OID 26512)
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    id character varying(36) NOT NULL,
    user_id character varying(36) NOT NULL,
    district character varying(100),
    province character varying(100),
    ward character varying(100),
    street character varying(255)
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- TOC entry 392 (class 1259 OID 26519)
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    id character varying(36) NOT NULL,
    name character varying(100) NOT NULL,
    logo_url character varying(500),
    description text
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- TOC entry 393 (class 1259 OID 26528)
-- Name: bundle_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bundle_services (
    active boolean NOT NULL,
    duration_months integer,
    price numeric(15,2) NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    id character varying(36) NOT NULL,
    type character varying(40) NOT NULL,
    name character varying(120) NOT NULL,
    description text,
    CONSTRAINT bundle_services_type_check CHECK (((type)::text = ANY ((ARRAY['WARRANTY'::character varying, 'SCREEN_PROTECTION'::character varying])::text[])))
);


ALTER TABLE public.bundle_services OWNER TO postgres;

--
-- TOC entry 394 (class 1259 OID 26536)
-- Name: cart_item_bundle_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_item_bundle_services (
    bundle_service_id character varying(36) NOT NULL,
    cart_item_id character varying(36) NOT NULL
);


ALTER TABLE public.cart_item_bundle_services OWNER TO postgres;

--
-- TOC entry 395 (class 1259 OID 26539)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    quantity integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    cart_id character varying(36) NOT NULL,
    id character varying(36) NOT NULL,
    product_variant_id character varying(36) NOT NULL
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- TOC entry 396 (class 1259 OID 26544)
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    customer_id character varying(36) NOT NULL,
    id character varying(36) NOT NULL
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- TOC entry 397 (class 1259 OID 26551)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    id character varying(36) NOT NULL,
    name character varying(100) NOT NULL,
    image_url character varying(500)
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 398 (class 1259 OID 26560)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id character varying(36) NOT NULL,
    membership_id character varying(36) NOT NULL
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 399 (class 1259 OID 26565)
-- Name: export_log_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.export_log_items (
    quantity integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    export_log_id character varying(36) NOT NULL,
    id character varying(36) NOT NULL,
    product_variant_id character varying(36) NOT NULL
);


ALTER TABLE public.export_log_items OWNER TO postgres;

--
-- TOC entry 400 (class 1259 OID 26570)
-- Name: export_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.export_logs (
    created_at timestamp(6) without time zone NOT NULL,
    exported_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    status character varying(30) NOT NULL,
    id character varying(36) NOT NULL,
    performed_by character varying(120) NOT NULL,
    reason text,
    CONSTRAINT export_logs_status_check CHECK (((status)::text = ANY ((ARRAY['SUCCESS'::character varying, 'FAILURE'::character varying, 'PENDING'::character varying])::text[])))
);


ALTER TABLE public.export_logs OWNER TO postgres;

--
-- TOC entry 401 (class 1259 OID 26578)
-- Name: favorite_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorite_products (
    created_at timestamp(6) without time zone NOT NULL,
    subscribed_at timestamp(6) without time zone NOT NULL,
    unsubscribed_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone NOT NULL,
    status character varying(30) NOT NULL,
    customer_id character varying(36) NOT NULL,
    id character varying(36) NOT NULL,
    product_variant_id character varying(36) NOT NULL,
    CONSTRAINT favorite_products_status_check CHECK (((status)::text = ANY ((ARRAY['SUBSCRIBED'::character varying, 'UNSUBSCRIBED'::character varying])::text[])))
);


ALTER TABLE public.favorite_products OWNER TO postgres;

--
-- TOC entry 402 (class 1259 OID 26586)
-- Name: import_log_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.import_log_items (
    import_price numeric(38,2) NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    id character varying(36) NOT NULL,
    import_log_id character varying(36) NOT NULL,
    product_variant_id character varying(36) NOT NULL
);


ALTER TABLE public.import_log_items OWNER TO postgres;

--
-- TOC entry 403 (class 1259 OID 26591)
-- Name: import_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.import_logs (
    created_at timestamp(6) without time zone NOT NULL,
    imported_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    status character varying(30) NOT NULL,
    id character varying(36) NOT NULL,
    performed_by character varying(120) NOT NULL,
    note text,
    CONSTRAINT import_logs_status_check CHECK (((status)::text = ANY ((ARRAY['SUCCESS'::character varying, 'FAILURE'::character varying, 'PENDING'::character varying])::text[])))
);


ALTER TABLE public.import_logs OWNER TO postgres;

--
-- TOC entry 404 (class 1259 OID 26599)
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    discount_amount numeric(15,2) NOT NULL,
    final_amount numeric(15,2) NOT NULL,
    original_amount numeric(15,2) NOT NULL,
    vat_amount numeric(15,2) NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    issued_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    id character varying(36) NOT NULL,
    order_id character varying(36) NOT NULL
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- TOC entry 405 (class 1259 OID 26606)
-- Name: login_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_logs (
    created_at timestamp(6) without time zone NOT NULL,
    login_time timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    login_status character varying(30) NOT NULL,
    account_id character varying(36),
    id character varying(36) NOT NULL,
    role_name character varying(50),
    email character varying(150) NOT NULL,
    CONSTRAINT login_logs_login_status_check CHECK (((login_status)::text = ANY ((ARRAY['SUCCESS'::character varying, 'FAILED'::character varying])::text[])))
);


ALTER TABLE public.login_logs OWNER TO postgres;

--
-- TOC entry 406 (class 1259 OID 26612)
-- Name: managers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.managers (
    id character varying(36) NOT NULL
);


ALTER TABLE public.managers OWNER TO postgres;

--
-- TOC entry 407 (class 1259 OID 26617)
-- Name: membership_benefits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.membership_benefits (
    discount_percentage double precision NOT NULL,
    free_shipping boolean NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    id character varying(36) NOT NULL,
    description text
);


ALTER TABLE public.membership_benefits OWNER TO postgres;

--
-- TOC entry 408 (class 1259 OID 26624)
-- Name: memberships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.memberships (
    max_spending numeric(15,2),
    min_spending numeric(15,2),
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    tier character varying(30) NOT NULL,
    benefit_id character varying(36) NOT NULL,
    id character varying(36) NOT NULL,
    CONSTRAINT memberships_tier_check CHECK (((tier)::text = ANY ((ARRAY['STANDARD'::character varying, 'BRONZE'::character varying, 'SILVER'::character varying, 'GOLD'::character varying, 'DIAMOND'::character varying])::text[])))
);


ALTER TABLE public.memberships OWNER TO postgres;

--
-- TOC entry 409 (class 1259 OID 26634)
-- Name: notification_channels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_channels (
    channel character varying(20) NOT NULL,
    notification_id character varying(36) NOT NULL,
    CONSTRAINT notification_channels_channel_check CHECK (((channel)::text = ANY ((ARRAY['EMAIL'::character varying, 'WEB'::character varying])::text[])))
);


ALTER TABLE public.notification_channels OWNER TO postgres;

--
-- TOC entry 410 (class 1259 OID 26638)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    created_at timestamp(6) without time zone NOT NULL,
    read_at timestamp(6) without time zone,
    sent_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone NOT NULL,
    status character varying(30) NOT NULL,
    customer_id character varying(36),
    favorite_product_id character varying(36),
    id character varying(36) NOT NULL,
    type character varying(40) NOT NULL,
    title character varying(150) NOT NULL,
    message text,
    recipient_role character varying(30),
    CONSTRAINT notifications_status_check CHECK (((status)::text = ANY ((ARRAY['SUCCESS'::character varying, 'PENDING'::character varying, 'FAILURE'::character varying])::text[]))),
    CONSTRAINT notifications_type_check CHECK (((type)::text = ANY ((ARRAY['STOCK_CHANGE'::character varying, 'OUT_OF_STOCK'::character varying, 'RESTOCKED'::character varying, 'PRICE_UPDATE'::character varying, 'PROMOTION'::character varying])::text[])))
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 411 (class 1259 OID 26647)
-- Name: order_item_bundle_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_item_bundle_services (
    bundle_service_id character varying(36) NOT NULL,
    order_item_id character varying(36) NOT NULL
);


ALTER TABLE public.order_item_bundle_services OWNER TO postgres;

--
-- TOC entry 412 (class 1259 OID 26650)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    quantity integer NOT NULL,
    unit_price_at_order numeric(15,2) NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    id character varying(36) NOT NULL,
    order_id character varying(36) NOT NULL,
    product_variant_id character varying(36) NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 413 (class 1259 OID 26655)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    created_at timestamp(6) without time zone NOT NULL,
    order_date timestamp(6) without time zone NOT NULL,
    paid_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone NOT NULL,
    address_id character varying(36) NOT NULL,
    customer_id character varying(36) NOT NULL,
    id character varying(36) NOT NULL,
    selected_payment_method_id character varying(36) NOT NULL,
    order_status character varying(40) NOT NULL,
    promotion_id character varying(36),
    CONSTRAINT orders_order_status_check CHECK (((order_status)::text = ANY ((ARRAY['AWAITING_CONFIRMATION'::character varying, 'PROCESSING'::character varying, 'SHIPPING'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying, 'REFUNDED'::character varying])::text[])))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 414 (class 1259 OID 26661)
-- Name: payment_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_logs (
    amount numeric(15,2) NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    paid_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone NOT NULL,
    id character varying(36) NOT NULL,
    order_id character varying(36) NOT NULL,
    status character varying(40) NOT NULL,
    failure_reason text,
    CONSTRAINT payment_logs_status_check CHECK (((status)::text = ANY ((ARRAY['SUCCESS'::character varying, 'FAILED'::character varying, 'PENDING'::character varying, 'CANCELLED'::character varying, 'REFUNDED'::character varying])::text[])))
);


ALTER TABLE public.payment_logs OWNER TO postgres;

--
-- TOC entry 415 (class 1259 OID 26669)
-- Name: payment_methods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_methods (
    enabled boolean NOT NULL,
    max_amount numeric(15,2),
    service_fee numeric(15,2),
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    payment_type character varying(31) NOT NULL,
    id character varying(36) NOT NULL,
    merchant_id character varying(100),
    name character varying(100) NOT NULL,
    partner_code character varying(100),
    terminal_code character varying(100),
    endpoint_url character varying(500),
    notify_url character varying(500),
    return_url character varying(500),
    description text,
    hash_secret character varying(255),
    CONSTRAINT payment_methods_payment_type_check CHECK (((payment_type)::text = ANY ((ARRAY['COD'::character varying, 'MOMO'::character varying, 'VNPAY'::character varying])::text[])))
);


ALTER TABLE public.payment_methods OWNER TO postgres;

--
-- TOC entry 416 (class 1259 OID 26677)
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    id character varying(36) NOT NULL,
    product_id character varying(36) NOT NULL,
    name character varying(150),
    image_url character varying(500) NOT NULL
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- TOC entry 417 (class 1259 OID 26684)
-- Name: product_promotions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_promotions (
    product_id character varying(36) NOT NULL,
    promotion_id character varying(36) NOT NULL
);


ALTER TABLE public.product_promotions OWNER TO postgres;

--
-- TOC entry 418 (class 1259 OID 26687)
-- Name: product_variants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variants (
    price numeric(15,2),
    ram_gb integer,
    storage_gb integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    status character varying(30) NOT NULL,
    id character varying(36) NOT NULL,
    product_id character varying(36) NOT NULL,
    color character varying(80),
    CONSTRAINT product_variants_status_check CHECK (((status)::text = ANY ((ARRAY['AVAILABLE'::character varying, 'EXPORTED'::character varying])::text[])))
);


ALTER TABLE public.product_variants OWNER TO postgres;

--
-- TOC entry 419 (class 1259 OID 26693)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    battery_capacity integer,
    nfc_supported boolean,
    screen_size double precision,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    brand_id character varying(36) NOT NULL,
    category_id character varying(36) NOT NULL,
    id character varying(36) NOT NULL,
    sim_type character varying(100),
    chipset character varying(120),
    operating_system character varying(120),
    screen_resolution character varying(120),
    name character varying(150) NOT NULL,
    description text,
    front_camera character varying(255),
    rear_camera character varying(255)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 420 (class 1259 OID 26700)
-- Name: promotions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotions (
    active boolean NOT NULL,
    discount_percent double precision NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    end_at timestamp(6) without time zone NOT NULL,
    start_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    id character varying(36) NOT NULL,
    code character varying(80) NOT NULL,
    name character varying(150) NOT NULL,
    discount_type character varying(30),
    CONSTRAINT promotions_discount_type_check CHECK (((discount_type)::text = ANY ((ARRAY['PERCENTAGE'::character varying, 'FIXED_AMOUNT'::character varying, 'FREE_SHIPPING'::character varying])::text[])))
);


ALTER TABLE public.promotions OWNER TO postgres;

--
-- TOC entry 421 (class 1259 OID 26707)
-- Name: purchase_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order_items (
    quantity integer NOT NULL,
    unit_price numeric(15,2) NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    id character varying(36) NOT NULL,
    product_variant_id character varying(36) NOT NULL,
    purchase_order_id character varying(36) NOT NULL,
    color character varying(80),
    ram_gb integer,
    storage_gb integer
);


ALTER TABLE public.purchase_order_items OWNER TO postgres;

--
-- TOC entry 422 (class 1259 OID 26712)
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_orders (
    order_date date,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    status character varying(30) NOT NULL,
    id character varying(36) NOT NULL,
    supplier_id character varying(36) NOT NULL,
    notes text,
    CONSTRAINT purchase_orders_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'SHIPPING'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying])::text[])))
);


ALTER TABLE public.purchase_orders OWNER TO postgres;

--
-- TOC entry 423 (class 1259 OID 26720)
-- Name: receipts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receipts (
    created_at timestamp(6) without time zone NOT NULL,
    issued_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    export_log_id character varying(36) NOT NULL,
    id character varying(36) NOT NULL,
    file_url character varying(500)
);


ALTER TABLE public.receipts OWNER TO postgres;

--
-- TOC entry 424 (class 1259 OID 26729)
-- Name: staffs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staffs (
    hire_date date,
    id character varying(36) NOT NULL,
    staff_code character varying(40) NOT NULL
);


ALTER TABLE public.staffs OWNER TO postgres;

--
-- TOC entry 425 (class 1259 OID 26736)
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    phone character varying(20),
    id character varying(36) NOT NULL,
    address character varying(255),
    email character varying(255),
    name character varying(255) NOT NULL,
    tax_code character varying(255) NOT NULL
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- TOC entry 426 (class 1259 OID 26749)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    phone character varying(20),
    id character varying(36) NOT NULL,
    full_name character varying(120) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 381 (class 1259 OID 17333)
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- TOC entry 375 (class 1259 OID 17170)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- TOC entry 378 (class 1259 OID 17193)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    selected_columns text[],
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- TOC entry 377 (class 1259 OID 17192)
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 383 (class 1259 OID 17376)
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- TOC entry 4773 (class 0 OID 0)
-- Dependencies: 383
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 387 (class 1259 OID 17496)
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- TOC entry 388 (class 1259 OID 17509)
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- TOC entry 382 (class 1259 OID 17368)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- TOC entry 384 (class 1259 OID 17386)
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- TOC entry 4777 (class 0 OID 0)
-- Dependencies: 384
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 385 (class 1259 OID 17435)
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- TOC entry 386 (class 1259 OID 17449)
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- TOC entry 389 (class 1259 OID 17519)
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- TOC entry 3866 (class 2604 OID 16514)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 4512 (class 0 OID 16529)
-- Dependencies: 353
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- TOC entry 4529 (class 0 OID 17084)
-- Dependencies: 372
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at, custom_claims_allowlist) FROM stdin;
\.


--
-- TOC entry 4523 (class 0 OID 16889)
-- Dependencies: 366
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- TOC entry 4514 (class 0 OID 16686)
-- Dependencies: 357
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- TOC entry 4511 (class 0 OID 16522)
-- Dependencies: 352
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4518 (class 0 OID 16776)
-- Dependencies: 361
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- TOC entry 4517 (class 0 OID 16764)
-- Dependencies: 360
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- TOC entry 4516 (class 0 OID 16751)
-- Dependencies: 359
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- TOC entry 4526 (class 0 OID 17001)
-- Dependencies: 369
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- TOC entry 4528 (class 0 OID 17074)
-- Dependencies: 371
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- TOC entry 4525 (class 0 OID 16971)
-- Dependencies: 368
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- TOC entry 4527 (class 0 OID 17034)
-- Dependencies: 370
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- TOC entry 4524 (class 0 OID 16939)
-- Dependencies: 367
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4510 (class 0 OID 16511)
-- Dependencies: 351
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- TOC entry 4521 (class 0 OID 16818)
-- Dependencies: 364
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- TOC entry 4522 (class 0 OID 16836)
-- Dependencies: 365
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- TOC entry 4513 (class 0 OID 16537)
-- Dependencies: 354
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
20260625000000
\.


--
-- TOC entry 4515 (class 0 OID 16716)
-- Dependencies: 358
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
\.


--
-- TOC entry 4520 (class 0 OID 16803)
-- Dependencies: 363
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4519 (class 0 OID 16794)
-- Dependencies: 362
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- TOC entry 4508 (class 0 OID 16499)
-- Dependencies: 349
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- TOC entry 4531 (class 0 OID 17149)
-- Dependencies: 374
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- TOC entry 4530 (class 0 OID 17126)
-- Dependencies: 373
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- TOC entry 4543 (class 0 OID 26500)
-- Dependencies: 390
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (created_at, updated_at, status, id, user_id, email, password) FROM stdin;
2026-06-30 00:47:05.717615	2026-06-30 00:47:05.717615	ACTIVE	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	ceedbc85-ac09-4978-a28a-5fd2b6936227	manager@techstore.com	$2a$10$IvEC/p12zDfT.KB/PzTdYuEv0T/NVcMPCrBA/BzpJrCmKKrXEzyni
2026-06-30 00:47:05.718614	2026-06-30 00:47:05.718614	ACTIVE	5fe8f461-380a-4743-8aaf-00b91959bd52	907793ba-04cc-4c51-a9cb-e73fbc077634	staff1@techstore.com	$2a$10$IvEC/p12zDfT.KB/PzTdYuEv0T/NVcMPCrBA/BzpJrCmKKrXEzyni
2026-06-30 00:47:05.719615	2026-06-30 00:47:05.719615	ACTIVE	4443d0ac-4da5-4a49-bf56-81d0356152eb	aa709650-7926-435d-919d-5453991002b8	staff2@techstore.com	$2a$10$IvEC/p12zDfT.KB/PzTdYuEv0T/NVcMPCrBA/BzpJrCmKKrXEzyni
2026-06-30 00:47:05.720614	2026-06-30 00:47:05.720614	ACTIVE	d962a654-3908-4d78-a0ec-9db37ed585fd	c7152be7-a711-4734-8a83-cd5ec04b1a12	customer1@techstore.com	$2a$10$IvEC/p12zDfT.KB/PzTdYuEv0T/NVcMPCrBA/BzpJrCmKKrXEzyni
2026-06-30 00:47:05.720614	2026-06-30 00:47:05.720614	ACTIVE	ec87c4a3-baed-459c-9ef6-e11d6c15317b	f3e638ab-16bc-43a3-926f-fd53766f3eee	customer2@techstore.com	$2a$10$IvEC/p12zDfT.KB/PzTdYuEv0T/NVcMPCrBA/BzpJrCmKKrXEzyni
2026-07-02 01:02:25.001886	2026-07-02 01:02:25.001886	ACTIVE	67b2b36f-6d63-4346-b9b5-049d81a94e44	128bf675-5c4c-4d00-8a38-95807f822bea	lomuto@gmail.com	$2a$10$UvkrzEnwtF4y341uqdgdWu3jz5SXkuy1BHnvt0PeSozw52B/mLfbO
2026-07-02 09:53:42.938657	2026-07-02 09:53:42.938657	ACTIVE	e58a9069-bbcb-43f5-b194-45e87378a03f	ee205fce-09e4-406a-a9e4-9326786828a3	repro-test-403@example.com	$2a$10$8nhAXRQJgXkiVgITVENPV.nTiQzcKryAXIqonKxrnmp4VJQeD10v.
\.


--
-- TOC entry 4544 (class 0 OID 26512)
-- Dependencies: 391
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (created_at, updated_at, id, user_id, district, province, ward, street) FROM stdin;
2026-06-30 00:47:05.716613	2026-06-30 00:47:05.716613	b654a38b-3822-40de-9d6a-d1d7f2beccb0	ceedbc85-ac09-4978-a28a-5fd2b6936227	Quận 5	Hồ Chí Minh	Phường 2	123 Nguyễn Trãi
2026-06-30 00:47:05.718614	2026-06-30 00:47:05.718614	20aca115-988f-4f17-9146-701c216959e5	907793ba-04cc-4c51-a9cb-e73fbc077634	Quận 1	Hồ Chí Minh	Bến Nghé	456 Lê Lợi
2026-06-30 00:47:05.719615	2026-06-30 00:47:05.719615	19ca1ba4-5393-46e9-8c98-c42899108f1a	aa709650-7926-435d-919d-5453991002b8	Quận 3	Hồ Chí Minh	Phường 11	789 CMT8
2026-06-30 00:47:05.720614	2026-06-30 00:47:05.720614	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	Quận 1	Hồ Chí Minh	Bến Thành	101 Lý Tự Trọng
2026-06-30 00:47:05.720614	2026-06-30 00:47:05.720614	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	Quận 3	Hồ Chí Minh	Phường 6	202 Hai Bà Trưng
2026-07-02 10:40:40.787332	2026-07-02 10:40:40.787332	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 10:44:24.163383	2026-07-02 10:44:24.163383	f0425761-4e5b-4eb2-8a91-153c1b7d57be	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 10:45:24.137258	2026-07-02 10:45:24.137258	d6af25d6-f371-4cbc-ac44-a0d3b78d457a	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 10:47:37.385061	2026-07-02 10:47:37.385061	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	Hóc Môn	TP. Hồ Chí Minh	Xã Trung Chánh	57a
2026-07-02 10:47:49.95111	2026-07-02 10:47:49.95111	a56d64b3-d2a3-4e4b-ae82-ed1e51a4ef3c	128bf675-5c4c-4d00-8a38-95807f822bea	Hóc Môn	TP. Hồ Chí Minh	Xã Trung Chánh	57a
2026-07-02 10:48:12.917244	2026-07-02 10:48:12.917244	c4183d6e-6427-4ab2-abb5-dbc1b17dab8e	128bf675-5c4c-4d00-8a38-95807f822bea	Hóc Môn	TP. Hồ Chí Minh	Xã Trung Chánh	57a
2026-07-02 10:53:11.191969	2026-07-02 10:53:11.191969	a40479c3-5cdd-4924-a89e-22d9a7d49324	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 11:19:19.202453	2026-07-02 11:19:19.202453	e36006e1-ad76-42a2-bf10-292b68ef2db5	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 11:21:33.463731	2026-07-02 11:21:33.463731	e2b5b6e9-642a-409d-abda-0b4f884864c3	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 11:21:44.142251	2026-07-02 11:21:44.142251	787bf99b-4e6a-4831-95d5-4d73cb1215e2	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 11:21:54.441872	2026-07-02 11:21:54.441872	c2c7b393-c9f4-4f9c-8e18-3e9523587e8d	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 11:22:04.715224	2026-07-02 11:22:04.715224	a7e261a6-5c10-4b41-9cb0-abc73dac3313	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 11:22:15.059159	2026-07-02 11:22:15.059159	b08344e1-f3ef-401c-8d4c-d69e19b05e77	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 11:31:58.124164	2026-07-02 11:31:58.124164	05972ef6-5fbf-4b8b-961d-9f278cd31a20	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 11:36:45.297042	2026-07-02 11:36:45.297042	968f4b41-ff24-46ce-a4c7-fa900d54b649	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 11:37:45.668426	2026-07-02 11:37:45.668426	cef5f68a-a7a3-44d1-bc10-76270dfa16bb	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 11:44:19.914734	2026-07-02 11:44:19.914734	ba6e92a9-fc9e-4526-a476-96c07bb16038	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 11:45:07.85421	2026-07-02 11:45:07.85421	a67588fb-e79a-4cf6-9c8a-021dee4138c0	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 12:13:36.324524	2026-07-02 12:13:36.324524	6d63f070-9dcc-44da-989b-f3f660fabf1a	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 12:36:41.899388	2026-07-02 12:36:41.899388	ec3c2f64-3c8d-4079-b18b-3f762041bf4b	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 12:45:17.426511	2026-07-02 12:45:17.426511	1118d0a8-d91d-4f26-a63c-51d582be3e27	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 12:47:05.809928	2026-07-02 12:47:05.809928	a9b7364a-f657-4f25-92a3-3fddd423718a	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 12:51:30.524602	2026-07-02 12:51:30.524602	2d112ff2-1170-4b95-b0d4-e3f42dd79459	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 12:52:24.703781	2026-07-02 12:52:24.703781	123a66de-1c35-4aaa-9ece-628056e77270	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
2026-07-02 12:52:49.314655	2026-07-02 12:52:49.314655	38afd242-a775-477d-9bbe-3e1c17ab9928	ee205fce-09e4-406a-a9e4-9326786828a3	District 1	HCMC	Ward 1	123 Test St
\.


--
-- TOC entry 4545 (class 0 OID 26519)
-- Dependencies: 392
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands (created_at, updated_at, id, name, logo_url, description) FROM stdin;
2026-06-30 00:47:05.638141	2026-06-30 00:47:05.638141	fecb7dae-6dcb-40b2-b779-4b614c4612fb	Apple	https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg	Apple Inc. - Cung cấp iPhone, iPad, Mac và các thiết bị phần cứng cao cấp.
2026-06-30 00:47:05.638668	2026-06-30 00:47:05.638668	c667ffba-5878-4cb5-88f7-87c731550e6b	Samsung	https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg	Samsung Electronics - Tập đoàn công nghệ hàng đầu thế giới về điện thoại thông minh Galaxy.
2026-06-30 00:47:05.638668	2026-06-30 00:47:05.638668	0fd024a5-0352-4e59-8540-f669d5072fd3	Xiaomi	https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg	Xiaomi - Thương hiệu điện thoại thông minh cấu hình cao giá tốt hàng đầu Trung Quốc.
2026-06-30 00:47:05.639255	2026-06-30 00:47:05.639255	c14584d1-12db-4336-89cf-c142ba27a7e2	OPPO	https://upload.wikimedia.org/wikipedia/commons/e/eb/OPPO_Logo.svg	OPPO - Chuyên gia selfie và dẫn đầu công nghệ sạc nhanh SuperVOOC.
2026-06-30 00:47:05.639255	2026-06-30 00:47:05.639255	b58afc93-3321-40d5-baf5-2e4ea4ec6c79	Vivo	https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_logo.svg	Vivo - Hãng điện thoại chụp hình đỉnh cao hợp tác cùng ZEISS.
2026-06-30 00:47:05.639255	2026-06-30 00:47:05.639255	968ad15c-1cef-4445-ac68-b7cbfcf51d60	OnePlus	https://upload.wikimedia.org/wikipedia/commons/2/2c/OnePlus_logo.svg	OnePlus - Flagship killer nổi tiếng với hiệu suất siêu nhanh và mượt mà.
2026-06-30 00:47:05.63978	2026-06-30 00:47:05.63978	30826b38-2ac0-4f43-8be0-ef34fdf00603	Realme	https://upload.wikimedia.org/wikipedia/commons/1/1a/Realme_logo.svg	Realme - Thương hiệu điện thoại dành cho giới trẻ năng động.
2026-06-30 00:47:05.63978	2026-06-30 00:47:05.63978	6ea2e415-7499-45f6-aab9-7ab30c9042f0	Asus	https://upload.wikimedia.org/wikipedia/commons/d/de/Asus_Logo.svg	Asus - Nổi tiếng với dòng ROG Phone chuyên game đỉnh nhất thị trường.
\.


--
-- TOC entry 4546 (class 0 OID 26528)
-- Dependencies: 393
-- Data for Name: bundle_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bundle_services (active, duration_months, price, created_at, updated_at, id, type, name, description) FROM stdin;
t	12	1290000.00	2026-07-02 08:45:52.207326	2026-07-02 08:45:52.207326	441ded6b-5a61-4492-bd48-8fb0ccda0f54	WARRANTY	Bảo hành VIP 12 tháng	Gói bảo hành vàng toàn diện 12 tháng
t	6	690000.00	2026-07-02 08:45:52.210324	2026-07-02 08:45:52.210324	b8d3dd1e-6fbc-4e9d-acb1-844b4015cbff	SCREEN_PROTECTION	Bảo hiểm rơi vỡ màn hình 6 tháng	Bảo hiểm rơi vỡ, nứt màn hình trong vòng 6 tháng
\.


--
-- TOC entry 4547 (class 0 OID 26536)
-- Dependencies: 394
-- Data for Name: cart_item_bundle_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_item_bundle_services (bundle_service_id, cart_item_id) FROM stdin;
\.


--
-- TOC entry 4548 (class 0 OID 26539)
-- Dependencies: 395
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (quantity, created_at, updated_at, cart_id, id, product_variant_id) FROM stdin;
1	2026-07-02 09:47:55.093203	2026-07-02 09:47:55.093203	2da11d2e-f71a-4318-a1df-669511f1ca37	58ec887b-4faa-4c85-a152-26474ce46ba8	123
\.


--
-- TOC entry 4549 (class 0 OID 26544)
-- Dependencies: 396
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (created_at, updated_at, customer_id, id) FROM stdin;
2026-07-02 01:02:24.568788	2026-07-02 01:02:24.568788	128bf675-5c4c-4d00-8a38-95807f822bea	8aa50a2b-8853-4974-9a38-c3801fc05570
2026-07-02 09:47:54.96042	2026-07-02 09:47:55.257005	c7152be7-a711-4734-8a83-cd5ec04b1a12	2da11d2e-f71a-4318-a1df-669511f1ca37
2026-07-02 09:53:42.700289	2026-07-02 09:53:42.700289	ee205fce-09e4-406a-a9e4-9326786828a3	ecb85785-59d4-490c-9657-232b6bc8ec33
\.


--
-- TOC entry 4550 (class 0 OID 26551)
-- Dependencies: 397
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (created_at, updated_at, id, name, image_url) FROM stdin;
2026-06-30 00:47:05.64032	2026-06-30 00:47:05.64032	fbcdae8c-e376-4667-96ab-8d6063e338d7	Điện thoại	https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300
\.


--
-- TOC entry 4551 (class 0 OID 26560)
-- Dependencies: 398
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, membership_id) FROM stdin;
128bf675-5c4c-4d00-8a38-95807f822bea	a52894b4-4284-49db-a3b8-62403ef6982e
c7152be7-a711-4734-8a83-cd5ec04b1a12	a4edcb55-76e0-49ec-b9d0-b79c42282518
f3e638ab-16bc-43a3-926f-fd53766f3eee	a52894b4-4284-49db-a3b8-62403ef6982e
ee205fce-09e4-406a-a9e4-9326786828a3	a52894b4-4284-49db-a3b8-62403ef6982e
\.


--
-- TOC entry 4552 (class 0 OID 26565)
-- Dependencies: 399
-- Data for Name: export_log_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.export_log_items (quantity, created_at, updated_at, export_log_id, id, product_variant_id) FROM stdin;
1	2026-06-30 12:04:20.056515	2026-06-30 12:04:20.056515	a5a083a1-2e75-4d37-a0e9-009f29fafb78	fc60018b-26fd-4929-9e50-28859490b39d	ff408fd3-4761-440f-bf52-47b6eb794f7b
1	2026-06-30 12:04:20.056515	2026-06-30 12:04:20.056515	a5a083a1-2e75-4d37-a0e9-009f29fafb78	e3a70038-0163-4a55-a2a8-7a60ea9da4f6	4eb16148-26cf-4401-859b-a39baf91ae35
1	2026-06-30 13:30:31.327984	2026-06-30 13:30:31.327984	fcb07639-3c95-4b98-85ce-4d298849ab0b	a0dabaee-bbd1-49df-92b7-15024e88d020	5781d588-66ae-49f6-b04f-dfbe9b711b18
1	2026-06-30 13:30:31.327984	2026-06-30 13:30:31.327984	fcb07639-3c95-4b98-85ce-4d298849ab0b	d96b6f32-10b3-4d9f-94ee-69b01d2efcc4	ec40a5e5-d065-4553-b52d-92e18fd19a96
1	2026-06-30 13:30:31.327984	2026-06-30 13:30:31.327984	fcb07639-3c95-4b98-85ce-4d298849ab0b	7b911803-cd97-4685-a128-25f795478a15	070dfd66-6523-4778-b431-0a7736831b71
1	2026-06-30 13:30:31.327984	2026-06-30 13:30:31.327984	fcb07639-3c95-4b98-85ce-4d298849ab0b	82acff27-889a-4125-9baf-92d16660c0e9	2d84f3ee-6196-41d4-8cf0-7da86c5302bc
1	2026-07-02 01:43:29.99885	2026-07-02 01:43:29.99885	07d90a42-b56d-44d2-a504-9138d9e5ecde	1c75497e-d142-4e53-affa-1061495d279a	26e845de-e23c-499e-ab22-9241fff150d0
\.


--
-- TOC entry 4553 (class 0 OID 26570)
-- Dependencies: 400
-- Data for Name: export_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.export_logs (created_at, exported_at, updated_at, status, id, performed_by, reason) FROM stdin;
2026-06-30 12:04:20.053556	2026-06-30 12:04:20.053556	2026-06-30 12:04:20.053556	SUCCESS	a5a083a1-2e75-4d37-a0e9-009f29fafb78	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
2026-06-30 13:30:31.327984	2026-06-30 13:30:31.327984	2026-06-30 13:30:31.327984	SUCCESS	fcb07639-3c95-4b98-85ce-4d298849ab0b	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
2026-06-30 22:14:52.596065	2026-06-30 22:14:52.596065	2026-06-30 22:14:52.596065	SUCCESS	765dcf84-59dd-43bd-bf34-6a929b40abee	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
2026-07-02 01:29:45.720436	2026-07-02 01:29:45.720436	2026-07-02 01:29:45.720436	SUCCESS	59df7669-1143-4588-86d5-db314963381c	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
2026-07-02 01:32:29.317585	2026-07-02 01:32:29.317585	2026-07-02 01:32:29.317585	SUCCESS	4e42611d-b29f-465b-80f5-fbd3c4e0aa0c	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
2026-07-02 01:39:31.165631	2026-07-02 01:39:31.165631	2026-07-02 01:39:31.165631	SUCCESS	3cf9eb11-fdae-4475-ab76-fcaacab1f298	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
2026-07-02 01:43:29.997851	2026-07-02 01:43:29.997851	2026-07-02 01:43:29.997851	SUCCESS	07d90a42-b56d-44d2-a504-9138d9e5ecde	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
2026-07-02 01:56:57.596489	2026-07-02 01:56:57.596489	2026-07-02 01:56:57.596489	SUCCESS	665b2c8b-de0e-48aa-ab3b-fd4d5ac22a26	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
\.


--
-- TOC entry 4554 (class 0 OID 26578)
-- Dependencies: 401
-- Data for Name: favorite_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorite_products (created_at, subscribed_at, unsubscribed_at, updated_at, status, customer_id, id, product_variant_id) FROM stdin;
2026-07-02 01:27:24.822635	2026-07-02 01:27:34.403904	\N	2026-07-02 01:27:34.563153	SUBSCRIBED	c7152be7-a711-4734-8a83-cd5ec04b1a12	51a71d30-a4b1-4718-bd69-085d137bd357	26e845de-e23c-499e-ab22-9241fff150d0
2026-07-02 01:32:10.61591	2026-07-02 01:54:30.233776	\N	2026-07-02 02:37:01.113323	SUBSCRIBED	c7152be7-a711-4734-8a83-cd5ec04b1a12	577509e9-9c8c-4b54-9cae-ae25bda123ec	1234
2026-07-02 08:35:13.424317	2026-07-02 08:35:13.424317	\N	2026-07-02 08:35:13.424317	SUBSCRIBED	128bf675-5c4c-4d00-8a38-95807f822bea	84cc4fcc-5671-4d4b-a775-ff813e8ff7a2	49f0b8d8-537b-4292-acec-debb639cb5c7
\.


--
-- TOC entry 4555 (class 0 OID 26586)
-- Dependencies: 402
-- Data for Name: import_log_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.import_log_items (import_price, quantity, created_at, updated_at, id, import_log_id, product_variant_id) FROM stdin;
15000000.00	1	2026-07-02 02:25:20.010495	2026-07-02 02:25:20.010495	50e1e8e5-8a9c-48cb-9b09-ca48df99af3a	a52133d0-cfd4-495c-9fe5-c26af46752b1	1234
14000000.00	1	2026-07-02 02:41:35.451041	2026-07-02 02:41:35.451041	fc6073ce-aed8-49af-9223-a85e460cb4d4	1a3f1c83-495d-411a-abab-a83a07483eb2	123
\.


--
-- TOC entry 4556 (class 0 OID 26591)
-- Dependencies: 403
-- Data for Name: import_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.import_logs (created_at, imported_at, updated_at, status, id, performed_by, note) FROM stdin;
2026-06-30 11:45:41.727897	2026-06-30 11:45:41.727897	2026-06-30 11:45:41.727897	SUCCESS	c3be2f73-c2f6-4ca2-a692-b4c467cbd074	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
2026-06-30 13:08:49.22574	2026-06-30 13:08:49.22574	2026-06-30 13:08:49.22574	SUCCESS	2cfef134-3c82-48a8-adb0-12c0399032e7	ceedbc85-ac09-4978-a28a-5fd2b6936227	Nhập hàng từ nhà cung cấp test1
2026-06-30 13:29:53.392991	2026-06-30 13:29:53.392991	2026-06-30 13:29:53.392991	SUCCESS	20317ce3-f954-42a6-b8e5-07e8aaaa2d1a	ceedbc85-ac09-4978-a28a-5fd2b6936227	Nhập hàng từ nhà cung cấp test1. test
2026-06-30 13:30:12.90732	2026-06-30 13:30:12.90732	2026-06-30 13:30:12.90732	SUCCESS	b3aa0270-57bd-422b-bff9-31f9918807cc	ceedbc85-ac09-4978-a28a-5fd2b6936227	Nhập hàng từ nhà cung cấp test1. test
2026-06-30 22:14:43.871399	2026-06-30 22:14:43.871399	2026-06-30 22:14:43.871399	SUCCESS	59751076-bef5-4cde-8899-969f1bb45ed2	ceedbc85-ac09-4978-a28a-5fd2b6936227	Nhập hàng từ nhà cung cấp test1
2026-07-02 01:32:00.2842	2026-07-02 01:32:00.286214	2026-07-02 01:32:00.2842	SUCCESS	4ecb344f-cf50-47a1-aa79-4e1ba5579435	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
2026-07-02 01:34:39.358367	2026-07-02 01:34:39.358367	2026-07-02 01:34:39.358367	SUCCESS	61e3a187-377f-4f06-ba65-45b1d1ddf9b6	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
2026-07-02 01:56:19.679374	2026-07-02 01:56:19.679374	2026-07-02 01:56:19.679374	SUCCESS	d002b8a2-7375-4310-8265-f46546f7c4df	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
2026-07-02 02:05:27.810555	2026-07-02 02:05:27.810555	2026-07-02 02:05:27.810555	SUCCESS	99c127e8-b9e5-4b72-b916-c596fe2ccd0c	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
2026-07-02 02:25:20.010495	2026-07-02 02:25:20.010495	2026-07-02 02:25:20.010495	SUCCESS	a52133d0-cfd4-495c-9fe5-c26af46752b1	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
2026-07-02 02:41:35.451041	2026-07-02 02:41:35.451041	2026-07-02 02:41:35.451041	SUCCESS	1a3f1c83-495d-411a-abab-a83a07483eb2	ceedbc85-ac09-4978-a28a-5fd2b6936227	\N
\.


--
-- TOC entry 4557 (class 0 OID 26599)
-- Dependencies: 404
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (discount_amount, final_amount, original_amount, vat_amount, created_at, issued_at, updated_at, id, order_id) FROM stdin;
0.00	28990000.00	28990000.00	0.00	2026-07-02 12:51:36.867972	2026-07-02 12:51:36.867972	2026-07-02 12:51:36.867972	4d60e10e-8181-4a37-ae65-d8d1b4af7963	18b6fb95-5047-40dc-b2c6-baf73303925b
0.00	14000000.00	14000000.00	0.00	2026-07-02 12:52:53.397128	2026-07-02 12:52:53.397128	2026-07-02 12:52:53.397128	d87c549d-d6ae-49a3-ae5d-d9280e77fe0e	6eecec2d-6b5f-4f72-81c3-a80335b6f247
0.00	27280000.00	27280000.00	0.00	2026-07-02 12:56:52.919261	2026-07-02 12:56:52.919261	2026-07-02 12:56:52.919261	8829c503-02d8-4fb9-b565-8a327372c3c0	5836eda6-bf83-4e11-921c-fc1c23e1e913
\.


--
-- TOC entry 4558 (class 0 OID 26606)
-- Dependencies: 405
-- Data for Name: login_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_logs (created_at, login_time, updated_at, login_status, account_id, id, role_name, email) FROM stdin;
2026-06-30 00:47:31.116939	2026-06-30 00:47:31.113942	2026-06-30 00:47:31.116939	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	5ee6baed-1dcf-4621-ae24-ef0b292f6c2d	MANAGER	manager@techstore.com
2026-06-30 11:10:34.188261	2026-06-30 11:10:34.177152	2026-06-30 11:10:34.188261	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	2913b5ed-3c18-4232-bfb4-c211a25b90a8	MANAGER	manager@techstore.com
2026-06-30 11:45:19.049035	2026-06-30 11:45:19.043032	2026-06-30 11:45:19.049035	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	b23fb3e6-97f1-4d5b-b4a6-ccb6aa278518	MANAGER	manager@techstore.com
2026-06-30 11:47:54.309629	2026-06-30 11:47:54.30863	2026-06-30 11:47:54.309629	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	4af2496a-fd05-4ea2-b381-8501f6b127fc	MANAGER	manager@techstore.com
2026-06-30 11:48:23.161667	2026-06-30 11:48:23.160666	2026-06-30 11:48:23.161667	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	e8e69690-67d5-4995-962b-be203f19e549	MANAGER	manager@techstore.com
2026-06-30 11:50:10.274282	2026-06-30 11:50:10.259216	2026-06-30 11:50:10.274282	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	ebc64456-ff4e-43e5-b907-17eb07c4209d	MANAGER	manager@techstore.com
2026-06-30 11:55:02.886927	2026-06-30 11:55:02.885924	2026-06-30 11:55:02.886927	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	347c4682-316f-47cc-9f0d-fdc3c36ee4c8	MANAGER	manager@techstore.com
2026-06-30 11:58:49.187416	2026-06-30 11:58:49.186423	2026-06-30 11:58:49.187416	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	6853db38-4ece-463c-af87-57caf3b103f2	MANAGER	manager@techstore.com
2026-06-30 12:00:40.85249	2026-06-30 12:00:40.85249	2026-06-30 12:00:40.85249	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	bc79a9f7-742d-458a-a5dc-5dc12ac86312	MANAGER	manager@techstore.com
2026-06-30 12:00:41.073347	2026-06-30 12:00:41.067309	2026-06-30 12:00:41.073347	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	941f4e8e-5ca0-4f94-9503-4254ccfdc4ad	MANAGER	manager@techstore.com
2026-06-30 12:01:52.838712	2026-06-30 12:01:52.838712	2026-06-30 12:01:52.838712	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	3c5d17a9-0a65-4e4a-b71a-2e8d359fd210	MANAGER	manager@techstore.com
2026-06-30 12:56:42.718929	2026-06-30 12:56:42.716923	2026-06-30 12:56:42.718929	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	df737c4d-779d-44ef-b8b7-366a8cec67de	MANAGER	manager@techstore.com
2026-06-30 13:07:59.66444	2026-06-30 13:07:59.66444	2026-06-30 13:07:59.66444	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	e91be6d2-7e4d-404f-aa74-f9c5ce6ca8da	MANAGER	manager@techstore.com
2026-06-30 13:29:10.422449	2026-06-30 13:29:10.422449	2026-06-30 13:29:10.422449	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	0e8967d3-2003-4f06-ae87-eb3aae3e4178	MANAGER	manager@techstore.com
2026-06-30 13:31:45.08958	2026-06-30 13:31:45.08958	2026-06-30 13:31:45.08958	FAILED	\N	105157e9-04bb-4a7b-b99e-5e6a0f2cc241	\N	customer@techstore.com
2026-06-30 13:31:55.372557	2026-06-30 13:31:55.371568	2026-06-30 13:31:55.372557	FAILED	\N	9a1cd81f-d19d-4f94-9ec6-89afbcb543ed	\N	staff@techstore.com
2026-06-30 13:32:01.167643	2026-06-30 13:32:01.167643	2026-06-30 13:32:01.167643	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	78dbb9ba-9076-4428-8a3e-6e4f7c200e72	MANAGER	manager@techstore.com
2026-06-30 13:33:42.739872	2026-06-30 13:33:42.739872	2026-06-30 13:33:42.739872	FAILED	\N	03eba96e-eb18-4be4-9128-c3f7a1e2e36b	\N	phuc@techstore.com
2026-06-30 13:33:48.800191	2026-06-30 13:33:48.800191	2026-06-30 13:33:48.800191	FAILED	\N	baeb10a1-472d-4dff-8797-96a353316028	\N	phuc@techstore.com
2026-06-30 13:33:54.413964	2026-06-30 13:33:54.413964	2026-06-30 13:33:54.413964	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	b284edaf-e37e-4af0-a6a2-4dbaddf993a4	MANAGER	manager@techstore.com
2026-06-30 13:34:21.680675	2026-06-30 13:34:21.679675	2026-06-30 13:34:21.680675	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	aab56ca3-99b6-4711-952c-76c80fff5590	CUSTOMER	customer1@techstore.com
2026-06-30 13:37:29.44235	2026-06-30 13:37:29.44235	2026-06-30 13:37:29.44235	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	56f0b25e-4d17-42c6-91e8-85a9b396197b	MANAGER	manager@techstore.com
2026-06-30 13:39:40.648692	2026-06-30 13:39:40.6457	2026-06-30 13:39:40.648692	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	8b28943b-557e-4903-8a91-01a94e99b73e	CUSTOMER	customer1@techstore.com
2026-06-30 13:44:15.003604	2026-06-30 13:44:15.003604	2026-06-30 13:44:15.003604	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	2517bc3e-6890-43ae-8337-521d2acf638b	MANAGER	manager@techstore.com
2026-06-30 22:13:48.073444	2026-06-30 22:13:48.068443	2026-06-30 22:13:48.073444	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	8d3e726b-6785-488e-bc6b-257fafd7d9d0	MANAGER	manager@techstore.com
2026-07-01 00:12:20.339919	2026-07-01 00:12:20.329532	2026-07-01 00:12:20.339919	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	2cc3e024-a537-4a09-a662-c3679e8c6024	MANAGER	manager@techstore.com
2026-07-01 21:53:29.524323	2026-07-01 21:53:29.521245	2026-07-01 21:53:29.524323	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	f85b425e-2e62-436a-abae-0e38f9d0b832	MANAGER	manager@techstore.com
2026-07-02 00:13:56.230217	2026-07-02 00:13:56.212472	2026-07-02 00:13:56.230217	FAILED	\N	1a65b0fb-80f4-40ef-9207-df9bc2386b0d	\N	lomuto@gmail.com
2026-07-02 01:02:27.18436	2026-07-02 01:02:27.181053	2026-07-02 01:02:27.18436	SUCCESS	67b2b36f-6d63-4346-b9b5-049d81a94e44	63460b82-d574-4c77-a148-a23a9ed26732	CUSTOMER	lomuto@gmail.com
2026-07-02 01:15:47.995927	2026-07-02 01:15:47.989289	2026-07-02 01:15:47.995927	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	c3b75d92-cadf-4f7b-a3c9-a4d1d1639102	MANAGER	manager@techstore.com
2026-07-02 01:16:24.31993	2026-07-02 01:16:24.31993	2026-07-02 01:16:24.31993	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	b367d838-67bb-4c33-84f3-dc9ae9c022d2	CUSTOMER	customer1@techstore.com
2026-07-02 01:28:36.864304	2026-07-02 01:28:36.864304	2026-07-02 01:28:36.864304	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	9ca5930f-03f8-471c-9967-b7ce1b238c13	MANAGER	manager@techstore.com
2026-07-02 01:36:13.111006	2026-07-02 01:36:13.111006	2026-07-02 01:36:13.111006	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	74e9a0b8-e973-4974-9248-babd48832a8e	CUSTOMER	customer1@techstore.com
2026-07-02 01:36:27.562099	2026-07-02 01:36:27.562099	2026-07-02 01:36:27.562099	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	248be552-71be-4e26-94d4-439de1d52c4b	CUSTOMER	customer1@techstore.com
2026-07-02 01:36:46.110382	2026-07-02 01:36:46.110382	2026-07-02 01:36:46.110382	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	f3c91c81-1fa2-483d-81a7-e3b0f81f1ed7	CUSTOMER	customer1@techstore.com
2026-07-02 01:37:16.655293	2026-07-02 01:37:16.654323	2026-07-02 01:37:16.655293	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	0673dcff-011e-4b7a-8d74-4d31a8d700a9	CUSTOMER	customer1@techstore.com
2026-07-02 01:38:35.888877	2026-07-02 01:38:35.882586	2026-07-02 01:38:35.888877	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	fac5e206-0eb9-43a6-9e97-5f17c9335a7d	CUSTOMER	customer1@techstore.com
2026-07-02 01:44:07.39273	2026-07-02 01:44:07.39273	2026-07-02 01:44:07.39273	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	ac87fdb3-0a18-4b5e-957d-60d49c17c3c2	CUSTOMER	customer1@techstore.com
2026-07-02 01:55:44.17617	2026-07-02 01:55:44.17617	2026-07-02 01:55:44.17617	FAILED	\N	dd45f0c4-bdbc-4402-8b6c-1694d2df050f	\N	manager01@crm.com
2026-07-02 01:55:46.391679	2026-07-02 01:55:46.391679	2026-07-02 01:55:46.391679	FAILED	\N	092928d1-e4aa-47d0-a5cd-1aaf1714747f	\N	manager01@crm.com
2026-07-02 01:55:47.592559	2026-07-02 01:55:47.576809	2026-07-02 01:55:47.592559	FAILED	\N	196b4589-257b-44b3-955e-a7f32ec36c52	\N	manager01@crm.com
2026-07-02 01:55:52.055959	2026-07-02 01:55:52.040283	2026-07-02 01:55:52.055959	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	d0fdfc37-10f4-4de5-9c28-bb4e645660d3	MANAGER	manager@techstore.com
2026-07-02 02:18:11.27452	2026-07-02 02:18:11.268659	2026-07-02 02:18:11.27452	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	19e2ed36-1f92-4e7e-8715-c91c823686e0	MANAGER	manager@techstore.com
2026-07-02 02:36:39.583489	2026-07-02 02:36:39.583489	2026-07-02 02:36:39.583489	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	7612e048-21f9-453a-a76d-e3acf3b245e7	CUSTOMER	customer1@techstore.com
2026-07-02 02:41:09.951622	2026-07-02 02:41:09.951622	2026-07-02 02:41:09.951622	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	abd90dd1-f057-4a15-9971-62751410bfe8	MANAGER	manager@techstore.com
2026-07-02 02:54:57.381257	2026-07-02 02:54:57.381257	2026-07-02 02:54:57.381257	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	832699cb-2261-4300-a914-27ca0f78d912	CUSTOMER	customer1@techstore.com
2026-07-02 03:09:46.451834	2026-07-02 03:09:46.447137	2026-07-02 03:09:46.451834	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	4936fae1-ecd7-49ed-9457-4fde846adf93	CUSTOMER	customer1@techstore.com
2026-07-02 03:11:34.257113	2026-07-02 03:11:34.257113	2026-07-02 03:11:34.257113	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	16c2d4f9-2325-43e9-b94a-1df4f907e808	MANAGER	manager@techstore.com
2026-07-02 03:27:39.797889	2026-07-02 03:27:39.796852	2026-07-02 03:27:39.797889	SUCCESS	ec87c4a3-baed-459c-9ef6-e11d6c15317b	a98f1d91-9e22-489d-8c66-5f85dd3e7e89	CUSTOMER	customer2@techstore.com
2026-07-02 08:21:21.611065	2026-07-02 08:21:21.594432	2026-07-02 08:21:21.611065	SUCCESS	67b2b36f-6d63-4346-b9b5-049d81a94e44	01d92a10-8cdc-4f8e-9ae3-ef9403a8a18c	CUSTOMER	lomuto@gmail.com
2026-07-02 09:17:13.815474	2026-07-02 09:17:13.812399	2026-07-02 09:17:13.815474	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	fccc037f-d3b7-403e-92fd-272c44cfaa77	MANAGER	manager@techstore.com
2026-07-02 09:16:31.168526	2026-07-02 09:16:31.102705	2026-07-02 09:16:31.168526	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	e32eea60-35ac-4a41-b9aa-bed1b567f38c	CUSTOMER	customer1@techstore.com
2026-07-02 09:22:45.665413	2026-07-02 09:22:45.665413	2026-07-02 09:22:45.665413	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	b63ff824-d915-4a0f-beaf-5ca11239ecc9	CUSTOMER	customer1@techstore.com
2026-07-02 09:23:32.14657	2026-07-02 09:23:32.135042	2026-07-02 09:23:32.14657	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	3ca6a3e5-bcea-464b-973e-04b81a83e920	CUSTOMER	customer1@techstore.com
2026-07-02 09:47:42.338306	2026-07-02 09:47:42.338306	2026-07-02 09:47:42.338306	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	c1841f2b-0130-4442-94cc-18d0811842c6	CUSTOMER	customer1@techstore.com
2026-07-02 09:54:58.78353	2026-07-02 09:54:58.778432	2026-07-02 09:54:58.78353	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	ef9b7a60-4318-4b16-9d9f-b3a50eba78fd	CUSTOMER	repro-test-403@example.com
2026-07-02 09:56:22.473802	2026-07-02 09:56:22.468912	2026-07-02 09:56:22.473802	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	3a8ef1c5-6053-4a04-9611-663c1f8a8a6d	CUSTOMER	repro-test-403@example.com
2026-07-02 09:57:54.81881	2026-07-02 09:57:54.817811	2026-07-02 09:57:54.81881	SUCCESS	d962a654-3908-4d78-a0ec-9db37ed585fd	34fd46ab-5d93-428f-8820-3fe276f4e3a3	CUSTOMER	customer1@techstore.com
2026-07-02 09:57:56.305991	2026-07-02 09:57:56.304983	2026-07-02 09:57:56.305991	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	4899565f-52fc-4890-8708-e509b1846af0	CUSTOMER	repro-test-403@example.com
2026-07-02 10:02:17.657975	2026-07-02 10:02:17.654986	2026-07-02 10:02:17.657975	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	ef1e243a-73e6-4b1b-9d6e-da3969cafd14	CUSTOMER	repro-test-403@example.com
2026-07-02 10:04:33.229534	2026-07-02 10:04:33.22853	2026-07-02 10:04:33.229534	SUCCESS	67b2b36f-6d63-4346-b9b5-049d81a94e44	a19c4541-c5cf-4a87-b9b1-6dd2b3fe11e3	CUSTOMER	lomuto@gmail.com
2026-07-02 10:10:39.189309	2026-07-02 10:10:39.178626	2026-07-02 10:10:39.189309	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	60d6ba71-2d36-46fd-a6b8-023dfffd71ba	CUSTOMER	repro-test-403@example.com
2026-07-02 10:13:18.23657	2026-07-02 10:13:18.231059	2026-07-02 10:13:18.23657	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	436312a7-0f31-462a-a646-82b5f861079b	CUSTOMER	repro-test-403@example.com
2026-07-02 10:14:30.538683	2026-07-02 10:14:30.537693	2026-07-02 10:14:30.538683	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	8cef0d1d-5859-4e69-8ccc-28b93ba6e13a	CUSTOMER	repro-test-403@example.com
2026-07-02 10:14:33.308793	2026-07-02 10:14:33.289618	2026-07-02 10:14:33.308793	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	b7cc1ffe-746f-4830-85f7-8d663740bbca	CUSTOMER	repro-test-403@example.com
2026-07-02 10:14:35.209503	2026-07-02 10:14:35.209503	2026-07-02 10:14:35.209503	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	44867c50-ab52-4afb-bdd2-7d32f238b543	CUSTOMER	repro-test-403@example.com
2026-07-02 10:17:59.29909	2026-07-02 10:17:59.29699	2026-07-02 10:17:59.29909	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	c7f207cf-291b-480c-b298-abc23f1b6ddb	CUSTOMER	repro-test-403@example.com
2026-07-02 10:22:06.420932	2026-07-02 10:22:06.406503	2026-07-02 10:22:06.420932	SUCCESS	67b2b36f-6d63-4346-b9b5-049d81a94e44	c44e62b3-59cc-4d96-8aef-a3ce36edfa9b	CUSTOMER	lomuto@gmail.com
2026-07-02 10:34:29.090585	2026-07-02 10:34:29.0739	2026-07-02 10:34:29.090585	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	d26bc3a0-bbb2-4b45-9e09-a5e80ed65f6c	CUSTOMER	repro-test-403@example.com
2026-07-02 10:39:44.081661	2026-07-02 10:39:44.047652	2026-07-02 10:39:44.081661	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	299f3221-ce5a-4d6b-a639-72f6a4a6d389	CUSTOMER	repro-test-403@example.com
2026-07-02 10:40:38.161772	2026-07-02 10:40:38.160765	2026-07-02 10:40:38.161772	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	033c789a-a56a-4f45-916b-804ccc5596e5	CUSTOMER	repro-test-403@example.com
2026-07-02 10:44:16.420854	2026-07-02 10:44:16.417989	2026-07-02 10:44:16.420854	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	ca5be895-37b5-4183-a9c7-e3d6dde9eac2	CUSTOMER	repro-test-403@example.com
2026-07-02 10:45:19.051791	2026-07-02 10:45:19.051791	2026-07-02 10:45:19.051791	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	968e80fd-6532-4a1c-86ac-b9c480cfbbf6	CUSTOMER	repro-test-403@example.com
2026-07-02 10:49:29.470807	2026-07-02 10:49:29.454969	2026-07-02 10:49:29.470807	SUCCESS	67b2b36f-6d63-4346-b9b5-049d81a94e44	d51e8901-2e0e-4da8-9db2-b64df2b64326	CUSTOMER	lomuto@gmail.com
2026-07-02 10:53:01.593778	2026-07-02 10:53:01.588757	2026-07-02 10:53:01.593778	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	b0f65d40-1204-400c-b735-5f75a9920bb0	CUSTOMER	repro-test-403@example.com
2026-07-02 11:19:10.543671	2026-07-02 11:19:10.243291	2026-07-02 11:19:10.543671	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	77fd0da6-6e2b-474e-8ee3-2fdded01a433	CUSTOMER	repro-test-403@example.com
2026-07-02 11:21:25.543852	2026-07-02 11:21:25.54034	2026-07-02 11:21:25.543852	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	08929ae0-baa6-4ea5-b774-49b343bf16b5	CUSTOMER	repro-test-403@example.com
2026-07-02 11:26:28.959361	2026-07-02 11:26:28.949327	2026-07-02 11:26:28.959361	SUCCESS	67b2b36f-6d63-4346-b9b5-049d81a94e44	f88625e6-5c95-4dfe-870c-57c3b742e64a	CUSTOMER	lomuto@gmail.com
2026-07-02 11:28:21.19436	2026-07-02 11:28:21.178806	2026-07-02 11:28:21.19436	SUCCESS	67b2b36f-6d63-4346-b9b5-049d81a94e44	cf9e1d12-6b94-40eb-bc85-133f60ae5d81	CUSTOMER	lomuto@gmail.com
2026-07-02 11:31:48.214641	2026-07-02 11:31:48.201271	2026-07-02 11:31:48.214641	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	6f9091b1-319f-4051-8656-db2b37683ec2	CUSTOMER	repro-test-403@example.com
2026-07-02 11:36:35.054911	2026-07-02 11:36:35.039415	2026-07-02 11:36:35.054911	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	4e15b0d4-c8dc-41ff-bece-84acb351d1b9	CUSTOMER	repro-test-403@example.com
2026-07-02 11:37:43.284084	2026-07-02 11:37:43.282832	2026-07-02 11:37:43.284084	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	f619e895-d949-45c3-9bd0-b24a7014c7d3	CUSTOMER	repro-test-403@example.com
2026-07-02 11:44:17.47322	2026-07-02 11:44:17.458409	2026-07-02 11:44:17.47322	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	177114cf-37a6-45b8-8aca-c1224de69b9f	CUSTOMER	repro-test-403@example.com
2026-07-02 11:45:04.748189	2026-07-02 11:45:04.746188	2026-07-02 11:45:04.748189	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	36976db2-3181-4d88-9020-e8a493eeb2e0	CUSTOMER	repro-test-403@example.com
2026-07-02 11:52:54.171594	2026-07-02 11:52:54.157593	2026-07-02 11:52:54.171594	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	a65e8d64-d758-4ae5-96ef-247abf5fd4c4	CUSTOMER	repro-test-403@example.com
2026-07-02 11:58:15.441605	2026-07-02 11:58:15.43142	2026-07-02 11:58:15.441605	SUCCESS	67b2b36f-6d63-4346-b9b5-049d81a94e44	ff001f44-c9ac-433a-8fcd-325af825bdc5	CUSTOMER	lomuto@gmail.com
2026-07-02 12:02:54.089299	2026-07-02 12:02:54.080025	2026-07-02 12:02:54.089299	SUCCESS	67b2b36f-6d63-4346-b9b5-049d81a94e44	97d8377c-8d78-4f2f-a498-25d088ad2e36	CUSTOMER	lomuto@gmail.com
2026-07-02 12:10:44.862625	2026-07-02 12:10:44.846636	2026-07-02 12:10:44.862625	SUCCESS	67b2b36f-6d63-4346-b9b5-049d81a94e44	7c18f791-1d6d-41f7-9391-b0ccc6374b8f	CUSTOMER	lomuto@gmail.com
2026-07-02 12:13:27.832478	2026-07-02 12:13:27.830479	2026-07-02 12:13:27.832478	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	c14eb8d4-3e7e-44a6-b077-6f2bdff391dd	CUSTOMER	repro-test-403@example.com
2026-07-02 12:28:27.223082	2026-07-02 12:28:27.208829	2026-07-02 12:28:27.223082	SUCCESS	67b2b36f-6d63-4346-b9b5-049d81a94e44	6dc4a9b2-f2d5-4bd8-9546-c15529a54be9	CUSTOMER	lomuto@gmail.com
2026-07-02 12:36:32.896423	2026-07-02 12:36:32.890821	2026-07-02 12:36:32.896423	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	a4a514b1-946c-4e1e-a092-9be0992a0c3c	CUSTOMER	repro-test-403@example.com
2026-07-02 12:37:37.955081	2026-07-02 12:37:37.953075	2026-07-02 12:37:37.955081	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	c3708f8c-eb09-47d9-9407-23be4b23c434	CUSTOMER	repro-test-403@example.com
2026-07-02 12:38:37.595177	2026-07-02 12:38:37.594129	2026-07-02 12:38:37.595177	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	20a6511f-35a9-4e37-9dd8-6638bb8a34c8	CUSTOMER	repro-test-403@example.com
2026-07-02 12:42:27.00664	2026-07-02 12:42:26.990848	2026-07-02 12:42:27.00664	SUCCESS	67b2b36f-6d63-4346-b9b5-049d81a94e44	1e3adeaa-b042-4b1d-9707-772e66a9a082	CUSTOMER	lomuto@gmail.com
2026-07-02 12:45:08.781632	2026-07-02 12:45:08.775073	2026-07-02 12:45:08.781632	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	75cb1ad8-bb8a-4ce7-a876-f24903d2e13e	CUSTOMER	repro-test-403@example.com
2026-07-02 12:46:57.867217	2026-07-02 12:46:57.865161	2026-07-02 12:46:57.867217	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	07fc0620-2354-4232-806f-bcac61809f31	CUSTOMER	repro-test-403@example.com
2026-07-02 12:51:22.519728	2026-07-02 12:51:22.516679	2026-07-02 12:51:22.519728	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	ee2bb732-c569-47d7-bed0-8453b860155a	CUSTOMER	repro-test-403@example.com
2026-07-02 12:51:59.819038	2026-07-02 12:51:59.81504	2026-07-02 12:51:59.819038	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	27f438d9-6ed0-497c-9540-bd9c353b440e	CUSTOMER	repro-test-403@example.com
2026-07-02 12:55:51.697753	2026-07-02 12:55:51.678212	2026-07-02 12:55:51.697753	SUCCESS	67b2b36f-6d63-4346-b9b5-049d81a94e44	56c7ff58-47cd-4e8f-8078-ce26a5ce1d4d	CUSTOMER	lomuto@gmail.com
2026-07-02 12:52:16.639299	2026-07-02 12:52:16.638293	2026-07-02 12:52:16.639299	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	f0a2600d-affa-4b67-9890-bd74d2d7f7ef	CUSTOMER	repro-test-403@example.com
2026-07-02 12:52:41.09214	2026-07-02 12:52:41.091147	2026-07-02 12:52:41.09214	SUCCESS	e58a9069-bbcb-43f5-b194-45e87378a03f	5a85f466-70da-44a3-8b24-638f0cd2116d	CUSTOMER	repro-test-403@example.com
2026-07-02 13:10:14.28479	2026-07-02 13:10:14.272913	2026-07-02 13:10:14.28479	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	bec3399c-8906-4877-b16c-31f721ea4ed8	MANAGER	manager@techstore.com
2026-07-02 13:10:49.546105	2026-07-02 13:10:49.541635	2026-07-02 13:10:49.546105	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	f19dbf68-fafd-41b0-85f3-15c161db58a1	MANAGER	manager@techstore.com
2026-07-02 13:10:16.119952	2026-07-02 13:10:16.118952	2026-07-02 13:10:16.119952	SUCCESS	5fe8f461-380a-4743-8aaf-00b91959bd52	63356dc7-b76d-4e1c-b463-c91771640614	STAFF	staff1@techstore.com
2026-07-02 15:55:22.979944	2026-07-02 15:55:22.973946	2026-07-02 15:55:22.979944	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	9fad6cc3-397e-44ad-9c3b-44b4c1e75ccb	MANAGER	manager@techstore.com
2026-07-02 16:20:17.79634	2026-07-02 16:20:17.790827	2026-07-02 16:20:17.79634	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	84245cb9-c880-4009-ac25-175c006af616	MANAGER	manager@techstore.com
2026-07-02 19:16:57.271037	2026-07-02 19:16:57.268026	2026-07-02 19:16:57.271037	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	cd4175d9-b5c2-4546-a38a-0aaf105057ca	MANAGER	manager@techstore.com
2026-07-02 21:41:39.825758	2026-07-02 21:41:39.824768	2026-07-02 21:41:39.825758	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	9be793f1-f178-4471-a62a-c97964fa18b8	MANAGER	manager@techstore.com
2026-07-03 00:38:03.946772	2026-07-03 00:38:03.92555	2026-07-03 00:38:03.946772	SUCCESS	b97f4e9b-1a43-4e2c-8bc1-6d93e1893ba8	8719a771-3fb1-40e0-8e14-c084bd8aaaeb	MANAGER	manager@techstore.com
\.


--
-- TOC entry 4559 (class 0 OID 26612)
-- Dependencies: 406
-- Data for Name: managers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.managers (id) FROM stdin;
ceedbc85-ac09-4978-a28a-5fd2b6936227
\.


--
-- TOC entry 4560 (class 0 OID 26617)
-- Dependencies: 407
-- Data for Name: membership_benefits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.membership_benefits (discount_percentage, free_shipping, created_at, updated_at, id, description) FROM stdin;
0	f	2026-06-30 00:47:05.615473	2026-06-30 00:47:05.615473	2eedcca5-7426-4050-9cad-f26f106875bb	Standard customer benefits
1	f	2026-06-30 00:47:05.625633	2026-06-30 00:47:05.625633	07002aef-6406-409d-8ccf-41ecb8082ad9	Bronze tier: 1% discount on all orders
2	f	2026-06-30 00:47:05.625633	2026-06-30 00:47:05.625633	ec7eb314-2a8b-41b1-b434-0c8a8ee3c2ec	Silver tier: 2% discount on all orders
5	t	2026-06-30 00:47:05.626643	2026-06-30 00:47:05.626643	dfe94d2e-7b94-47c6-8bff-d5a7b1ad8fa9	Gold tier: 5% discount and Free Shipping
10	t	2026-06-30 00:47:05.626643	2026-06-30 00:47:05.626643	337f07ef-b73e-4ef1-a5ad-4255c9a947f1	Diamond tier: 10% discount and Free Shipping
\.


--
-- TOC entry 4561 (class 0 OID 26624)
-- Dependencies: 408
-- Data for Name: memberships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.memberships (max_spending, min_spending, created_at, updated_at, tier, benefit_id, id) FROM stdin;
5000000.00	0.00	2026-06-30 00:47:05.627646	2026-06-30 00:47:05.627646	STANDARD	2eedcca5-7426-4050-9cad-f26f106875bb	a52894b4-4284-49db-a3b8-62403ef6982e
15000000.00	5000000.00	2026-06-30 00:47:05.634163	2026-06-30 00:47:05.634163	BRONZE	07002aef-6406-409d-8ccf-41ecb8082ad9	b4ba8a5f-90ec-4ba0-b615-2378df591d5d
50000000.00	15000000.00	2026-06-30 00:47:05.635671	2026-06-30 00:47:05.635671	SILVER	ec7eb314-2a8b-41b1-b434-0c8a8ee3c2ec	a4edcb55-76e0-49ec-b9d0-b79c42282518
100000000.00	50000000.00	2026-06-30 00:47:05.635671	2026-06-30 00:47:05.635671	GOLD	dfe94d2e-7b94-47c6-8bff-d5a7b1ad8fa9	d63de832-cde5-45e5-b7b8-89284bc81113
\N	100000000.00	2026-06-30 00:47:05.635671	2026-06-30 00:47:05.635671	DIAMOND	337f07ef-b73e-4ef1-a5ad-4255c9a947f1	57811e92-39d2-416a-8def-3fec3571c536
\.


--
-- TOC entry 4562 (class 0 OID 26634)
-- Dependencies: 409
-- Data for Name: notification_channels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_channels (channel, notification_id) FROM stdin;
WEB	e6bdedc9-3355-4641-9e89-b63fcfc3f25c
WEB	b5f2dd8a-4314-446c-b13c-cc805ca5c20a
WEB	9d901f7c-00a9-424d-8b3d-d5a487206ed9
WEB	5aee9a6d-3ed6-4ac0-9596-2d714f7707f6
WEB	5b049313-6c53-479d-86dc-b4f68002d12d
WEB	bff1760a-c3ef-4c89-84be-5d3e9b2ec3c1
WEB	9fed641a-af40-426f-8853-56dae7eab5b0
\.


--
-- TOC entry 4563 (class 0 OID 26638)
-- Dependencies: 410
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (created_at, read_at, sent_at, updated_at, status, customer_id, favorite_product_id, id, type, title, message, recipient_role) FROM stdin;
2026-07-02 02:05:29.124881	2026-07-02 02:36:46.643216	2026-07-02 02:05:29.124348	2026-07-02 02:36:46.899057	SUCCESS	c7152be7-a711-4734-8a83-cd5ec04b1a12	577509e9-9c8c-4b54-9cae-ae25bda123ec	e6bdedc9-3355-4641-9e89-b63fcfc3f25c	RESTOCKED	Product is back in stock	Asus ROG Phone 8 Pro is available again.	CUSTOMER
2026-07-02 12:51:36.871978	\N	2026-07-02 12:51:36.871978	2026-07-02 12:51:36.871978	SUCCESS	\N	\N	b5f2dd8a-4314-446c-b13c-cc805ca5c20a	PROMOTION	Đơn hàng mới	Đơn hàng mới 18b6fb95-5047-40dc-b2c6-baf73303925b từ khách hàng Test Repro đang chờ xử lý.	STAFF
2026-07-02 12:52:53.397128	\N	2026-07-02 12:52:53.397128	2026-07-02 12:52:53.397128	SUCCESS	\N	\N	5aee9a6d-3ed6-4ac0-9596-2d714f7707f6	PROMOTION	Đơn hàng mới	Đơn hàng mới 6eecec2d-6b5f-4f72-81c3-a80335b6f247 từ khách hàng Test Repro đang chờ xử lý.	STAFF
2026-07-02 12:56:52.922248	\N	2026-07-02 12:56:52.921257	2026-07-02 12:56:52.922248	SUCCESS	\N	\N	bff1760a-c3ef-4c89-84be-5d3e9b2ec3c1	PROMOTION	Đơn hàng mới	Đơn hàng mới 5836eda6-bf83-4e11-921c-fc1c23e1e913 từ khách hàng Nguyễn Đức Duy đang chờ xử lý.	STAFF
2026-07-02 12:56:52.924252	2026-07-02 15:55:36.222164	2026-07-02 12:56:52.923247	2026-07-02 15:55:36.224183	SUCCESS	\N	\N	9fed641a-af40-426f-8853-56dae7eab5b0	PROMOTION	Đơn hàng mới	Đơn hàng mới 5836eda6-bf83-4e11-921c-fc1c23e1e913 từ khách hàng Nguyễn Đức Duy đang chờ xử lý.	MANAGER
2026-07-02 12:52:53.398169	2026-07-02 20:38:21.923387	2026-07-02 12:52:53.397128	2026-07-02 20:38:21.934954	SUCCESS	\N	\N	5b049313-6c53-479d-86dc-b4f68002d12d	PROMOTION	Đơn hàng mới	Đơn hàng mới 6eecec2d-6b5f-4f72-81c3-a80335b6f247 từ khách hàng Test Repro đang chờ xử lý.	MANAGER
2026-07-02 12:51:36.872976	2026-07-02 20:38:23.172893	2026-07-02 12:51:36.872976	2026-07-02 20:38:23.172893	SUCCESS	\N	\N	9d901f7c-00a9-424d-8b3d-d5a487206ed9	PROMOTION	Đơn hàng mới	Đơn hàng mới 18b6fb95-5047-40dc-b2c6-baf73303925b từ khách hàng Test Repro đang chờ xử lý.	MANAGER
\.


--
-- TOC entry 4564 (class 0 OID 26647)
-- Dependencies: 411
-- Data for Name: order_item_bundle_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_item_bundle_services (bundle_service_id, order_item_id) FROM stdin;
441ded6b-5a61-4492-bd48-8fb0ccda0f54	a74ef4c2-4d5d-4838-acac-26a025e0ba40
\.


--
-- TOC entry 4565 (class 0 OID 26650)
-- Dependencies: 412
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (quantity, unit_price_at_order, created_at, updated_at, id, order_id, product_variant_id) FROM stdin;
1	34990000.00	2026-07-02 02:53:16.119244	2026-07-02 02:53:16.119244	d20a98ed-6764-4e2a-abcd-755ce517b971	demo-membership-order-customer1	569a61bf-b263-4443-a0f0-18452f8d3077
1	28990000.00	2026-07-02 12:51:36.865976	2026-07-02 12:51:36.865976	ee92536a-74de-439a-a9a5-ee1e3db487ea	18b6fb95-5047-40dc-b2c6-baf73303925b	cb25b96a-193b-47a8-ab91-f3c230c35df3
1	14000000.00	2026-07-02 12:52:53.396173	2026-07-02 12:52:53.396173	0c496988-aff3-43c6-846d-4d51f8858c02	6eecec2d-6b5f-4f72-81c3-a80335b6f247	123
1	25990000.00	2026-07-02 12:56:52.915655	2026-07-02 12:56:52.915655	a74ef4c2-4d5d-4838-acac-26a025e0ba40	5836eda6-bf83-4e11-921c-fc1c23e1e913	f7b3fc11-7e27-473e-8805-932058ac57bd
1	14990000.00	2026-07-02 21:04:38.12408	2026-07-02 21:04:38.12408	7272fb4a-8173-4da8-8c20-e500bce46030	SEED-ORDER-0001	cae3ee57-2619-4f98-acf1-dcad5f1068c8
1	10490000.00	2026-07-02 21:04:39.837213	2026-07-02 21:04:39.837213	b8b6f4a4-c05b-4a86-a44b-2f454d8d3678	SEED-ORDER-0002	1c95c7ca-4a20-4a6f-876e-8e445fcc075b
1	2990000.00	2026-07-02 21:04:42.227601	2026-07-02 21:04:42.227601	9576abeb-ded0-4ce5-8d96-90da69b89200	SEED-ORDER-0003	af28811e-ff39-47d7-8ad1-6931fd3649a5
1	12490000.00	2026-07-02 21:04:42.227973	2026-07-02 21:04:42.227973	a31745fe-e9fa-414d-b6f0-d898e113094e	SEED-ORDER-0003	b78071cf-1af1-4611-90bc-7c72779b7642
1	19990000.00	2026-07-02 21:04:44.824015	2026-07-02 21:04:44.824015	5ee28ad7-3a7a-4c1a-8d0c-f01f0ce2de6e	SEED-ORDER-0004	cf50298b-b5f9-41ee-a556-3538747e9088
1	15990000.00	2026-07-02 21:04:44.824015	2026-07-02 21:04:44.824015	55f8c1a0-dae7-4cf4-a40c-fe08ebbf335b	SEED-ORDER-0004	38093a9b-8955-411b-9383-530e8123eddb
1	18990000.00	2026-07-02 21:04:46.969108	2026-07-02 21:04:46.969108	1d9236f6-1e5d-4f66-978d-d50059b5fd25	SEED-ORDER-0005	34f0ee14-c2ad-493a-b68c-8be774d598d6
1	16990000.00	2026-07-02 21:04:48.667963	2026-07-02 21:04:48.667963	d6f19105-9bfe-4db6-a98c-6862e767e1a1	SEED-ORDER-0006	01f3c845-fe99-4716-a51d-2028aa9788f3
1	25990000.00	2026-07-02 21:04:50.932965	2026-07-02 21:04:50.932965	8e44e3f9-0467-48df-b19f-9c7daac3c0ab	SEED-ORDER-0007	50c500b8-2cfc-4154-ae46-40cf94139ce4
1	37990000.00	2026-07-02 21:04:50.936212	2026-07-02 21:04:50.936212	ea8723c1-0559-40da-9c96-97e6b8a9839d	SEED-ORDER-0007	26c70f1f-5304-418f-acc2-5dfd0385d80c
1	24990000.00	2026-07-02 21:04:53.692522	2026-07-02 21:04:53.692522	a69d26f0-fadb-40d5-8135-117c573aac0c	SEED-ORDER-0008	f30b188d-3f42-419c-8446-9fbcc3f05dce
1	25990000.00	2026-07-02 21:04:53.693205	2026-07-02 21:04:53.693205	b3dec1a3-7c14-428a-ac23-a4aab8475d61	SEED-ORDER-0008	79e99576-343e-4b14-aaba-92ba526205e1
1	3490000.00	2026-07-02 21:04:55.728861	2026-07-02 21:04:55.728861	1f830be4-6b96-4002-9c27-4a60c3b73782	SEED-ORDER-0009	77ffd9fe-c998-457b-96aa-42024106ef43
1	24990000.00	2026-07-02 21:04:57.845585	2026-07-02 21:04:57.845585	bb7770ff-93d0-423f-8c7f-a23db0743234	SEED-ORDER-0010	078c714e-c30c-4f7e-a21f-b1d03be3082b
1	16990000.00	2026-07-02 21:04:57.846582	2026-07-02 21:04:57.846582	9cfc04df-8b46-42a6-b64a-f89ca77b699b	SEED-ORDER-0010	902bbbe5-5991-411e-9b46-1f080c8c0340
1	27990000.00	2026-07-02 21:04:59.904708	2026-07-02 21:04:59.904708	5c02b02d-df5a-4143-9bc7-78ae1fd4cec8	SEED-ORDER-0011	7480ad67-053e-4e2e-9017-a977112d31f2
1	18990000.00	2026-07-02 21:05:01.548112	2026-07-02 21:05:01.548112	bf6b4f4d-ea2e-430e-b976-c5abe6fb3fa5	SEED-ORDER-0012	0f2e7cb7-f0e5-4fef-b47c-7fc2bc2f5c97
1	16990000.00	2026-07-02 21:05:05.015038	2026-07-02 21:05:05.015038	bf2b5f21-4c67-4122-945d-fdf9f670c39f	SEED-ORDER-0013	5382035e-642f-45fa-ae25-84072fb41b05
1	8990000.00	2026-07-02 21:05:05.016045	2026-07-02 21:05:05.016045	ec44f08f-455e-406b-ae11-7dce02356106	SEED-ORDER-0013	06c0d6da-06c6-4c67-b591-9b116c72683f
1	14990000.00	2026-07-02 21:05:07.552249	2026-07-02 21:05:07.552249	05ed9716-8271-4f0e-a085-66b0af57db9e	SEED-ORDER-0014	5160c1a2-343d-44a1-9893-5b3cd7d69ee8
1	17990000.00	2026-07-02 21:05:09.606318	2026-07-02 21:05:09.606318	09488183-353b-477c-a9b7-5be9f67cc04e	SEED-ORDER-0015	6467175a-765c-42a4-afe8-26cf8f3de8b3
1	25990000.00	2026-07-02 21:05:09.607314	2026-07-02 21:05:09.607314	56ac5d02-f851-43ec-af0f-6ec938a48130	SEED-ORDER-0015	aed38cd9-fed4-4111-8c7b-a4037f229865
1	22990000.00	2026-07-02 21:05:12.301262	2026-07-02 21:05:12.301262	687e93ee-8f7f-4689-b309-6c9f4d7c034d	SEED-ORDER-0016	2ed83b28-a0fa-46a3-bbdb-a01c899f7112
1	37990000.00	2026-07-02 21:05:14.593491	2026-07-02 21:05:14.593491	d329fad0-0c01-400c-8525-1aaea27f1aed	SEED-ORDER-0017	85336a23-094c-4f2e-b510-6fdc76333fa1
1	15990000.00	2026-07-02 21:05:14.594681	2026-07-02 21:05:14.594681	7b756577-4536-44f3-8e0c-19fa7f0774d5	SEED-ORDER-0017	c2fd1a50-9072-4429-8511-b8cf3621f7f9
1	17990000.00	2026-07-02 21:05:16.683346	2026-07-02 21:05:16.683346	3d4fa8c9-e230-4f0c-bdcf-2c28787e57f0	SEED-ORDER-0018	e87cffd0-f424-42d4-8409-e8a62e33e64f
1	17990000.00	2026-07-02 21:05:18.355714	2026-07-02 21:05:18.355714	0bb80dcb-a915-473f-8e86-a902ea00e72d	SEED-ORDER-0019	cf659293-c31b-415e-aa9f-3b9866fa6632
1	34990000.00	2026-07-02 21:05:21.215721	2026-07-02 21:05:21.215721	0a76cf7d-11eb-44bd-a952-5f4ff5a2250c	SEED-ORDER-0020	a6db378a-04d8-4507-bd60-62b03380e443
1	8990000.00	2026-07-02 21:05:21.216629	2026-07-02 21:05:21.216629	672b177c-488f-42d1-8b53-e9c002f46815	SEED-ORDER-0020	4ec5bccc-e6d3-469b-a5b9-2d13bd647f98
1	7490000.00	2026-07-02 21:05:23.887204	2026-07-02 21:05:23.887204	32398e53-f92d-459b-9de3-9308630068e9	SEED-ORDER-0021	b8259e5a-f952-4647-9a8d-1873e1756eee
1	22990000.00	2026-07-02 21:05:23.888206	2026-07-02 21:05:23.888206	84c3af5d-42a8-4473-80b3-964e1386d1db	SEED-ORDER-0021	48194eb8-d766-4520-b6f7-63479ee66873
1	34990000.00	2026-07-02 21:05:26.440727	2026-07-02 21:05:26.440727	338df938-afeb-492e-9340-fd2f47d842d5	SEED-ORDER-0022	eeeba2f5-4a04-41f1-b625-0bd0d2036316
1	22490000.00	2026-07-02 21:05:26.441802	2026-07-02 21:05:26.441802	6c42f0b4-1460-4a2b-bf19-9dcd2ebc9694	SEED-ORDER-0022	54c77c30-b064-4632-8fba-fb691b2bfecc
1	22490000.00	2026-07-02 21:05:29.033249	2026-07-02 21:05:29.033249	19ad74e7-4246-40af-b2c5-c2acb87dd54c	SEED-ORDER-0023	fb1b26e8-4fac-4d28-a9b8-31f4c33fcc1e
1	43990000.00	2026-07-02 21:05:29.033839	2026-07-02 21:05:29.033839	6274ad91-a74f-461c-b316-c8f3cd0fbcae	SEED-ORDER-0023	f9b5afd9-1a65-44e9-8bba-67d3dcbdc89b
1	8990000.00	2026-07-02 21:05:32.349424	2026-07-02 21:05:32.349424	6c02ea24-86d9-46d9-8655-f1ec84663c6b	SEED-ORDER-0024	9e74879c-25f7-49b3-a0f9-7396563b2170
1	34990000.00	2026-07-02 21:05:32.349424	2026-07-02 21:05:32.349424	4b3bfa35-fe33-44bd-9151-4e87725b4a96	SEED-ORDER-0024	7cfc3d0d-ccb2-4b1d-ae5d-b8acd598748e
1	8990000.00	2026-07-02 21:05:37.309076	2026-07-02 21:05:37.309076	9e820098-fe71-4266-86e6-0cf1ff950bd8	SEED-ORDER-0025	1b81c69e-d47c-4374-af93-f708678d5049
1	15990000.00	2026-07-02 21:05:37.309076	2026-07-02 21:05:37.309076	06a7574d-d8bb-443e-862e-190260d6c3a5	SEED-ORDER-0025	b5623c50-558e-4305-9b21-5f81de40539e
1	13990000.00	2026-07-02 21:05:39.479071	2026-07-02 21:05:39.479071	0187f32e-a449-43b3-bdbe-5a06e4bc33cc	SEED-ORDER-0026	fef7b9db-1f17-4701-8cd6-a2d278183be0
1	28990000.00	2026-07-02 21:05:41.154444	2026-07-02 21:05:41.154444	0b815a87-3624-428b-b6f5-d9998107d4e6	SEED-ORDER-0027	6328c8a2-0caa-4175-a394-bfa38c71fa2a
1	13990000.00	2026-07-02 21:05:43.221573	2026-07-02 21:05:43.221573	d58fccfb-ec61-4b99-bb9c-1936f94bdb78	SEED-ORDER-0028	f3d851c8-afa8-444a-bf3f-d1ed45265b2a
1	7490000.00	2026-07-02 21:05:43.222584	2026-07-02 21:05:43.222584	699de767-68b3-4c6c-88e9-753f58ae1fc2	SEED-ORDER-0028	57ee9596-bf8e-4e3c-a5e2-fb05456202e0
1	14990000.00	2026-07-02 21:05:45.82789	2026-07-02 21:05:45.82789	4aa8fe9b-aa3f-4d73-bdbe-906388f82bb3	SEED-ORDER-0029	e6d0a5b4-1c0d-4b0d-9365-8dc80cc52954
1	24490000.00	2026-07-02 21:05:48.249232	2026-07-02 21:05:48.249232	6e36caf2-2a4d-46fb-bbd4-7565180c76a2	SEED-ORDER-0030	92923ad8-60c6-4092-94ac-41fedf4b8acd
1	28990000.00	2026-07-02 21:05:48.249232	2026-07-02 21:05:48.249232	96be8eb2-3617-460a-9f33-4853a370be96	SEED-ORDER-0030	1a89adf1-b675-4afa-bd7a-b492e9f3670d
1	6490000.00	2026-07-02 21:05:50.373044	2026-07-02 21:05:50.373044	7f14d852-2cec-474c-b0a5-a48d8a6e2735	SEED-ORDER-0031	1465e56f-89ad-4b3d-a8e6-818fb78bb51a
1	13990000.00	2026-07-02 21:05:52.106837	2026-07-02 21:05:52.106837	3c5012bb-0cfd-42c1-a9a1-0d22475d034e	SEED-ORDER-0032	fbbee4e4-775d-4f0e-a5be-19f0669237a1
1	21990000.00	2026-07-02 21:05:53.734864	2026-07-02 21:05:53.734864	85f6040b-9556-473e-93e4-236293e388f5	SEED-ORDER-0033	da0c4c22-9686-42e7-890d-7bc6d0e08de7
1	19990000.00	2026-07-02 21:05:55.375092	2026-07-02 21:05:55.375092	b3e74cb2-8784-4d4c-a8b6-a7300378e4ed	SEED-ORDER-0034	3dc63eb1-2144-4e6b-88bd-a242a1f9a92f
1	14000000.00	2026-07-02 21:05:57.454076	2026-07-02 21:05:57.454076	0fd69732-547e-4d9a-9cf5-ae40297da840	SEED-ORDER-0035	2f66d3fa-a154-47b7-a5fd-7662cd5d21fd
1	8990000.00	2026-07-02 21:05:57.455136	2026-07-02 21:05:57.455136	0e3e952a-e96b-400e-9bf7-368fc0479118	SEED-ORDER-0035	c792b562-b3f6-4e48-be78-e8e1bce645e0
1	25490000.00	2026-07-02 21:05:59.493367	2026-07-02 21:05:59.493367	6039f4a8-194b-4667-91f1-04030fd50588	SEED-ORDER-0036	bb7fd94b-b0c3-4066-9bd5-476f5f735bcf
1	17990000.00	2026-07-02 21:06:01.157602	2026-07-02 21:06:01.157602	5b62fc28-3ea6-4205-9f70-6cf0a880b6b3	SEED-ORDER-0037	a3bb2cdd-ec49-4c26-bc95-73567836b846
1	37990000.00	2026-07-02 21:06:03.422159	2026-07-02 21:06:03.422159	ce4e3aa1-4db9-4cab-b31c-f2ef85539758	SEED-ORDER-0038	898fb48b-c8e0-4d03-b2a9-83e67708d1af
1	22490000.00	2026-07-02 21:06:03.422159	2026-07-02 21:06:03.422159	fbd31508-5dd2-49c6-8c5d-19a0b45a1c34	SEED-ORDER-0038	654f69a3-1015-4b59-bfdb-3007b2b81d83
1	17990000.00	2026-07-02 21:06:05.989297	2026-07-02 21:06:05.989297	fc97ba3d-b0e0-496a-b24e-bb8bcdc8f384	SEED-ORDER-0039	0d023e08-c65e-4181-ab49-5a967c0c8026
1	28490000.00	2026-07-02 21:06:05.989297	2026-07-02 21:06:05.989297	319ffd8d-c6e6-43fa-8fbc-35c5e87516fb	SEED-ORDER-0039	9b4af3d6-7c2d-4a37-85a7-e953f05286e1
1	34990000.00	2026-07-02 21:06:08.688272	2026-07-02 21:06:08.688272	291470bb-24da-4355-917c-0d482c0a0d43	SEED-ORDER-0040	38882dcd-d7af-4921-998f-0de7a4bca578
1	47990000.00	2026-07-02 21:06:08.68928	2026-07-02 21:06:08.68928	86d3d7d4-2575-4d9f-8a24-01acc1fd11c1	SEED-ORDER-0040	a52530c1-d3a0-4c03-9776-a2cddb99cd80
1	34990000.00	2026-07-02 21:06:10.716192	2026-07-02 21:06:10.716192	6113aa5b-9131-4e86-b03f-4087ccefca3e	SEED-ORDER-0041	10d8df51-280a-42c3-9e13-05104ac52b82
1	34990000.00	2026-07-02 21:06:13.893028	2026-07-02 21:06:13.893028	39f617cf-cb7e-4efb-856b-e3d599cfe0a3	SEED-ORDER-0042	ddfbbf72-e14f-487b-9d09-4f95f2ea7432
1	24990000.00	2026-07-02 21:06:15.965131	2026-07-02 21:06:15.965131	cf2f7402-97e4-4960-a6cd-b1a83d38ca54	SEED-ORDER-0043	e79a1928-adb9-4fa1-9854-0f92823a93c4
1	18990000.00	2026-07-02 21:06:17.733451	2026-07-02 21:06:17.733451	fe0eb29e-e0b7-425f-9873-9d5d762f3694	SEED-ORDER-0044	ec1718d6-c153-4e9c-9dea-8720b9f907da
1	22990000.00	2026-07-02 21:06:20.953105	2026-07-02 21:06:20.953105	10a4061f-eaee-4ce5-85c9-c60f8b8a8a5b	SEED-ORDER-0045	7f557c19-1460-48f8-ae5e-078162fe5fb6
1	16990000.00	2026-07-02 21:06:20.95411	2026-07-02 21:06:20.95411	d941f036-a9c4-4130-8cd6-5c3f4f13104d	SEED-ORDER-0045	febb951d-a516-44d0-90fe-9173433b9eda
1	21990000.00	2026-07-02 21:06:23.056726	2026-07-02 21:06:23.056726	cb12964f-e3e4-455b-95ff-fb5330172c5e	SEED-ORDER-0046	9ca3a26b-fafc-4ad1-b604-50b440f9f5bc
1	34990000.00	2026-07-02 21:06:25.760496	2026-07-02 21:06:25.760496	27de8998-76c8-4bd1-985e-17a2f457dce0	SEED-ORDER-0047	7074016d-a5a5-4b7d-8227-c0f977ab3c53
1	21990000.00	2026-07-02 21:06:25.761501	2026-07-02 21:06:25.761501	e1b7ab3d-7453-4d00-a578-0d95626e7c14	SEED-ORDER-0047	9de0abed-7aaa-4d80-a5e4-3f041ae1b18f
1	24990000.00	2026-07-02 21:06:27.811298	2026-07-02 21:06:27.811298	170683b8-30af-46d8-be57-3a9c6cdbe843	SEED-ORDER-0048	52a44e1d-49e6-458c-b24b-0a796f6755a9
1	17990000.00	2026-07-02 21:06:29.434966	2026-07-02 21:06:29.434966	ac9b916f-2f94-4ef5-8562-ae0a120c1711	SEED-ORDER-0049	ec1cacc1-63d4-44a0-b28f-361736d41a57
1	22490000.00	2026-07-02 21:06:31.605617	2026-07-02 21:06:31.605617	1d9d3032-f490-4939-8034-292d147372e7	SEED-ORDER-0050	0ce7693d-fd93-43dd-aa67-cf87e2262e7d
1	24990000.00	2026-07-02 21:06:31.605617	2026-07-02 21:06:31.605617	a244e251-8029-4227-b79a-6c24315075c2	SEED-ORDER-0050	858f52ba-3a75-4862-a434-5be9305af429
1	15990000.00	2026-07-02 21:06:35.00151	2026-07-02 21:06:35.00151	52f8292d-1f33-4ba1-ac19-6748884f4e63	SEED-ORDER-0051	55211108-2c21-425c-a4f6-d1a9c874b368
1	34990000.00	2026-07-02 21:06:35.00151	2026-07-02 21:06:35.00151	d831e5ad-3de4-47cc-acc4-86dc1732b27b	SEED-ORDER-0051	2fd938ad-0fcd-4466-a87a-66f7e645d62f
1	47990000.00	2026-07-02 21:06:37.248465	2026-07-02 21:06:37.248465	b76da7ef-6bf6-499d-9301-0b1f0f8af49a	SEED-ORDER-0052	4ff8c63f-e739-4ec9-8ee0-7a7559881158
1	25990000.00	2026-07-02 21:06:39.006657	2026-07-02 21:06:39.006657	98c287a7-a7d1-4178-b9ec-f77bc946862f	SEED-ORDER-0053	604a2a0c-c5b4-4f89-92c1-b9b2c17ca508
1	21990000.00	2026-07-02 21:06:41.755578	2026-07-02 21:06:41.755578	69062c95-d49f-457f-bd35-695c4d2ca605	SEED-ORDER-0054	064a7ba0-1c73-4c7e-a24a-a696d3345e88
1	34990000.00	2026-07-02 21:06:41.756578	2026-07-02 21:06:41.756578	d25d9e0c-859d-472e-9456-008e07a1be92	SEED-ORDER-0054	0ed35b1c-720f-4a47-a681-42781f978569
1	15990000.00	2026-07-02 21:06:44.408379	2026-07-02 21:06:44.408379	22b1c85f-c5d5-410c-82b7-373688966848	SEED-ORDER-0055	13486aaa-6460-4d17-affe-4411d49e9cdb
1	14990000.00	2026-07-02 21:06:44.409337	2026-07-02 21:06:44.409337	087546be-2d15-46dd-8798-81858405c61c	SEED-ORDER-0055	f2ccedeb-664f-4ca3-aabf-5d94eac3399e
1	28490000.00	2026-07-02 21:06:46.47298	2026-07-02 21:06:46.47298	15b82142-3f9c-408c-af36-c43339f26316	SEED-ORDER-0056	a4834d07-bf12-4fa5-b5c8-a27887bc3467
1	13990000.00	2026-07-02 21:06:48.075831	2026-07-02 21:06:48.075831	0a9cdb36-4e9d-4db8-bd18-b502db35f880	SEED-ORDER-0057	4cb32801-c353-4e0f-aae2-06c111a44956
1	18990000.00	2026-07-02 21:06:49.705632	2026-07-02 21:06:49.705632	f961d0f6-cffd-422d-af33-a5fcbafe13db	SEED-ORDER-0058	162b7b1d-80fa-430c-89e4-d474fc184ed5
1	24990000.00	2026-07-02 21:06:51.480377	2026-07-02 21:06:51.480377	fa6a7173-20bf-4d06-b672-47b04d7d8225	SEED-ORDER-0059	4c9f9a57-4d8a-42ee-a86a-2f0086ef5a73
1	25990000.00	2026-07-02 21:06:54.80816	2026-07-02 21:06:54.80816	9252e2f3-4523-41c7-bf53-eab18ffc62b5	SEED-ORDER-0060	eba57224-ec40-4995-9035-39c615cead3a
1	12490000.00	2026-07-02 21:06:54.809159	2026-07-02 21:06:54.809159	5af8f76a-ba10-4f71-8c70-8b10547c0381	SEED-ORDER-0060	6acb8506-76a6-4edf-b8f9-7ae7f51a4d71
1	17990000.00	2026-07-02 21:06:58.223055	2026-07-02 21:06:58.223055	62e6d73b-6415-44cd-8944-ffcb1ccd9aaa	SEED-ORDER-0061	a4d12d6e-2722-4737-93bb-5e89add79510
1	13990000.00	2026-07-02 21:06:58.223055	2026-07-02 21:06:58.223055	8a246b28-ca84-49ea-81ca-492fa9aed959	SEED-ORDER-0061	29d9f900-8215-4f9b-8c2e-92d22d7a1f09
1	3490000.00	2026-07-02 21:07:00.721474	2026-07-02 21:07:00.721474	b4cca778-1de8-45cd-ab25-95f06b23c46a	SEED-ORDER-0062	2fb2f577-073e-4d88-aaa2-40d586df943d
1	27990000.00	2026-07-02 21:07:00.721474	2026-07-02 21:07:00.721474	10eaea11-2f22-46ef-bfca-3f4b2451df28	SEED-ORDER-0062	3e10436c-89b3-41c0-aa71-ec801187b121
1	47990000.00	2026-07-02 21:07:02.797755	2026-07-02 21:07:02.797755	fcea97d0-ef77-47cc-b375-e8749bec6e2c	SEED-ORDER-0063	da53d04f-c3a5-4c92-9e56-7d10050b6b92
1	3490000.00	2026-07-02 21:07:05.258553	2026-07-02 21:07:05.258553	b51a39bd-a640-4e39-975e-6b204d9bf369	SEED-ORDER-0064	f3015a42-8799-4271-8b33-c6509ab685ad
1	13990000.00	2026-07-02 21:07:06.923656	2026-07-02 21:07:06.923656	00aa5d10-31e9-4cfa-b054-3f1ef0b72b3b	SEED-ORDER-0065	9b11eae4-53f0-467f-86b2-014cb7a41d5b
1	19990000.00	2026-07-02 21:07:08.526259	2026-07-02 21:07:08.526259	fdc985d1-6501-4e4f-80ba-46373382d0fc	SEED-ORDER-0066	3408fdaa-b8c6-4273-9792-846b51826d5e
1	18990000.00	2026-07-02 21:07:10.597284	2026-07-02 21:07:10.597284	6f7ab0d6-bcb0-4993-a0f9-7fb0d02b3140	SEED-ORDER-0067	045048ba-ab92-428b-b82f-e7b93f311715
1	14990000.00	2026-07-02 21:07:10.597284	2026-07-02 21:07:10.597284	dfc95db5-0d55-4866-a163-957993f22749	SEED-ORDER-0067	d0f5568a-93d7-49fb-a926-84c4b244a5d5
1	14990000.00	2026-07-02 21:07:13.384808	2026-07-02 21:07:13.384808	d802a297-6bf0-4ada-b342-abd2ebb6e218	SEED-ORDER-0068	0852d2e9-cb73-4aae-8447-9a66260860f2
1	13990000.00	2026-07-02 21:07:13.385817	2026-07-02 21:07:13.385817	16df6962-648d-4d1f-9d87-eff8aedb134c	SEED-ORDER-0068	c4c61e89-b556-41b3-aa15-2ef1788d489c
1	37990000.00	2026-07-02 21:07:15.50513	2026-07-02 21:07:15.50513	65df23fc-5cc2-40a6-99c2-c8c91c7dd0b1	SEED-ORDER-0069	889f3739-8524-47cb-99bd-51c9c847c4cd
1	15990000.00	2026-07-02 21:07:17.069341	2026-07-02 21:07:17.069341	ae91e148-4b4d-49c0-80bf-242c6d8ef36f	SEED-ORDER-0070	0af57dfc-60e6-4034-8da8-b88710803161
1	18990000.00	2026-07-02 21:07:18.689608	2026-07-02 21:07:18.689608	da4d38d0-ad4d-4eb2-95ad-248d2dfd100e	SEED-ORDER-0071	fd9a89b8-08dc-4152-a9d1-7c6183b26dd8
1	8990000.00	2026-07-02 21:07:20.859277	2026-07-02 21:07:20.859277	75bbc69e-8e15-4333-a357-7987ea0b66f3	SEED-ORDER-0072	cdbf0f04-4d32-41bd-833f-dfc461aa6377
1	25990000.00	2026-07-02 21:07:20.859277	2026-07-02 21:07:20.859277	2f20d8b0-7bcf-4c9f-8fae-e294712b6c9c	SEED-ORDER-0072	86f601dd-9a4f-4d71-83b0-cacddd84b15e
1	25990000.00	2026-07-02 21:07:23.385682	2026-07-02 21:07:23.385682	a9bfbdf1-6870-40a4-a1eb-9ffec28a1149	SEED-ORDER-0073	b836cc19-cd61-4c8f-96e0-269b7e752f05
1	15990000.00	2026-07-02 21:07:23.385682	2026-07-02 21:07:23.385682	66e0c050-8985-4fe8-a987-a45cbd62f5f7	SEED-ORDER-0073	7392b678-89b4-41db-bc33-e1cdeb67d584
1	28490000.00	2026-07-02 21:07:25.89561	2026-07-02 21:07:25.89561	fd963de1-ddc7-4b89-b84d-54345e2c7720	SEED-ORDER-0074	28bb64af-62d3-4bd4-ad24-a1df5e747a3f
1	24990000.00	2026-07-02 21:07:25.896191	2026-07-02 21:07:25.896191	7a3a1e23-b58b-4339-9fb9-ab7bd687038b	SEED-ORDER-0074	e41c406e-a753-48f3-9955-2b3d60464444
1	3490000.00	2026-07-02 21:07:28.496744	2026-07-02 21:07:28.496744	10a72679-ab6d-4562-8a99-856022f7ad78	SEED-ORDER-0075	a6296d67-6b02-4e5b-a4b1-eb39f41499b1
1	8990000.00	2026-07-02 21:07:28.497753	2026-07-02 21:07:28.497753	b8cd67d3-cb8d-42db-90d8-d85a12657364	SEED-ORDER-0075	0960b0a5-1ee0-4f82-81d8-ecbe2553554e
1	19990000.00	2026-07-02 21:07:30.526507	2026-07-02 21:07:30.526507	03f2acd0-427e-44a1-871c-65fb493f0fca	SEED-ORDER-0076	aab559cf-925e-4c17-aff6-f8a9af730762
1	8990000.00	2026-07-02 21:07:32.582366	2026-07-02 21:07:32.582366	8950b998-eacc-4be1-8c12-ffedcae6a917	SEED-ORDER-0077	e4ac7d52-3482-43b5-ad3c-9b1f12e1f7f9
1	37990000.00	2026-07-02 21:07:32.582366	2026-07-02 21:07:32.582366	87a47d4c-c5de-4201-abaf-05e6f6e584e3	SEED-ORDER-0077	6f7d8c5f-e149-4cf3-9335-d6005db3db30
1	24990000.00	2026-07-02 21:07:35.132918	2026-07-02 21:07:35.132918	81204833-3110-434b-a5e2-752cb48ee259	SEED-ORDER-0078	ae663292-0f5b-4b94-aad7-f77a3c20db3b
1	15990000.00	2026-07-02 21:07:35.132918	2026-07-02 21:07:35.132918	7e54eb19-9967-4047-8fa6-84e1caf32c46	SEED-ORDER-0078	01e16c4c-7201-4a77-8e61-cf4a9caf49e2
1	24990000.00	2026-07-02 21:07:37.198234	2026-07-02 21:07:37.198234	9330fdda-175e-49a9-b103-03521c3b5565	SEED-ORDER-0079	48dc6932-2ce7-4b1e-861d-78f939d76f7b
1	18990000.00	2026-07-02 21:07:39.268678	2026-07-02 21:07:39.268678	08bb1d0f-10ad-48d8-8041-35d1542cf4f3	SEED-ORDER-0080	ee58ac72-7665-403c-bd41-698398b69227
1	37990000.00	2026-07-02 21:07:40.890654	2026-07-02 21:07:40.890654	28af0f20-6495-48be-b54e-aea1a2baf9a6	SEED-ORDER-0081	0260d426-c7a0-4c56-bdbb-566f71a3bae3
1	16990000.00	2026-07-02 21:07:42.968646	2026-07-02 21:07:42.968646	bab2a741-966d-4395-b765-59084c73ea2d	SEED-ORDER-0082	ab3026af-4cf8-4dbe-812b-02fc8196fb8d
1	18990000.00	2026-07-02 21:07:42.968646	2026-07-02 21:07:42.968646	62d96111-36ef-4e14-a978-8b328f6dc65e	SEED-ORDER-0082	cf41e779-0149-4e84-bddf-c67fad08f42c
1	16990000.00	2026-07-02 21:07:45.498518	2026-07-02 21:07:45.498518	21599256-31bf-4255-8612-d7f865442009	SEED-ORDER-0083	824c9645-f656-4a27-adff-abb0c2a952cb
1	22490000.00	2026-07-02 21:07:45.498518	2026-07-02 21:07:45.498518	45adb814-1311-4518-9a9b-b65fd4a3088c	SEED-ORDER-0083	29fd26f9-5785-4c0a-b8a4-e998a611fa08
1	15990000.00	2026-07-02 21:07:47.543124	2026-07-02 21:07:47.543124	33a8e5f5-6bd3-4592-8f95-8a74b2090672	SEED-ORDER-0084	548756de-7931-4e79-94e6-aac784d0cdc6
1	19990000.00	2026-07-02 21:07:49.729618	2026-07-02 21:07:49.729618	216c0c88-f51d-4bf4-beb9-819e569a7b09	SEED-ORDER-0085	8c40ce43-b3fd-4b16-97dd-f55bc62cc464
1	27990000.00	2026-07-02 21:07:49.729618	2026-07-02 21:07:49.729618	cec0f896-ae2b-44b7-9b5b-c3dbcaecbd61	SEED-ORDER-0085	a16801de-291c-491b-8862-b781eb2fd2b9
1	18990000.00	2026-07-02 21:07:52.313406	2026-07-02 21:07:52.313406	31036262-f694-4123-8816-6d0bae7486e6	SEED-ORDER-0086	59771aa9-0e03-4a5a-969f-2e6c68511f6f
1	17990000.00	2026-07-02 21:07:52.313406	2026-07-02 21:07:52.313406	c14a2db4-8ea2-4099-9097-4e77a4ce09ba	SEED-ORDER-0086	42ee0607-c0b4-4ca6-8b8d-ceaecbf7fe4e
1	22990000.00	2026-07-02 21:07:54.908919	2026-07-02 21:07:54.908919	92e00d8d-267d-4bfd-bcf6-fd0ee138eb4f	SEED-ORDER-0087	fb9f58d6-a451-4d5d-a6e1-6fe2d8d902f1
1	19990000.00	2026-07-02 21:07:54.911986	2026-07-02 21:07:54.911986	427751d2-4264-4afd-a99a-519a450a808c	SEED-ORDER-0087	2618e911-e149-4bf6-9f91-2fddd2c3cd30
1	15990000.00	2026-07-02 21:07:57.838494	2026-07-02 21:07:57.838494	b21fa5df-0d41-4bd3-a711-ab8c83638c2d	SEED-ORDER-0088	9461f184-b574-498d-b8b8-732d28c5a179
1	27990000.00	2026-07-02 21:07:57.839493	2026-07-02 21:07:57.839493	5ac97fef-8387-4412-98c6-3ee976e51353	SEED-ORDER-0088	b9ac8c37-9d65-40f8-807c-a0e5cf7f5416
1	19990000.00	2026-07-02 21:08:00.43332	2026-07-02 21:08:00.43332	cefebd2f-aa47-4a7e-9e3a-dcfeabd5cf36	SEED-ORDER-0089	41161e45-b281-449d-8772-624d323ff82c
1	2990000.00	2026-07-02 21:08:00.434312	2026-07-02 21:08:00.434312	ab666f92-1fa8-41a1-afc3-0cd60fdc2449	SEED-ORDER-0089	5d73c9f4-5b32-4bf8-80da-dbca1576df32
1	19990000.00	2026-07-02 21:08:03.038071	2026-07-02 21:08:03.038071	8dae834f-1365-4698-93a1-f5b77854bd24	SEED-ORDER-0090	7f8b7969-7d72-48ec-a38a-789eed544bc2
1	34990000.00	2026-07-02 21:08:03.038071	2026-07-02 21:08:03.038071	916b5a54-6861-4bd3-8edc-8f10df5e8d32	SEED-ORDER-0090	c03e4bb4-2b1f-4bfa-a081-3c3be0488888
1	17990000.00	2026-07-02 21:08:05.799187	2026-07-02 21:08:05.799187	10fae445-edbc-4d15-9216-23d80ddee278	SEED-ORDER-0091	2f1bdf9b-a6e5-4c20-87ed-a9d1b42be3fa
1	22990000.00	2026-07-02 21:08:05.799187	2026-07-02 21:08:05.799187	868aa29e-c2b3-4b1c-bf38-e09a1567624f	SEED-ORDER-0091	b33c6259-c163-456a-ba78-aa13e6c72409
1	19990000.00	2026-07-02 21:08:07.909571	2026-07-02 21:08:07.909571	2a163536-3a0f-492b-b2d9-8cc7d131e19a	SEED-ORDER-0092	103a63f5-e4d6-4c9f-84b9-754c538faaa7
1	12490000.00	2026-07-02 21:08:09.498026	2026-07-02 21:08:09.498026	d3d13689-1dc0-4d65-bffe-0d8ad7a2fb47	SEED-ORDER-0093	196affca-3765-4b6a-85fa-22a65c8308a5
1	24490000.00	2026-07-02 21:08:11.127672	2026-07-02 21:08:11.127672	84ec615d-87af-4197-95fa-bc2eb499ec69	SEED-ORDER-0094	4a68318a-dc5b-441c-a096-eb6874357eb9
1	7490000.00	2026-07-02 21:08:12.732688	2026-07-02 21:08:12.732688	a3f16bed-59a4-4544-b3fb-2321656d4cdd	SEED-ORDER-0095	e618947e-16b7-4168-93fe-6fdad6a3a090
1	15990000.00	2026-07-02 21:08:14.895969	2026-07-02 21:08:14.895969	1a551178-7110-4810-b625-d59b8e041a5e	SEED-ORDER-0096	9c8ce216-6aa7-42d2-b5bf-e11cc01f6faa
1	14990000.00	2026-07-02 21:08:16.503638	2026-07-02 21:08:16.503638	eb2cfed7-a755-4f8c-86b5-3bb739be24fa	SEED-ORDER-0097	00fdb19f-7b25-491b-bb3a-8752b5e89f44
1	33990000.00	2026-07-02 21:08:18.152578	2026-07-02 21:08:18.152578	81ab2db1-1e92-420d-b53f-5aadccf8dc31	SEED-ORDER-0098	09a7b7b6-f204-47a0-981a-c6786cab519a
1	21990000.00	2026-07-02 21:08:19.817161	2026-07-02 21:08:19.817161	a6ece104-71a8-47da-9570-4be2acd4f430	SEED-ORDER-0099	1abc04db-05fd-4ad3-af2e-f355ee269607
1	27990000.00	2026-07-02 21:08:21.853869	2026-07-02 21:08:21.853869	0fe99f79-c8d2-4fef-a403-8991a188d113	SEED-ORDER-0100	a68b46b8-d6be-49cd-a753-0741ac23ef28
1	6490000.00	2026-07-02 21:08:21.854882	2026-07-02 21:08:21.854882	d1f2cbcc-09f9-437b-bc33-26597fc5023f	SEED-ORDER-0100	5794d6f6-122e-4eae-999a-7051925e3e0c
1	28990000.00	2026-07-02 21:08:23.913828	2026-07-02 21:08:23.913828	28376a19-52a5-4cf7-b523-c127d1bf7038	SEED-ORDER-0101	9fec2cf1-8870-48cf-9ad0-5ee1bf34bc87
1	34990000.00	2026-07-02 21:08:25.942909	2026-07-02 21:08:25.942909	a655d706-a17f-4255-873d-5f5853094bbc	SEED-ORDER-0102	9179c641-1a91-4e08-b4c0-7212763c4239
1	27990000.00	2026-07-02 21:08:27.538165	2026-07-02 21:08:27.538165	55ad9719-3931-497e-b7af-549a7d3aa1c3	SEED-ORDER-0103	c6b2cdc6-7eb7-4a65-bd79-3c4b8d0d726d
1	16990000.00	2026-07-02 21:08:29.599178	2026-07-02 21:08:29.599178	2c2186ca-13d6-487f-9d22-f92813d3309a	SEED-ORDER-0104	1cdabbab-8448-4f05-808d-3edeea4e7f25
1	17990000.00	2026-07-02 21:08:29.600692	2026-07-02 21:08:29.600692	a3d8e698-f55e-4b56-81d8-f0f6e6036f79	SEED-ORDER-0104	f38c0c1f-ae3c-486d-b072-50ae2a1a0fcb
1	47990000.00	2026-07-02 21:08:32.396215	2026-07-02 21:08:32.396215	33167f2a-8e2b-4fcc-9a52-fbbddca1c5d0	SEED-ORDER-0105	8aaa8049-5cbb-4ece-92b1-95b783c5a986
1	21990000.00	2026-07-02 21:08:32.397284	2026-07-02 21:08:32.397284	ea977333-fe1a-4e1b-bee9-d03e95ad2a93	SEED-ORDER-0105	cc71dfdd-3a2f-4da7-bb4b-1ebf795d916a
1	14990000.00	2026-07-02 21:08:34.945129	2026-07-02 21:08:34.945129	3b90b9d9-f74b-4456-869f-88b7a5ff1e38	SEED-ORDER-0106	589e2541-9f64-4bbf-936c-c59ef74fb21d
1	17990000.00	2026-07-02 21:08:34.946129	2026-07-02 21:08:34.946129	d55f3f30-9668-444e-b776-804bc2e94192	SEED-ORDER-0106	ade3d84d-d63b-46c6-bb68-f668e1ad2d3d
1	13990000.00	2026-07-02 21:08:37.723326	2026-07-02 21:08:37.723326	9a7ed506-d6d4-4f09-a4c1-bbdb6bf1f826	SEED-ORDER-0107	ec66d706-db06-491f-86ab-7e3cba2414ca
1	14990000.00	2026-07-02 21:08:37.724341	2026-07-02 21:08:37.724341	c6e01614-9a73-436e-bfdc-8c5fea76988e	SEED-ORDER-0107	9b04682f-5428-44e4-9ff4-cc75b3c80eb9
1	47990000.00	2026-07-02 21:08:40.846933	2026-07-02 21:08:40.846933	91438ce1-41ac-4e81-8b03-a9f02e192fdf	SEED-ORDER-0108	3a74f773-e3e5-4c21-9c5c-4bf4f5dac030
1	22490000.00	2026-07-02 21:08:40.847929	2026-07-02 21:08:40.847929	59c00509-4f08-4f3c-8765-f3b7c804ae1e	SEED-ORDER-0108	12d5b0d1-005f-46f3-9a4b-10c47a3dc2d0
1	24990000.00	2026-07-02 21:08:43.378859	2026-07-02 21:08:43.378859	29e28764-3bb3-4129-8628-fd32fcb29165	SEED-ORDER-0109	24263295-7148-46ad-af0b-523bc9f793c2
1	18990000.00	2026-07-02 21:08:43.378859	2026-07-02 21:08:43.378859	03c54da9-f888-4c2b-9695-573e97d690e6	SEED-ORDER-0109	daad2ee0-e90c-4332-9a37-48ad31bd9bf5
1	34990000.00	2026-07-02 21:08:46.023939	2026-07-02 21:08:46.023939	966b8b78-99e4-4be8-88f3-17c516b0e4fa	SEED-ORDER-0110	bcddbbeb-56aa-4b2b-9d95-6a898df0654c
1	22490000.00	2026-07-02 21:08:46.023939	2026-07-02 21:08:46.023939	87d083ca-eacb-427d-bc9b-ae0289838af2	SEED-ORDER-0110	d7ae48bd-ff6d-4eaf-95fe-98e5053dd2bb
1	28990000.00	2026-07-02 21:08:48.514232	2026-07-02 21:08:48.514232	f72a6e01-509e-4cd1-bdc9-7b990f24c98b	SEED-ORDER-0111	a7655127-270c-409c-9e3d-a11df7526f84
1	19990000.00	2026-07-02 21:08:50.137585	2026-07-02 21:08:50.137585	2d515c2b-41ea-4c5d-93bf-f5e6497181c4	SEED-ORDER-0112	0be2dc74-8691-4102-9d77-0998e6e956a3
1	15990000.00	2026-07-02 21:08:51.807943	2026-07-02 21:08:51.807943	22c882c2-488e-4586-8729-e726a869e538	SEED-ORDER-0113	c4a3c3ee-8414-4189-aec3-7b7a81d16222
1	15990000.00	2026-07-02 21:08:53.516988	2026-07-02 21:08:53.516988	528c0c87-7b75-4431-9620-3b641e6f0339	SEED-ORDER-0114	e4ee4b25-13e9-44ea-9b90-fdd4420976e5
1	25990000.00	2026-07-02 21:08:55.619739	2026-07-02 21:08:55.619739	bcfb41ee-5f09-4dd2-9f38-3f6050c7d61e	SEED-ORDER-0115	411a3faf-4e13-4136-b9ad-9f88c2448108
1	15990000.00	2026-07-02 21:08:55.620624	2026-07-02 21:08:55.620624	2fcae8e8-fc75-4aae-9b34-8c2f889da15d	SEED-ORDER-0115	9f40d28e-0614-4c2d-b57c-9777fb7c5a99
1	43990000.00	2026-07-02 21:08:58.897762	2026-07-02 21:08:58.897762	427620fc-7e53-4104-ae21-015485dfa9b5	SEED-ORDER-0116	2bb2e651-687e-4416-b7cf-32e1a48e09de
1	25990000.00	2026-07-02 21:08:58.898778	2026-07-02 21:08:58.898778	f17266bd-0189-4231-9410-dfdbeaa8614b	SEED-ORDER-0116	a3926e79-cf3c-4a20-a7e7-bdbd86e58de2
1	19990000.00	2026-07-02 21:09:01.789604	2026-07-02 21:09:01.789604	30190906-c4e9-49ec-b2ae-6ad2741715f1	SEED-ORDER-0117	1475752b-ebb0-4c47-b75c-c6c0a64d0967
1	18990000.00	2026-07-02 21:09:01.789604	2026-07-02 21:09:01.789604	2e59bcbe-cb2c-4682-8727-336a62e8cc3a	SEED-ORDER-0117	7c18aa21-3a0a-4899-8d5d-7c3427d4f083
1	37990000.00	2026-07-02 21:09:03.97142	2026-07-02 21:09:03.97142	0cd814d2-9155-4381-992b-f12f9d31add7	SEED-ORDER-0118	e2a152d0-4f84-44ff-ae2d-e9e494ad4a93
1	28990000.00	2026-07-02 21:09:06.064101	2026-07-02 21:09:06.064101	0caf09dd-9b7e-4871-9d0a-0a734e07c901	SEED-ORDER-0119	26b2d704-0905-4c95-adf2-b00f7f58e045
1	24990000.00	2026-07-02 21:09:06.064101	2026-07-02 21:09:06.064101	38e76fc0-4de8-4dca-8198-66fe596c899e	SEED-ORDER-0119	a7392b5f-e53b-4187-9de5-07f0d4ff6efe
1	28490000.00	2026-07-02 21:09:08.131097	2026-07-02 21:09:08.131097	fa20a16d-587d-4f66-9a6e-8c0e85093122	SEED-ORDER-0120	db2c8beb-f0dd-4c1d-9ffc-9a04ff59a6e3
1	27990000.00	2026-07-02 21:09:10.289193	2026-07-02 21:09:10.289193	7068faad-84ac-41cf-9360-5540912b8715	SEED-ORDER-0121	86ac42ae-0d31-436c-9d13-580b0b46c063
1	14990000.00	2026-07-02 21:09:10.289193	2026-07-02 21:09:10.289193	85402972-b6a0-4a30-a88d-5e8b53066f53	SEED-ORDER-0121	adfc2355-6c05-4211-adc0-c7d79a1be510
1	25490000.00	2026-07-02 21:09:12.748107	2026-07-02 21:09:12.748107	b63e900d-0e38-431d-af32-a0eeeced007c	SEED-ORDER-0122	ec6bb45c-b2c7-48d2-b214-3ef5e0f11698
1	15990000.00	2026-07-02 21:09:14.798184	2026-07-02 21:09:14.798184	7b0a4028-6812-4992-8c45-826dda3fed68	SEED-ORDER-0123	96d1120b-9b0c-4d1c-a24d-d2afa05fc89c
1	28490000.00	2026-07-02 21:09:17.014474	2026-07-02 21:09:17.014474	7de1ab23-f2f5-452f-8699-c8ccd8f71591	SEED-ORDER-0124	70c147d6-623d-4a69-b14c-1f7c11a340ea
1	8990000.00	2026-07-02 21:09:17.015396	2026-07-02 21:09:17.015396	2302dce7-ebf3-49a9-a89a-f98cb5321937	SEED-ORDER-0124	6478c85d-1f2b-4d23-9085-a330b8bae732
1	3490000.00	2026-07-02 21:09:19.383024	2026-07-02 21:09:19.383024	08ca1607-610d-4a05-b468-a0b27c71dffe	SEED-ORDER-0125	6f7395e5-721c-47c7-ba18-63195e432b36
1	17990000.00	2026-07-02 21:09:21.123201	2026-07-02 21:09:21.123201	54f77bd2-f389-4124-946d-44927ff519f7	SEED-ORDER-0126	885f5683-18bc-4b6d-8e30-9a8f78fa400d
1	13990000.00	2026-07-02 21:09:23.716346	2026-07-02 21:09:23.716346	721ad1be-5ebe-4fb4-9ffc-478ac5539b68	SEED-ORDER-0127	1d0dfa65-2eae-4ec7-b8c4-9e66de110930
1	14990000.00	2026-07-02 21:09:23.716346	2026-07-02 21:09:23.716346	09f517a7-8e63-4627-af8e-c3a1ea96c843	SEED-ORDER-0127	f1db027e-5221-4c09-a04e-35c7445badd1
1	8990000.00	2026-07-02 21:09:25.763561	2026-07-02 21:09:25.763561	3772467b-0b52-40ce-b677-7f13209ae8c3	SEED-ORDER-0128	68e921d0-6a49-4315-a331-79fc5cd36410
1	24990000.00	2026-07-02 21:09:27.630107	2026-07-02 21:09:27.630107	79ecc230-f706-49d5-ba0a-580085486584	SEED-ORDER-0129	552280a0-62ea-46ef-b0da-51dd8524b4c0
1	18990000.00	2026-07-02 21:09:29.398297	2026-07-02 21:09:29.398297	7fcba744-dd3e-452b-b86e-7cee74c4a84a	SEED-ORDER-0130	142e1678-b7f0-4e67-8167-7539436161b0
1	34990000.00	2026-07-02 21:09:31.013027	2026-07-02 21:09:31.013027	a1aa9d8f-ca0f-459b-b247-5bbf87bd5128	SEED-ORDER-0131	ad371af6-b839-4ae2-a735-6c7fce54f8ea
1	21990000.00	2026-07-02 21:09:32.635975	2026-07-02 21:09:32.635975	850112e8-8907-48af-8bbc-ec46b21c745a	SEED-ORDER-0132	7d35cfba-adb5-42ea-bfff-e59d0a12d85b
1	16990000.00	2026-07-02 21:09:34.746831	2026-07-02 21:09:34.746831	99f999d7-f27c-451b-9742-dc95f0e975d5	SEED-ORDER-0133	d0c0aa3f-b269-40cb-a351-3b58010f0b61
1	25490000.00	2026-07-02 21:09:34.746831	2026-07-02 21:09:34.746831	3160b69d-8fbc-4d57-bbd1-aef516e57aad	SEED-ORDER-0133	cb928d4f-63f6-4ba2-8a19-bef6d90aa3c7
1	25490000.00	2026-07-02 21:09:36.981542	2026-07-02 21:09:36.981542	41b9061c-f3b2-4cb2-a18c-9953567e29a5	SEED-ORDER-0134	0d47a50f-57d6-4010-896e-d24a4ae4a89a
1	12490000.00	2026-07-02 21:09:39.045169	2026-07-02 21:09:39.045169	6f84efbc-91e8-496f-82d4-f59b057678b3	SEED-ORDER-0135	f0bd59c6-e9f9-42b3-9dab-315a13921aa4
1	24990000.00	2026-07-02 21:09:39.045778	2026-07-02 21:09:39.045778	570ef5d6-548e-435e-912f-b2f5a8a1effa	SEED-ORDER-0135	0d5697fb-8927-4271-8530-d49312379bd0
1	16990000.00	2026-07-02 21:09:41.673388	2026-07-02 21:09:41.673388	bb037e72-57c3-45de-943f-24638f17621f	SEED-ORDER-0136	02801f85-0a29-46e9-b3d4-cae579be7711
1	8990000.00	2026-07-02 21:09:41.674383	2026-07-02 21:09:41.674383	2cc5d5b1-9bf2-4063-adb0-0a59198e9c7c	SEED-ORDER-0136	7e354000-1a0b-4265-ba2a-5d7af8c6eca1
1	21990000.00	2026-07-02 21:09:43.85493	2026-07-02 21:09:43.85493	ef08587f-e207-4e36-9fb5-227fa1ed8c00	SEED-ORDER-0137	7ca357e8-65ad-412a-851f-2265d653229c
1	15990000.00	2026-07-02 21:09:45.908233	2026-07-02 21:09:45.908233	ab91bb0f-19d9-4ec3-a882-3cb858ed8d95	SEED-ORDER-0138	11591511-61e6-4f4f-b2ae-a7e72c814ccd
1	17990000.00	2026-07-02 21:09:47.997398	2026-07-02 21:09:47.997398	0d234dfa-d630-47cf-b665-39e4a915979e	SEED-ORDER-0139	b2338270-1ae4-495f-b1c1-436d1a64bba7
1	7490000.00	2026-07-02 21:09:47.997398	2026-07-02 21:09:47.997398	6e38ddf4-e386-4f43-8e87-2bc35b2912ac	SEED-ORDER-0139	7eff3167-3d1b-4cd6-93a3-72c5b1c71e0e
1	18990000.00	2026-07-02 21:09:50.767694	2026-07-02 21:09:50.767694	1be6a1ab-d9be-4f30-bde0-407b06c4e6cc	SEED-ORDER-0140	30d66397-558e-4eaa-bdae-c223a5f402ea
1	25990000.00	2026-07-02 21:09:52.408356	2026-07-02 21:09:52.408356	afbe06ea-b441-4b46-acfc-3bd059e13b13	SEED-ORDER-0141	be7be0ec-8d1e-4334-b6ca-efef50ae9cf4
1	21990000.00	2026-07-02 21:09:54.315548	2026-07-02 21:09:54.315548	c939d04d-f165-4e4d-842f-046b206c183d	SEED-ORDER-0142	974e05d4-2e6e-4861-9283-6a5dfcf631de
1	27990000.00	2026-07-02 21:09:56.48727	2026-07-02 21:09:56.48727	d7351b69-6bc8-4c89-8924-d21f8830336f	SEED-ORDER-0143	f4a818f9-96cc-4b04-815c-d56be75fdb97
1	13990000.00	2026-07-02 21:09:56.48727	2026-07-02 21:09:56.48727	c4971694-40f5-40e6-b5fa-c82c4a05b321	SEED-ORDER-0143	109b053d-ae66-4926-8b91-c1231e5bbd53
1	21990000.00	2026-07-02 21:09:59.009197	2026-07-02 21:09:59.009197	c5e3cc1f-4367-4f59-88a9-952133905080	SEED-ORDER-0144	1a2e73d9-b4ef-4baa-b983-bff708cf97bf
1	2990000.00	2026-07-02 21:09:59.009197	2026-07-02 21:09:59.009197	dc0fd7ea-bacb-4257-b401-1e2eff795a1c	SEED-ORDER-0144	fe4dae83-6151-4744-a114-4258ca063024
1	25990000.00	2026-07-02 21:10:01.540462	2026-07-02 21:10:01.540462	a74a7c71-ab3f-4484-ac4b-e335935e7d18	SEED-ORDER-0145	82befcf1-142e-419f-b7a2-42626843f660
1	22990000.00	2026-07-02 21:10:01.541475	2026-07-02 21:10:01.541475	bf175248-a10d-490d-aaa1-9a179d6f90e4	SEED-ORDER-0145	648922ab-e1cc-40b1-8a01-706a2769a7a4
1	37990000.00	2026-07-02 21:10:04.822928	2026-07-02 21:10:04.822928	7bd4fd80-f407-40ca-a25b-e11c3db84bd5	SEED-ORDER-0146	009200d3-2fd9-4a91-be79-05f52b338c02
1	22990000.00	2026-07-02 21:10:04.82359	2026-07-02 21:10:04.82359	a1b7fc8a-ad1b-4321-b05b-25dafd483441	SEED-ORDER-0146	50138b09-6ebe-45e3-ac51-290cbde3bd00
1	17990000.00	2026-07-02 21:10:07.355379	2026-07-02 21:10:07.355379	6720d30a-2c90-4a73-a118-48f9b3e2d033	SEED-ORDER-0147	de3a6194-78cd-49a5-940b-0b0e198d6e01
1	22490000.00	2026-07-02 21:10:07.355379	2026-07-02 21:10:07.355379	223ca91e-2455-4840-a2fa-90e019befba0	SEED-ORDER-0147	49381364-5576-4952-80a2-e8b28a80f18b
1	21990000.00	2026-07-02 21:10:09.404236	2026-07-02 21:10:09.404236	a919cdac-c44c-4256-bc66-5c7a4bb06a36	SEED-ORDER-0148	d983b1f7-4dd4-4329-8256-eb4d27ab9c4d
1	24990000.00	2026-07-02 21:10:11.5369	2026-07-02 21:10:11.5369	0a789411-752f-4718-8f14-08f33539adb8	SEED-ORDER-0149	96560ac3-b8b4-4813-b3c3-0883a878096b
1	21990000.00	2026-07-02 21:10:11.5369	2026-07-02 21:10:11.5369	6998035c-c811-4713-91f8-a18f20802ead	SEED-ORDER-0149	9e5dfdea-4058-4810-abef-9e998ced56ea
1	24990000.00	2026-07-02 21:10:13.598035	2026-07-02 21:10:13.598035	13f4ec12-9d44-4134-9cd9-37dde0306a2c	SEED-ORDER-0150	93803f5c-1957-4381-bc91-c0687b756a9b
1	10490000.00	2026-07-02 21:10:15.64951	2026-07-02 21:10:15.64951	4cebe8fd-4164-4b4d-800b-063b0358fb86	SEED-ORDER-0151	f89577ba-2871-4a1c-bcfe-80d0ddb07fc3
1	15990000.00	2026-07-02 21:10:17.991074	2026-07-02 21:10:17.991074	98c77c08-1cec-47a0-a34a-bd3c023e22ec	SEED-ORDER-0152	a0c68271-29bd-4077-ad16-90102493bde6
1	21990000.00	2026-07-02 21:10:17.991074	2026-07-02 21:10:17.991074	4f0f2f11-5529-4220-8784-8f61e1147c0f	SEED-ORDER-0152	a5def204-8821-48a1-86f0-4bc669fe08d3
1	14990000.00	2026-07-02 21:10:19.998371	2026-07-02 21:10:19.998371	920c1898-8457-4464-8070-f364f595fad4	SEED-ORDER-0153	a663752c-3da4-48b9-848b-0b7dc239d39a
1	24990000.00	2026-07-02 21:10:22.149102	2026-07-02 21:10:22.149102	347cf272-8ee1-417f-a0ed-64597bc6258f	SEED-ORDER-0154	ca06b209-f72e-4ae4-a8ff-c11fc00bc55f
1	22490000.00	2026-07-02 21:10:22.149102	2026-07-02 21:10:22.149102	3bb563b6-c8b0-4c1a-a97d-e63a91a2edbe	SEED-ORDER-0154	d74c9e45-c1b5-4038-a960-d5499c0ea7ee
1	10490000.00	2026-07-02 21:10:24.214902	2026-07-02 21:10:24.214902	1b3b0c98-e3a7-48be-b637-16f51d64ea6f	SEED-ORDER-0155	5c1f8ffb-7594-4729-bbb5-220f8990bd9d
1	13990000.00	2026-07-02 21:10:26.257424	2026-07-02 21:10:26.257424	fd86f647-6a66-4cd7-9582-fa773fa8706c	SEED-ORDER-0156	714308f7-83e7-431d-b20c-42cbfcd39424
1	8990000.00	2026-07-02 21:10:26.258437	2026-07-02 21:10:26.258437	891827b0-401b-48b2-ba24-11c83a6879cf	SEED-ORDER-0156	2d1632bc-8815-4ec6-90d8-d63838346ae0
1	21990000.00	2026-07-02 21:10:29.163605	2026-07-02 21:10:29.163605	4e5f99af-15ec-409b-9f6e-958272d0833f	SEED-ORDER-0157	acacb039-e7cf-4366-a424-6f5d96cbfc81
1	3490000.00	2026-07-02 21:10:29.163605	2026-07-02 21:10:29.163605	56173c76-9ea9-4fd3-ad82-310da0225379	SEED-ORDER-0157	aadbb110-19e0-47c3-890c-db97c285f457
1	33990000.00	2026-07-02 21:10:31.312554	2026-07-02 21:10:31.312554	b244e948-d53e-4a39-a559-85707e9afa51	SEED-ORDER-0158	c3886c2e-2366-43c2-b51c-054b6179abad
1	22490000.00	2026-07-02 21:10:33.333055	2026-07-02 21:10:33.333055	b74e7124-bba1-4945-811d-20480d5fae11	SEED-ORDER-0159	e201ed9c-4450-4349-ab58-1ef61d15f945
1	2990000.00	2026-07-02 21:10:33.333055	2026-07-02 21:10:33.333055	223dd948-0273-4c65-874b-cc555a0383ae	SEED-ORDER-0159	5c74a142-cc8a-48a9-93d1-25c1f7f24f1b
1	28490000.00	2026-07-02 21:10:36.441567	2026-07-02 21:10:36.441567	8117de6b-e60a-4615-8f80-20a58aa7e7ab	SEED-ORDER-0160	453f7d76-d4af-4f1d-890b-773ea2b7f14f
1	10490000.00	2026-07-02 21:10:36.441567	2026-07-02 21:10:36.441567	17d1275d-efef-4734-a251-097b8d4b46d0	SEED-ORDER-0160	b714cf2d-5c53-4ef6-bcb2-6223bb6c4b6f
1	6490000.00	2026-07-02 21:10:38.913036	2026-07-02 21:10:38.913036	22691361-42f8-4926-a368-d886eed804f9	SEED-ORDER-0161	fc9d54bb-78f6-46cb-9e52-f40e1d6f8bc4
1	21990000.00	2026-07-02 21:10:38.913036	2026-07-02 21:10:38.913036	f121a802-70f9-4f30-bc78-dc1181a0729e	SEED-ORDER-0161	128e5af9-b4e7-439e-af15-e6a84530a3a1
1	21990000.00	2026-07-02 21:10:42.167997	2026-07-02 21:10:42.167997	c8633e57-6831-45c8-b659-0ceb01646056	SEED-ORDER-0162	6748dfcb-c195-46b3-8b21-0a4d7dd11e13
1	7490000.00	2026-07-02 21:10:42.167997	2026-07-02 21:10:42.167997	f5634bac-9efe-4a67-a4f5-ee4e21e44776	SEED-ORDER-0162	dd958706-8614-4444-bed3-34b815627c7e
1	15990000.00	2026-07-02 21:10:44.69447	2026-07-02 21:10:44.69447	3f9a3b5c-451f-4acd-acfe-e79cf6f77f4a	SEED-ORDER-0163	139c7542-fe43-4694-a081-af571429ea1b
1	6490000.00	2026-07-02 21:10:44.69548	2026-07-02 21:10:44.69548	bda63770-978f-45d4-ac0d-8e27a52b175a	SEED-ORDER-0163	26541ef3-2e86-40d2-b874-59072f538638
1	7490000.00	2026-07-02 21:10:47.409114	2026-07-02 21:10:47.409114	fc2f0e78-d229-4daa-9b2e-64f9359afdd1	SEED-ORDER-0164	aae887f7-ea45-4693-9f4f-7aba14050a09
1	14990000.00	2026-07-02 21:10:47.409114	2026-07-02 21:10:47.409114	d01de5d4-62d0-46de-806e-4019a6d27aaf	SEED-ORDER-0164	668d0ae9-916e-4934-b50f-14513c18a075
1	18990000.00	2026-07-02 21:10:49.427004	2026-07-02 21:10:49.427004	a7fa2919-d7ad-4d60-ad05-267de9049004	SEED-ORDER-0165	30b2052b-cefe-4d65-993b-68326d3d7221
1	34990000.00	2026-07-02 21:10:51.419167	2026-07-02 21:10:51.419167	5729d55d-7868-46ae-b8e2-944f882045d5	SEED-ORDER-0166	67f2fb4f-e8b9-43f1-8d24-db8a344b8835
1	30990000.00	2026-07-02 21:10:53.660773	2026-07-02 21:10:53.660773	a9472957-76b0-4ae4-ab07-ae6409451f7e	SEED-ORDER-0167	25214433-56f7-4b52-b131-f9c5b64d2b56
1	21990000.00	2026-07-02 21:10:53.661373	2026-07-02 21:10:53.661373	f7fb4dca-f0d2-4e85-9d8c-5264d0fefe03	SEED-ORDER-0167	c606b391-27d3-4373-8aca-e2c85a3e3f57
1	7490000.00	2026-07-02 21:10:55.855391	2026-07-02 21:10:55.855391	afa908cf-b9ae-4834-912d-dbf1db263553	SEED-ORDER-0168	c73f3c2c-3efe-4875-b4ba-887bb4306df6
1	21990000.00	2026-07-02 21:10:57.450657	2026-07-02 21:10:57.450657	bf42bf0a-7b2f-4470-afec-12220db01efc	SEED-ORDER-0169	89b2275b-5fd4-4d08-a924-e18c5b1047a9
1	37990000.00	2026-07-02 21:10:59.535593	2026-07-02 21:10:59.535593	66f1f87e-117d-422e-8c7a-686b0902431a	SEED-ORDER-0170	7b9211b7-0c34-4d7b-85f0-4c2ea5ce4383
1	25990000.00	2026-07-02 21:10:59.536673	2026-07-02 21:10:59.536673	71805cd2-e820-4178-8cca-cc163832b162	SEED-ORDER-0170	759e77d5-1876-4fe7-86b9-9002105c866b
1	24990000.00	2026-07-02 21:11:02.976517	2026-07-02 21:11:02.976517	a26e4b28-e7a1-4327-998c-7f9692a1bd44	SEED-ORDER-0171	8fd0b1cc-d1c0-4371-895a-4b9f57a21d11
1	25490000.00	2026-07-02 21:11:02.976517	2026-07-02 21:11:02.976517	675c65ad-6634-4900-9578-efa6c0c0fe14	SEED-ORDER-0171	b1af90fb-4e8c-4714-82f5-7250ff6f3399
1	3490000.00	2026-07-02 21:11:05.523632	2026-07-02 21:11:05.523632	e20a7349-a707-48c1-bb3e-7b4b1b17f49f	SEED-ORDER-0172	93a9d839-4be7-46b5-ba49-83d90886ff17
1	21990000.00	2026-07-02 21:11:08.791462	2026-07-02 21:11:08.791462	f2190eb9-f206-4680-8531-feaa3b5c6701	SEED-ORDER-0173	9408cc4a-7be6-4776-b83e-c755984bd535
1	12490000.00	2026-07-02 21:11:08.792477	2026-07-02 21:11:08.792477	72e0e96e-038b-4430-8586-db1f9181cb10	SEED-ORDER-0173	99ade123-4d92-4ce9-b736-5184c62d100c
1	7490000.00	2026-07-02 21:11:11.305576	2026-07-02 21:11:11.305576	8e514857-b557-4776-9c83-eaab113ab57e	SEED-ORDER-0174	3654621a-191c-43be-bd2f-a47130204242
1	21990000.00	2026-07-02 21:11:14.322328	2026-07-02 21:11:14.322328	e01bb94e-5a19-48a3-8c28-809ab842acbb	SEED-ORDER-0175	ec9e9bab-f679-4658-85fb-875da9c88a8b
1	16990000.00	2026-07-02 21:11:14.322328	2026-07-02 21:11:14.322328	4e38c097-548b-43e5-bd7f-aaaa20e1a072	SEED-ORDER-0175	fc877702-1e69-4a0c-8963-79932b4a15f0
1	14990000.00	2026-07-02 21:11:17.011206	2026-07-02 21:11:17.011206	852cf8c9-a90b-4174-8be3-74aef95d1370	SEED-ORDER-0176	f0476dc3-5609-4bb0-814d-a99c95a685bb
1	13990000.00	2026-07-02 21:11:17.011206	2026-07-02 21:11:17.011206	fee73683-bea2-4014-9d86-04122c1e0546	SEED-ORDER-0176	91dfe2af-067f-4904-a513-d99c2cb5886d
1	24990000.00	2026-07-02 21:11:19.777962	2026-07-02 21:11:19.777962	12e3a4eb-3040-4648-8859-a708873650b7	SEED-ORDER-0177	f23115dd-3daa-4bfd-8d3c-2016949e319f
1	24990000.00	2026-07-02 21:11:22.010566	2026-07-02 21:11:22.010566	e8d7e994-d1e0-4ed6-9529-2330181c8888	SEED-ORDER-0178	3c72dbf9-13a5-4172-b3fd-8673a20b5f09
1	14990000.00	2026-07-02 21:11:23.844214	2026-07-02 21:11:23.844214	31d63683-584c-4451-ab83-35034523572c	SEED-ORDER-0179	07d1db7e-98aa-4fee-a839-df56309e9781
1	22990000.00	2026-07-02 21:11:25.862838	2026-07-02 21:11:25.862838	768ee8d6-9128-49e4-9130-5970b0be4e74	SEED-ORDER-0180	36561aab-79f3-44ed-b8b1-30e9fb78c7cf
\.


--
-- TOC entry 4566 (class 0 OID 26655)
-- Dependencies: 413
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (created_at, order_date, paid_at, updated_at, address_id, customer_id, id, selected_payment_method_id, order_status, promotion_id) FROM stdin;
2026-07-02 02:53:16.114358	2026-07-02 02:53:15.970244	\N	2026-07-02 02:53:16.114358	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	demo-membership-order-customer1	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:05:16.683346	2026-06-21 21:15:00	2026-06-21 21:20:00	2026-07-02 21:05:16.683346	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0018	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:05:18.355714	2026-04-25 20:34:00	2026-04-25 20:57:00	2026-07-02 21:05:18.355714	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0019	278c479c-7cd2-4546-a85f-63319fb05566	REFUNDED	\N
2026-07-02 12:56:52.912585	2026-07-02 12:56:51.982469	2026-07-02 12:56:52.912033	2026-07-02 13:50:39.597199	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	5836eda6-bf83-4e11-921c-fc1c23e1e913	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:05:21.214624	2026-02-25 01:08:00	2026-02-25 01:15:00	2026-07-02 21:05:21.214624	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0020	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:05:23.886205	2026-01-11 22:44:00	2026-01-11 23:02:00	2026-07-02 21:05:23.886205	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0021	f38422ae-e07d-417c-91b1-5f1b59120732	SHIPPING	\N
2026-07-02 12:52:53.395231	2026-07-02 12:52:52.843833	\N	2026-07-02 13:53:10.9449	38afd242-a775-477d-9bbe-3e1c17ab9928	ee205fce-09e4-406a-a9e4-9326786828a3	6eecec2d-6b5f-4f72-81c3-a80335b6f247	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 12:51:36.864977	2026-07-02 12:51:35.837729	2026-07-02 12:51:36.863976	2026-07-02 13:53:15.450458	2d112ff2-1170-4b95-b0d4-e3f42dd79459	ee205fce-09e4-406a-a9e4-9326786828a3	18b6fb95-5047-40dc-b2c6-baf73303925b	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:04:38.122847	2026-03-22 00:39:00	2026-03-22 01:02:00	2026-07-02 21:04:38.122847	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0001	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:04:39.836209	2026-05-06 20:13:00	2026-05-06 20:38:00	2026-07-02 21:04:39.836209	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0002	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:04:42.225983	2026-04-01 22:57:00	2026-04-01 23:22:00	2026-07-02 21:04:42.225983	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0003	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:04:44.823003	2026-06-20 01:55:00	2026-06-20 02:29:00	2026-07-02 21:04:44.823003	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0004	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:04:46.968109	2026-03-03 03:55:00	2026-03-03 04:11:00	2026-07-02 21:04:46.968109	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0005	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:04:48.665966	2026-03-03 17:42:00	\N	2026-07-02 21:04:48.665966	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0006	278c479c-7cd2-4546-a85f-63319fb05566	PROCESSING	\N
2026-07-02 21:04:50.931525	2026-06-26 22:41:00	\N	2026-07-02 21:04:50.931525	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0007	278c479c-7cd2-4546-a85f-63319fb05566	CANCELLED	\N
2026-07-02 21:04:53.691851	2026-04-18 03:47:00	\N	2026-07-02 21:04:53.691851	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0008	278c479c-7cd2-4546-a85f-63319fb05566	PROCESSING	\N
2026-07-02 21:04:55.728861	2026-02-24 23:35:00	2026-02-25 00:01:00	2026-07-02 21:04:55.728861	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0009	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:04:57.844587	2026-06-09 00:43:00	2026-06-09 01:02:00	2026-07-02 21:04:57.844587	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0010	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:04:59.904708	2026-02-01 04:32:00	2026-02-01 04:44:00	2026-07-02 21:04:59.904708	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0011	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:05:01.547114	2026-06-29 01:53:00	2026-06-29 02:05:00	2026-07-02 21:05:01.547114	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0012	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:05:05.013586	2026-03-23 23:20:00	2026-03-23 23:36:00	2026-07-02 21:05:05.013586	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0013	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:05:07.551245	2026-01-31 02:47:00	2026-01-31 03:19:00	2026-07-02 21:05:07.551245	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0014	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:05:09.605319	2026-02-22 20:42:00	\N	2026-07-02 21:05:09.605319	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0015	f38422ae-e07d-417c-91b1-5f1b59120732	PROCESSING	\N
2026-07-02 21:05:12.301262	2026-06-01 03:08:00	2026-06-01 03:30:00	2026-07-02 21:05:12.301262	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0016	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:05:14.592491	2026-03-27 22:17:00	2026-03-27 22:48:00	2026-07-02 21:05:14.592491	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0017	278c479c-7cd2-4546-a85f-63319fb05566	REFUNDED	\N
2026-07-02 21:05:26.440727	2026-03-21 17:23:00	2026-03-21 17:33:00	2026-07-02 21:05:26.440727	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0022	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:05:29.032237	2026-01-19 18:13:00	\N	2026-07-02 21:05:29.032237	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0023	f38422ae-e07d-417c-91b1-5f1b59120732	CANCELLED	\N
2026-07-02 21:05:32.348418	2026-03-09 18:03:00	2026-03-09 18:27:00	2026-07-02 21:05:32.348418	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0024	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:05:37.309076	2026-04-25 18:33:00	2026-04-25 18:57:00	2026-07-02 21:05:37.309076	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0025	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:05:39.478072	2026-05-25 17:41:00	2026-05-25 17:51:00	2026-07-02 21:05:39.478072	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0026	f38422ae-e07d-417c-91b1-5f1b59120732	REFUNDED	\N
2026-07-02 21:05:41.153448	2026-04-30 02:27:00	\N	2026-07-02 21:05:41.153448	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0027	17360cf2-1fcd-4044-a05f-d24859b7d8ff	CANCELLED	\N
2026-07-02 21:05:43.221573	2026-06-18 01:26:00	\N	2026-07-02 21:05:43.221573	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0028	f38422ae-e07d-417c-91b1-5f1b59120732	PROCESSING	\N
2026-07-02 21:05:45.82789	2026-04-11 18:59:00	2026-04-11 19:16:00	2026-07-02 21:05:45.82789	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0029	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:05:48.248233	2026-01-23 02:44:00	2026-01-23 03:14:00	2026-07-02 21:05:48.248233	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0030	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:05:50.372021	2026-06-14 17:14:00	2026-06-14 17:30:00	2026-07-02 21:05:50.372021	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0031	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:05:52.104836	2026-02-13 00:36:00	2026-02-13 01:05:00	2026-07-02 21:05:52.104836	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0032	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:05:53.734864	2026-06-17 18:38:00	2026-06-17 18:43:00	2026-07-02 21:05:53.734864	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0033	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:05:55.374093	2026-03-31 20:03:00	2026-03-31 20:15:00	2026-07-02 21:05:55.374093	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0034	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:05:57.453076	2026-03-04 04:50:00	2026-03-04 05:07:00	2026-07-02 21:05:57.453076	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0035	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:05:59.493367	2026-01-27 22:22:00	2026-01-27 22:45:00	2026-07-02 21:05:59.493367	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0036	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:06:01.157602	2026-06-12 19:54:00	2026-06-12 20:14:00	2026-07-02 21:06:01.157602	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0037	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:06:03.421149	2026-04-07 20:12:00	2026-04-07 20:40:00	2026-07-02 21:06:03.421149	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0038	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:06:05.989297	2026-06-24 02:01:00	2026-06-24 02:17:00	2026-07-02 21:06:05.989297	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0039	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:06:08.688272	2026-04-17 18:22:00	\N	2026-07-02 21:06:08.688272	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0040	17360cf2-1fcd-4044-a05f-d24859b7d8ff	CANCELLED	\N
2026-07-02 21:06:10.714946	2026-04-27 17:09:00	2026-04-27 17:26:00	2026-07-02 21:06:10.714946	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0041	17360cf2-1fcd-4044-a05f-d24859b7d8ff	REFUNDED	\N
2026-07-02 21:06:13.89229	2026-04-29 19:06:00	2026-04-29 19:38:00	2026-07-02 21:06:13.89229	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0042	278c479c-7cd2-4546-a85f-63319fb05566	REFUNDED	\N
2026-07-02 21:06:15.961132	2026-05-15 05:23:00	2026-05-15 05:30:00	2026-07-02 21:06:15.961132	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0043	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:06:17.733451	2026-03-21 20:52:00	\N	2026-07-02 21:06:17.733451	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0044	278c479c-7cd2-4546-a85f-63319fb05566	CANCELLED	\N
2026-07-02 21:06:20.953105	2026-02-20 20:25:00	2026-02-20 20:53:00	2026-07-02 21:06:20.953105	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0045	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:06:23.055826	2026-02-26 02:17:00	2026-02-26 02:45:00	2026-07-02 21:06:23.055826	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0046	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:06:25.760496	2026-03-19 20:58:00	2026-03-19 21:13:00	2026-07-02 21:06:25.760496	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0047	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:06:27.810788	2026-05-21 19:48:00	2026-05-21 20:03:00	2026-07-02 21:06:27.810788	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0048	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:06:29.433971	2026-02-05 01:54:00	\N	2026-07-02 21:06:29.433971	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0049	278c479c-7cd2-4546-a85f-63319fb05566	CANCELLED	\N
2026-07-02 21:06:31.604614	2026-02-10 05:41:00	2026-02-10 05:49:00	2026-07-02 21:06:31.604614	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0050	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:06:35.001009	2026-02-12 01:44:00	2026-02-12 01:56:00	2026-07-02 21:06:35.001009	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0051	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:06:37.248465	2026-05-02 04:18:00	2026-05-02 04:40:00	2026-07-02 21:06:37.248465	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0052	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:06:39.006657	2026-04-30 01:36:00	\N	2026-07-02 21:06:39.006657	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0053	f38422ae-e07d-417c-91b1-5f1b59120732	CANCELLED	\N
2026-07-02 21:06:41.755578	2026-06-02 04:32:00	2026-06-02 04:57:00	2026-07-02 21:06:41.755578	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0054	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:06:44.408379	2026-05-04 17:22:00	2026-05-04 17:28:00	2026-07-02 21:06:44.408379	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0055	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:06:46.472236	2026-02-22 18:53:00	2026-02-22 19:17:00	2026-07-02 21:06:46.472236	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0056	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:06:48.075831	2026-06-19 18:36:00	2026-06-19 18:54:00	2026-07-02 21:06:48.075831	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0057	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:06:49.704632	2026-03-05 20:15:00	2026-03-05 20:44:00	2026-07-02 21:06:49.704632	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0058	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:06:51.480377	2026-03-16 00:00:00	2026-03-16 00:33:00	2026-07-02 21:06:51.480377	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0059	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:06:54.80816	2026-02-23 19:40:00	2026-02-23 20:10:00	2026-07-02 21:06:54.80816	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0060	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:06:58.223055	2026-04-27 23:32:00	2026-04-28 00:04:00	2026-07-02 21:06:58.223055	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0061	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:07:00.721474	2026-03-16 04:51:00	2026-03-16 05:08:00	2026-07-02 21:07:00.721474	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0062	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:07:02.797755	2026-01-09 05:05:00	2026-01-09 05:25:00	2026-07-02 21:07:02.797755	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0063	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:07:05.258553	2026-05-12 22:57:00	2026-05-12 23:30:00	2026-07-02 21:07:05.258553	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0064	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:07:06.922643	2026-06-02 23:19:00	\N	2026-07-02 21:07:06.922643	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0065	f38422ae-e07d-417c-91b1-5f1b59120732	PROCESSING	\N
2026-07-02 21:07:08.525258	2026-05-16 04:57:00	2026-05-16 05:27:00	2026-07-02 21:07:08.525258	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0066	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:07:10.597284	2026-05-22 00:43:00	2026-05-22 00:54:00	2026-07-02 21:07:10.597284	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0067	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:07:13.384808	2026-06-03 00:49:00	2026-06-03 00:54:00	2026-07-02 21:07:13.384808	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0068	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:07:15.50513	2026-05-22 23:22:00	2026-05-22 23:32:00	2026-07-02 21:07:15.50513	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0069	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:07:17.069341	2026-02-10 22:39:00	2026-02-10 23:04:00	2026-07-02 21:07:17.069341	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0070	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:07:18.689608	2026-06-02 03:14:00	2026-06-02 03:25:00	2026-07-02 21:07:18.689608	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0071	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:07:20.859277	2026-05-06 05:10:00	2026-05-06 05:25:00	2026-07-02 21:07:20.859277	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0072	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:07:23.384891	2026-04-22 22:26:00	2026-04-22 22:32:00	2026-07-02 21:07:23.384891	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0073	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:07:25.89561	2026-04-16 17:35:00	2026-04-16 18:01:00	2026-07-02 21:07:25.89561	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0074	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:07:28.496744	2026-06-25 01:03:00	2026-06-25 01:32:00	2026-07-02 21:07:28.496744	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0075	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:07:30.525636	2026-04-28 05:29:00	2026-04-28 05:35:00	2026-07-02 21:07:30.525636	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0076	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:07:32.581347	2026-05-30 04:25:00	2026-05-30 04:43:00	2026-07-02 21:07:32.581347	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0077	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:07:35.132918	2026-05-31 03:59:00	2026-05-31 04:08:00	2026-07-02 21:07:35.132918	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0078	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:07:37.198234	2026-06-27 19:41:00	2026-06-27 19:55:00	2026-07-02 21:07:37.198234	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0079	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:07:39.268678	2026-06-07 05:06:00	2026-06-07 05:16:00	2026-07-02 21:07:39.268678	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0080	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:07:40.889091	2026-03-16 19:38:00	2026-03-16 19:54:00	2026-07-02 21:07:40.889091	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0081	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:07:42.967649	2026-04-18 19:17:00	\N	2026-07-02 21:07:42.967649	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0082	278c479c-7cd2-4546-a85f-63319fb05566	CANCELLED	\N
2026-07-02 21:07:45.49751	2026-06-17 19:55:00	2026-06-17 20:09:00	2026-07-02 21:07:45.49751	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0083	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:07:47.542477	2026-05-18 04:53:00	2026-05-18 05:22:00	2026-07-02 21:07:47.542477	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0084	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:07:49.728634	2026-05-05 22:18:00	2026-05-05 22:36:00	2026-07-02 21:07:49.728634	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0085	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:07:52.312408	2026-03-25 01:12:00	2026-03-25 01:37:00	2026-07-02 21:07:52.312408	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0086	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:07:54.908919	2026-06-27 20:29:00	2026-06-27 20:56:00	2026-07-02 21:07:54.908919	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0087	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:07:57.838494	2026-06-02 00:59:00	2026-06-02 01:20:00	2026-07-02 21:07:57.838494	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0088	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:08:00.432768	2026-03-16 17:34:00	2026-03-16 18:00:00	2026-07-02 21:08:00.432768	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0089	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:08:03.037246	2026-05-20 05:08:00	2026-05-20 05:29:00	2026-07-02 21:08:03.037246	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0090	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:08:05.798089	2026-04-07 04:35:00	2026-04-07 04:46:00	2026-07-02 21:08:05.798089	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0091	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:08:07.908569	2026-02-10 00:55:00	2026-02-10 01:01:00	2026-07-02 21:08:07.908569	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0092	17360cf2-1fcd-4044-a05f-d24859b7d8ff	SHIPPING	\N
2026-07-02 21:08:09.498026	2026-06-01 03:32:00	2026-06-01 03:43:00	2026-07-02 21:08:09.498026	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0093	278c479c-7cd2-4546-a85f-63319fb05566	SHIPPING	\N
2026-07-02 21:08:11.127672	2026-03-22 22:01:00	2026-03-22 22:27:00	2026-07-02 21:08:11.127672	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0094	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:08:12.732688	2026-03-31 00:52:00	2026-03-31 01:21:00	2026-07-02 21:08:12.732688	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0095	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:08:14.894969	2026-05-08 19:07:00	2026-05-08 19:17:00	2026-07-02 21:08:14.894969	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0096	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:08:16.503638	2026-05-16 20:38:00	2026-05-16 21:11:00	2026-07-02 21:08:16.503638	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0097	278c479c-7cd2-4546-a85f-63319fb05566	SHIPPING	\N
2026-07-02 21:08:18.151572	2026-05-11 21:32:00	\N	2026-07-02 21:08:18.151572	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0098	278c479c-7cd2-4546-a85f-63319fb05566	CANCELLED	\N
2026-07-02 21:08:19.816146	2026-06-21 19:49:00	2026-06-21 20:21:00	2026-07-02 21:08:19.816146	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0099	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:08:21.853869	2026-04-02 21:18:00	2026-04-02 21:37:00	2026-07-02 21:08:21.853869	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0100	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:08:23.913828	2026-01-28 03:16:00	2026-01-28 03:36:00	2026-07-02 21:08:23.913828	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0101	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:08:25.942909	2026-06-28 19:45:00	2026-06-28 20:09:00	2026-07-02 21:08:25.942909	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0102	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:08:27.538165	2026-02-04 05:02:00	2026-02-04 05:09:00	2026-07-02 21:08:27.538165	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0103	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:08:29.599178	2026-06-23 17:21:00	2026-06-23 17:44:00	2026-07-02 21:08:29.599178	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0104	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:08:32.396215	2026-01-30 21:30:00	2026-01-30 21:54:00	2026-07-02 21:08:32.396215	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0105	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:08:34.945129	2026-06-21 21:13:00	2026-06-21 21:38:00	2026-07-02 21:08:34.945129	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0106	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:08:37.723326	2026-06-10 05:00:00	2026-06-10 05:09:00	2026-07-02 21:08:37.723326	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0107	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:08:40.846933	2026-05-27 19:50:00	2026-05-27 20:20:00	2026-07-02 21:08:40.846933	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0108	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:08:43.378859	2026-06-29 21:51:00	2026-06-29 22:11:00	2026-07-02 21:08:43.378859	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0109	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:08:46.023118	2026-03-26 03:20:00	2026-03-26 03:30:00	2026-07-02 21:08:46.023118	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0110	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:08:48.514232	2026-06-07 01:57:00	2026-06-07 02:24:00	2026-07-02 21:08:48.514232	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0111	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:08:50.137585	2026-01-07 03:48:00	2026-01-07 03:53:00	2026-07-02 21:08:50.137585	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0112	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:08:51.807943	2026-01-21 02:15:00	2026-01-21 02:31:00	2026-07-02 21:08:51.807943	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0113	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:08:53.516988	2026-05-18 01:47:00	2026-05-18 01:55:00	2026-07-02 21:08:53.516988	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0114	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:08:55.619739	2026-05-28 19:55:00	2026-05-28 20:01:00	2026-07-02 21:08:55.619739	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0115	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:08:58.897762	2026-03-23 03:24:00	2026-03-23 03:31:00	2026-07-02 21:08:58.897762	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0116	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:09:01.78861	2026-03-07 03:57:00	2026-03-07 04:17:00	2026-07-02 21:09:01.78861	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0117	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:09:03.97142	2026-05-29 05:11:00	2026-05-29 05:37:00	2026-07-02 21:09:03.97142	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0118	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:09:06.064101	2026-04-27 02:24:00	2026-04-27 02:38:00	2026-07-02 21:09:06.064101	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0119	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:09:08.131097	2026-04-15 18:32:00	2026-04-15 18:51:00	2026-07-02 21:09:08.131097	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0120	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:09:10.289193	2026-06-28 05:54:00	\N	2026-07-02 21:09:10.289193	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0121	17360cf2-1fcd-4044-a05f-d24859b7d8ff	PROCESSING	\N
2026-07-02 21:09:12.748107	2026-03-21 23:11:00	2026-03-21 23:19:00	2026-07-02 21:09:12.748107	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0122	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:09:14.797172	2026-03-20 22:50:00	2026-03-20 23:23:00	2026-07-02 21:09:14.797172	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0123	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:09:17.014474	2026-03-15 17:44:00	2026-03-15 18:15:00	2026-07-02 21:09:17.014474	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0124	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:09:19.383024	2026-04-12 22:18:00	2026-04-12 22:25:00	2026-07-02 21:09:19.383024	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0125	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:09:21.123201	2026-01-20 17:41:00	2026-01-20 17:55:00	2026-07-02 21:09:21.123201	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0126	f38422ae-e07d-417c-91b1-5f1b59120732	REFUNDED	\N
2026-07-02 21:09:23.716346	2026-03-24 02:11:00	2026-03-24 02:31:00	2026-07-02 21:09:23.716346	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0127	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:09:25.763561	2026-03-19 23:39:00	2026-03-19 23:57:00	2026-07-02 21:09:25.763561	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0128	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:09:27.630107	2026-03-21 18:19:00	2026-03-21 18:51:00	2026-07-02 21:09:27.630107	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0129	f38422ae-e07d-417c-91b1-5f1b59120732	REFUNDED	\N
2026-07-02 21:09:29.398297	2026-04-28 05:41:00	2026-04-28 06:14:00	2026-07-02 21:09:29.398297	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0130	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:09:31.013027	2026-05-27 02:52:00	2026-05-27 03:01:00	2026-07-02 21:09:31.013027	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0131	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:09:32.635975	2026-05-10 19:28:00	2026-05-10 20:01:00	2026-07-02 21:09:32.635975	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0132	278c479c-7cd2-4546-a85f-63319fb05566	REFUNDED	\N
2026-07-02 21:09:34.746831	2026-06-25 04:52:00	2026-06-25 05:19:00	2026-07-02 21:09:34.746831	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0133	f38422ae-e07d-417c-91b1-5f1b59120732	REFUNDED	\N
2026-07-02 21:09:36.981542	2026-02-22 01:24:00	2026-02-22 01:35:00	2026-07-02 21:09:36.981542	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0134	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:09:39.045169	2026-03-27 03:02:00	2026-03-27 03:10:00	2026-07-02 21:09:39.045169	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0135	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:09:41.673388	2026-05-21 03:24:00	2026-05-21 03:57:00	2026-07-02 21:09:41.673388	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0136	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:09:43.85493	2026-04-15 03:00:00	2026-04-15 03:26:00	2026-07-02 21:09:43.85493	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0137	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:09:45.908233	2026-05-14 03:46:00	2026-05-14 03:52:00	2026-07-02 21:09:45.908233	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0138	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:09:47.997398	2026-04-15 05:29:00	2026-04-15 05:51:00	2026-07-02 21:09:47.997398	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0139	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:09:50.767694	2026-02-05 18:05:00	2026-02-05 18:34:00	2026-07-02 21:09:50.767694	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0140	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:09:52.408356	2026-06-06 01:49:00	2026-06-06 02:05:00	2026-07-02 21:09:52.408356	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0141	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:09:54.315548	2026-03-13 20:10:00	2026-03-13 20:25:00	2026-07-02 21:09:54.315548	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0142	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:09:56.48627	2026-07-01 04:23:00	\N	2026-07-02 21:09:56.48627	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0143	f38422ae-e07d-417c-91b1-5f1b59120732	CANCELLED	\N
2026-07-02 21:09:59.008246	2026-05-09 03:26:00	2026-05-09 03:53:00	2026-07-02 21:09:59.008246	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0144	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:10:01.540462	2026-04-20 19:07:00	2026-04-20 19:14:00	2026-07-02 21:10:01.540462	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0145	278c479c-7cd2-4546-a85f-63319fb05566	REFUNDED	\N
2026-07-02 21:10:04.822928	2026-04-21 00:23:00	\N	2026-07-02 21:10:04.822928	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0146	278c479c-7cd2-4546-a85f-63319fb05566	CANCELLED	\N
2026-07-02 21:10:07.355379	2026-06-05 19:41:00	2026-06-05 19:49:00	2026-07-02 21:10:07.355379	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0147	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:10:09.40324	2026-05-12 20:23:00	2026-05-12 20:42:00	2026-07-02 21:10:09.40324	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0148	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:10:11.5369	2026-04-23 18:47:00	2026-04-23 19:03:00	2026-07-02 21:10:11.5369	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0149	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:10:13.598035	2026-06-13 20:12:00	2026-06-13 20:41:00	2026-07-02 21:10:13.598035	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0150	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:10:15.64951	2026-03-24 03:15:00	2026-03-24 03:37:00	2026-07-02 21:10:15.64951	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0151	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:10:17.991074	2026-05-26 18:19:00	\N	2026-07-02 21:10:17.991074	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0152	17360cf2-1fcd-4044-a05f-d24859b7d8ff	CANCELLED	\N
2026-07-02 21:10:19.998371	2026-05-14 19:45:00	2026-05-14 20:05:00	2026-07-02 21:10:19.998371	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0153	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:10:22.149102	2026-06-23 04:25:00	2026-06-23 04:58:00	2026-07-02 21:10:22.149102	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0154	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:10:24.214902	2026-03-21 02:25:00	2026-03-21 02:41:00	2026-07-02 21:10:24.214902	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0155	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:10:26.257424	2026-04-25 03:37:00	2026-04-25 03:59:00	2026-07-02 21:10:26.257424	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0156	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:10:29.163605	2026-02-28 00:32:00	2026-02-28 00:45:00	2026-07-02 21:10:29.163605	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0157	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:10:31.312554	2026-06-20 04:26:00	2026-06-20 04:47:00	2026-07-02 21:10:31.312554	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0158	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:10:33.333055	2026-03-11 03:57:00	2026-03-11 04:27:00	2026-07-02 21:10:33.333055	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0159	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:10:36.441219	2026-05-15 00:49:00	2026-05-15 01:07:00	2026-07-02 21:10:36.441219	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0160	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:10:38.913036	2026-06-05 21:44:00	\N	2026-07-02 21:10:38.913036	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0161	17360cf2-1fcd-4044-a05f-d24859b7d8ff	CANCELLED	\N
2026-07-02 21:10:42.167997	2026-01-07 22:18:00	2026-01-07 22:50:00	2026-07-02 21:10:42.167997	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0162	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:10:44.69447	2026-04-04 21:48:00	2026-04-04 22:18:00	2026-07-02 21:10:44.69447	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0163	f38422ae-e07d-417c-91b1-5f1b59120732	REFUNDED	\N
2026-07-02 21:10:47.408102	2026-06-19 17:58:00	2026-06-19 18:19:00	2026-07-02 21:10:47.408102	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0164	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:10:49.425939	2026-02-27 20:26:00	2026-02-27 20:58:00	2026-07-02 21:10:49.425939	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0165	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:10:51.418166	2026-02-20 21:23:00	2026-02-20 21:28:00	2026-07-02 21:10:51.418166	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0166	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:10:53.660773	2026-07-01 19:27:00	2026-07-01 19:35:00	2026-07-02 21:10:53.660773	f6897e5f-70ff-40db-86b6-a41fdd81d086	f3e638ab-16bc-43a3-926f-fd53766f3eee	SEED-ORDER-0167	17360cf2-1fcd-4044-a05f-d24859b7d8ff	REFUNDED	\N
2026-07-02 21:10:55.855391	2026-06-19 21:52:00	2026-06-19 22:21:00	2026-07-02 21:10:55.855391	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0168	f38422ae-e07d-417c-91b1-5f1b59120732	REFUNDED	\N
2026-07-02 21:10:57.449671	2026-03-27 00:21:00	2026-03-27 00:50:00	2026-07-02 21:10:57.449671	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0169	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:10:59.535593	2026-04-04 04:41:00	2026-04-04 04:49:00	2026-07-02 21:10:59.535593	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0170	278c479c-7cd2-4546-a85f-63319fb05566	SHIPPING	\N
2026-07-02 21:11:02.976517	2026-02-26 23:16:00	2026-02-26 23:37:00	2026-07-02 21:11:02.976517	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0171	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:11:05.523632	2026-05-31 04:02:00	2026-05-31 04:13:00	2026-07-02 21:11:05.523632	3ba030ba-280f-4874-a0eb-3a8b8d79d4e4	c7152be7-a711-4734-8a83-cd5ec04b1a12	SEED-ORDER-0172	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:11:08.791462	2026-03-26 19:36:00	2026-03-26 19:48:00	2026-07-02 21:11:08.791462	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0173	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:11:11.305576	2026-06-27 18:27:00	2026-06-27 18:54:00	2026-07-02 21:11:11.305576	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0174	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
2026-07-02 21:11:14.322328	2026-06-09 04:36:00	2026-06-09 05:05:00	2026-07-02 21:11:14.322328	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0175	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:11:17.011206	2026-05-19 00:46:00	2026-05-19 01:12:00	2026-07-02 21:11:17.011206	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0176	278c479c-7cd2-4546-a85f-63319fb05566	COMPLETED	\N
2026-07-02 21:11:19.777962	2026-06-21 17:50:00	2026-06-21 18:03:00	2026-07-02 21:11:19.777962	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0177	17360cf2-1fcd-4044-a05f-d24859b7d8ff	REFUNDED	\N
2026-07-02 21:11:22.009617	2026-05-26 04:12:00	2026-05-26 04:45:00	2026-07-02 21:11:22.009617	93046a91-6843-4738-bde4-9ce1c08cd616	ee205fce-09e4-406a-a9e4-9326786828a3	SEED-ORDER-0178	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:11:23.844214	2026-05-11 20:59:00	2026-05-11 21:16:00	2026-07-02 21:11:23.844214	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0179	f38422ae-e07d-417c-91b1-5f1b59120732	COMPLETED	\N
2026-07-02 21:11:25.862838	2026-04-27 02:19:00	2026-04-27 02:31:00	2026-07-02 21:11:25.862838	88305b1d-22e6-492a-91d1-c65a382360c1	128bf675-5c4c-4d00-8a38-95807f822bea	SEED-ORDER-0180	17360cf2-1fcd-4044-a05f-d24859b7d8ff	COMPLETED	\N
\.


--
-- TOC entry 4567 (class 0 OID 26661)
-- Dependencies: 414
-- Data for Name: payment_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_logs (amount, created_at, paid_at, updated_at, id, order_id, status, failure_reason) FROM stdin;
28990000.00	2026-07-02 12:51:36.866976	2026-07-02 12:51:36.865976	2026-07-02 12:51:36.866976	2b3c8745-99e0-413d-8df5-612a119873b8	18b6fb95-5047-40dc-b2c6-baf73303925b	SUCCESS	\N
14000000.00	2026-07-02 12:52:53.396173	\N	2026-07-02 12:52:53.396173	5d728fa2-3bcd-4f1f-844f-d73e4c3276a8	6eecec2d-6b5f-4f72-81c3-a80335b6f247	PENDING	\N
27280000.00	2026-07-02 12:56:52.917655	2026-07-02 12:56:52.91666	2026-07-02 12:56:52.917655	87c68795-6017-4322-9305-a40bc2b7c030	5836eda6-bf83-4e11-921c-fc1c23e1e913	SUCCESS	\N
\.


--
-- TOC entry 4568 (class 0 OID 26669)
-- Dependencies: 415
-- Data for Name: payment_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_methods (enabled, max_amount, service_fee, created_at, updated_at, payment_type, id, merchant_id, name, partner_code, terminal_code, endpoint_url, notify_url, return_url, description, hash_secret) FROM stdin;
t	20000000.00	0.00	2026-06-30 00:47:05.637073	2026-06-30 00:47:05.637073	COD	278c479c-7cd2-4546-a85f-63319fb05566	\N	COD	\N	\N	\N	\N	\N	Thanh toán khi nhận hàng	\N
t	\N	\N	2026-06-30 00:47:05.637579	2026-06-30 00:47:05.637579	MOMO	f38422ae-e07d-417c-91b1-5f1b59120732	MOMO	Ví MoMo	MOMOBKUN20180529	\N	https://test-payment.momo.vn/v2/gateway/api/create	https://your-ngrok-url.ngrok-free.app/api/payments/momo/ipn	http://localhost:8080/api/payments/momo/return	Thanh toán qua ví điện tử MoMo	\N
t	\N	\N	2026-06-30 00:47:05.637579	2026-06-30 00:47:05.637579	VNPAY	17360cf2-1fcd-4044-a05f-d24859b7d8ff	\N	VNPAY	\N	X25J2OJ1	https://sandbox.vnpayment.vn/paymentv2/vpcpay.html	\N	https://4c47-2001-ee0-4f87-31e0-f16e-4a3c-ca2a-c9fe.ngrok-free.app/api/payments/vnpay/return	Thanh toán qua cổng VNPAY	GC6Z9RTBCZ9QU0KKIRTC9XASLWHQZZNY
\.


--
-- TOC entry 4569 (class 0 OID 26677)
-- Dependencies: 416
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (created_at, updated_at, id, product_id, name, image_url) FROM stdin;
2026-06-30 00:47:05.724911	2026-06-30 00:47:05.724911	9738e145-576d-4c64-939f-ec14262b5c21	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Front View	https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500
2026-06-30 00:47:05.733986	2026-06-30 00:47:05.733986	2e14b56e-6bb4-4f1e-bb9e-4cc3eb83bbcb	16c1702a-9e54-448c-84a1-f792d4e3a53d	Primary View	https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500
2026-06-30 00:47:05.73599	2026-06-30 00:47:05.73599	4b6a325f-c1db-4e14-8baf-504da2260f01	07012006-e6f3-442c-bacf-382799932139	Front View	https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500
2026-06-30 00:47:05.737108	2026-06-30 00:47:05.737108	e5147e41-2877-4ffd-b185-f9fff81e814a	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Rear View	https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500
2026-06-30 00:47:05.738114	2026-06-30 00:47:05.738114	8cf34862-0670-4497-9fa6-d2161f32facf	59085754-49e0-4e3a-b1ea-a41f6474ca07	Main View	https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500
2026-06-30 00:47:05.740117	2026-06-30 00:47:05.740117	14f17bb7-d774-4a21-a446-5dedd4cf0146	acfe635a-cb82-46dc-800a-c5c2431fb3a2	Folded and Unfolded	https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500
2026-06-30 00:47:05.741118	2026-06-30 00:47:05.741118	ea3faafb-17cd-424f-8890-fd694896535e	4640982c-0c67-40b8-be17-a2689c61a3c2	Camera Lens view	https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500
2026-06-30 00:47:05.741118	2026-06-30 00:47:05.741118	2d13aa65-cc1e-47ab-9842-0dda96c48e35	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Front View	https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500
2026-06-30 00:47:05.742116	2026-06-30 00:47:05.742116	6da34066-d90d-443f-812c-9501a02fb48e	4b5eede5-f103-411c-92d0-da37eca2a33c	Slim Design View	https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300
2026-06-30 00:47:05.743114	2026-06-30 00:47:05.743114	ce226eb6-e43f-4610-af23-9ab089c0d979	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Standard design	https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500
2026-06-30 00:47:05.744118	2026-06-30 00:47:05.744118	a7d0207d-4cb8-4e2f-b565-702ac2ea41f2	e2213015-5168-45e3-a5c4-f792649bb853	Original color show	https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500
2026-06-30 00:47:05.744118	2026-06-30 00:47:05.744118	f39c3fd7-31eb-4093-a502-6412b1cba45a	5f28cfb8-26bb-4970-9bc6-341aede0107a	Matte finish design	https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500
2026-06-30 00:47:05.745626	2026-06-30 00:47:05.745626	dbed1752-9601-4e71-b5fa-b65ff4d30c1f	82b0225d-578a-403a-a0fd-3835f735a213	Emerald Green Show	https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500
2026-06-30 00:47:05.746637	2026-06-30 00:47:05.746637	066c15f5-6190-49cc-8929-584742415529	94a585ac-f5e6-4ec1-8602-97085cc860c7	Eco Leather Orange	https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500
2026-07-02 02:21:19.61876	2026-07-02 02:21:19.61876	bebeafc6-0e2d-41eb-9436-32c3b1f07e0e	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Gaming Cyber View	https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300
2026-06-30 00:47:05.748634	2026-06-30 00:47:05.748634	18f63397-992e-4b5a-8cc4-82b7169f6959	145b4ff7-b502-4a63-a67d-666a62412139	Pastel Blue View	https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500
2026-06-30 00:47:05.748634	2026-06-30 00:47:05.748634	48ec377f-ce14-45bb-9591-dbd38a5da656	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Front Curved Angle	https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500
2026-06-30 11:10:55.226188	2026-06-30 11:10:55.226188	e9dda53c-31d7-4947-b53b-49fb0a3c3e7f	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Asus ROG Phone 8 Pro image 1	https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300
2026-07-02 16:52:20.785618	2026-07-02 16:52:20.785618	4c8dcb9c-3b40-416a-92e8-6a00493a3dab	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	iPhone 16 Pro Max View	https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500
2026-07-02 16:52:24.633835	2026-07-02 16:52:24.633835	1edced1e-e203-45fe-9edc-4a67534deeb1	1628368c-54a0-4fc2-9f28-f06feeec57c1	Samsung Galaxy S24 View	https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500
2026-07-02 16:52:28.185871	2026-07-02 16:52:28.185871	1ab6d614-6fc9-4120-8f8c-45d76a035aeb	098b52d0-0c50-4fa2-87b5-f6aaf55b8417	Xiaomi 14 Ultra View	https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500
2026-07-02 16:52:30.660525	2026-07-02 16:52:30.660525	e31afb3e-35be-496e-b23c-aa85d78eb025	c8078475-d3e3-46be-a7b4-cde1e07e664a	OPPO Reno 12 Pro View	https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500
2026-07-02 16:52:35.670367	2026-07-02 16:52:35.670367	79450812-2cf5-47f0-b914-f22f67c6ed7f	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Vivo V30 Pro View	https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300
2026-07-02 16:52:38.644888	2026-07-02 16:52:38.644888	16f13873-a3ba-4fec-89af-1a0ea4d86050	38d600e7-c9ac-4f94-b957-de371ebae1a7	OnePlus 12R View	https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500
2026-07-02 16:52:41.181529	2026-07-02 16:52:41.181529	67f40c9d-ce61-46e1-900a-0eb90bb97756	09323b27-7a17-44bf-9493-ecbcaeed022f	Realme 12 Pro+ View	https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500
2026-07-02 16:52:44.739374	2026-07-02 16:52:44.739374	7f1bc021-d25e-45ed-a8c4-802d7adddbcd	c889aedf-2c51-4b23-b430-e04a784c0fea	Asus Zenfone 11 Ultra View	https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300
\.


--
-- TOC entry 4570 (class 0 OID 26684)
-- Dependencies: 417
-- Data for Name: product_promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_promotions (product_id, promotion_id) FROM stdin;
\.


--
-- TOC entry 4571 (class 0 OID 26687)
-- Dependencies: 418
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variants (price, ram_gb, storage_gb, created_at, updated_at, status, id, product_id, color) FROM stdin;
34990000.00	8	256	2026-06-30 00:47:05.73298	2026-06-30 00:47:05.73298	AVAILABLE	569a61bf-b263-4443-a0f0-18452f8d3077	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Tự nhiên
34990000.00	8	256	2026-06-30 00:47:05.73298	2026-06-30 00:47:05.73298	AVAILABLE	2c881c96-2733-4e59-9252-026de75a2ce1	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Đen
37990000.00	8	512	2026-06-30 00:47:05.73298	2026-06-30 00:47:05.73298	AVAILABLE	bc26ed0c-3588-4e85-9484-3deb23d3ade0	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Tự nhiên
25990000.00	12	256	2026-06-30 00:47:05.733986	2026-06-30 00:47:05.733986	AVAILABLE	7d345843-5ec1-4b80-a4d8-55fc4912a9d8	16c1702a-9e54-448c-84a1-f792d4e3a53d	Titan Xám
28990000.00	12	512	2026-06-30 00:47:05.733986	2026-06-30 00:47:05.733986	AVAILABLE	16360c5c-c728-44b6-b094-5302bd5b2512	16c1702a-9e54-448c-84a1-f792d4e3a53d	Titan Xám
33990000.00	12	1024	2026-06-30 00:47:05.734986	2026-06-30 00:47:05.734986	AVAILABLE	cb9bf3fe-5576-436a-b8b2-14c7e87ae463	16c1702a-9e54-448c-84a1-f792d4e3a53d	Titan Đen
16990000.00	12	256	2026-06-30 00:47:05.73599	2026-06-30 00:47:05.73599	AVAILABLE	d63836b4-c99e-43ed-bc30-fb11aa97fbf3	07012006-e6f3-442c-bacf-382799932139	Đen
18990000.00	12	512	2026-06-30 00:47:05.737108	2026-06-30 00:47:05.737108	AVAILABLE	1b4fadd2-5571-4091-89f1-09113f46813a	07012006-e6f3-442c-bacf-382799932139	Trắng
24990000.00	16	256	2026-06-30 00:47:05.737108	2026-06-30 00:47:05.737108	AVAILABLE	3071d143-68c2-4ada-9fba-30b08b133623	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Đen Biển Sâu
27990000.00	16	512	2026-06-30 00:47:05.737108	2026-06-30 00:47:05.737108	AVAILABLE	544935a0-95f0-4a48-af2b-07c22214865f	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Xanh Bầu Trời
22990000.00	6	128	2026-06-30 00:47:05.738114	2026-06-30 00:47:05.738114	AVAILABLE	49f0b8d8-537b-4292-acec-debb639cb5c7	59085754-49e0-4e3a-b1ea-a41f6474ca07	Hồng
25990000.00	6	256	2026-06-30 00:47:05.738114	2026-06-30 00:47:05.738114	AVAILABLE	f7b3fc11-7e27-473e-8805-932058ac57bd	59085754-49e0-4e3a-b1ea-a41f6474ca07	Xanh lá
30990000.00	6	512	2026-06-30 00:47:05.738114	2026-06-30 00:47:05.738114	AVAILABLE	4ef40151-08e1-4870-8211-ecf9eea036c4	59085754-49e0-4e3a-b1ea-a41f6474ca07	Đen
19990000.00	12	256	2026-06-30 00:47:05.741118	2026-06-30 00:47:05.741118	AVAILABLE	eecbfc69-c4b6-4db2-83c5-a44652505990	4640982c-0c67-40b8-be17-a2689c61a3c2	Đen Tinh Thể
22990000.00	12	512	2026-06-30 00:47:05.741118	2026-06-30 00:47:05.741118	AVAILABLE	c75baef6-203b-4cbf-9a85-36c6b895edfe	4640982c-0c67-40b8-be17-a2689c61a3c2	Trắng Tinh Tuyết
6490000.00	8	128	2026-06-30 00:47:05.742116	2026-06-30 00:47:05.742116	AVAILABLE	8e4017e8-dcf6-48aa-a031-32e97eca12c8	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Xanh Rừng
14990000.00	12	256	2026-06-30 00:47:05.743114	2026-06-30 00:47:05.743114	AVAILABLE	b7d3ee03-5e0c-4fae-8086-1c1d87bb13e4	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
10490000.00	8	128	2026-06-30 00:47:05.744118	2026-06-30 00:47:05.744118	AVAILABLE	c2c41b71-cba1-497b-97ae-88970f164225	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Xanh Băng
12490000.00	8	256	2026-06-30 00:47:05.744118	2026-06-30 00:47:05.744118	AVAILABLE	389ca737-7135-40c0-aeae-8d72a506efcb	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Đen
21990000.00	6	256	2026-06-30 00:47:05.744118	2026-06-30 00:47:05.744118	AVAILABLE	fa2712f5-7f5e-4c88-ace9-7384b526799c	e2213015-5168-45e3-a5c4-f792649bb853	Đỏ
2990000.00	4	64	2026-06-30 00:47:05.745626	2026-06-30 00:47:05.745626	AVAILABLE	94f6cb4d-0648-4e46-889e-0355b228b029	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xám Graphite
3490000.00	4	128	2026-06-30 00:47:05.745626	2026-06-30 00:47:05.745626	AVAILABLE	cd57820b-c453-42e7-9b11-b1d4306137b5	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xanh Lá
22490000.00	12	256	2026-06-30 00:47:05.745626	2026-06-30 00:47:05.745626	AVAILABLE	40523c1f-2111-4cd5-8186-845e4161a1f1	82b0225d-578a-403a-a0fd-3835f735a213	Xanh Lục Bảo
24990000.00	16	512	2026-06-30 00:47:05.745626	2026-06-30 00:47:05.745626	AVAILABLE	3427d5c9-d6df-48ca-a623-f12026602c3a	82b0225d-578a-403a-a0fd-3835f735a213	Đen Tuyền
17990000.00	16	512	2026-06-30 00:47:05.746637	2026-06-30 00:47:05.746637	AVAILABLE	dbb00774-c171-4609-81fe-9259d56ce9c8	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
25490000.00	6	128	2026-06-30 00:47:05.748634	2026-06-30 00:47:05.748634	AVAILABLE	24178b7e-7353-4cde-ae4c-37d0d2bcdac6	145b4ff7-b502-4a63-a67d-666a62412139	Xanh Dương Nhạt
28490000.00	6	256	2026-06-30 00:47:05.748634	2026-06-30 00:47:05.748634	AVAILABLE	9ba81d79-4193-475e-a7d2-171e70f73ef2	145b4ff7-b502-4a63-a67d-666a62412139	Hồng Phấn
21990000.00	12	256	2026-06-30 00:47:05.749635	2026-06-30 00:47:05.749635	AVAILABLE	48eac11c-0cbb-40d4-a7ee-83a6ac722409	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Tím Coban
24490000.00	12	512	2026-06-30 00:47:05.749635	2026-06-30 00:47:05.749635	AVAILABLE	d6031a56-c67b-403f-93f2-7870f6efe523	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Vàng Hổ Phách
14990000.00	12	256	2026-07-02 21:04:37.827358	2026-07-02 21:04:37.827358	EXPORTED	cae3ee57-2619-4f98-acf1-dcad5f1068c8	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
10490000.00	8	128	2026-07-02 21:04:39.611228	2026-07-02 21:04:39.611228	EXPORTED	1c95c7ca-4a20-4a6f-876e-8e445fcc075b	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Xanh Băng
42000000.00	16	512	2026-06-30 01:08:19.67262	2026-06-30 01:08:19.67262	AVAILABLE	39cb6e6b-47ab-4771-acda-7bbacb1e8ea9	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Đen
2990000.00	4	64	2026-07-02 21:04:41.504403	2026-07-02 21:04:41.504403	EXPORTED	af28811e-ff39-47d7-8ad1-6931fd3649a5	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xám Graphite
28990000.00	16	512	2026-06-30 00:47:05.747634	2026-06-30 12:04:20.183492	EXPORTED	ff408fd3-4761-440f-bf52-47b6eb794f7b	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Phantom Black
34990000.00	24	1024	2026-06-30 00:47:05.747634	2026-06-30 12:04:20.185793	EXPORTED	4eb16148-26cf-4401-859b-a39baf91ae35	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Shadow Edition
12490000.00	8	256	2026-07-02 21:04:42.001107	2026-07-02 21:04:42.001107	EXPORTED	b78071cf-1af1-4611-90bc-7c72779b7642	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Đen
19990000.00	12	256	2026-07-02 21:04:44.10722	2026-07-02 21:04:44.10722	EXPORTED	cf50298b-b5f9-41ee-a556-3538747e9088	4640982c-0c67-40b8-be17-a2689c61a3c2	Đen Tinh Thể
15990000.00	12	512	2026-07-02 21:04:44.592862	2026-07-02 21:04:44.592862	EXPORTED	38093a9b-8955-411b-9383-530e8123eddb	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
18990000.00	12	512	2026-07-02 21:04:46.736557	2026-07-02 21:04:46.736557	EXPORTED	34f0ee14-c2ad-493a-b68c-8be774d598d6	07012006-e6f3-442c-bacf-382799932139	Trắng
16990000.00	12	256	2026-07-02 21:04:48.400397	2026-07-02 21:04:48.400397	EXPORTED	01f3c845-fe99-4716-a51d-2028aa9788f3	07012006-e6f3-442c-bacf-382799932139	Đen
25990000.00	6	256	2026-07-02 21:04:50.237644	2026-07-02 21:04:50.237644	EXPORTED	50c500b8-2cfc-4154-ae46-40cf94139ce4	59085754-49e0-4e3a-b1ea-a41f6474ca07	Xanh lá
37990000.00	8	512	2026-07-02 21:04:50.701534	2026-07-02 21:04:50.701534	EXPORTED	26c70f1f-5304-418f-acc2-5dfd0385d80c	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Tự nhiên
24990000.00	16	512	2026-07-02 21:04:52.986908	2026-07-02 21:04:52.986908	EXPORTED	f30b188d-3f42-419c-8446-9fbcc3f05dce	c889aedf-2c51-4b23-b430-e04a784c0fea	Đen
43990000.00	8	1024	2026-06-30 00:47:05.733986	2026-06-30 13:30:31.840632	EXPORTED	5781d588-66ae-49f6-b04f-dfbe9b711b18	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Xanh
43990000.00	12	256	2026-06-30 00:47:05.740117	2026-06-30 13:30:31.840632	EXPORTED	ec40a5e5-d065-4553-b52d-92e18fd19a96	acfe635a-cb82-46dc-800a-c5c2431fb3a2	Xanh Đá Phiến
47990000.00	12	512	2026-06-30 00:47:05.740117	2026-06-30 13:30:31.840632	EXPORTED	070dfd66-6523-4778-b431-0a7736831b71	acfe635a-cb82-46dc-800a-c5c2431fb3a2	Kem
7490000.00	8	256	2026-06-30 00:47:05.742116	2026-06-30 13:30:31.840632	EXPORTED	2d84f3ee-6196-41d4-8cf0-7da86c5302bc	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Đen Bóng Đêm
18990000.00	6	128	2026-06-30 00:47:05.744118	2026-07-02 01:43:30.140697	EXPORTED	26e845de-e23c-499e-ab22-9241fff150d0	e2213015-5168-45e3-a5c4-f792649bb853	Tím
28990000.00	16	512	2026-07-02 02:21:19.770731	2026-07-02 02:21:19.770731	AVAILABLE	cb25b96a-193b-47a8-ab91-f3c230c35df3	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Phantom Black
34990000.00	24	1024	2026-07-02 02:21:20.519532	2026-07-02 02:21:20.519532	AVAILABLE	8f70925b-750b-418e-83c8-b6ccb84db4e2	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Shadow Edition
14000000.00	16	256	2026-07-02 02:41:35.435315	2026-07-02 02:41:35.435315	AVAILABLE	123	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Phantom Black
15000001.00	13	512	2026-07-02 02:25:20.010495	2026-07-02 02:25:20.010495	AVAILABLE	1234	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Phantom Black
25990000.00	6	256	2026-07-02 21:04:53.442368	2026-07-02 21:04:53.442368	EXPORTED	79e99576-343e-4b14-aaba-92ba526205e1	59085754-49e0-4e3a-b1ea-a41f6474ca07	Xanh lá
3490000.00	4	128	2026-07-02 21:04:55.503073	2026-07-02 21:04:55.503073	EXPORTED	77ffd9fe-c998-457b-96aa-42024106ef43	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xanh Lá
24990000.00	16	256	2026-07-02 21:04:57.171267	2026-07-02 21:04:57.171267	EXPORTED	078c714e-c30c-4f7e-a21f-b1d03be3082b	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Đen Biển Sâu
16990000.00	12	256	2026-07-02 21:04:57.621514	2026-07-02 21:04:57.621514	EXPORTED	902bbbe5-5991-411e-9b46-1f080c8c0340	07012006-e6f3-442c-bacf-382799932139	Đen
27990000.00	16	512	2026-07-02 21:04:59.681148	2026-07-02 21:04:59.681148	EXPORTED	7480ad67-053e-4e2e-9017-a977112d31f2	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Xanh Bầu Trời
18990000.00	12	512	2026-07-02 21:05:01.287989	2026-07-02 21:05:01.287989	EXPORTED	0f2e7cb7-f0e5-4fef-b47c-7fc2bc2f5c97	07012006-e6f3-442c-bacf-382799932139	Trắng
16990000.00	12	256	2026-07-02 21:05:03.173552	2026-07-02 21:05:03.173552	EXPORTED	5382035e-642f-45fa-ae25-84072fb41b05	07012006-e6f3-442c-bacf-382799932139	Đen
8990000.00	8	256	2026-07-02 21:05:04.34611	2026-07-02 21:05:04.34611	EXPORTED	06c0d6da-06c6-4c67-b591-9b116c72683f	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
14990000.00	12	256	2026-07-02 21:05:07.329362	2026-07-02 21:05:07.329362	EXPORTED	5160c1a2-343d-44a1-9893-5b3cd7d69ee8	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
17990000.00	16	512	2026-07-02 21:05:08.930665	2026-07-02 21:05:08.930665	EXPORTED	6467175a-765c-42a4-afe8-26cf8f3de8b3	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
25990000.00	12	256	2026-07-02 21:05:09.383231	2026-07-02 21:05:09.383231	EXPORTED	aed38cd9-fed4-4111-8c7b-a4037f229865	16c1702a-9e54-448c-84a1-f792d4e3a53d	Titan Xám
22990000.00	12	512	2026-07-02 21:05:12.077587	2026-07-02 21:05:12.077587	EXPORTED	2ed83b28-a0fa-46a3-bbdb-a01c899f7112	4640982c-0c67-40b8-be17-a2689c61a3c2	Trắng Tinh Tuyết
37990000.00	8	512	2026-07-02 21:05:13.691994	2026-07-02 21:05:13.691994	EXPORTED	85336a23-094c-4f2e-b510-6fdc76333fa1	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Tự nhiên
15990000.00	12	512	2026-07-02 21:05:14.369948	2026-07-02 21:05:14.369948	EXPORTED	c2fd1a50-9072-4429-8511-b8cf3621f7f9	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
17990000.00	16	512	2026-07-02 21:05:16.460572	2026-07-02 21:05:16.460572	EXPORTED	e87cffd0-f424-42d4-8409-e8a62e33e64f	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
17990000.00	16	512	2026-07-02 21:05:18.105208	2026-07-02 21:05:18.105208	EXPORTED	cf659293-c31b-415e-aa9f-3b9866fa6632	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
34990000.00	8	256	2026-07-02 21:05:19.829451	2026-07-02 21:05:19.829451	EXPORTED	a6db378a-04d8-4507-bd60-62b03380e443	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Đen
8990000.00	8	256	2026-07-02 21:05:20.99023	2026-07-02 21:05:20.99023	EXPORTED	4ec5bccc-e6d3-469b-a5b9-2d13bd647f98	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
7490000.00	8	256	2026-07-02 21:05:23.13349	2026-07-02 21:05:23.13349	EXPORTED	b8259e5a-f952-4647-9a8d-1873e1756eee	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Đen Bóng Đêm
22990000.00	12	512	2026-07-02 21:05:23.625082	2026-07-02 21:05:23.625082	EXPORTED	48194eb8-d766-4520-b6f7-63479ee66873	4640982c-0c67-40b8-be17-a2689c61a3c2	Trắng Tinh Tuyết
34990000.00	8	256	2026-07-02 21:05:25.739241	2026-07-02 21:05:25.739241	EXPORTED	eeeba2f5-4a04-41f1-b625-0bd0d2036316	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Tự nhiên
22490000.00	12	256	2026-07-02 21:05:26.204395	2026-07-02 21:05:26.204395	EXPORTED	54c77c30-b064-4632-8fba-fb691b2bfecc	82b0225d-578a-403a-a0fd-3835f735a213	Xanh Lục Bảo
22490000.00	12	256	2026-07-02 21:05:28.311824	2026-07-02 21:05:28.311824	EXPORTED	fb1b26e8-4fac-4d28-a9b8-31f4c33fcc1e	82b0225d-578a-403a-a0fd-3835f735a213	Xanh Lục Bảo
43990000.00	12	256	2026-07-02 21:05:28.805141	2026-07-02 21:05:28.805141	EXPORTED	f9b5afd9-1a65-44e9-8bba-67d3dcbdc89b	acfe635a-cb82-46dc-800a-c5c2431fb3a2	Xanh Đá Phiến
8990000.00	8	256	2026-07-02 21:05:31.325851	2026-07-02 21:05:31.325851	EXPORTED	9e74879c-25f7-49b3-a0f9-7396563b2170	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
34990000.00	24	1024	2026-07-02 21:05:32.12495	2026-07-02 21:05:32.12495	EXPORTED	7cfc3d0d-ccb2-4b1d-ae5d-b8acd598748e	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Shadow Edition
8990000.00	8	256	2026-07-02 21:05:36.365375	2026-07-02 21:05:36.365375	EXPORTED	1b81c69e-d47c-4374-af93-f708678d5049	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
15990000.00	12	512	2026-07-02 21:05:37.060379	2026-07-02 21:05:37.060379	EXPORTED	b5623c50-558e-4305-9b21-5f81de40539e	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
13990000.00	12	256	2026-07-02 21:05:39.242344	2026-07-02 21:05:39.242344	EXPORTED	fef7b9db-1f17-4701-8cd6-a2d278183be0	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
28990000.00	12	512	2026-07-02 21:05:40.931982	2026-07-02 21:05:40.931982	EXPORTED	6328c8a2-0caa-4175-a394-bfa38c71fa2a	16c1702a-9e54-448c-84a1-f792d4e3a53d	Titan Xám
13990000.00	12	256	2026-07-02 21:05:42.516194	2026-07-02 21:05:42.516194	EXPORTED	f3d851c8-afa8-444a-bf3f-d1ed45265b2a	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
7490000.00	8	256	2026-07-02 21:05:42.982221	2026-07-02 21:05:42.982221	EXPORTED	57ee9596-bf8e-4e3c-a5e2-fb05456202e0	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Đen Bóng Đêm
14990000.00	12	256	2026-07-02 21:05:45.574535	2026-07-02 21:05:45.574535	EXPORTED	e6d0a5b4-1c0d-4b0d-9365-8dc80cc52954	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
24490000.00	12	512	2026-07-02 21:05:47.321454	2026-07-02 21:05:47.321454	EXPORTED	92923ad8-60c6-4092-94ac-41fedf4b8acd	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Vàng Hổ Phách
28990000.00	12	512	2026-07-02 21:05:48.024262	2026-07-02 21:05:48.024262	EXPORTED	1a89adf1-b675-4afa-bd7a-b492e9f3670d	16c1702a-9e54-448c-84a1-f792d4e3a53d	Titan Xám
6490000.00	8	128	2026-07-02 21:05:50.129214	2026-07-02 21:05:50.129214	EXPORTED	1465e56f-89ad-4b3d-a8e6-818fb78bb51a	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Xanh Rừng
13990000.00	12	256	2026-07-02 21:05:51.844284	2026-07-02 21:05:51.844284	EXPORTED	fbbee4e4-775d-4f0e-a5be-19f0669237a1	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
21990000.00	12	256	2026-07-02 21:05:53.511115	2026-07-02 21:05:53.511115	EXPORTED	da0c4c22-9686-42e7-890d-7bc6d0e08de7	c889aedf-2c51-4b23-b430-e04a784c0fea	Titan Xám
19990000.00	8	128	2026-07-02 21:05:55.135403	2026-07-02 21:05:55.135403	EXPORTED	3dc63eb1-2144-4e6b-88bd-a242a1f9a92f	1628368c-54a0-4fc2-9f28-f06feeec57c1	Onyx Đen
14000000.00	16	256	2026-07-02 21:05:56.751556	2026-07-02 21:05:56.751556	EXPORTED	2f66d3fa-a154-47b7-a5fd-7662cd5d21fd	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Phantom Black
8990000.00	8	256	2026-07-02 21:05:57.202169	2026-07-02 21:05:57.202169	EXPORTED	c792b562-b3f6-4e48-be78-e8e1bce645e0	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
25490000.00	6	128	2026-07-02 21:05:59.268702	2026-07-02 21:05:59.268702	EXPORTED	bb7fd94b-b0c3-4066-9bd5-476f5f735bcf	145b4ff7-b502-4a63-a67d-666a62412139	Xanh Dương Nhạt
17990000.00	16	512	2026-07-02 21:06:00.89048	2026-07-02 21:06:00.89048	EXPORTED	a3bb2cdd-ec49-4c26-bc95-73567836b846	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
37990000.00	8	512	2026-07-02 21:06:02.751207	2026-07-02 21:06:02.751207	EXPORTED	898fb48b-c8e0-4d03-b2a9-83e67708d1af	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Đen
22490000.00	12	256	2026-07-02 21:06:03.198978	2026-07-02 21:06:03.198978	EXPORTED	654f69a3-1015-4b59-bfdb-3007b2b81d83	82b0225d-578a-403a-a0fd-3835f735a213	Xanh Lục Bảo
17990000.00	16	512	2026-07-02 21:06:05.301554	2026-07-02 21:06:05.301554	EXPORTED	0d023e08-c65e-4181-ab49-5a967c0c8026	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
28490000.00	6	256	2026-07-02 21:06:05.763788	2026-07-02 21:06:05.763788	EXPORTED	9b4af3d6-7c2d-4a37-85a7-e953f05286e1	145b4ff7-b502-4a63-a67d-666a62412139	Hồng Phấn
34990000.00	8	256	2026-07-02 21:06:08.013889	2026-07-02 21:06:08.013889	EXPORTED	38882dcd-d7af-4921-998f-0de7a4bca578	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Đen
47990000.00	12	512	2026-07-02 21:06:08.465408	2026-07-02 21:06:08.465408	EXPORTED	a52530c1-d3a0-4c03-9776-a2cddb99cd80	acfe635a-cb82-46dc-800a-c5c2431fb3a2	Kem
34990000.00	8	256	2026-07-02 21:06:10.492443	2026-07-02 21:06:10.492443	EXPORTED	10d8df51-280a-42c3-9e13-05104ac52b82	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Sa Mạc
34990000.00	8	256	2026-07-02 21:06:13.670442	2026-07-02 21:06:13.670442	EXPORTED	ddfbbf72-e14f-487b-9d09-4f95f2ea7432	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Tự nhiên
24990000.00	16	256	2026-07-02 21:06:15.732897	2026-07-02 21:06:15.732897	EXPORTED	e79a1928-adb9-4fa1-9854-0f92823a93c4	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Đen Biển Sâu
18990000.00	12	512	2026-07-02 21:06:17.506158	2026-07-02 21:06:17.506158	EXPORTED	ec1718d6-c153-4e9c-9dea-8720b9f907da	07012006-e6f3-442c-bacf-382799932139	Trắng
22990000.00	6	128	2026-07-02 21:06:19.809234	2026-07-02 21:06:19.809234	EXPORTED	7f557c19-1460-48f8-ae5e-078162fe5fb6	59085754-49e0-4e3a-b1ea-a41f6474ca07	Hồng
16990000.00	12	256	2026-07-02 21:06:20.702135	2026-07-02 21:06:20.702135	EXPORTED	febb951d-a516-44d0-90fe-9173433b9eda	07012006-e6f3-442c-bacf-382799932139	Đen
21990000.00	12	256	2026-07-02 21:06:22.813367	2026-07-02 21:06:22.813367	EXPORTED	9ca3a26b-fafc-4ad1-b604-50b440f9f5bc	c889aedf-2c51-4b23-b430-e04a784c0fea	Titan Xám
34990000.00	8	256	2026-07-02 21:06:25.024496	2026-07-02 21:06:25.024496	EXPORTED	7074016d-a5a5-4b7d-8227-c0f977ab3c53	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Đen
21990000.00	12	256	2026-07-02 21:06:25.537942	2026-07-02 21:06:25.537942	EXPORTED	9de0abed-7aaa-4d80-a5e4-3f041ae1b18f	c889aedf-2c51-4b23-b430-e04a784c0fea	Titan Xám
24990000.00	16	512	2026-07-02 21:06:27.56481	2026-07-02 21:06:27.56481	EXPORTED	52a44e1d-49e6-458c-b24b-0a796f6755a9	c889aedf-2c51-4b23-b430-e04a784c0fea	Đen
17990000.00	16	512	2026-07-02 21:06:29.212625	2026-07-02 21:06:29.212625	EXPORTED	ec1cacc1-63d4-44a0-b28f-361736d41a57	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
22490000.00	12	256	2026-07-02 21:06:30.824872	2026-07-02 21:06:30.824872	EXPORTED	0ce7693d-fd93-43dd-aa67-cf87e2262e7d	82b0225d-578a-403a-a0fd-3835f735a213	Xanh Lục Bảo
24990000.00	16	256	2026-07-02 21:06:31.381573	2026-07-02 21:06:31.381573	EXPORTED	858f52ba-3a75-4862-a434-5be9305af429	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Đen Biển Sâu
15990000.00	12	512	2026-07-02 21:06:33.893243	2026-07-02 21:06:33.893243	EXPORTED	55211108-2c21-425c-a4f6-d1a9c874b368	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
34990000.00	8	256	2026-07-02 21:06:34.344942	2026-07-02 21:06:34.344942	EXPORTED	2fd938ad-0fcd-4466-a87a-66f7e645d62f	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Sa Mạc
47990000.00	12	512	2026-07-02 21:06:36.981961	2026-07-02 21:06:36.981961	EXPORTED	4ff8c63f-e739-4ec9-8ee0-7a7559881158	acfe635a-cb82-46dc-800a-c5c2431fb3a2	Kem
25990000.00	12	256	2026-07-02 21:06:38.741484	2026-07-02 21:06:38.741484	EXPORTED	604a2a0c-c5b4-4f89-92c1-b9b2c17ca508	16c1702a-9e54-448c-84a1-f792d4e3a53d	Titan Xám
21990000.00	8	256	2026-07-02 21:06:41.04827	2026-07-02 21:06:41.04827	EXPORTED	064a7ba0-1c73-4c7e-a24a-a696d3345e88	1628368c-54a0-4fc2-9f28-f06feeec57c1	Marble Xám
34990000.00	8	256	2026-07-02 21:06:41.532127	2026-07-02 21:06:41.532127	EXPORTED	0ed35b1c-720f-4a47-a681-42781f978569	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Tự nhiên
15990000.00	12	512	2026-07-02 21:06:43.628975	2026-07-02 21:06:43.628975	EXPORTED	13486aaa-6460-4d17-affe-4411d49e9cdb	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
14990000.00	12	256	2026-07-02 21:06:44.184891	2026-07-02 21:06:44.184891	EXPORTED	f2ccedeb-664f-4ca3-aabf-5d94eac3399e	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
28490000.00	6	256	2026-07-02 21:06:46.250403	2026-07-02 21:06:46.250403	EXPORTED	a4834d07-bf12-4fa5-b5c8-a27887bc3467	145b4ff7-b502-4a63-a67d-666a62412139	Hồng Phấn
13990000.00	12	256	2026-07-02 21:06:47.851324	2026-07-02 21:06:47.851324	EXPORTED	4cb32801-c353-4e0f-aae2-06c111a44956	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
18990000.00	12	512	2026-07-02 21:06:49.457274	2026-07-02 21:06:49.457274	EXPORTED	162b7b1d-80fa-430c-89e4-d474fc184ed5	07012006-e6f3-442c-bacf-382799932139	Trắng
24990000.00	16	512	2026-07-02 21:06:51.209414	2026-07-02 21:06:51.209414	EXPORTED	4c9f9a57-4d8a-42ee-a86a-2f0086ef5a73	c889aedf-2c51-4b23-b430-e04a784c0fea	Đen
25990000.00	6	256	2026-07-02 21:06:54.101448	2026-07-02 21:06:54.101448	EXPORTED	eba57224-ec40-4995-9035-39c615cead3a	59085754-49e0-4e3a-b1ea-a41f6474ca07	Xanh lá
12490000.00	8	256	2026-07-02 21:06:54.583297	2026-07-02 21:06:54.583297	EXPORTED	6acb8506-76a6-4edf-b8f9-7ae7f51a4d71	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Đen
17990000.00	16	512	2026-07-02 21:06:57.299301	2026-07-02 21:06:57.299301	EXPORTED	a4d12d6e-2722-4737-93bb-5e89add79510	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
13990000.00	12	256	2026-07-02 21:06:58.000322	2026-07-02 21:06:58.000322	EXPORTED	29d9f900-8215-4f9b-8c2e-92d22d7a1f09	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
3490000.00	4	128	2026-07-02 21:07:00.030512	2026-07-02 21:07:00.030512	EXPORTED	2fb2f577-073e-4d88-aaa2-40d586df943d	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xanh Lá
27990000.00	16	512	2026-07-02 21:07:00.4982	2026-07-02 21:07:00.4982	EXPORTED	3e10436c-89b3-41c0-aa71-ec801187b121	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Xanh Bầu Trời
47990000.00	12	512	2026-07-02 21:07:02.575201	2026-07-02 21:07:02.575201	EXPORTED	da53d04f-c3a5-4c92-9e56-7d10050b6b92	acfe635a-cb82-46dc-800a-c5c2431fb3a2	Kem
3490000.00	4	128	2026-07-02 21:07:05.035111	2026-07-02 21:07:05.035111	EXPORTED	f3015a42-8799-4271-8b33-c6509ab685ad	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xanh Lá
13990000.00	12	256	2026-07-02 21:07:06.700402	2026-07-02 21:07:06.700402	EXPORTED	9b11eae4-53f0-467f-86b2-014cb7a41d5b	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
19990000.00	8	128	2026-07-02 21:07:08.302229	2026-07-02 21:07:08.302229	EXPORTED	3408fdaa-b8c6-4273-9792-846b51826d5e	1628368c-54a0-4fc2-9f28-f06feeec57c1	Onyx Đen
18990000.00	6	128	2026-07-02 21:07:09.924275	2026-07-02 21:07:09.924275	EXPORTED	045048ba-ab92-428b-b82f-e7b93f311715	e2213015-5168-45e3-a5c4-f792649bb853	Tím
14990000.00	12	256	2026-07-02 21:07:10.374415	2026-07-02 21:07:10.374415	EXPORTED	d0f5568a-93d7-49fb-a926-84c4b244a5d5	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
14990000.00	12	256	2026-07-02 21:07:12.648861	2026-07-02 21:07:12.648861	EXPORTED	0852d2e9-cb73-4aae-8447-9a66260860f2	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
13990000.00	12	256	2026-07-02 21:07:13.142263	2026-07-02 21:07:13.142263	EXPORTED	c4c61e89-b556-41b3-aa15-2ef1788d489c	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
37990000.00	8	512	2026-07-02 21:07:15.28173	2026-07-02 21:07:15.28173	EXPORTED	889f3739-8524-47cb-99bd-51c9c847c4cd	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Tự nhiên
15990000.00	12	512	2026-07-02 21:07:16.846333	2026-07-02 21:07:16.846333	EXPORTED	0af57dfc-60e6-4034-8da8-b88710803161	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
18990000.00	12	512	2026-07-02 21:07:18.466247	2026-07-02 21:07:18.466247	EXPORTED	fd9a89b8-08dc-4152-a9d1-7c6183b26dd8	07012006-e6f3-442c-bacf-382799932139	Trắng
8990000.00	8	256	2026-07-02 21:07:20.184212	2026-07-02 21:07:20.184212	EXPORTED	cdbf0f04-4d32-41bd-833f-dfc461aa6377	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
25990000.00	6	256	2026-07-02 21:07:20.635543	2026-07-02 21:07:20.635543	EXPORTED	86f601dd-9a4f-4d71-83b0-cacddd84b15e	59085754-49e0-4e3a-b1ea-a41f6474ca07	Xanh lá
25990000.00	6	256	2026-07-02 21:07:22.700414	2026-07-02 21:07:22.700414	EXPORTED	b836cc19-cd61-4c8f-96e0-269b7e752f05	59085754-49e0-4e3a-b1ea-a41f6474ca07	Xanh lá
15990000.00	12	512	2026-07-02 21:07:23.156395	2026-07-02 21:07:23.156395	EXPORTED	7392b678-89b4-41db-bc33-e1cdeb67d584	c8078475-d3e3-46be-a7b4-cde1e07e664a	Xanh Ocean
28490000.00	6	256	2026-07-02 21:07:25.197906	2026-07-02 21:07:25.197906	EXPORTED	28bb64af-62d3-4bd4-ad24-a1df5e747a3f	145b4ff7-b502-4a63-a67d-666a62412139	Hồng Phấn
24990000.00	16	512	2026-07-02 21:07:25.671742	2026-07-02 21:07:25.671742	EXPORTED	e41c406e-a753-48f3-9955-2b3d60464444	82b0225d-578a-403a-a0fd-3835f735a213	Đen Tuyền
3490000.00	4	128	2026-07-02 21:07:27.713238	2026-07-02 21:07:27.713238	EXPORTED	a6296d67-6b02-4e5b-a4b1-eb39f41499b1	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xanh Lá
8990000.00	8	256	2026-07-02 21:07:28.231509	2026-07-02 21:07:28.231509	EXPORTED	0960b0a5-1ee0-4f82-81d8-ecbe2553554e	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
19990000.00	8	128	2026-07-02 21:07:30.302569	2026-07-02 21:07:30.302569	EXPORTED	aab559cf-925e-4c17-aff6-f8a9af730762	1628368c-54a0-4fc2-9f28-f06feeec57c1	Onyx Đen
8990000.00	8	256	2026-07-02 21:07:31.877809	2026-07-02 21:07:31.877809	EXPORTED	e4ac7d52-3482-43b5-ad3c-9b1f12e1f7f9	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
37990000.00	8	512	2026-07-02 21:07:32.331537	2026-07-02 21:07:32.331537	EXPORTED	6f7d8c5f-e149-4cf3-9335-d6005db3db30	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Đen
24990000.00	16	512	2026-07-02 21:07:34.442113	2026-07-02 21:07:34.442113	EXPORTED	ae663292-0f5b-4b94-aad7-f77a3c20db3b	82b0225d-578a-403a-a0fd-3835f735a213	Đen Tuyền
15990000.00	12	512	2026-07-02 21:07:34.893557	2026-07-02 21:07:34.893557	EXPORTED	01e16c4c-7201-4a77-8e61-cf4a9caf49e2	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
24990000.00	16	512	2026-07-02 21:07:36.973485	2026-07-02 21:07:36.973485	EXPORTED	48dc6932-2ce7-4b1e-861d-78f939d76f7b	c889aedf-2c51-4b23-b430-e04a784c0fea	Đen
18990000.00	6	128	2026-07-02 21:07:39.046223	2026-07-02 21:07:39.046223	EXPORTED	ee58ac72-7665-403c-bd41-698398b69227	e2213015-5168-45e3-a5c4-f792649bb853	Tím
37990000.00	8	512	2026-07-02 21:07:40.666321	2026-07-02 21:07:40.666321	EXPORTED	0260d426-c7a0-4c56-bdbb-566f71a3bae3	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Đen
16990000.00	12	256	2026-07-02 21:07:42.294223	2026-07-02 21:07:42.294223	EXPORTED	ab3026af-4cf8-4dbe-812b-02fc8196fb8d	07012006-e6f3-442c-bacf-382799932139	Đen
18990000.00	6	128	2026-07-02 21:07:42.7449	2026-07-02 21:07:42.7449	EXPORTED	cf41e779-0149-4e84-bddf-c67fad08f42c	e2213015-5168-45e3-a5c4-f792649bb853	Tím
16990000.00	12	256	2026-07-02 21:07:44.828359	2026-07-02 21:07:44.828359	EXPORTED	824c9645-f656-4a27-adff-abb0c2a952cb	07012006-e6f3-442c-bacf-382799932139	Đen
22490000.00	12	256	2026-07-02 21:07:45.275205	2026-07-02 21:07:45.275205	EXPORTED	29fd26f9-5785-4c0a-b8a4-e998a611fa08	82b0225d-578a-403a-a0fd-3835f735a213	Xanh Lục Bảo
15990000.00	12	512	2026-07-02 21:07:47.305932	2026-07-02 21:07:47.305932	EXPORTED	548756de-7931-4e79-94e6-aac784d0cdc6	c8078475-d3e3-46be-a7b4-cde1e07e664a	Xanh Ocean
19990000.00	8	128	2026-07-02 21:07:48.891462	2026-07-02 21:07:48.891462	EXPORTED	8c40ce43-b3fd-4b16-97dd-f55bc62cc464	1628368c-54a0-4fc2-9f28-f06feeec57c1	Onyx Đen
27990000.00	16	512	2026-07-02 21:07:49.489045	2026-07-02 21:07:49.489045	EXPORTED	a16801de-291c-491b-8862-b781eb2fd2b9	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Xanh Bầu Trời
18990000.00	6	128	2026-07-02 21:07:51.630799	2026-07-02 21:07:51.630799	EXPORTED	59771aa9-0e03-4a5a-969f-2e6c68511f6f	e2213015-5168-45e3-a5c4-f792649bb853	Tím
17990000.00	16	512	2026-07-02 21:07:52.089415	2026-07-02 21:07:52.089415	EXPORTED	42ee0607-c0b4-4ca6-8b8d-ceaecbf7fe4e	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
22990000.00	12	512	2026-07-02 21:07:54.159308	2026-07-02 21:07:54.159308	EXPORTED	fb9f58d6-a451-4d5d-a6e1-6fe2d8d902f1	4640982c-0c67-40b8-be17-a2689c61a3c2	Trắng Tinh Tuyết
19990000.00	8	128	2026-07-02 21:07:54.618075	2026-07-02 21:07:54.618075	EXPORTED	2618e911-e149-4bf6-9f91-2fddd2c3cd30	1628368c-54a0-4fc2-9f28-f06feeec57c1	Onyx Đen
15990000.00	12	512	2026-07-02 21:07:56.868289	2026-07-02 21:07:56.868289	EXPORTED	9461f184-b574-498d-b8b8-732d28c5a179	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
27990000.00	16	512	2026-07-02 21:07:57.614352	2026-07-02 21:07:57.614352	EXPORTED	b9ac8c37-9d65-40f8-807c-a0e5cf7f5416	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Xanh Bầu Trời
19990000.00	8	128	2026-07-02 21:07:59.667553	2026-07-02 21:07:59.667553	EXPORTED	41161e45-b281-449d-8772-624d323ff82c	1628368c-54a0-4fc2-9f28-f06feeec57c1	Onyx Đen
2990000.00	4	64	2026-07-02 21:08:00.159259	2026-07-02 21:08:00.159259	EXPORTED	5d73c9f4-5b32-4bf8-80da-dbca1576df32	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xám Graphite
19990000.00	12	256	2026-07-02 21:08:02.349164	2026-07-02 21:08:02.349164	EXPORTED	7f8b7969-7d72-48ec-a38a-789eed544bc2	4640982c-0c67-40b8-be17-a2689c61a3c2	Đen Tinh Thể
34990000.00	8	256	2026-07-02 21:08:02.815933	2026-07-02 21:08:02.815933	EXPORTED	c03e4bb4-2b1f-4bfa-a081-3c3be0488888	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Sa Mạc
17990000.00	16	512	2026-07-02 21:08:04.876119	2026-07-02 21:08:04.876119	EXPORTED	2f1bdf9b-a6e5-4c20-87ed-a9d1b42be3fa	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
22990000.00	6	128	2026-07-02 21:08:05.480263	2026-07-02 21:08:05.480263	EXPORTED	b33c6259-c163-456a-ba78-aa13e6c72409	59085754-49e0-4e3a-b1ea-a41f6474ca07	Hồng
19990000.00	8	128	2026-07-02 21:08:07.684208	2026-07-02 21:08:07.684208	EXPORTED	103a63f5-e4d6-4c9f-84b9-754c538faaa7	1628368c-54a0-4fc2-9f28-f06feeec57c1	Onyx Đen
12490000.00	8	256	2026-07-02 21:08:09.274264	2026-07-02 21:08:09.274264	EXPORTED	196affca-3765-4b6a-85fa-22a65c8308a5	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Đen
24490000.00	12	512	2026-07-02 21:08:10.905859	2026-07-02 21:08:10.905859	EXPORTED	4a68318a-dc5b-441c-a096-eb6874357eb9	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Vàng Hổ Phách
7490000.00	8	256	2026-07-02 21:08:12.508807	2026-07-02 21:08:12.508807	EXPORTED	e618947e-16b7-4168-93fe-6fdad6a3a090	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Đen Bóng Đêm
15990000.00	12	512	2026-07-02 21:08:14.64442	2026-07-02 21:08:14.64442	EXPORTED	9c8ce216-6aa7-42d2-b5bf-e11cc01f6faa	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
14990000.00	12	256	2026-07-02 21:08:16.262093	2026-07-02 21:08:16.262093	EXPORTED	00fdb19f-7b25-491b-bb3a-8752b5e89f44	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
33990000.00	12	1024	2026-07-02 21:08:17.927783	2026-07-02 21:08:17.927783	EXPORTED	09a7b7b6-f204-47a0-981a-c6786cab519a	16c1702a-9e54-448c-84a1-f792d4e3a53d	Titan Đen
21990000.00	12	256	2026-07-02 21:08:19.593824	2026-07-02 21:08:19.593824	EXPORTED	1abc04db-05fd-4ad3-af2e-f355ee269607	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Tím Coban
27990000.00	16	512	2026-07-02 21:08:21.175019	2026-07-02 21:08:21.175019	EXPORTED	a68b46b8-d6be-49cd-a753-0741ac23ef28	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Xanh Bầu Trời
6490000.00	8	128	2026-07-02 21:08:21.626615	2026-07-02 21:08:21.626615	EXPORTED	5794d6f6-122e-4eae-999a-7051925e3e0c	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Xanh Rừng
28990000.00	16	512	2026-07-02 21:08:23.690477	2026-07-02 21:08:23.690477	EXPORTED	9fec2cf1-8870-48cf-9ad0-5ee1bf34bc87	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Phantom Black
34990000.00	8	256	2026-07-02 21:08:25.713741	2026-07-02 21:08:25.713741	EXPORTED	9179c641-1a91-4e08-b4c0-7212763c4239	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Tự nhiên
27990000.00	16	512	2026-07-02 21:08:27.315607	2026-07-02 21:08:27.315607	EXPORTED	c6b2cdc6-7eb7-4a65-bd79-3c4b8d0d726d	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Xanh Bầu Trời
16990000.00	12	256	2026-07-02 21:08:28.925326	2026-07-02 21:08:28.925326	EXPORTED	1cdabbab-8448-4f05-808d-3edeea4e7f25	07012006-e6f3-442c-bacf-382799932139	Đen
17990000.00	16	512	2026-07-02 21:08:29.375162	2026-07-02 21:08:29.375162	EXPORTED	f38c0c1f-ae3c-486d-b072-50ae2a1a0fcb	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
47990000.00	12	512	2026-07-02 21:08:31.713695	2026-07-02 21:08:31.713695	EXPORTED	8aaa8049-5cbb-4ece-92b1-95b783c5a986	acfe635a-cb82-46dc-800a-c5c2431fb3a2	Kem
21990000.00	12	256	2026-07-02 21:08:32.172378	2026-07-02 21:08:32.172378	EXPORTED	cc71dfdd-3a2f-4da7-bb4b-1ebf795d916a	c889aedf-2c51-4b23-b430-e04a784c0fea	Titan Xám
14990000.00	12	256	2026-07-02 21:08:34.264545	2026-07-02 21:08:34.264545	EXPORTED	589e2541-9f64-4bbf-936c-c59ef74fb21d	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
17990000.00	16	512	2026-07-02 21:08:34.722299	2026-07-02 21:08:34.722299	EXPORTED	ade3d84d-d63b-46c6-bb68-f668e1ad2d3d	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
13990000.00	12	256	2026-07-02 21:08:37.048982	2026-07-02 21:08:37.048982	EXPORTED	ec66d706-db06-491f-86ab-7e3cba2414ca	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
14990000.00	12	256	2026-07-02 21:08:37.50199	2026-07-02 21:08:37.50199	EXPORTED	9b04682f-5428-44e4-9ff4-cc75b3c80eb9	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
47990000.00	12	512	2026-07-02 21:08:39.982712	2026-07-02 21:08:39.982712	EXPORTED	3a74f773-e3e5-4c21-9c5c-4bf4f5dac030	acfe635a-cb82-46dc-800a-c5c2431fb3a2	Kem
22490000.00	12	256	2026-07-02 21:08:40.620529	2026-07-02 21:08:40.620529	EXPORTED	12d5b0d1-005f-46f3-9a4b-10c47a3dc2d0	82b0225d-578a-403a-a0fd-3835f735a213	Xanh Lục Bảo
24990000.00	16	256	2026-07-02 21:08:42.703301	2026-07-02 21:08:42.703301	EXPORTED	24263295-7148-46ad-af0b-523bc9f793c2	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Đen Biển Sâu
18990000.00	12	512	2026-07-02 21:08:43.153972	2026-07-02 21:08:43.153972	EXPORTED	daad2ee0-e90c-4332-9a37-48ad31bd9bf5	07012006-e6f3-442c-bacf-382799932139	Trắng
34990000.00	8	256	2026-07-02 21:08:45.248481	2026-07-02 21:08:45.248481	EXPORTED	bcddbbeb-56aa-4b2b-9d95-6a898df0654c	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Sa Mạc
22490000.00	12	256	2026-07-02 21:08:45.788891	2026-07-02 21:08:45.788891	EXPORTED	d7ae48bd-ff6d-4eaf-95fe-98e5053dd2bb	82b0225d-578a-403a-a0fd-3835f735a213	Xanh Lục Bảo
28990000.00	12	512	2026-07-02 21:08:48.290785	2026-07-02 21:08:48.290785	EXPORTED	a7655127-270c-409c-9e3d-a11df7526f84	16c1702a-9e54-448c-84a1-f792d4e3a53d	Titan Xám
19990000.00	8	128	2026-07-02 21:08:49.914263	2026-07-02 21:08:49.914263	EXPORTED	0be2dc74-8691-4102-9d77-0998e6e956a3	1628368c-54a0-4fc2-9f28-f06feeec57c1	Onyx Đen
15990000.00	12	512	2026-07-02 21:08:51.537097	2026-07-02 21:08:51.537097	EXPORTED	c4a3c3ee-8414-4189-aec3-7b7a81d16222	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
15990000.00	12	512	2026-07-02 21:08:53.28409	2026-07-02 21:08:53.28409	EXPORTED	e4ee4b25-13e9-44ea-9b90-fdd4420976e5	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
25990000.00	6	256	2026-07-02 21:08:54.93273	2026-07-02 21:08:54.93273	EXPORTED	411a3faf-4e13-4136-b9ad-9f88c2448108	59085754-49e0-4e3a-b1ea-a41f6474ca07	Xanh lá
15990000.00	12	512	2026-07-02 21:08:55.385392	2026-07-02 21:08:55.385392	EXPORTED	9f40d28e-0614-4c2d-b57c-9777fb7c5a99	c8078475-d3e3-46be-a7b4-cde1e07e664a	Xanh Ocean
43990000.00	12	256	2026-07-02 21:08:58.034709	2026-07-02 21:08:58.034709	EXPORTED	2bb2e651-687e-4416-b7cf-32e1a48e09de	acfe635a-cb82-46dc-800a-c5c2431fb3a2	Xanh Đá Phiến
25990000.00	12	256	2026-07-02 21:08:58.608705	2026-07-02 21:08:58.608705	EXPORTED	a3926e79-cf3c-4a20-a7e7-bdbd86e58de2	16c1702a-9e54-448c-84a1-f792d4e3a53d	Titan Xám
19990000.00	12	256	2026-07-02 21:09:01.087401	2026-07-02 21:09:01.087401	EXPORTED	1475752b-ebb0-4c47-b75c-c6c0a64d0967	4640982c-0c67-40b8-be17-a2689c61a3c2	Đen Tinh Thể
18990000.00	6	128	2026-07-02 21:09:01.546714	2026-07-02 21:09:01.546714	EXPORTED	7c18aa21-3a0a-4899-8d5d-7c3427d4f083	e2213015-5168-45e3-a5c4-f792649bb853	Tím
37990000.00	8	512	2026-07-02 21:09:03.747126	2026-07-02 21:09:03.747126	EXPORTED	e2a152d0-4f84-44ff-ae2d-e9e494ad4a93	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Đen
28990000.00	16	512	2026-07-02 21:09:05.380536	2026-07-02 21:09:05.380536	EXPORTED	26b2d704-0905-4c95-adf2-b00f7f58e045	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Phantom Black
24990000.00	16	512	2026-07-02 21:09:05.829658	2026-07-02 21:09:05.829658	EXPORTED	a7392b5f-e53b-4187-9de5-07f0d4ff6efe	c889aedf-2c51-4b23-b430-e04a784c0fea	Đen
28490000.00	6	256	2026-07-02 21:09:07.905334	2026-07-02 21:09:07.905334	EXPORTED	db2c8beb-f0dd-4c1d-9ffc-9a04ff59a6e3	145b4ff7-b502-4a63-a67d-666a62412139	Hồng Phấn
27990000.00	16	512	2026-07-02 21:09:09.552586	2026-07-02 21:09:09.552586	EXPORTED	86ac42ae-0d31-436c-9d13-580b0b46c063	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Xanh Bầu Trời
14990000.00	12	256	2026-07-02 21:09:10.015573	2026-07-02 21:09:10.015573	EXPORTED	adfc2355-6c05-4211-adc0-c7d79a1be510	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
25490000.00	6	128	2026-07-02 21:09:12.520707	2026-07-02 21:09:12.520707	EXPORTED	ec6bb45c-b2c7-48d2-b214-3ef5e0f11698	145b4ff7-b502-4a63-a67d-666a62412139	Xanh Dương Nhạt
15990000.00	12	512	2026-07-02 21:09:14.573321	2026-07-02 21:09:14.573321	EXPORTED	96d1120b-9b0c-4d1c-a24d-d2afa05fc89c	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
28490000.00	6	256	2026-07-02 21:09:16.337899	2026-07-02 21:09:16.337899	EXPORTED	70c147d6-623d-4a69-b14c-1f7c11a340ea	145b4ff7-b502-4a63-a67d-666a62412139	Hồng Phấn
8990000.00	8	256	2026-07-02 21:09:16.788295	2026-07-02 21:09:16.788295	EXPORTED	6478c85d-1f2b-4d23-9085-a330b8bae732	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
3490000.00	4	128	2026-07-02 21:09:19.153914	2026-07-02 21:09:19.153914	EXPORTED	6f7395e5-721c-47c7-ba18-63195e432b36	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xanh Lá
17990000.00	16	512	2026-07-02 21:09:20.863106	2026-07-02 21:09:20.863106	EXPORTED	885f5683-18bc-4b6d-8e30-9a8f78fa400d	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
13990000.00	12	256	2026-07-02 21:09:23.032925	2026-07-02 21:09:23.032925	EXPORTED	1d0dfa65-2eae-4ec7-b8c4-9e66de110930	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
14990000.00	12	256	2026-07-02 21:09:23.484786	2026-07-02 21:09:23.484786	EXPORTED	f1db027e-5221-4c09-a04e-35c7445badd1	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
8990000.00	8	256	2026-07-02 21:09:25.539278	2026-07-02 21:09:25.539278	EXPORTED	68e921d0-6a49-4315-a331-79fc5cd36410	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
24990000.00	16	512	2026-07-02 21:09:27.397149	2026-07-02 21:09:27.397149	EXPORTED	552280a0-62ea-46ef-b0da-51dd8524b4c0	82b0225d-578a-403a-a0fd-3835f735a213	Đen Tuyền
18990000.00	6	128	2026-07-02 21:09:29.15162	2026-07-02 21:09:29.15162	EXPORTED	142e1678-b7f0-4e67-8167-7539436161b0	e2213015-5168-45e3-a5c4-f792649bb853	Tím
34990000.00	8	256	2026-07-02 21:09:30.789114	2026-07-02 21:09:30.789114	EXPORTED	ad371af6-b839-4ae2-a735-6c7fce54f8ea	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Sa Mạc
21990000.00	6	256	2026-07-02 21:09:32.413566	2026-07-02 21:09:32.413566	EXPORTED	7d35cfba-adb5-42ea-bfff-e59d0a12d85b	e2213015-5168-45e3-a5c4-f792649bb853	Đỏ
16990000.00	12	256	2026-07-02 21:09:34.003682	2026-07-02 21:09:34.003682	EXPORTED	d0c0aa3f-b269-40cb-a351-3b58010f0b61	07012006-e6f3-442c-bacf-382799932139	Đen
25490000.00	6	128	2026-07-02 21:09:34.51674	2026-07-02 21:09:34.51674	EXPORTED	cb928d4f-63f6-4ba2-8a19-bef6d90aa3c7	145b4ff7-b502-4a63-a67d-666a62412139	Xanh Dương Nhạt
25490000.00	6	128	2026-07-02 21:09:36.761158	2026-07-02 21:09:36.761158	EXPORTED	0d47a50f-57d6-4010-896e-d24a4ae4a89a	145b4ff7-b502-4a63-a67d-666a62412139	Xanh Dương Nhạt
12490000.00	8	256	2026-07-02 21:09:38.334838	2026-07-02 21:09:38.334838	EXPORTED	f0bd59c6-e9f9-42b3-9dab-315a13921aa4	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Đen
24990000.00	16	512	2026-07-02 21:09:38.81879	2026-07-02 21:09:38.81879	EXPORTED	0d5697fb-8927-4271-8530-d49312379bd0	c889aedf-2c51-4b23-b430-e04a784c0fea	Đen
16990000.00	12	256	2026-07-02 21:09:40.970901	2026-07-02 21:09:40.970901	EXPORTED	02801f85-0a29-46e9-b3d4-cae579be7711	07012006-e6f3-442c-bacf-382799932139	Đen
8990000.00	8	256	2026-07-02 21:09:41.423548	2026-07-02 21:09:41.423548	EXPORTED	7e354000-1a0b-4265-ba2a-5d7af8c6eca1	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
21990000.00	8	256	2026-07-02 21:09:43.632965	2026-07-02 21:09:43.632965	EXPORTED	7ca357e8-65ad-412a-851f-2265d653229c	1628368c-54a0-4fc2-9f28-f06feeec57c1	Marble Xám
15990000.00	12	512	2026-07-02 21:09:45.688083	2026-07-02 21:09:45.688083	EXPORTED	11591511-61e6-4f4f-b2ae-a7e72c814ccd	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
17990000.00	16	512	2026-07-02 21:09:47.302585	2026-07-02 21:09:47.302585	EXPORTED	b2338270-1ae4-495f-b1c1-436d1a64bba7	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
7490000.00	8	256	2026-07-02 21:09:47.775705	2026-07-02 21:09:47.775705	EXPORTED	7eff3167-3d1b-4cd6-93a3-72c5b1c71e0e	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Đen Bóng Đêm
18990000.00	6	128	2026-07-02 21:09:50.54508	2026-07-02 21:09:50.54508	EXPORTED	30d66397-558e-4eaa-bdae-c223a5f402ea	e2213015-5168-45e3-a5c4-f792649bb853	Tím
25990000.00	6	256	2026-07-02 21:09:52.180325	2026-07-02 21:09:52.180325	EXPORTED	be7be0ec-8d1e-4334-b6ca-efef50ae9cf4	59085754-49e0-4e3a-b1ea-a41f6474ca07	Xanh lá
21990000.00	12	256	2026-07-02 21:09:54.057955	2026-07-02 21:09:54.057955	EXPORTED	974e05d4-2e6e-4861-9283-6a5dfcf631de	c889aedf-2c51-4b23-b430-e04a784c0fea	Titan Xám
27990000.00	16	512	2026-07-02 21:09:55.774821	2026-07-02 21:09:55.774821	EXPORTED	f4a818f9-96cc-4b04-815c-d56be75fdb97	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Xanh Bầu Trời
13990000.00	12	256	2026-07-02 21:09:56.262041	2026-07-02 21:09:56.262041	EXPORTED	109b053d-ae66-4926-8b91-c1231e5bbd53	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
21990000.00	6	256	2026-07-02 21:09:58.339205	2026-07-02 21:09:58.339205	EXPORTED	1a2e73d9-b4ef-4baa-b983-bff708cf97bf	e2213015-5168-45e3-a5c4-f792649bb853	Đỏ
2990000.00	4	64	2026-07-02 21:09:58.788127	2026-07-02 21:09:58.788127	EXPORTED	fe4dae83-6151-4744-a114-4258ca063024	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xám Graphite
25990000.00	12	256	2026-07-02 21:10:00.817791	2026-07-02 21:10:00.817791	EXPORTED	82befcf1-142e-419f-b7a2-42626843f660	16c1702a-9e54-448c-84a1-f792d4e3a53d	Titan Xám
22990000.00	12	512	2026-07-02 21:10:01.299287	2026-07-02 21:10:01.299287	EXPORTED	648922ab-e1cc-40b1-8a01-706a2769a7a4	4640982c-0c67-40b8-be17-a2689c61a3c2	Trắng Tinh Tuyết
37990000.00	8	512	2026-07-02 21:10:03.461297	2026-07-02 21:10:03.461297	EXPORTED	009200d3-2fd9-4a91-be79-05f52b338c02	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Tự nhiên
22990000.00	6	128	2026-07-02 21:10:04.555968	2026-07-02 21:10:04.555968	EXPORTED	50138b09-6ebe-45e3-ac51-290cbde3bd00	59085754-49e0-4e3a-b1ea-a41f6474ca07	Hồng
17990000.00	16	512	2026-07-02 21:10:06.681082	2026-07-02 21:10:06.681082	EXPORTED	de3a6194-78cd-49a5-940b-0b0e198d6e01	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
22490000.00	12	256	2026-07-02 21:10:07.13315	2026-07-02 21:10:07.13315	EXPORTED	49381364-5576-4952-80a2-e8b28a80f18b	82b0225d-578a-403a-a0fd-3835f735a213	Xanh Lục Bảo
21990000.00	6	256	2026-07-02 21:10:09.164108	2026-07-02 21:10:09.164108	EXPORTED	d983b1f7-4dd4-4329-8256-eb4d27ab9c4d	e2213015-5168-45e3-a5c4-f792649bb853	Đỏ
24990000.00	16	256	2026-07-02 21:10:10.843683	2026-07-02 21:10:10.843683	EXPORTED	96560ac3-b8b4-4813-b3c3-0883a878096b	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Đen Biển Sâu
21990000.00	8	256	2026-07-02 21:10:11.292923	2026-07-02 21:10:11.292923	EXPORTED	9e5dfdea-4058-4810-abef-9e998ced56ea	1628368c-54a0-4fc2-9f28-f06feeec57c1	Marble Xám
24990000.00	16	512	2026-07-02 21:10:13.376112	2026-07-02 21:10:13.376112	EXPORTED	93803f5c-1957-4381-bc91-c0687b756a9b	c889aedf-2c51-4b23-b430-e04a784c0fea	Đen
10490000.00	8	128	2026-07-02 21:10:14.984132	2026-07-02 21:10:14.984132	EXPORTED	f89577ba-2871-4a1c-bcfe-80d0ddb07fc3	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Xanh Băng
15990000.00	12	512	2026-07-02 21:10:17.30558	2026-07-02 21:10:17.30558	EXPORTED	a0c68271-29bd-4077-ad16-90102493bde6	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
21990000.00	12	256	2026-07-02 21:10:17.753074	2026-07-02 21:10:17.753074	EXPORTED	a5def204-8821-48a1-86f0-4bc669fe08d3	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Tím Coban
14990000.00	12	256	2026-07-02 21:10:19.776869	2026-07-02 21:10:19.776869	EXPORTED	a663752c-3da4-48b9-848b-0b7dc239d39a	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
24990000.00	16	256	2026-07-02 21:10:21.481473	2026-07-02 21:10:21.481473	EXPORTED	ca06b209-f72e-4ae4-a8ff-c11fc00bc55f	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Đen Biển Sâu
22490000.00	12	256	2026-07-02 21:10:21.926859	2026-07-02 21:10:21.926859	EXPORTED	d74c9e45-c1b5-4038-a960-d5499c0ea7ee	82b0225d-578a-403a-a0fd-3835f735a213	Xanh Lục Bảo
34990000.00	8	256	2026-07-02 16:52:20.788626	2026-07-02 16:52:20.788626	AVAILABLE	a86e1fe5-9e21-4e94-bbd6-3e472c3c8a83	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Sa Mạc
34990000.00	8	256	2026-07-02 16:52:20.788626	2026-07-02 16:52:20.788626	AVAILABLE	a34adc08-91c5-43f4-86ba-befbf2411f6e	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Sa Mạc
34990000.00	8	256	2026-07-02 16:52:20.789624	2026-07-02 16:52:20.789624	AVAILABLE	d06ff42d-111a-4e6a-8b51-ac37385d73b4	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Sa Mạc
34990000.00	8	256	2026-07-02 16:52:20.790624	2026-07-02 16:52:20.790624	AVAILABLE	09cf37bc-2f75-4bb1-a3c0-b7122aa7e950	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Sa Mạc
34990000.00	8	256	2026-07-02 16:52:20.791621	2026-07-02 16:52:20.791621	AVAILABLE	1271ff76-4f92-4944-9e70-174feb904cb7	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Sa Mạc
34990000.00	8	256	2026-07-02 16:52:20.791621	2026-07-02 16:52:20.791621	EXPORTED	e3dfd6b0-4fc5-437d-8df1-517f51df7d72	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Sa Mạc
34990000.00	8	256	2026-07-02 16:52:20.793613	2026-07-02 16:52:20.793613	EXPORTED	352e25f1-58f0-4aee-bcad-e21b5da85428	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Sa Mạc
37990000.00	8	512	2026-07-02 16:52:20.795127	2026-07-02 16:52:20.795127	AVAILABLE	8def75a1-5477-43bf-b00c-d3683d73141f	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Đen
37990000.00	8	512	2026-07-02 16:52:20.796154	2026-07-02 16:52:20.796154	AVAILABLE	070e1f6a-3024-427a-8426-e0b9fcf38a44	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Đen
37990000.00	8	512	2026-07-02 16:52:20.796154	2026-07-02 16:52:20.796154	AVAILABLE	e309c820-83f5-472d-ae9d-c313314ec3ed	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Đen
37990000.00	8	512	2026-07-02 16:52:20.796154	2026-07-02 16:52:20.796154	AVAILABLE	31043450-2c96-443a-a7f2-f88af4a5f361	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Đen
37990000.00	8	512	2026-07-02 16:52:20.797152	2026-07-02 16:52:20.797152	EXPORTED	5b42a16d-d7c9-4364-b0cb-d19ae52673f7	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Đen
19990000.00	8	128	2026-07-02 16:52:24.635837	2026-07-02 16:52:24.635837	AVAILABLE	c2b5bfb3-dd93-4d57-b1d1-6f0a4730d888	1628368c-54a0-4fc2-9f28-f06feeec57c1	Onyx Đen
19990000.00	8	128	2026-07-02 16:52:24.635837	2026-07-02 16:52:24.635837	AVAILABLE	ef974e1e-704b-4993-948e-dd1603bd831b	1628368c-54a0-4fc2-9f28-f06feeec57c1	Onyx Đen
19990000.00	8	128	2026-07-02 16:52:24.636835	2026-07-02 16:52:24.636835	EXPORTED	8e22cf06-8f48-4b36-8066-3cc71a8b06bb	1628368c-54a0-4fc2-9f28-f06feeec57c1	Onyx Đen
19990000.00	8	128	2026-07-02 16:52:24.638836	2026-07-02 16:52:24.638836	EXPORTED	daec3980-11d5-4ac5-8fb2-ff720c03610c	1628368c-54a0-4fc2-9f28-f06feeec57c1	Onyx Đen
19990000.00	8	128	2026-07-02 16:52:24.641838	2026-07-02 16:52:24.641838	EXPORTED	efcd10b0-3884-4223-90dd-03af0da4fdf0	1628368c-54a0-4fc2-9f28-f06feeec57c1	Onyx Đen
19990000.00	8	128	2026-07-02 16:52:24.643835	2026-07-02 16:52:24.643835	EXPORTED	47001f28-69d1-4922-a57f-551712c12f89	1628368c-54a0-4fc2-9f28-f06feeec57c1	Onyx Đen
21990000.00	8	256	2026-07-02 16:52:24.643835	2026-07-02 16:52:24.643835	AVAILABLE	453116e3-6c80-4dc4-9e6d-b230540327a0	1628368c-54a0-4fc2-9f28-f06feeec57c1	Marble Xám
21990000.00	8	256	2026-07-02 16:52:24.644839	2026-07-02 16:52:24.644839	EXPORTED	ca5e5c70-b6d6-410e-b1f9-ce668a924267	1628368c-54a0-4fc2-9f28-f06feeec57c1	Marble Xám
21990000.00	8	256	2026-07-02 16:52:24.644839	2026-07-02 16:52:24.644839	EXPORTED	0000dead-f77f-4ab2-b319-f5195a3d6342	1628368c-54a0-4fc2-9f28-f06feeec57c1	Marble Xám
27990000.00	16	512	2026-07-02 16:52:28.186863	2026-07-02 16:52:28.186863	EXPORTED	1a0041d1-c7fd-4dec-a34c-a8ee18e19293	098b52d0-0c50-4fa2-87b5-f6aaf55b8417	Đen
27990000.00	16	512	2026-07-02 16:52:28.187858	2026-07-02 16:52:28.187858	EXPORTED	0e6c739d-6e78-41cb-bc78-2a2fd9e56b43	098b52d0-0c50-4fa2-87b5-f6aaf55b8417	Đen
27990000.00	16	512	2026-07-02 16:52:28.187858	2026-07-02 16:52:28.187858	EXPORTED	b0c5d031-3a0c-489b-9cae-62eb4522c109	098b52d0-0c50-4fa2-87b5-f6aaf55b8417	Đen
27990000.00	16	512	2026-07-02 16:52:28.187858	2026-07-02 16:52:28.187858	EXPORTED	0dc88ae7-8f36-4f1f-9946-f04886d0f50c	098b52d0-0c50-4fa2-87b5-f6aaf55b8417	Đen
27990000.00	16	512	2026-07-02 16:52:28.187858	2026-07-02 16:52:28.187858	EXPORTED	ffb2af78-4a2e-4d8a-a1ba-2c0c639b7327	098b52d0-0c50-4fa2-87b5-f6aaf55b8417	Đen
27990000.00	16	512	2026-07-02 16:52:28.188867	2026-07-02 16:52:28.188867	EXPORTED	87d1307f-5e71-435f-8282-d7bc4f641d05	098b52d0-0c50-4fa2-87b5-f6aaf55b8417	Đen
13990000.00	12	256	2026-07-02 16:52:30.662538	2026-07-02 16:52:30.662538	AVAILABLE	172164f8-2c14-46b5-b3bf-f1f168fdbe00	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
13990000.00	12	256	2026-07-02 16:52:30.662538	2026-07-02 16:52:30.662538	AVAILABLE	453f93ea-37b0-480f-9f2a-85093f2514e6	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
13990000.00	12	256	2026-07-02 16:52:30.662538	2026-07-02 16:52:30.662538	AVAILABLE	d5d80efa-c801-4b7b-8167-3edb922926a0	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
13990000.00	12	256	2026-07-02 16:52:30.662538	2026-07-02 16:52:30.662538	AVAILABLE	1d6801e7-9c2a-4128-a430-daecd2a83262	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
13990000.00	12	256	2026-07-02 16:52:30.662538	2026-07-02 16:52:30.662538	AVAILABLE	d1943d8b-bcae-49a6-bebd-63bda48edb73	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
13990000.00	12	256	2026-07-02 16:52:30.662538	2026-07-02 16:52:30.662538	AVAILABLE	27ff28a0-1fef-417e-9a8b-55036d5b84d3	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
13990000.00	12	256	2026-07-02 16:52:30.663529	2026-07-02 16:52:30.663529	AVAILABLE	ae175ccd-8cd7-409b-a6c5-36830f06d67c	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
13990000.00	12	256	2026-07-02 16:52:30.663529	2026-07-02 16:52:30.663529	EXPORTED	eb9a0edd-13ac-4a3b-8ebd-32f452564302	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
13990000.00	12	256	2026-07-02 16:52:30.663529	2026-07-02 16:52:30.663529	EXPORTED	7c60472d-8d03-4957-bdde-902925a03c0c	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
15990000.00	12	512	2026-07-02 16:52:30.663529	2026-07-02 16:52:30.663529	AVAILABLE	bfabe050-3d57-4a23-a450-3d044e52dd0f	c8078475-d3e3-46be-a7b4-cde1e07e664a	Xanh Ocean
15990000.00	12	512	2026-07-02 16:52:30.664534	2026-07-02 16:52:30.664534	AVAILABLE	f183b6e6-df72-4cad-9421-d366304cd969	c8078475-d3e3-46be-a7b4-cde1e07e664a	Xanh Ocean
15990000.00	12	512	2026-07-02 16:52:30.665534	2026-07-02 16:52:30.665534	AVAILABLE	21c19022-873f-4dab-b8db-e2f4d1a0aa0c	c8078475-d3e3-46be-a7b4-cde1e07e664a	Xanh Ocean
15990000.00	12	512	2026-07-02 16:52:30.666534	2026-07-02 16:52:30.666534	AVAILABLE	0c8350be-3615-47fa-b9bf-f95a9c1fa8d3	c8078475-d3e3-46be-a7b4-cde1e07e664a	Xanh Ocean
15990000.00	12	512	2026-07-02 16:52:30.666534	2026-07-02 16:52:30.666534	AVAILABLE	0c643701-2610-48a0-875b-142e3b1d40d6	c8078475-d3e3-46be-a7b4-cde1e07e664a	Xanh Ocean
15990000.00	12	512	2026-07-02 16:52:30.666534	2026-07-02 16:52:30.666534	EXPORTED	94b8bd84-918b-4885-8f46-bd9641c20d57	c8078475-d3e3-46be-a7b4-cde1e07e664a	Xanh Ocean
15990000.00	12	512	2026-07-02 16:52:35.671375	2026-07-02 16:52:35.671375	AVAILABLE	3af41a20-be27-4c7d-b9f8-4e391993fb3f	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
15990000.00	12	512	2026-07-02 16:52:35.671375	2026-07-02 16:52:35.671375	AVAILABLE	bc10a005-b9db-4ace-85eb-01ab30ddafd5	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
15990000.00	12	512	2026-07-02 16:52:35.671375	2026-07-02 16:52:35.671375	AVAILABLE	bed4c68f-ef7e-4806-80f9-66098d6f623b	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
15990000.00	12	512	2026-07-02 16:52:35.671375	2026-07-02 16:52:35.671375	AVAILABLE	882bf4d2-2355-4138-80ab-f25aa8bc64ad	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
15990000.00	12	512	2026-07-02 16:52:35.671375	2026-07-02 16:52:35.671375	EXPORTED	4bac508e-b0e9-4d30-993a-470709a62858	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
15990000.00	12	512	2026-07-02 16:52:35.671375	2026-07-02 16:52:35.671375	EXPORTED	08abc154-0526-4c64-9780-1d51e028102d	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
15990000.00	12	512	2026-07-02 16:52:35.672367	2026-07-02 16:52:35.672367	EXPORTED	2487a9fb-5e82-4470-aa9b-ea732bede6ab	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
12990000.00	16	256	2026-07-02 16:52:38.645898	2026-07-02 16:52:38.645898	EXPORTED	02cdfa75-2742-463c-9a96-9c8d82c6ccb6	38d600e7-c9ac-4f94-b957-de371ebae1a7	Cool Blue
12990000.00	16	256	2026-07-02 16:52:38.645898	2026-07-02 16:52:38.645898	EXPORTED	81417b9a-7483-437f-ab2f-582d83802fa4	38d600e7-c9ac-4f94-b957-de371ebae1a7	Cool Blue
12990000.00	16	256	2026-07-02 16:52:38.645898	2026-07-02 16:52:38.645898	EXPORTED	a756b005-e885-4447-bc26-e7b6dd80b56c	38d600e7-c9ac-4f94-b957-de371ebae1a7	Cool Blue
12990000.00	16	256	2026-07-02 16:52:38.646898	2026-07-02 16:52:38.646898	EXPORTED	1e574dc1-6fec-45ec-98e5-1690f1b916c7	38d600e7-c9ac-4f94-b957-de371ebae1a7	Cool Blue
12990000.00	16	256	2026-07-02 16:52:38.646898	2026-07-02 16:52:38.646898	EXPORTED	e9c6e4f6-e525-407f-a5a5-f5c9def6a1a5	38d600e7-c9ac-4f94-b957-de371ebae1a7	Cool Blue
8990000.00	8	256	2026-07-02 16:52:41.182528	2026-07-02 16:52:41.182528	AVAILABLE	13690f11-af85-4912-a3a0-30a7d43757d8	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
8990000.00	8	256	2026-07-02 16:52:41.182528	2026-07-02 16:52:41.182528	AVAILABLE	ae132683-a2f3-4fcc-a15e-84ff1cff4380	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
8990000.00	8	256	2026-07-02 16:52:41.182528	2026-07-02 16:52:41.182528	AVAILABLE	2b73ad7f-ad57-40b2-be9d-48095ca1a7d0	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
8990000.00	8	256	2026-07-02 16:52:41.182528	2026-07-02 16:52:41.182528	AVAILABLE	0b2d3235-47e1-4b2d-b986-b50de98b8526	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
8990000.00	8	256	2026-07-02 16:52:41.182528	2026-07-02 16:52:41.182528	AVAILABLE	c5c812c4-4ac4-4f78-81c3-963b8c4a2baa	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
8990000.00	8	256	2026-07-02 16:52:41.182528	2026-07-02 16:52:41.182528	AVAILABLE	4cf37686-495a-497d-8e7b-ca82ccfa5b07	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
8990000.00	8	256	2026-07-02 16:52:41.183528	2026-07-02 16:52:41.183528	AVAILABLE	003de057-17d1-45d3-b5d6-a04d6820fb51	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
8990000.00	8	256	2026-07-02 16:52:41.183528	2026-07-02 16:52:41.183528	AVAILABLE	34720991-196b-4797-aa9c-779b9456a336	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
8990000.00	8	256	2026-07-02 16:52:41.183528	2026-07-02 16:52:41.183528	EXPORTED	a2c96bc9-5a89-4bfa-9208-a3ec38247817	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
8990000.00	8	256	2026-07-02 16:52:41.183528	2026-07-02 16:52:41.183528	EXPORTED	68fbee72-c039-4e09-afe0-3eeaa14d587e	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
21990000.00	12	256	2026-07-02 16:52:44.740622	2026-07-02 16:52:44.740622	AVAILABLE	91eab31b-7cb2-40ff-b2c3-3676ced0e17f	c889aedf-2c51-4b23-b430-e04a784c0fea	Titan Xám
21990000.00	12	256	2026-07-02 16:52:44.740622	2026-07-02 16:52:44.740622	EXPORTED	5629fa44-4676-45c1-b777-2d34ff56c67a	c889aedf-2c51-4b23-b430-e04a784c0fea	Titan Xám
24990000.00	16	512	2026-07-02 16:52:44.740622	2026-07-02 16:52:44.740622	AVAILABLE	ee73c48a-0426-4ea1-9a38-9aada3402496	c889aedf-2c51-4b23-b430-e04a784c0fea	Đen
34990000.00	8	256	2026-07-02 19:16:17.509741	2026-07-02 19:16:17.509741	AVAILABLE	4e75d087-043c-4337-90e6-76c4dd2b6f40	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Tự nhiên
34990000.00	8	256	2026-07-02 19:16:17.987215	2026-07-02 19:16:17.987215	AVAILABLE	a0d891e1-8685-4c33-ab4d-5733bfea5cdd	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Đen
37990000.00	8	512	2026-07-02 19:16:18.45756	2026-07-02 19:16:18.45756	AVAILABLE	8666ff45-caef-46bc-af7b-e20b582f1bef	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Tự nhiên
43990000.00	8	1024	2026-07-02 19:16:18.910177	2026-07-02 19:16:18.910177	AVAILABLE	f4b42e66-b26c-4575-9409-c31839d1ceed	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Xanh
43990000.00	8	1024	2026-07-02 19:16:18.910903	2026-07-02 19:16:18.910903	AVAILABLE	5b762bb9-625f-4e86-ac5e-5ac31ba43d8f	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Titan Xanh
16990000.00	12	256	2026-07-02 19:16:20.764447	2026-07-02 19:16:20.764447	AVAILABLE	9a35ae60-6355-46b5-b44a-a160c54e963d	07012006-e6f3-442c-bacf-382799932139	Đen
16990000.00	12	256	2026-07-02 19:16:20.764447	2026-07-02 19:16:20.764447	AVAILABLE	9a36cd98-5344-4a50-9623-e70cff8c4fc2	07012006-e6f3-442c-bacf-382799932139	Đen
16990000.00	12	256	2026-07-02 19:16:20.764447	2026-07-02 19:16:20.764447	AVAILABLE	97d59abb-d923-4a48-95c1-5557df60b4a2	07012006-e6f3-442c-bacf-382799932139	Đen
18990000.00	12	512	2026-07-02 19:16:21.674776	2026-07-02 19:16:21.674776	AVAILABLE	b8550d69-ddc1-44a3-84d3-bf71331dea3e	07012006-e6f3-442c-bacf-382799932139	Trắng
18990000.00	12	512	2026-07-02 19:16:21.674776	2026-07-02 19:16:21.674776	AVAILABLE	609fe8a0-1bc4-4469-a6ee-ba4110a31dc6	07012006-e6f3-442c-bacf-382799932139	Trắng
18990000.00	12	512	2026-07-02 19:16:21.675778	2026-07-02 19:16:21.675778	AVAILABLE	ec915c42-90a5-454f-aa5a-e783d7052e54	07012006-e6f3-442c-bacf-382799932139	Trắng
22990000.00	6	128	2026-07-02 19:16:23.492105	2026-07-02 19:16:23.492105	AVAILABLE	c4ee06e7-aba8-4e20-a578-962f936a40bb	59085754-49e0-4e3a-b1ea-a41f6474ca07	Hồng
22990000.00	6	128	2026-07-02 19:16:23.492105	2026-07-02 19:16:23.492105	AVAILABLE	b9fc46d3-5c28-4d18-b2dc-968fcd8cf424	59085754-49e0-4e3a-b1ea-a41f6474ca07	Hồng
25990000.00	6	256	2026-07-02 19:16:24.19596	2026-07-02 19:16:24.19596	AVAILABLE	476d118d-c640-4cea-84bf-2ebd2610cd2c	59085754-49e0-4e3a-b1ea-a41f6474ca07	Xanh lá
25990000.00	6	256	2026-07-02 19:16:24.19596	2026-07-02 19:16:24.19596	AVAILABLE	ffdaf8bf-f621-453b-b700-5ec3301ee139	59085754-49e0-4e3a-b1ea-a41f6474ca07	Xanh lá
30990000.00	6	512	2026-07-02 19:16:24.879115	2026-07-02 19:16:24.879115	AVAILABLE	314ef1a6-5751-4cf9-8c6c-2f515daebe4a	59085754-49e0-4e3a-b1ea-a41f6474ca07	Đen
30990000.00	6	512	2026-07-02 19:16:24.880109	2026-07-02 19:16:24.880109	AVAILABLE	dcbd66e1-3a04-490b-8a06-4a6fb69ce348	59085754-49e0-4e3a-b1ea-a41f6474ca07	Đen
43990000.00	12	256	2026-07-02 19:16:25.783211	2026-07-02 19:16:25.783211	AVAILABLE	9cf6175e-c232-476d-a4b0-d2f52d2ede5e	acfe635a-cb82-46dc-800a-c5c2431fb3a2	Xanh Đá Phiến
47990000.00	12	512	2026-07-02 19:16:26.236506	2026-07-02 19:16:26.236506	AVAILABLE	48846895-7cce-47ee-9130-704c74bdce7e	acfe635a-cb82-46dc-800a-c5c2431fb3a2	Kem
19990000.00	12	256	2026-07-02 19:16:26.912675	2026-07-02 19:16:26.912675	AVAILABLE	9da5f0dd-bb11-4d58-b9f4-2ef182f74429	4640982c-0c67-40b8-be17-a2689c61a3c2	Đen Tinh Thể
19990000.00	12	256	2026-07-02 19:16:26.912675	2026-07-02 19:16:26.912675	AVAILABLE	2a11611d-b933-41fa-b3e3-cee36fbc2832	4640982c-0c67-40b8-be17-a2689c61a3c2	Đen Tinh Thể
19990000.00	12	256	2026-07-02 19:16:26.913677	2026-07-02 19:16:26.913677	AVAILABLE	b710deda-b55c-4cb6-bfe4-aadc2857021c	4640982c-0c67-40b8-be17-a2689c61a3c2	Đen Tinh Thể
22990000.00	12	512	2026-07-02 19:16:27.825911	2026-07-02 19:16:27.825911	AVAILABLE	ad2c9229-03db-4891-8db6-c94a87919e58	4640982c-0c67-40b8-be17-a2689c61a3c2	Trắng Tinh Tuyết
22990000.00	12	512	2026-07-02 19:16:27.825911	2026-07-02 19:16:27.825911	AVAILABLE	21162dd3-8a04-422f-93c3-9b3a8609376c	4640982c-0c67-40b8-be17-a2689c61a3c2	Trắng Tinh Tuyết
22990000.00	12	512	2026-07-02 19:16:27.825911	2026-07-02 19:16:27.825911	AVAILABLE	a1a8ada0-8659-4bfb-b513-1f0b947e00fb	4640982c-0c67-40b8-be17-a2689c61a3c2	Trắng Tinh Tuyết
6490000.00	8	128	2026-07-02 19:16:28.958354	2026-07-02 19:16:28.958354	AVAILABLE	787f3f76-04b9-418a-ac74-7bb042e8d73c	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Xanh Rừng
6490000.00	8	128	2026-07-02 19:16:28.959354	2026-07-02 19:16:28.959354	AVAILABLE	572c7ac2-e1fa-41ef-99ae-dcf630692c9a	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Xanh Rừng
6490000.00	8	128	2026-07-02 19:16:28.960367	2026-07-02 19:16:28.960367	AVAILABLE	c220d86b-52db-41a7-993d-07c3492e8a97	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Xanh Rừng
6490000.00	8	128	2026-07-02 19:16:28.96137	2026-07-02 19:16:28.96137	AVAILABLE	d219e416-b570-46dd-a40b-8f85c3fd8008	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Xanh Rừng
7490000.00	8	256	2026-07-02 19:16:30.105547	2026-07-02 19:16:30.105547	AVAILABLE	64839bd2-d38c-4386-8a7e-d7e8c8a7fe4b	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Đen Bóng Đêm
7490000.00	8	256	2026-07-02 19:16:30.107486	2026-07-02 19:16:30.107486	AVAILABLE	c644de24-7952-4801-95c1-411c2267243a	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Đen Bóng Đêm
7490000.00	8	256	2026-07-02 19:16:30.108009	2026-07-02 19:16:30.108009	AVAILABLE	91b63bca-f064-4f45-be59-56beb0c62bd7	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Đen Bóng Đêm
7490000.00	8	256	2026-07-02 19:16:30.108009	2026-07-02 19:16:30.108009	AVAILABLE	6a3f0c28-8e36-45d8-aca6-c3ae55af0555	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Đen Bóng Đêm
7490000.00	8	256	2026-07-02 19:16:30.109019	2026-07-02 19:16:30.109019	AVAILABLE	8730c57c-8c5c-4f0c-995b-54db25b6f201	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Đen Bóng Đêm
14990000.00	12	256	2026-07-02 19:16:31.789578	2026-07-02 19:16:31.789578	AVAILABLE	e07810a1-3dee-449a-a9f2-b3cdf71f44f9	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
10490000.00	8	128	2026-07-02 19:16:33.067221	2026-07-02 19:16:33.067221	AVAILABLE	fce0af90-0dbe-4ea4-a2a1-1055ce80252c	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Xanh Băng
10490000.00	8	128	2026-07-02 19:16:33.067221	2026-07-02 19:16:33.067221	AVAILABLE	3b597401-4f9f-4d9e-9eff-f2bf071c92e7	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Xanh Băng
12490000.00	8	256	2026-07-02 19:16:33.791163	2026-07-02 19:16:33.791163	AVAILABLE	8820c6f1-0321-4e4e-bfb6-853c1b38fce4	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Đen
12490000.00	8	256	2026-07-02 19:16:33.791163	2026-07-02 19:16:33.791163	AVAILABLE	226fd0ba-ec20-429e-99d4-4c5653917289	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Đen
18990000.00	6	128	2026-07-02 19:16:34.743697	2026-07-02 19:16:34.743697	AVAILABLE	3d9c40af-ff87-4be1-9f26-619643f1f858	e2213015-5168-45e3-a5c4-f792649bb853	Tím
2990000.00	4	64	2026-07-02 19:16:35.681254	2026-07-02 19:16:35.681254	AVAILABLE	e4a9d162-f204-4600-abf9-7142f75e07e6	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xám Graphite
2990000.00	4	64	2026-07-02 19:16:35.682252	2026-07-02 19:16:35.682252	AVAILABLE	99acaf01-c784-4ade-b15d-903abe47c34d	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xám Graphite
2990000.00	4	64	2026-07-02 19:16:35.682252	2026-07-02 19:16:35.682252	AVAILABLE	b9aa6c48-f5e3-455a-9660-d8a8e92dccfd	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xám Graphite
2990000.00	4	64	2026-07-02 19:16:35.683256	2026-07-02 19:16:35.683256	AVAILABLE	b7b56346-7dc3-4a10-a5f4-62983112a0e2	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xám Graphite
2990000.00	4	64	2026-07-02 19:16:35.683256	2026-07-02 19:16:35.683256	AVAILABLE	7b6a013d-3593-49ee-81a4-2476f132b486	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xám Graphite
3490000.00	4	128	2026-07-02 19:16:37.087332	2026-07-02 19:16:37.087332	AVAILABLE	5d5027f4-751e-475a-8c3b-f1bb54452c7e	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xanh Lá
3490000.00	4	128	2026-07-02 19:16:37.088665	2026-07-02 19:16:37.088665	AVAILABLE	09ccf40d-0786-4c3b-b3ed-573f243c4166	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xanh Lá
3490000.00	4	128	2026-07-02 19:16:37.088665	2026-07-02 19:16:37.088665	AVAILABLE	c49acb8f-9fed-433b-8c2e-82010bb06db8	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xanh Lá
3490000.00	4	128	2026-07-02 19:16:37.088665	2026-07-02 19:16:37.088665	AVAILABLE	53007cf8-e84d-49c2-8249-81eb8c736ea3	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xanh Lá
3490000.00	4	128	2026-07-02 19:16:37.088665	2026-07-02 19:16:37.088665	AVAILABLE	9c8ff3d9-8d2f-409c-9ae1-66e626309746	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xanh Lá
22490000.00	12	256	2026-07-02 19:16:38.716641	2026-07-02 19:16:38.716641	AVAILABLE	aaca4559-f38e-407f-8021-57294e6fc6a9	82b0225d-578a-403a-a0fd-3835f735a213	Xanh Lục Bảo
24990000.00	16	512	2026-07-02 19:16:39.173363	2026-07-02 19:16:39.173363	AVAILABLE	44614625-95a0-4677-a00e-d798b5b56585	82b0225d-578a-403a-a0fd-3835f735a213	Đen Tuyền
17990000.00	16	512	2026-07-02 19:16:39.888773	2026-07-02 19:16:39.888773	AVAILABLE	117b83bc-aaba-4c51-bfc0-43f6333ba2b7	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
17990000.00	16	512	2026-07-02 19:16:39.889329	2026-07-02 19:16:39.889329	AVAILABLE	81ff10ab-c98b-4739-a6c4-e94b94688c7f	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
17990000.00	16	512	2026-07-02 19:16:39.889329	2026-07-02 19:16:39.889329	AVAILABLE	fc121cf3-2d3f-4d27-9ca8-f205e3bd993b	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
17990000.00	16	512	2026-07-02 19:16:39.889329	2026-07-02 19:16:39.889329	AVAILABLE	003a5faf-92f1-4063-a71d-2030c73c0936	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
17990000.00	16	512	2026-07-02 19:16:39.889865	2026-07-02 19:16:39.889865	AVAILABLE	7cd574c5-f7fc-41f4-96b3-9c6e33d9ff69	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
17990000.00	16	512	2026-07-02 19:16:39.889865	2026-07-02 19:16:39.889865	AVAILABLE	102f9d15-47a0-45b1-922e-c286bfcb6083	94a585ac-f5e6-4ec1-8602-97085cc860c7	Cam Da Thuần Chay
28990000.00	16	512	2026-07-02 19:16:41.750885	2026-07-02 19:16:41.750885	AVAILABLE	ab35e42e-5485-416c-8173-1dbed7020814	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Phantom Black
28990000.00	16	512	2026-07-02 19:16:41.751887	2026-07-02 19:16:41.751887	AVAILABLE	66561192-c406-4afa-ad6e-e8f5ae7cc01c	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Phantom Black
34990000.00	24	1024	2026-07-02 19:16:42.456183	2026-07-02 19:16:42.456183	AVAILABLE	511f10ba-c94d-42b9-9a77-88db3202c3be	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Shadow Edition
34990000.00	24	1024	2026-07-02 19:16:42.456183	2026-07-02 19:16:42.456183	AVAILABLE	d8733708-96c4-4613-8152-0ba671c4c688	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Shadow Edition
21990000.00	12	256	2026-07-02 19:16:44.128354	2026-07-02 19:16:44.128354	AVAILABLE	d0cb79fd-be2b-48f1-a814-a912da9e9758	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Tím Coban
21990000.00	12	256	2026-07-02 19:16:44.128354	2026-07-02 19:16:44.128354	AVAILABLE	edeb2cd2-da4e-4cc0-a079-b2255e3dbebd	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Tím Coban
21990000.00	12	256	2026-07-02 19:16:44.129518	2026-07-02 19:16:44.129518	AVAILABLE	918eabf7-e671-4316-9df6-f85ed1925e9d	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Tím Coban
21990000.00	12	256	2026-07-02 19:16:44.129518	2026-07-02 19:16:44.129518	AVAILABLE	1d3d4a1c-126d-4fa3-a2be-41ffb3bda76c	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Tím Coban
24490000.00	12	512	2026-07-02 19:16:45.268406	2026-07-02 19:16:45.268406	AVAILABLE	e7d498db-e643-42b6-b5b3-1fb3762455cf	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Vàng Hổ Phách
24490000.00	12	512	2026-07-02 19:16:45.268406	2026-07-02 19:16:45.268406	AVAILABLE	9b36f91c-f485-491c-b11a-cc38666e641c	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Vàng Hổ Phách
24490000.00	12	512	2026-07-02 19:16:45.268406	2026-07-02 19:16:45.268406	AVAILABLE	5f636565-c7f0-4827-b697-3cdccb21cbd8	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Vàng Hổ Phách
24490000.00	12	512	2026-07-02 19:16:45.268406	2026-07-02 19:16:45.268406	AVAILABLE	bcf82041-2ce1-42ba-833a-a4ea3453ef6a	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Vàng Hổ Phách
10490000.00	8	128	2026-07-02 21:10:23.993171	2026-07-02 21:10:23.993171	EXPORTED	5c1f8ffb-7594-4729-bbb5-220f8990bd9d	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Xanh Băng
13990000.00	12	256	2026-07-02 21:10:25.571503	2026-07-02 21:10:25.571503	EXPORTED	714308f7-83e7-431d-b20c-42cbfcd39424	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
8990000.00	8	256	2026-07-02 21:10:26.035859	2026-07-02 21:10:26.035859	EXPORTED	2d1632bc-8815-4ec6-90d8-d63838346ae0	09323b27-7a17-44bf-9493-ecbcaeed022f	Xanh Đại Dương
21990000.00	8	256	2026-07-02 21:10:28.291156	2026-07-02 21:10:28.291156	EXPORTED	acacb039-e7cf-4366-a424-6f5d96cbfc81	1628368c-54a0-4fc2-9f28-f06feeec57c1	Marble Xám
3490000.00	4	128	2026-07-02 21:10:28.869337	2026-07-02 21:10:28.869337	EXPORTED	aadbb110-19e0-47c3-890c-db97c285f457	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xanh Lá
33990000.00	12	1024	2026-07-02 21:10:31.08854	2026-07-02 21:10:31.08854	EXPORTED	c3886c2e-2366-43c2-b51c-054b6179abad	16c1702a-9e54-448c-84a1-f792d4e3a53d	Titan Đen
22490000.00	12	256	2026-07-02 21:10:32.660509	2026-07-02 21:10:32.660509	EXPORTED	e201ed9c-4450-4349-ab58-1ef61d15f945	82b0225d-578a-403a-a0fd-3835f735a213	Xanh Lục Bảo
2990000.00	4	64	2026-07-02 21:10:33.107989	2026-07-02 21:10:33.107989	EXPORTED	5c74a142-cc8a-48a9-93d1-25c1f7f24f1b	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xám Graphite
28490000.00	6	256	2026-07-02 21:10:35.531228	2026-07-02 21:10:35.531228	EXPORTED	453f7d76-d4af-4f1d-890b-773ea2b7f14f	145b4ff7-b502-4a63-a67d-666a62412139	Hồng Phấn
10490000.00	8	128	2026-07-02 21:10:36.21733	2026-07-02 21:10:36.21733	EXPORTED	b714cf2d-5c53-4ef6-bcb2-6223bb6c4b6f	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Xanh Băng
6490000.00	8	128	2026-07-02 21:10:38.235468	2026-07-02 21:10:38.235468	EXPORTED	fc9d54bb-78f6-46cb-9e52-f40e1d6f8bc4	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Xanh Rừng
21990000.00	12	256	2026-07-02 21:10:38.683584	2026-07-02 21:10:38.683584	EXPORTED	128e5af9-b4e7-439e-af15-e6a84530a3a1	c889aedf-2c51-4b23-b430-e04a784c0fea	Titan Xám
21990000.00	12	256	2026-07-02 21:10:41.254577	2026-07-02 21:10:41.254577	EXPORTED	6748dfcb-c195-46b3-8b21-0a4d7dd11e13	c889aedf-2c51-4b23-b430-e04a784c0fea	Titan Xám
7490000.00	8	256	2026-07-02 21:10:41.934415	2026-07-02 21:10:41.934415	EXPORTED	dd958706-8614-4444-bed3-34b815627c7e	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Đen Bóng Đêm
15990000.00	12	512	2026-07-02 21:10:43.948731	2026-07-02 21:10:43.948731	EXPORTED	139c7542-fe43-4694-a081-af571429ea1b	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Xanh Titan
6490000.00	8	128	2026-07-02 21:10:44.468806	2026-07-02 21:10:44.468806	EXPORTED	26541ef3-2e86-40d2-b874-59072f538638	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Xanh Rừng
7490000.00	8	256	2026-07-02 21:10:46.729311	2026-07-02 21:10:46.729311	EXPORTED	aae887f7-ea45-4693-9f4f-7aba14050a09	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Đen Bóng Đêm
14990000.00	12	256	2026-07-02 21:10:47.185494	2026-07-02 21:10:47.185494	EXPORTED	668d0ae9-916e-4934-b50f-14513c18a075	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
18990000.00	12	512	2026-07-02 21:10:49.202685	2026-07-02 21:10:49.202685	EXPORTED	30b2052b-cefe-4d65-993b-68326d3d7221	07012006-e6f3-442c-bacf-382799932139	Trắng
34990000.00	8	256	2026-07-02 21:10:51.19306	2026-07-02 21:10:51.19306	EXPORTED	67f2fb4f-e8b9-43f1-8d24-db8a344b8835	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Sa Mạc
30990000.00	6	512	2026-07-02 21:10:52.764395	2026-07-02 21:10:52.764395	EXPORTED	25214433-56f7-4b52-b131-f9c5b64d2b56	59085754-49e0-4e3a-b1ea-a41f6474ca07	Đen
21990000.00	6	256	2026-07-02 21:10:53.436432	2026-07-02 21:10:53.436432	EXPORTED	c606b391-27d3-4373-8aca-e2c85a3e3f57	e2213015-5168-45e3-a5c4-f792649bb853	Đỏ
7490000.00	8	256	2026-07-02 21:10:55.622961	2026-07-02 21:10:55.622961	EXPORTED	c73f3c2c-3efe-4875-b4ba-887bb4306df6	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Đen Bóng Đêm
21990000.00	6	256	2026-07-02 21:10:57.224068	2026-07-02 21:10:57.224068	EXPORTED	89b2275b-5fd4-4d08-a924-e18c5b1047a9	e2213015-5168-45e3-a5c4-f792649bb853	Đỏ
37990000.00	8	512	2026-07-02 21:10:58.802723	2026-07-02 21:10:58.802723	EXPORTED	7b9211b7-0c34-4d7b-85f0-4c2ea5ce4383	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Titan Đen
25990000.00	6	256	2026-07-02 21:10:59.254594	2026-07-02 21:10:59.254594	EXPORTED	759e77d5-1876-4fe7-86b9-9002105c866b	59085754-49e0-4e3a-b1ea-a41f6474ca07	Xanh lá
24990000.00	16	512	2026-07-02 21:11:01.928546	2026-07-02 21:11:01.928546	EXPORTED	8fd0b1cc-d1c0-4371-895a-4b9f57a21d11	c889aedf-2c51-4b23-b430-e04a784c0fea	Đen
25490000.00	6	128	2026-07-02 21:11:02.753681	2026-07-02 21:11:02.753681	EXPORTED	b1af90fb-4e8c-4714-82f5-7250ff6f3399	145b4ff7-b502-4a63-a67d-666a62412139	Xanh Dương Nhạt
3490000.00	4	128	2026-07-02 21:11:05.205917	2026-07-02 21:11:05.205917	EXPORTED	93a9d839-4be7-46b5-ba49-83d90886ff17	5f28cfb8-26bb-4970-9bc6-341aede0107a	Xanh Lá
21990000.00	12	256	2026-07-02 21:11:08.050599	2026-07-02 21:11:08.050599	EXPORTED	9408cc4a-7be6-4776-b83e-c755984bd535	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Tím Coban
12490000.00	8	256	2026-07-02 21:11:08.550096	2026-07-02 21:11:08.550096	EXPORTED	99ade123-4d92-4ce9-b736-5184c62d100c	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Đen
7490000.00	8	256	2026-07-02 21:11:11.044786	2026-07-02 21:11:11.044786	EXPORTED	3654621a-191c-43be-bd2f-a47130204242	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Đen Bóng Đêm
21990000.00	6	256	2026-07-02 21:11:13.517872	2026-07-02 21:11:13.517872	EXPORTED	ec9e9bab-f679-4658-85fb-875da9c88a8b	e2213015-5168-45e3-a5c4-f792649bb853	Đỏ
16990000.00	12	256	2026-07-02 21:11:14.012367	2026-07-02 21:11:14.012367	EXPORTED	fc877702-1e69-4a0c-8963-79932b4a15f0	07012006-e6f3-442c-bacf-382799932139	Đen
14990000.00	12	256	2026-07-02 21:11:16.330369	2026-07-02 21:11:16.330369	EXPORTED	f0476dc3-5609-4bb0-814d-a99c95a685bb	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
13990000.00	12	256	2026-07-02 21:11:16.788378	2026-07-02 21:11:16.788378	EXPORTED	91dfe2af-067f-4904-a513-d99c2cb5886d	c8078475-d3e3-46be-a7b4-cde1e07e664a	Vàng Sunset
24990000.00	16	512	2026-07-02 21:11:19.243439	2026-07-02 21:11:19.243439	EXPORTED	f23115dd-3daa-4bfd-8d3c-2016949e319f	c889aedf-2c51-4b23-b430-e04a784c0fea	Đen
24990000.00	16	512	2026-07-02 21:11:21.788258	2026-07-02 21:11:21.788258	EXPORTED	3c72dbf9-13a5-4172-b3fd-8673a20b5f09	c889aedf-2c51-4b23-b430-e04a784c0fea	Đen
14990000.00	12	256	2026-07-02 21:11:23.542474	2026-07-02 21:11:23.542474	EXPORTED	07d1db7e-98aa-4fee-a839-df56309e9781	4b5eede5-f103-411c-92d0-da37eca2a33c	Xanh Biển
22990000.00	6	128	2026-07-02 21:11:25.595377	2026-07-02 21:11:25.595377	EXPORTED	36561aab-79f3-44ed-b8b1-30e9fb78c7cf	59085754-49e0-4e3a-b1ea-a41f6474ca07	Hồng
\.


--
-- TOC entry 4572 (class 0 OID 26693)
-- Dependencies: 419
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (battery_capacity, nfc_supported, screen_size, created_at, updated_at, brand_id, category_id, id, sim_type, chipset, operating_system, screen_resolution, name, description, front_camera, rear_camera) FROM stdin;
4422	t	6.7	2026-06-30 00:47:05.721614	2026-06-30 00:47:05.757875	fecb7dae-6dcb-40b2-b779-4b614c4612fb	fbcdae8c-e376-4667-96ab-8d6063e338d7	08ce3514-5c20-404b-b6a4-6b50b5ae82ea	Dual SIM (nano-SIM and eSIM)	Apple A17 Pro	iOS 17	1290 x 2796 pixels	iPhone 15 Pro Max	iPhone 15 Pro Max là chiếc iPhone mạnh mẽ nhất từ trước đến nay với chip A17 Pro tiên tiến, hệ thống camera chuyên nghiệp 48MP và khung titan nhẹ bền. Màn hình Super Retina XDR 6.7 inch với ProMotion 120Hz mang lại trải nghiệm hình ảnh tuyệt vời.	12MP	48MP + 12MP + 12MP
5000	t	6.8	2026-06-30 00:47:05.733986	2026-06-30 00:47:05.75949	c667ffba-5878-4cb5-88f7-87c731550e6b	fbcdae8c-e376-4667-96ab-8d6063e338d7	16c1702a-9e54-448c-84a1-f792d4e3a53d	Dual SIM (Nano-SIM, dual stand-by)	Snapdragon 8 Gen 3	Android 14, One UI 6.1	1440 x 3120 pixels	Samsung Galaxy S24 Ultra	Samsung Galaxy S24 Ultra với bút S Pen tích hợp, camera 200MP vượt trội và chip Snapdragon 8 Gen 3 mạnh mẽ. Màn hình Dynamic AMOLED 2X 6.8 inch sắc nét và khung titan cao cấp.	12MP	200MP + 50MP + 12MP + 10MP
4880	t	6.73	2026-06-30 00:47:05.734986	2026-06-30 00:47:05.75949	0fd024a5-0352-4e59-8540-f669d5072fd3	fbcdae8c-e376-4667-96ab-8d6063e338d7	07012006-e6f3-442c-bacf-382799932139	Dual SIM	Snapdragon 8 Gen 3	Android 14, HyperOS	1440 x 3200 pixels	Xiaomi 14 Pro	Xiaomi 14 Pro với camera Leica đẳng cấp, chip Snapdragon 8 Gen 3 và màn hình LTPO AMOLED sắc nét. Sạc nhanh HyperCharge 120W đầy pin chỉ trong 23 phút.	32MP	50MP Leica + 50MP + 50MP
5000	t	6.82	2026-06-30 00:47:05.737108	2026-06-30 00:47:05.75949	c14584d1-12db-4336-89cf-c142ba27a7e2	fbcdae8c-e376-4667-96ab-8d6063e338d7	ef42de0d-d638-4dc4-a31f-8d6ca1f8822b	Dual SIM	Snapdragon 8 Gen 3	Android 14, ColorOS 14	1440 x 3168 pixels	OPPO Find X7 Pro	OPPO Find X7 Pro với hệ thống camera Hasselblad chuyên nghiệp, màn hình LTPO AMOLED và sạc nhanh SuperVOOC 100W. Thiết kế sang trọng với khung vân gỗ độc đáo.	32MP	50MP Hasselblad + 50MP + 64MP
3877	t	6.1	2026-06-30 00:47:05.738114	2026-06-30 00:47:05.760018	fecb7dae-6dcb-40b2-b779-4b614c4612fb	fbcdae8c-e376-4667-96ab-8d6063e338d7	59085754-49e0-4e3a-b1ea-a41f6474ca07	Dual SIM (nano-SIM and eSIM)	Apple A16 Bionic	iOS 17	1179 x 2556 pixels	iPhone 15	iPhone 15 với camera 48MP mới, cổng USB-C và chip A16 Bionic mạnh mẽ. Màn hình Super Retina XDR 6.1 inch tuyệt đẹp trong thiết kế nhôm và kính sang trọng.	12MP	48MP + 12MP
4400	t	7.6	2026-06-30 00:47:05.739113	2026-06-30 00:47:05.760018	c667ffba-5878-4cb5-88f7-87c731550e6b	fbcdae8c-e376-4667-96ab-8d6063e338d7	acfe635a-cb82-46dc-800a-c5c2431fb3a2	Dual SIM	Snapdragon 8 Gen 2	Android 13, One UI 5.1.1	1812 x 2176 pixels	Samsung Galaxy Z Fold 5	Galaxy Z Fold 5 là smartphone màn hình gập cao cấp nhất của Samsung với bản lề Flex mỏng hơn, màn hình AMOLED 7.6 inch và chip Snapdragon 8 Gen 2 mạnh mẽ.	10MP	50MP + 12MP + 10MP
5400	t	6.78	2026-06-30 00:47:05.740117	2026-06-30 00:47:05.760018	b58afc93-3321-40d5-baf5-2e4ea4ec6c79	fbcdae8c-e376-4667-96ab-8d6063e338d7	4640982c-0c67-40b8-be17-a2689c61a3c2	Dual SIM	MediaTek Dimensity 9300	Android 14, OriginOS 4	1260 x 2800 pixels	Vivo X100 Pro	Vivo X100 Pro với camera ZEISS chuyên nghiệp, chip Dimensity 9300 mạnh mẽ và pin 5.400 mAh dung lượng khủng. Sạc nhanh FlashCharge 100W và sạc không dây 50W.	32MP	50MP ZEISS + 50MP + 64MP
5100	t	6.67	2026-06-30 00:47:05.741118	2026-06-30 00:47:05.760018	0fd024a5-0352-4e59-8540-f669d5072fd3	fbcdae8c-e376-4667-96ab-8d6063e338d7	dfd5cfa4-434f-40c6-818f-4dcc221bd8b6	Dual SIM	MediaTek Helio G99 Ultra	Android 13, MIUI 14	1220 x 2712 pixels	Xiaomi Redmi Note 13 Pro	Redmi Note 13 Pro với camera 200MP sắc nét vượt trội trong phân khúc tầm trung, màn hình AMOLED 120Hz và pin 5.100 mAh sử dụng cả ngày thoải mái.	16MP	200MP + 8MP + 2MP
4600	t	6.7	2026-06-30 00:47:05.742116	2026-06-30 00:47:05.760543	c14584d1-12db-4336-89cf-c142ba27a7e2	fbcdae8c-e376-4667-96ab-8d6063e338d7	4b5eede5-f103-411c-92d0-da37eca2a33c	Dual SIM	MediaTek Dimensity 8200	Android 14, ColorOS 14	1080 x 2412 pixels	OPPO Reno 11 Pro	OPPO Reno 11 Pro với thiết kế thời thượng, camera selfie 32MP sắc nét và màn hình AMOLED 6.7 inch tràn viền. Hiệu năng mạnh mẽ nhờ chip Dimensity 8200.	32MP	50MP + 32MP + 8MP
5000	t	6.6	2026-06-30 00:47:05.743114	2026-06-30 00:47:05.760543	c667ffba-5878-4cb5-88f7-87c731550e6b	fbcdae8c-e376-4667-96ab-8d6063e338d7	3a8e4e5a-e215-43ee-94b5-acfdce39b228	Dual SIM	Exynos 1480	Android 14, One UI 6.1	1080 x 2340 pixels	Samsung Galaxy A55	Samsung Galaxy A55 với màn hình Super AMOLED 6.6 inch, camera 50MP chất lượng cao và thiết kế nhôm sang trọng. Hỗ trợ Galaxy AI thông minh.	32MP	50MP + 12MP + 5MP
3279	t	6.1	2026-06-30 00:47:05.744118	2026-06-30 00:47:05.760543	fecb7dae-6dcb-40b2-b779-4b614c4612fb	fbcdae8c-e376-4667-96ab-8d6063e338d7	e2213015-5168-45e3-a5c4-f792649bb853	Dual SIM	Apple A15 Bionic	iOS 16 (nâng cấp iOS 17)	1170 x 2532 pixels	iPhone 14	iPhone 14 với chip A15 Bionic, camera 12MP cải tiến và chế độ Action Mode chống rung vượt trội. Thiết kế nhôm và kính sang trọng, phù hợp cho mọi phong cách.	12MP	12MP + 12MP
5000	f	6.71	2026-06-30 00:47:05.744118	2026-06-30 00:47:05.760543	0fd024a5-0352-4e59-8540-f669d5072fd3	fbcdae8c-e376-4667-96ab-8d6063e338d7	5f28cfb8-26bb-4970-9bc6-341aede0107a	Dual SIM	MediaTek Helio G85	Android 12, MIUI 13	720 x 1650 pixels	Xiaomi Redmi 12C	Redmi 12C là lựa chọn giá rẻ thông minh với pin 5.000 mAh sử dụng cả ngày, camera 50MP chất lượng và màn hình lớn 6.71 inch. Phù hợp cho người dùng phổ thông.	5MP	50MP + 2MP
5400	t	6.82	2026-06-30 00:47:05.745626	2026-06-30 00:47:05.761071	968ad15c-1cef-4445-ac68-b7cbfcf51d60	fbcdae8c-e376-4667-96ab-8d6063e338d7	82b0225d-578a-403a-a0fd-3835f735a213	Dual SIM	Snapdragon 8 Gen 3	Android 14, OxygenOS 14	1440 x 3168 pixels	OnePlus 12	OnePlus 12 mang đến trải nghiệm mượt mà đỉnh cao với chip Snapdragon 8 Gen 3 thế hệ mới, sạc nhanh SuperVOOC 100W và camera hợp tác cùng thương hiệu Hasselblad huyền thoại.	32MP	50MP Hasselblad + 48MP + 64MP
5400	t	6.78	2026-06-30 00:47:05.746637	2026-06-30 00:47:05.761071	30826b38-2ac0-4f43-8be0-ef34fdf00603	fbcdae8c-e376-4667-96ab-8d6063e338d7	94a585ac-f5e6-4ec1-8602-97085cc860c7	Dual SIM	Snapdragon 8 Gen 3	Android 14, Realme UI 5.0	1264 x 2780 pixels	Realme GT5 Pro	Realme GT5 Pro là quái thú cấu hình với chip Snapdragon 8 Gen 3, tản nhiệt buồng hơi VC siêu khủng và màn hình cong 1.5K sáng nhất thế giới lên đến 4500 nits.	32MP	50MP + 50MP + 8MP
5500	t	6.78	2026-06-30 00:47:05.746637	2026-07-02 02:21:19.771732	6ea2e415-7499-45f6-aab9-7ab30c9042f0	fbcdae8c-e376-4667-96ab-8d6063e338d7	2b4f0751-d773-4eb3-a5b7-82a55ce66b42	Dual SIM	Snapdragon 8 Gen 3	Android 14	1080 x 2400 pixels	Asus ROG Phone 8 Pro	Asus ROG Phone 8 Pro là cỗ máy chiến game tối thượng được thiết kế lại mỏng hơn, hỗ trợ chống nước IP68, màn hình phụ AniMe Vision độc quyền ở mặt sau và bộ nút trigger chơi game siêu nhạy.	32MP	50MP + 32MP + 13MP
4383	t	6.7	2026-06-30 00:47:05.747634	2026-06-30 00:47:05.761071	fecb7dae-6dcb-40b2-b779-4b614c4612fb	fbcdae8c-e376-4667-96ab-8d6063e338d7	145b4ff7-b502-4a63-a67d-666a62412139	Dual SIM (nano-SIM and eSIM)	Apple A16 Bionic	iOS 17	1290 x 2796 pixels	iPhone 15 Plus	iPhone 15 Plus nâng tầm trải nghiệm giải trí với màn hình lớn 6.7 inch siêu sắc nét, thời lượng pin trâu nhất lịch sử iPhone và đảo động thông minh Dynamic Island.	12MP	48MP + 12MP
4900	t	6.7	2026-06-30 00:47:05.748634	2026-06-30 00:47:05.761071	c667ffba-5878-4cb5-88f7-87c731550e6b	fbcdae8c-e376-4667-96ab-8d6063e338d7	3fc556e1-28e5-4a38-ac98-af2f8ba8bf45	Dual SIM	Exynos 2400	Android 14, One UI 6.1	1440 x 3120 pixels	Samsung Galaxy S24 Plus	Samsung Galaxy S24 Plus mang lại thiết kế tinh tế vuông vức, màn hình QHD+ Dynamic AMOLED 2X rực rỡ và sức mạnh xử lý đỉnh cao cùng bộ tính năng trí tuệ nhân tạo Galaxy AI.	12MP	50MP + 10MP + 12MP
4685	t	6.9	2026-07-02 16:52:20.783617	2026-07-02 16:52:20.807152	fecb7dae-6dcb-40b2-b779-4b614c4612fb	fbcdae8c-e376-4667-96ab-8d6063e338d7	73c6ac5b-74d0-4e1f-a0c3-c35a190ad2f4	Dual SIM (nano-SIM and eSIM)	Apple A18 Pro	iOS 18	\N	iPhone 16 Pro Max	iPhone 16 Pro Max với chip Apple A18 Pro mạnh mẽ nhất, hệ thống camera Fusion 48MP nâng cấp và khung titan cao cấp siêu bền nhẹ.	12MP	48MP + 48MP + 12MP
4000	t	6.2	2026-07-02 16:52:24.63283	2026-07-02 16:52:24.648842	c667ffba-5878-4cb5-88f7-87c731550e6b	fbcdae8c-e376-4667-96ab-8d6063e338d7	1628368c-54a0-4fc2-9f28-f06feeec57c1	Dual SIM	Exynos 2400	Android 14, One UI 6.1	\N	Samsung Galaxy S24	Samsung Galaxy S24 bản tiêu chuẩn nhỏ gọn với hiệu năng Galaxy AI thông minh, màn hình Dynamic AMOLED 2X sắc nét và thiết kế khung nhôm Armor chắc chắn.	12MP	50MP + 12MP + 10MP
5300	t	6.73	2026-07-02 16:52:28.184864	2026-07-02 16:52:28.198883	0fd024a5-0352-4e59-8540-f669d5072fd3	fbcdae8c-e376-4667-96ab-8d6063e338d7	098b52d0-0c50-4fa2-87b5-f6aaf55b8417	Dual SIM	Snapdragon 8 Gen 3	Android 14, HyperOS	\N	Xiaomi 14 Ultra	Xiaomi 14 Ultra sở hữu hệ thống camera Leica Quad với 4 ống kính chuyên nghiệp, chip Snapdragon 8 Gen 3 đỉnh cao và thiết kế da cao cấp sang trọng.	32MP	50MP Leica Quad Camera
5000	t	6.7	2026-07-02 16:52:30.659525	2026-07-02 16:52:30.679539	c14584d1-12db-4336-89cf-c142ba27a7e2	fbcdae8c-e376-4667-96ab-8d6063e338d7	c8078475-d3e3-46be-a7b4-cde1e07e664a	Dual SIM	MediaTek Dimensity 8350	Android 14, ColorOS 14	\N	OPPO Reno 12 Pro	OPPO Reno 12 Pro nổi bật với tính năng AI đột phá, thiết kế viền cong mềm mại và camera chân dung 50MP cho ảnh xóa phông tự nhiên.	50MP	50MP + 8MP + 50MP
5000	t	6.78	2026-07-02 16:52:35.670367	2026-07-02 16:52:35.674317	b58afc93-3321-40d5-baf5-2e4ea4ec6c79	fbcdae8c-e376-4667-96ab-8d6063e338d7	24e46844-edb0-4ff1-86fa-18c8ea7eac61	Dual SIM	MediaTek Dimensity 8200	Android 14, OriginOS 4	\N	Vivo V30 Pro	Vivo V30 Pro trang bị camera chân dung ZEISS chuyên nghiệp với đèn Aura Light thế hệ mới, mang lại ảnh selfie đẹp tự nhiên trong mọi điều kiện ánh sáng.	50MP	50MP ZEISS + 50MP + 50MP
5500	t	6.78	2026-07-02 16:52:38.644888	2026-07-02 16:52:38.650896	968ad15c-1cef-4445-ac68-b7cbfcf51d60	fbcdae8c-e376-4667-96ab-8d6063e338d7	38d600e7-c9ac-4f94-b957-de371ebae1a7	Dual SIM	Snapdragon 8 Gen 2	Android 14, OxygenOS 14	\N	OnePlus 12R	OnePlus 12R mang đến hiệu năng flagship với mức giá dễ tiếp cận hơn, sạc nhanh SuperVOOC 100W và màn hình LTPO 120Hz mượt mà.	16MP	50MP + 8MP + 2MP
5000	f	6.7	2026-07-02 16:52:41.181529	2026-07-02 16:52:41.187527	30826b38-2ac0-4f43-8be0-ef34fdf00603	fbcdae8c-e376-4667-96ab-8d6063e338d7	09323b27-7a17-44bf-9493-ecbcaeed022f	Dual SIM	Snapdragon 6 Gen 1	Android 14, Realme UI 5.0	\N	Realme 12 Pro+	Realme 12 Pro+ với camera Periscope 50MP zoom quang học 3x hiếm có trong tầm giá, thiết kế da mặt lưng độc đáo lấy cảm hứng từ đồng hồ cổ điển.	16MP	50MP Periscope + 8MP + 32MP
5500	t	6.78	2026-07-02 16:52:44.739374	2026-07-02 16:52:44.745617	6ea2e415-7499-45f6-aab9-7ab30c9042f0	fbcdae8c-e376-4667-96ab-8d6063e338d7	c889aedf-2c51-4b23-b430-e04a784c0fea	Dual SIM	Snapdragon 8 Gen 3	Android 14	\N	Asus Zenfone 11 Ultra	Asus Zenfone 11 Ultra là flagship nhỏ gọn với chip Snapdragon 8 Gen 3, hệ thống chống rung camera 6 trục tiên tiến và pin 5.500 mAh bền bỉ cả ngày.	32MP	50MP + 13MP + 32MP
\.


--
-- TOC entry 4573 (class 0 OID 26700)
-- Dependencies: 420
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotions (active, discount_percent, created_at, end_at, start_at, updated_at, id, code, name, discount_type) FROM stdin;
t	10	2026-07-02 03:02:13.420072	2026-06-30 23:59:00	2026-01-01 00:00:00	2026-07-02 03:20:54.837058	c03536e7-4294-4dc7-86b4-32b0bf3e57a3	TECH10OFF	Giảm 10% cho đơn từ 5 triệu	PERCENTAGE
t	0	2026-07-02 03:02:13.704079	2026-12-31 23:59:00	2026-01-01 00:00:00	2026-07-02 03:20:55.137097	8f5010e2-24ff-4100-9f6d-204dee27673a	FREESHIP	Miễn phí vận chuyển toàn quốc	FREE_SHIPPING
t	50000	2026-07-02 03:02:13.982152	2026-07-15 23:59:00	2026-01-01 00:00:00	2026-07-02 03:20:55.425697	ee9ddd6e-86dd-4214-b54e-1f837260ebe8	NEWMEM50K	Giảm 50.000đ cho thành viên mới	FIXED_AMOUNT
t	15	2026-07-02 03:12:20.979431	2026-07-09 03:00:00	2026-07-02 03:00:00	2026-07-02 03:12:20.979431	43a798ed-e63b-4c5f-bc70-a1698a3c8995	SUMMERSALE15	HÈ	PERCENTAGE
t	1600000	2026-07-02 09:22:28.720209	2026-07-09 09:00:00	2026-07-01 09:00:00	2026-07-02 09:28:54.770879	4ee64218-1cb0-49cd-80da-cc94824bdfab	SALESAPSAN	Ưu đãi 1/7	FIXED_AMOUNT
\.


--
-- TOC entry 4574 (class 0 OID 26707)
-- Dependencies: 421
-- Data for Name: purchase_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_items (quantity, unit_price, created_at, updated_at, id, product_variant_id, purchase_order_id, color, ram_gb, storage_gb) FROM stdin;
1	42000000.00	2026-06-30 01:08:19.67262	2026-06-30 01:08:19.67262	3613cf89-8a8f-4f4e-9a7a-9c98a969d955	39cb6e6b-47ab-4771-acda-7bbacb1e8ea9	a1e6d8a1-9225-4058-863a-6c8e6f96bbfe	\N	\N	\N
\.


--
-- TOC entry 4575 (class 0 OID 26712)
-- Dependencies: 422
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_orders (order_date, created_at, updated_at, status, id, supplier_id, notes) FROM stdin;
\N	2026-06-30 01:08:19.67262	2026-06-30 01:08:45.925002	SHIPPING	a1e6d8a1-9225-4058-863a-6c8e6f96bbfe	ec725f50-eaec-4a6e-aa34-43709cc3b161	\N
\.


--
-- TOC entry 4576 (class 0 OID 26720)
-- Dependencies: 423
-- Data for Name: receipts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receipts (created_at, issued_at, updated_at, export_log_id, id, file_url) FROM stdin;
2026-06-30 12:04:21.502006	2026-06-30 12:04:21.502006	2026-06-30 12:04:21.503003	a5a083a1-2e75-4d37-a0e9-009f29fafb78	70f9c023-1508-4898-80a2-766eb4777dde	/api/warehouse/receipts/70f9c023-1508-4898-80a2-766eb4777dde/download
2026-06-30 13:30:34.694977	2026-06-30 13:30:34.694977	2026-06-30 13:30:34.694977	fcb07639-3c95-4b98-85ce-4d298849ab0b	dd71ee13-6e08-48c4-93c8-8071a3759612	/api/warehouse/receipts/dd71ee13-6e08-48c4-93c8-8071a3759612/download
2026-06-30 22:14:54.024742	2026-06-30 22:14:54.024742	2026-06-30 22:14:54.024742	765dcf84-59dd-43bd-bf34-6a929b40abee	78b6dcc0-4bed-4651-9ac2-af92a175f220	/api/warehouse/receipts/78b6dcc0-4bed-4651-9ac2-af92a175f220/download
2026-07-02 01:29:46.895367	2026-07-02 01:29:46.895367	2026-07-02 01:29:46.904344	59df7669-1143-4588-86d5-db314963381c	67cddedc-bcc2-4616-a9a6-004018c45aa2	/api/warehouse/receipts/67cddedc-bcc2-4616-a9a6-004018c45aa2/download
2026-07-02 01:32:30.48716	2026-07-02 01:32:30.48716	2026-07-02 01:32:30.48716	4e42611d-b29f-465b-80f5-fbd3c4e0aa0c	a1f945f2-799a-4962-9897-acab02f55386	/api/warehouse/receipts/a1f945f2-799a-4962-9897-acab02f55386/download
2026-07-02 01:39:32.398066	2026-07-02 01:39:32.398066	2026-07-02 01:39:32.398066	3cf9eb11-fdae-4475-ab76-fcaacab1f298	ce64513c-a626-4e1c-88dc-e81047248db1	/api/warehouse/receipts/ce64513c-a626-4e1c-88dc-e81047248db1/download
2026-07-02 01:43:31.129731	2026-07-02 01:43:31.141102	2026-07-02 01:43:31.141102	07d90a42-b56d-44d2-a504-9138d9e5ecde	4bc67c6f-8685-4bca-a148-a4d511207eb6	/api/warehouse/receipts/4bc67c6f-8685-4bca-a148-a4d511207eb6/download
2026-07-02 01:56:58.742071	2026-07-02 01:56:58.742071	2026-07-02 01:56:58.742071	665b2c8b-de0e-48aa-ab3b-fd4d5ac22a26	16b7e915-37aa-45f4-8a86-b6b4292ec050	/api/warehouse/receipts/16b7e915-37aa-45f4-8a86-b6b4292ec050/download
\.


--
-- TOC entry 4577 (class 0 OID 26729)
-- Dependencies: 424
-- Data for Name: staffs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.staffs (hire_date, id, staff_code) FROM stdin;
2025-06-30	907793ba-04cc-4c51-a9cb-e73fbc077634	ST001
2025-12-30	aa709650-7926-435d-919d-5453991002b8	ST002
\.


--
-- TOC entry 4578 (class 0 OID 26736)
-- Dependencies: 425
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (created_at, updated_at, phone, id, address, email, name, tax_code) FROM stdin;
2026-06-30 00:48:57.717873	2026-06-30 00:48:57.717873	\N	ec725f50-eaec-4a6e-aa34-43709cc3b161	\N	\N	test1	100000
\.


--
-- TOC entry 4579 (class 0 OID 26749)
-- Dependencies: 426
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (created_at, updated_at, phone, id, full_name) FROM stdin;
2026-06-30 00:47:05.716613	2026-06-30 00:47:05.716613	0987654321	ceedbc85-ac09-4978-a28a-5fd2b6936227	Nguyễn Đức Duy
2026-06-30 00:47:05.718614	2026-06-30 00:47:05.718614	0912345678	907793ba-04cc-4c51-a9cb-e73fbc077634	Trần Hoàng Nam
2026-06-30 00:47:05.719615	2026-06-30 00:47:05.719615	0934567890	aa709650-7926-435d-919d-5453991002b8	Lê Thị Hương
2026-07-02 01:02:24.478549	2026-07-02 01:02:24.478549	0971040735	128bf675-5c4c-4d00-8a38-95807f822bea	Nguyễn Đức Duy
2026-06-30 00:47:05.720614	2026-07-02 02:55:03.593226	0909090909	c7152be7-a711-4734-8a83-cd5ec04b1a12	Trần Thị Bình
2026-06-30 00:47:05.720614	2026-07-02 03:27:45.800106	0888888888	f3e638ab-16bc-43a3-926f-fd53766f3eee	Lê Hoàng Nam
2026-07-02 09:53:42.674488	2026-07-02 09:53:42.674488	0911111111	ee205fce-09e4-406a-a9e4-9326786828a3	Test Repro
\.


--
-- TOC entry 4532 (class 0 OID 17170)
-- Dependencies: 375
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-06-09 06:33:22
20211116045059	2026-06-09 06:33:22
20211116050929	2026-06-09 06:33:22
20211116051442	2026-06-09 06:33:22
20211116212300	2026-06-09 06:33:22
20211116213355	2026-06-09 06:33:22
20211116213934	2026-06-09 06:33:22
20211116214523	2026-06-09 06:33:22
20211122062447	2026-06-09 06:33:22
20211124070109	2026-06-09 06:33:22
20211202204204	2026-06-09 06:33:22
20211202204605	2026-06-09 06:33:22
20211210212804	2026-06-09 06:33:22
20211228014915	2026-06-09 06:33:22
20220107221237	2026-06-09 06:33:22
20220228202821	2026-06-09 06:33:22
20220312004840	2026-06-09 06:33:22
20220603231003	2026-06-09 06:33:22
20220603232444	2026-06-09 06:33:22
20220615214548	2026-06-09 06:33:22
20220712093339	2026-06-09 06:33:22
20220908172859	2026-06-09 06:33:22
20220916233421	2026-06-09 06:33:22
20230119133233	2026-06-09 06:33:22
20230128025114	2026-06-09 06:33:22
20230128025212	2026-06-09 06:33:22
20230227211149	2026-06-09 06:33:22
20230228184745	2026-06-09 06:33:22
20230308225145	2026-06-09 06:33:22
20230328144023	2026-06-09 06:33:22
20231018144023	2026-06-09 06:33:22
20231204144023	2026-06-09 06:33:22
20231204144024	2026-06-09 06:33:22
20231204144025	2026-06-09 06:33:22
20240108234812	2026-06-09 06:33:22
20240109165339	2026-06-09 06:33:22
20240227174441	2026-06-09 06:33:22
20240311171622	2026-06-09 06:33:22
20240321100241	2026-06-09 06:33:23
20240401105812	2026-06-09 06:33:23
20240418121054	2026-06-09 06:33:23
20240523004032	2026-06-09 06:33:23
20240618124746	2026-06-09 06:33:23
20240801235015	2026-06-09 06:33:23
20240805133720	2026-06-09 06:33:23
20240827160934	2026-06-09 06:33:23
20240919163303	2026-06-09 06:33:23
20240919163305	2026-06-09 06:33:23
20241019105805	2026-06-09 06:33:23
20241030150047	2026-06-09 06:33:23
20241108114728	2026-06-09 06:33:23
20241121104152	2026-06-09 06:33:23
20241130184212	2026-06-09 06:33:23
20241220035512	2026-06-09 06:33:23
20241220123912	2026-06-09 06:33:23
20241224161212	2026-06-09 06:33:23
20250107150512	2026-06-09 06:33:23
20250110162412	2026-06-09 06:33:23
20250123174212	2026-06-09 06:33:23
20250128220012	2026-06-09 06:33:23
20250506224012	2026-06-09 06:33:23
20250523164012	2026-06-09 06:33:23
20250714121412	2026-06-09 06:33:23
20250905041441	2026-06-09 06:33:23
20251103001201	2026-06-09 06:33:23
20251120212548	2026-06-09 06:33:23
20251120215549	2026-06-09 06:33:23
20260218120000	2026-06-09 06:33:23
20260326120000	2026-06-09 06:33:23
20260514120000	2026-06-09 06:33:23
20260527120000	2026-06-09 06:33:23
20260528120000	2026-06-09 06:33:23
20260603120000	2026-06-09 06:33:23
20260605120000	2026-06-17 12:50:04
20260606110000	2026-06-17 12:50:04
20260616120000	2026-06-25 13:17:29
20260624120000	2026-06-25 13:17:29
20260626120000	2026-07-02 16:32:30
\.


--
-- TOC entry 4534 (class 0 OID 17193)
-- Dependencies: 378
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter, selected_columns) FROM stdin;
\.


--
-- TOC entry 4536 (class 0 OID 17376)
-- Dependencies: 383
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- TOC entry 4540 (class 0 OID 17496)
-- Dependencies: 387
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- TOC entry 4541 (class 0 OID 17509)
-- Dependencies: 388
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4535 (class 0 OID 17368)
-- Dependencies: 382
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-06-09 06:33:23.818848
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-06-09 06:33:23.838887
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-06-09 06:33:23.85655
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-06-09 06:33:23.88035
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-06-09 06:33:23.889226
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-06-09 06:33:23.89347
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-06-09 06:33:23.898122
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-06-09 06:33:23.902702
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-06-09 06:33:23.906973
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-06-09 06:33:23.912423
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-06-09 06:33:23.917224
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-06-09 06:33:23.922305
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-06-09 06:33:23.927001
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-06-09 06:33:23.932025
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-06-09 06:33:23.936516
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-06-09 06:33:23.95623
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-06-09 06:33:23.960545
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-06-09 06:33:23.964988
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-06-09 06:33:23.969271
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-06-09 06:33:23.974304
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-06-09 06:33:23.978866
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-06-09 06:33:23.98918
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-06-09 06:33:24.002906
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-06-09 06:33:24.012799
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-06-09 06:33:24.017822
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-06-09 06:33:24.022248
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-06-09 06:33:24.026887
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-06-09 06:33:24.031248
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-06-09 06:33:24.035687
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-06-09 06:33:24.040017
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-06-09 06:33:24.044347
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-06-09 06:33:24.048517
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-06-09 06:33:24.052602
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-06-09 06:33:24.056746
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-06-09 06:33:24.060889
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-06-09 06:33:24.064892
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-06-09 06:33:24.069062
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-06-09 06:33:24.073048
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-06-09 06:33:24.078595
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-06-09 06:33:24.089127
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-06-09 06:33:24.093543
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-06-09 06:33:24.09761
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-06-09 06:33:24.101899
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-06-09 06:33:24.106339
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-06-09 06:33:24.110325
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-06-09 06:33:24.115041
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-06-09 06:33:24.124833
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-06-09 06:33:24.131099
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-06-09 06:33:24.13539
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-06-09 06:33:24.152804
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-06-09 06:33:24.160316
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-06-09 06:34:23.035377
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-06-09 06:34:23.03782
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-06-09 06:34:23.049982
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-06-09 06:34:23.053069
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-06-09 06:34:23.055075
56	fix-optimized-search-function	b823ed1e418101032fa01374edc9a436e54e3ed4	2026-06-09 06:34:23.076332
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-06-09 06:34:23.08697
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-06-09 06:34:23.093197
59	drop-unused-functions	38456f13e39691c2bbb4b5151d0d1cdbabd4a8c4	2026-06-09 06:34:23.099563
60	optimize-existing-functions-again	db35e1c91a9201e59f4fef8d972c2f277d68b157	2026-06-09 06:34:23.10436
\.


--
-- TOC entry 4537 (class 0 OID 17386)
-- Dependencies: 384
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- TOC entry 4538 (class 0 OID 17435)
-- Dependencies: 385
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata) FROM stdin;
\.


--
-- TOC entry 4539 (class 0 OID 17449)
-- Dependencies: 386
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- TOC entry 4542 (class 0 OID 17519)
-- Dependencies: 389
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3856 (class 0 OID 16612)
-- Dependencies: 355
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4784 (class 0 OID 0)
-- Dependencies: 350
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- TOC entry 4785 (class 0 OID 0)
-- Dependencies: 377
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- TOC entry 4065 (class 2606 OID 16789)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- TOC entry 4034 (class 2606 OID 16535)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 4120 (class 2606 OID 17121)
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- TOC entry 4122 (class 2606 OID 17119)
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4088 (class 2606 OID 16895)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- TOC entry 4043 (class 2606 OID 16913)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- TOC entry 4045 (class 2606 OID 16923)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- TOC entry 4032 (class 2606 OID 16528)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- TOC entry 4067 (class 2606 OID 16782)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- TOC entry 4063 (class 2606 OID 16770)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 4055 (class 2606 OID 16963)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- TOC entry 4057 (class 2606 OID 16757)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- TOC entry 4101 (class 2606 OID 17022)
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- TOC entry 4103 (class 2606 OID 17020)
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- TOC entry 4105 (class 2606 OID 17018)
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- TOC entry 4115 (class 2606 OID 17080)
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- TOC entry 4098 (class 2606 OID 16982)
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- TOC entry 4109 (class 2606 OID 17044)
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- TOC entry 4111 (class 2606 OID 17046)
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- TOC entry 4092 (class 2606 OID 16948)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4026 (class 2606 OID 16518)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4029 (class 2606 OID 16699)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- TOC entry 4077 (class 2606 OID 16829)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- TOC entry 4079 (class 2606 OID 16827)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4084 (class 2606 OID 16843)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- TOC entry 4037 (class 2606 OID 16541)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4050 (class 2606 OID 16720)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4074 (class 2606 OID 16810)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- TOC entry 4069 (class 2606 OID 16801)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4019 (class 2606 OID 16883)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 4021 (class 2606 OID 16505)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4130 (class 2606 OID 17158)
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 4126 (class 2606 OID 17141)
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- TOC entry 4167 (class 2606 OID 26507)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 4169 (class 2606 OID 26509)
-- Name: accounts accounts_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_key UNIQUE (user_id);


--
-- TOC entry 4175 (class 2606 OID 26518)
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 4177 (class 2606 OID 26527)
-- Name: brands brands_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_name_key UNIQUE (name);


--
-- TOC entry 4179 (class 2606 OID 26525)
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- TOC entry 4181 (class 2606 OID 26535)
-- Name: bundle_services bundle_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bundle_services
    ADD CONSTRAINT bundle_services_pkey PRIMARY KEY (id);


--
-- TOC entry 4183 (class 2606 OID 26543)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4185 (class 2606 OID 26550)
-- Name: carts carts_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_customer_id_key UNIQUE (customer_id);


--
-- TOC entry 4187 (class 2606 OID 26548)
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- TOC entry 4189 (class 2606 OID 26559)
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- TOC entry 4191 (class 2606 OID 26557)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4193 (class 2606 OID 26564)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 4195 (class 2606 OID 26569)
-- Name: export_log_items export_log_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.export_log_items
    ADD CONSTRAINT export_log_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4197 (class 2606 OID 26577)
-- Name: export_logs export_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.export_logs
    ADD CONSTRAINT export_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4199 (class 2606 OID 26583)
-- Name: favorite_products favorite_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_products
    ADD CONSTRAINT favorite_products_pkey PRIMARY KEY (id);


--
-- TOC entry 4203 (class 2606 OID 26590)
-- Name: import_log_items import_log_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_log_items
    ADD CONSTRAINT import_log_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4205 (class 2606 OID 26598)
-- Name: import_logs import_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_logs
    ADD CONSTRAINT import_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4207 (class 2606 OID 26605)
-- Name: invoices invoices_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_order_id_key UNIQUE (order_id);


--
-- TOC entry 4209 (class 2606 OID 26603)
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- TOC entry 4211 (class 2606 OID 26611)
-- Name: login_logs login_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs
    ADD CONSTRAINT login_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4213 (class 2606 OID 26616)
-- Name: managers managers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.managers
    ADD CONSTRAINT managers_pkey PRIMARY KEY (id);


--
-- TOC entry 4215 (class 2606 OID 26623)
-- Name: membership_benefits membership_benefits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership_benefits
    ADD CONSTRAINT membership_benefits_pkey PRIMARY KEY (id);


--
-- TOC entry 4217 (class 2606 OID 26631)
-- Name: memberships memberships_benefit_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.memberships
    ADD CONSTRAINT memberships_benefit_id_key UNIQUE (benefit_id);


--
-- TOC entry 4219 (class 2606 OID 26629)
-- Name: memberships memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.memberships
    ADD CONSTRAINT memberships_pkey PRIMARY KEY (id);


--
-- TOC entry 4223 (class 2606 OID 26646)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4225 (class 2606 OID 26654)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4227 (class 2606 OID 26660)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4229 (class 2606 OID 26668)
-- Name: payment_logs payment_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_logs
    ADD CONSTRAINT payment_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4231 (class 2606 OID 26676)
-- Name: payment_methods payment_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_methods
    ADD CONSTRAINT payment_methods_pkey PRIMARY KEY (id);


--
-- TOC entry 4233 (class 2606 OID 26683)
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4235 (class 2606 OID 26692)
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- TOC entry 4237 (class 2606 OID 26699)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4239 (class 2606 OID 26704)
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- TOC entry 4243 (class 2606 OID 26711)
-- Name: purchase_order_items purchase_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4245 (class 2606 OID 26719)
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4247 (class 2606 OID 26728)
-- Name: receipts receipts_export_log_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT receipts_export_log_id_key UNIQUE (export_log_id);


--
-- TOC entry 4249 (class 2606 OID 26726)
-- Name: receipts receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT receipts_pkey PRIMARY KEY (id);


--
-- TOC entry 4251 (class 2606 OID 26733)
-- Name: staffs staffs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staffs
    ADD CONSTRAINT staffs_pkey PRIMARY KEY (id);


--
-- TOC entry 4253 (class 2606 OID 26735)
-- Name: staffs staffs_staff_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staffs
    ADD CONSTRAINT staffs_staff_code_key UNIQUE (staff_code);


--
-- TOC entry 4255 (class 2606 OID 26744)
-- Name: suppliers suppliers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_email_key UNIQUE (email);


--
-- TOC entry 4257 (class 2606 OID 26746)
-- Name: suppliers suppliers_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key UNIQUE (name);


--
-- TOC entry 4259 (class 2606 OID 26742)
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- TOC entry 4261 (class 2606 OID 26748)
-- Name: suppliers suppliers_tax_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_tax_code_key UNIQUE (tax_code);


--
-- TOC entry 4171 (class 2606 OID 26511)
-- Name: accounts uk_accounts_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT uk_accounts_email UNIQUE (email);


--
-- TOC entry 4173 (class 2606 OID 26960)
-- Name: accounts uk_accounts_user; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT uk_accounts_user UNIQUE (user_id);


--
-- TOC entry 4201 (class 2606 OID 26585)
-- Name: favorite_products uk_favorite_products_customer_variant; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_products
    ADD CONSTRAINT uk_favorite_products_customer_variant UNIQUE (customer_id, product_variant_id);


--
-- TOC entry 4221 (class 2606 OID 26633)
-- Name: memberships uk_memberships_tier; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.memberships
    ADD CONSTRAINT uk_memberships_tier UNIQUE (tier);


--
-- TOC entry 4241 (class 2606 OID 26706)
-- Name: promotions uk_promotions_code; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT uk_promotions_code UNIQUE (code);


--
-- TOC entry 4263 (class 2606 OID 26753)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3988 (class 2606 OID 17355)
-- Name: messages messages_payload_exclusive; Type: CHECK CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages
    ADD CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL))) NOT VALID;


--
-- TOC entry 4140 (class 2606 OID 17347)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4136 (class 2606 OID 17201)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- TOC entry 4133 (class 2606 OID 17174)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4159 (class 2606 OID 17542)
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- TOC entry 4147 (class 2606 OID 17384)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- TOC entry 4162 (class 2606 OID 17518)
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- TOC entry 4142 (class 2606 OID 17375)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- TOC entry 4144 (class 2606 OID 17373)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4152 (class 2606 OID 17396)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- TOC entry 4157 (class 2606 OID 17458)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- TOC entry 4155 (class 2606 OID 17443)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 4165 (class 2606 OID 17528)
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- TOC entry 4035 (class 1259 OID 16536)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- TOC entry 4005 (class 1259 OID 16709)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4116 (class 1259 OID 17125)
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- TOC entry 4117 (class 1259 OID 17124)
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- TOC entry 4118 (class 1259 OID 17122)
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- TOC entry 4123 (class 1259 OID 17123)
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- TOC entry 4006 (class 1259 OID 16711)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4007 (class 1259 OID 16712)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4053 (class 1259 OID 16791)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- TOC entry 4086 (class 1259 OID 16899)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- TOC entry 4041 (class 1259 OID 16879)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- TOC entry 4786 (class 0 OID 0)
-- Dependencies: 4041
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 4046 (class 1259 OID 16706)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- TOC entry 4089 (class 1259 OID 16896)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- TOC entry 4113 (class 1259 OID 17081)
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- TOC entry 4090 (class 1259 OID 16897)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- TOC entry 4008 (class 1259 OID 17167)
-- Name: idx_users_created_at_desc; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_users_created_at_desc ON auth.users USING btree (created_at DESC);


--
-- TOC entry 4009 (class 1259 OID 17166)
-- Name: idx_users_email; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_users_email ON auth.users USING btree (email);


--
-- TOC entry 4010 (class 1259 OID 17168)
-- Name: idx_users_last_sign_in_at_desc; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_users_last_sign_in_at_desc ON auth.users USING btree (last_sign_in_at DESC);


--
-- TOC entry 4011 (class 1259 OID 17169)
-- Name: idx_users_name; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_users_name ON auth.users USING btree (((raw_user_meta_data ->> 'name'::text))) WHERE ((raw_user_meta_data ->> 'name'::text) IS NOT NULL);


--
-- TOC entry 4061 (class 1259 OID 16902)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- TOC entry 4058 (class 1259 OID 16763)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- TOC entry 4059 (class 1259 OID 16908)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- TOC entry 4099 (class 1259 OID 17033)
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- TOC entry 4096 (class 1259 OID 16986)
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- TOC entry 4106 (class 1259 OID 17059)
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- TOC entry 4107 (class 1259 OID 17057)
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- TOC entry 4112 (class 1259 OID 17058)
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- TOC entry 4093 (class 1259 OID 16955)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- TOC entry 4094 (class 1259 OID 16954)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- TOC entry 4095 (class 1259 OID 16956)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- TOC entry 4012 (class 1259 OID 16713)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4013 (class 1259 OID 16710)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4022 (class 1259 OID 16519)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- TOC entry 4023 (class 1259 OID 16520)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- TOC entry 4024 (class 1259 OID 16705)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- TOC entry 4027 (class 1259 OID 16793)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- TOC entry 4030 (class 1259 OID 16898)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- TOC entry 4080 (class 1259 OID 16835)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- TOC entry 4081 (class 1259 OID 16900)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- TOC entry 4082 (class 1259 OID 16850)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- TOC entry 4085 (class 1259 OID 16849)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- TOC entry 4047 (class 1259 OID 16901)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- TOC entry 4048 (class 1259 OID 17071)
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- TOC entry 4051 (class 1259 OID 16792)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- TOC entry 4072 (class 1259 OID 16817)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- TOC entry 4075 (class 1259 OID 16816)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- TOC entry 4070 (class 1259 OID 16802)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- TOC entry 4071 (class 1259 OID 16964)
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- TOC entry 4060 (class 1259 OID 16961)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- TOC entry 4052 (class 1259 OID 16790)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- TOC entry 4014 (class 1259 OID 16870)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- TOC entry 4787 (class 0 OID 0)
-- Dependencies: 4014
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 4015 (class 1259 OID 16707)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- TOC entry 4016 (class 1259 OID 16509)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- TOC entry 4017 (class 1259 OID 16925)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- TOC entry 4128 (class 1259 OID 17165)
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- TOC entry 4131 (class 1259 OID 17164)
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- TOC entry 4124 (class 1259 OID 17147)
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- TOC entry 4127 (class 1259 OID 17148)
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- TOC entry 4134 (class 1259 OID 17348)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- TOC entry 4138 (class 1259 OID 17349)
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- TOC entry 4137 (class 1259 OID 17363)
-- Name: subscription_subscription_id_entity_filters_action_filter_selec; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_selec ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter, COALESCE(selected_columns, '{}'::text[]));


--
-- TOC entry 4145 (class 1259 OID 17385)
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- TOC entry 4148 (class 1259 OID 17402)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- TOC entry 4160 (class 1259 OID 17543)
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- TOC entry 4153 (class 1259 OID 17469)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- TOC entry 4149 (class 1259 OID 17434)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- TOC entry 4150 (class 1259 OID 17403)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- TOC entry 4163 (class 1259 OID 17534)
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- TOC entry 4329 (class 2620 OID 17206)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- TOC entry 4330 (class 2620 OID 17488)
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- TOC entry 4331 (class 2620 OID 17552)
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- TOC entry 4332 (class 2620 OID 17553)
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- TOC entry 4333 (class 2620 OID 17422)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- TOC entry 4265 (class 2606 OID 16693)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4270 (class 2606 OID 16783)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4269 (class 2606 OID 16771)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- TOC entry 4268 (class 2606 OID 16758)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4276 (class 2606 OID 17023)
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 4277 (class 2606 OID 17028)
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4278 (class 2606 OID 17052)
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 4279 (class 2606 OID 17047)
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4275 (class 2606 OID 16949)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4264 (class 2606 OID 16726)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4272 (class 2606 OID 16830)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4273 (class 2606 OID 16903)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- TOC entry 4274 (class 2606 OID 16844)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4266 (class 2606 OID 17066)
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 4267 (class 2606 OID 16721)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4271 (class 2606 OID 16811)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4281 (class 2606 OID 17159)
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4280 (class 2606 OID 17142)
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4288 (class 2606 OID 26759)
-- Name: addresses fk1fa36y2oqhao3wgg2rw1pi459; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT fk1fa36y2oqhao3wgg2rw1pi459 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4317 (class 2606 OID 26899)
-- Name: payment_logs fk29ygux4a0q924wl7gs0h7l99g; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_logs
    ADD CONSTRAINT fk29ygux4a0q924wl7gs0h7l99g FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4307 (class 2606 OID 26854)
-- Name: notifications fk30dp6ycner3dgso3scgc9vghy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk30dp6ycner3dgso3scgc9vghy FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- TOC entry 4289 (class 2606 OID 26764)
-- Name: cart_item_bundle_services fk3t585kwojlacboxwd0px1fc8v; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item_bundle_services
    ADD CONSTRAINT fk3t585kwojlacboxwd0px1fc8v FOREIGN KEY (bundle_service_id) REFERENCES public.bundle_services(id);


--
-- TOC entry 4313 (class 2606 OID 27051)
-- Name: orders fk42bki7v5u9s62olp5is82sd74; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk42bki7v5u9s62olp5is82sd74 FOREIGN KEY (promotion_id) REFERENCES public.promotions(id);


--
-- TOC entry 4298 (class 2606 OID 26809)
-- Name: favorite_products fk45ettyo1mpwr769wk47cdxhl4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_products
    ADD CONSTRAINT fk45ettyo1mpwr769wk47cdxhl4 FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- TOC entry 4302 (class 2606 OID 26829)
-- Name: invoices fk4ko3y00tkkk2ya3p6wnefjj2f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT fk4ko3y00tkkk2ya3p6wnefjj2f FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4327 (class 2606 OID 26949)
-- Name: receipts fk4riagxynetvo7t2tv9qxqsk9w; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipts
    ADD CONSTRAINT fk4riagxynetvo7t2tv9qxqsk9w FOREIGN KEY (export_log_id) REFERENCES public.export_logs(id);


--
-- TOC entry 4319 (class 2606 OID 26914)
-- Name: product_promotions fk5li9b7on7wrh01p4ikflvjvx6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_promotions
    ADD CONSTRAINT fk5li9b7on7wrh01p4ikflvjvx6 FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4290 (class 2606 OID 26769)
-- Name: cart_item_bundle_services fk5tjgm95vsh3a2lsbhpllxmh9u; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item_bundle_services
    ADD CONSTRAINT fk5tjgm95vsh3a2lsbhpllxmh9u FOREIGN KEY (cart_item_id) REFERENCES public.cart_items(id);


--
-- TOC entry 4293 (class 2606 OID 26784)
-- Name: carts fk8ba3sryid5k8a9kidpkvqipyt; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT fk8ba3sryid5k8a9kidpkvqipyt FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- TOC entry 4314 (class 2606 OID 26894)
-- Name: orders fk9p0hwbmw3oxj0kdpb8f1dfsr5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk9p0hwbmw3oxj0kdpb8f1dfsr5 FOREIGN KEY (selected_payment_method_id) REFERENCES public.payment_methods(id);


--
-- TOC entry 4294 (class 2606 OID 26789)
-- Name: customers fka05wbib8rj9goai658v5g7ce4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT fka05wbib8rj9goai658v5g7ce4 FOREIGN KEY (membership_id) REFERENCES public.memberships(id);


--
-- TOC entry 4322 (class 2606 OID 26924)
-- Name: products fka3a4mpsfdf4d2y6r8ra3sc8mv; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fka3a4mpsfdf4d2y6r8ra3sc8mv FOREIGN KEY (brand_id) REFERENCES public.brands(id);


--
-- TOC entry 4299 (class 2606 OID 26814)
-- Name: favorite_products fkabyewuy5ayp1e7lky979l3bs6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_products
    ADD CONSTRAINT fkabyewuy5ayp1e7lky979l3bs6 FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id);


--
-- TOC entry 4311 (class 2606 OID 26879)
-- Name: order_items fkbioxgbv59vetrxe0ejfubep1w; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkbioxgbv59vetrxe0ejfubep1w FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4309 (class 2606 OID 26869)
-- Name: order_item_bundle_services fkd9uwye7i79ymyv9i7o0y8a9g0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item_bundle_services
    ADD CONSTRAINT fkd9uwye7i79ymyv9i7o0y8a9g0 FOREIGN KEY (order_item_id) REFERENCES public.order_items(id);


--
-- TOC entry 4328 (class 2606 OID 26954)
-- Name: staffs fkdrcbb0t4jyjslw24sf1tkfk2p; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staffs
    ADD CONSTRAINT fkdrcbb0t4jyjslw24sf1tkfk2p FOREIGN KEY (id) REFERENCES public.users(id);


--
-- TOC entry 4300 (class 2606 OID 26819)
-- Name: import_log_items fkeyvvme4kvf618rhbbkmgfy83q; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_log_items
    ADD CONSTRAINT fkeyvvme4kvf618rhbbkmgfy83q FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id);


--
-- TOC entry 4296 (class 2606 OID 26804)
-- Name: export_log_items fkfrkkwueenkqr6a9gwdhosjkmv; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.export_log_items
    ADD CONSTRAINT fkfrkkwueenkqr6a9gwdhosjkmv FOREIGN KEY (export_log_id) REFERENCES public.export_logs(id);


--
-- TOC entry 4305 (class 2606 OID 26844)
-- Name: memberships fkg5el0m85hil6ht13udpiiciys; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.memberships
    ADD CONSTRAINT fkg5el0m85hil6ht13udpiiciys FOREIGN KEY (benefit_id) REFERENCES public.membership_benefits(id);


--
-- TOC entry 4297 (class 2606 OID 26799)
-- Name: export_log_items fkgrepohyv6beoy3yqn5q7wf1w1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.export_log_items
    ADD CONSTRAINT fkgrepohyv6beoy3yqn5q7wf1w1 FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id);


--
-- TOC entry 4315 (class 2606 OID 26884)
-- Name: orders fkhlglkvf5i60dv6dn397ethgpt; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fkhlglkvf5i60dv6dn397ethgpt FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- TOC entry 4308 (class 2606 OID 26859)
-- Name: notifications fkiw47pt4gy5y5ehe4604fqheas; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fkiw47pt4gy5y5ehe4604fqheas FOREIGN KEY (favorite_product_id) REFERENCES public.favorite_products(id);


--
-- TOC entry 4312 (class 2606 OID 26874)
-- Name: order_items fkltmtlue0wixrg1cf0xo7x0l4d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkltmtlue0wixrg1cf0xo7x0l4d FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id);


--
-- TOC entry 4306 (class 2606 OID 26849)
-- Name: notification_channels fkmpsidir1onjqphb9jl5a0ie2s; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_channels
    ADD CONSTRAINT fkmpsidir1onjqphb9jl5a0ie2s FOREIGN KEY (notification_id) REFERENCES public.notifications(id);


--
-- TOC entry 4291 (class 2606 OID 26774)
-- Name: cart_items fkn1s4l7h0vm4o259wpu7ft0y2y; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fkn1s4l7h0vm4o259wpu7ft0y2y FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id);


--
-- TOC entry 4287 (class 2606 OID 26754)
-- Name: accounts fknjuop33mo69pd79ctplkck40n; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT fknjuop33mo69pd79ctplkck40n FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4324 (class 2606 OID 26939)
-- Name: purchase_order_items fko3yj8ocbw2kav38548t22hgh8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT fko3yj8ocbw2kav38548t22hgh8 FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id);


--
-- TOC entry 4304 (class 2606 OID 26839)
-- Name: managers fko602exy2392s7gi9as93mio60; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.managers
    ADD CONSTRAINT fko602exy2392s7gi9as93mio60 FOREIGN KEY (id) REFERENCES public.users(id);


--
-- TOC entry 4303 (class 2606 OID 26834)
-- Name: login_logs fkofjfbi0tlitaqkibvevc0w8sm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_logs
    ADD CONSTRAINT fkofjfbi0tlitaqkibvevc0w8sm FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- TOC entry 4323 (class 2606 OID 26929)
-- Name: products fkog2rp4qthbtt2lfyhfo32lsw9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fkog2rp4qthbtt2lfyhfo32lsw9 FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 4321 (class 2606 OID 26919)
-- Name: product_variants fkosqitn4s405cynmhb87lkvuau; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT fkosqitn4s405cynmhb87lkvuau FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4292 (class 2606 OID 26779)
-- Name: cart_items fkpcttvuq4mxppo8sxggjtn5i2c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fkpcttvuq4mxppo8sxggjtn5i2c FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- TOC entry 4295 (class 2606 OID 26794)
-- Name: customers fkpog72rpahj62h7nod9wwc28if; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT fkpog72rpahj62h7nod9wwc28if FOREIGN KEY (id) REFERENCES public.users(id);


--
-- TOC entry 4325 (class 2606 OID 26934)
-- Name: purchase_order_items fkpv8lwyeahhx6u568gy3qlpfro; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT fkpv8lwyeahhx6u568gy3qlpfro FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id);


--
-- TOC entry 4316 (class 2606 OID 26889)
-- Name: orders fkpxtb8awmi0dk6smoh2vp1litg; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fkpxtb8awmi0dk6smoh2vp1litg FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- TOC entry 4320 (class 2606 OID 26909)
-- Name: product_promotions fkqmcm2exr3u4h8gxekpru47vqb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_promotions
    ADD CONSTRAINT fkqmcm2exr3u4h8gxekpru47vqb FOREIGN KEY (promotion_id) REFERENCES public.promotions(id);


--
-- TOC entry 4318 (class 2606 OID 26904)
-- Name: product_images fkqnq71xsohugpqwf3c9gxmsuy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT fkqnq71xsohugpqwf3c9gxmsuy FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4301 (class 2606 OID 26824)
-- Name: import_log_items fkr93l6mp8oe1xl7mf9ypb0xxn1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_log_items
    ADD CONSTRAINT fkr93l6mp8oe1xl7mf9ypb0xxn1 FOREIGN KEY (import_log_id) REFERENCES public.import_logs(id);


--
-- TOC entry 4326 (class 2606 OID 26944)
-- Name: purchase_orders fkrpdasmb8y8xs5tiy4369xpinq; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT fkrpdasmb8y8xs5tiy4369xpinq FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- TOC entry 4310 (class 2606 OID 26864)
-- Name: order_item_bundle_services fks06sgt5fjn3lvp0g0ovy7vale; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item_bundle_services
    ADD CONSTRAINT fks06sgt5fjn3lvp0g0ovy7vale FOREIGN KEY (bundle_service_id) REFERENCES public.bundle_services(id);


--
-- TOC entry 4282 (class 2606 OID 17397)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4283 (class 2606 OID 17444)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4284 (class 2606 OID 17464)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4285 (class 2606 OID 17459)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- TOC entry 4286 (class 2606 OID 17529)
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- TOC entry 4485 (class 0 OID 16529)
-- Dependencies: 353
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4496 (class 0 OID 16889)
-- Dependencies: 366
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4487 (class 0 OID 16686)
-- Dependencies: 357
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4484 (class 0 OID 16522)
-- Dependencies: 352
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4491 (class 0 OID 16776)
-- Dependencies: 361
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4490 (class 0 OID 16764)
-- Dependencies: 360
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4489 (class 0 OID 16751)
-- Dependencies: 359
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4497 (class 0 OID 16939)
-- Dependencies: 367
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4483 (class 0 OID 16511)
-- Dependencies: 351
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4494 (class 0 OID 16818)
-- Dependencies: 364
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4495 (class 0 OID 16836)
-- Dependencies: 365
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4486 (class 0 OID 16537)
-- Dependencies: 354
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4488 (class 0 OID 16716)
-- Dependencies: 358
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4493 (class 0 OID 16803)
-- Dependencies: 363
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4492 (class 0 OID 16794)
-- Dependencies: 362
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4482 (class 0 OID 16499)
-- Dependencies: 349
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4498 (class 0 OID 17333)
-- Dependencies: 381
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4500 (class 0 OID 17376)
-- Dependencies: 383
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4504 (class 0 OID 17496)
-- Dependencies: 387
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4505 (class 0 OID 17509)
-- Dependencies: 388
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4499 (class 0 OID 17368)
-- Dependencies: 382
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4501 (class 0 OID 17386)
-- Dependencies: 384
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4502 (class 0 OID 17435)
-- Dependencies: 385
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4503 (class 0 OID 17449)
-- Dependencies: 386
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4506 (class 0 OID 17519)
-- Dependencies: 389
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4507 (class 6104 OID 16430)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- TOC entry 4585 (class 0 OID 0)
-- Dependencies: 35
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- TOC entry 4586 (class 0 OID 0)
-- Dependencies: 21
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- TOC entry 4587 (class 0 OID 0)
-- Dependencies: 109
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 4588 (class 0 OID 0)
-- Dependencies: 8
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- TOC entry 4589 (class 0 OID 0)
-- Dependencies: 36
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- TOC entry 4590 (class 0 OID 0)
-- Dependencies: 30
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- TOC entry 4596 (class 0 OID 0)
-- Dependencies: 491
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- TOC entry 4597 (class 0 OID 0)
-- Dependencies: 504
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- TOC entry 4599 (class 0 OID 0)
-- Dependencies: 490
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- TOC entry 4601 (class 0 OID 0)
-- Dependencies: 489
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- TOC entry 4602 (class 0 OID 0)
-- Dependencies: 485
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- TOC entry 4603 (class 0 OID 0)
-- Dependencies: 486
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- TOC entry 4604 (class 0 OID 0)
-- Dependencies: 457
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- TOC entry 4605 (class 0 OID 0)
-- Dependencies: 487
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- TOC entry 4606 (class 0 OID 0)
-- Dependencies: 461
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4607 (class 0 OID 0)
-- Dependencies: 463
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4608 (class 0 OID 0)
-- Dependencies: 454
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- TOC entry 4609 (class 0 OID 0)
-- Dependencies: 453
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- TOC entry 4610 (class 0 OID 0)
-- Dependencies: 460
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4611 (class 0 OID 0)
-- Dependencies: 462
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4612 (class 0 OID 0)
-- Dependencies: 464
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- TOC entry 4613 (class 0 OID 0)
-- Dependencies: 465
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- TOC entry 4614 (class 0 OID 0)
-- Dependencies: 458
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- TOC entry 4615 (class 0 OID 0)
-- Dependencies: 459
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- TOC entry 4617 (class 0 OID 0)
-- Dependencies: 492
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- TOC entry 4619 (class 0 OID 0)
-- Dependencies: 496
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4621 (class 0 OID 0)
-- Dependencies: 493
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- TOC entry 4622 (class 0 OID 0)
-- Dependencies: 456
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4623 (class 0 OID 0)
-- Dependencies: 455
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- TOC entry 4624 (class 0 OID 0)
-- Dependencies: 441
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- TOC entry 4625 (class 0 OID 0)
-- Dependencies: 440
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- TOC entry 4626 (class 0 OID 0)
-- Dependencies: 442
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- TOC entry 4627 (class 0 OID 0)
-- Dependencies: 488
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- TOC entry 4628 (class 0 OID 0)
-- Dependencies: 484
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- TOC entry 4629 (class 0 OID 0)
-- Dependencies: 478
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- TOC entry 4630 (class 0 OID 0)
-- Dependencies: 480
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4631 (class 0 OID 0)
-- Dependencies: 482
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- TOC entry 4632 (class 0 OID 0)
-- Dependencies: 479
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- TOC entry 4633 (class 0 OID 0)
-- Dependencies: 481
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4634 (class 0 OID 0)
-- Dependencies: 483
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- TOC entry 4635 (class 0 OID 0)
-- Dependencies: 474
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- TOC entry 4636 (class 0 OID 0)
-- Dependencies: 476
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- TOC entry 4637 (class 0 OID 0)
-- Dependencies: 475
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- TOC entry 4638 (class 0 OID 0)
-- Dependencies: 477
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4639 (class 0 OID 0)
-- Dependencies: 470
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- TOC entry 4640 (class 0 OID 0)
-- Dependencies: 472
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- TOC entry 4641 (class 0 OID 0)
-- Dependencies: 471
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- TOC entry 4642 (class 0 OID 0)
-- Dependencies: 473
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- TOC entry 4643 (class 0 OID 0)
-- Dependencies: 466
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- TOC entry 4644 (class 0 OID 0)
-- Dependencies: 468
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- TOC entry 4645 (class 0 OID 0)
-- Dependencies: 467
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- TOC entry 4646 (class 0 OID 0)
-- Dependencies: 469
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- TOC entry 4647 (class 0 OID 0)
-- Dependencies: 494
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4648 (class 0 OID 0)
-- Dependencies: 495
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4650 (class 0 OID 0)
-- Dependencies: 497
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4651 (class 0 OID 0)
-- Dependencies: 448
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- TOC entry 4652 (class 0 OID 0)
-- Dependencies: 449
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- TOC entry 4653 (class 0 OID 0)
-- Dependencies: 450
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- TOC entry 4654 (class 0 OID 0)
-- Dependencies: 451
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- TOC entry 4655 (class 0 OID 0)
-- Dependencies: 452
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- TOC entry 4656 (class 0 OID 0)
-- Dependencies: 443
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- TOC entry 4657 (class 0 OID 0)
-- Dependencies: 444
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- TOC entry 4658 (class 0 OID 0)
-- Dependencies: 446
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- TOC entry 4659 (class 0 OID 0)
-- Dependencies: 445
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- TOC entry 4660 (class 0 OID 0)
-- Dependencies: 447
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- TOC entry 4661 (class 0 OID 0)
-- Dependencies: 503
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- TOC entry 4662 (class 0 OID 0)
-- Dependencies: 427
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4663 (class 0 OID 0)
-- Dependencies: 439
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- TOC entry 4664 (class 0 OID 0)
-- Dependencies: 510
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- TOC entry 4665 (class 0 OID 0)
-- Dependencies: 515
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- TOC entry 4666 (class 0 OID 0)
-- Dependencies: 512
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- TOC entry 4667 (class 0 OID 0)
-- Dependencies: 508
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- TOC entry 4668 (class 0 OID 0)
-- Dependencies: 507
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- TOC entry 4669 (class 0 OID 0)
-- Dependencies: 536
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO dashboard_user;


--
-- TOC entry 4670 (class 0 OID 0)
-- Dependencies: 511
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- TOC entry 4671 (class 0 OID 0)
-- Dependencies: 517
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;


--
-- TOC entry 4672 (class 0 OID 0)
-- Dependencies: 506
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- TOC entry 4673 (class 0 OID 0)
-- Dependencies: 514
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- TOC entry 4674 (class 0 OID 0)
-- Dependencies: 518
-- Name: FUNCTION send_binary(payload bytea, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) TO dashboard_user;


--
-- TOC entry 4675 (class 0 OID 0)
-- Dependencies: 505
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- TOC entry 4676 (class 0 OID 0)
-- Dependencies: 509
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- TOC entry 4677 (class 0 OID 0)
-- Dependencies: 513
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- TOC entry 4678 (class 0 OID 0)
-- Dependencies: 516
-- Name: FUNCTION wal2json_escape_identifier(name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.wal2json_escape_identifier(name text) TO postgres;
GRANT ALL ON FUNCTION realtime.wal2json_escape_identifier(name text) TO dashboard_user;


--
-- TOC entry 4679 (class 0 OID 0)
-- Dependencies: 499
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- TOC entry 4680 (class 0 OID 0)
-- Dependencies: 501
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- TOC entry 4681 (class 0 OID 0)
-- Dependencies: 502
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- TOC entry 4683 (class 0 OID 0)
-- Dependencies: 353
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- TOC entry 4684 (class 0 OID 0)
-- Dependencies: 372
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- TOC entry 4686 (class 0 OID 0)
-- Dependencies: 366
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- TOC entry 4689 (class 0 OID 0)
-- Dependencies: 357
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- TOC entry 4691 (class 0 OID 0)
-- Dependencies: 352
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- TOC entry 4693 (class 0 OID 0)
-- Dependencies: 361
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- TOC entry 4695 (class 0 OID 0)
-- Dependencies: 360
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- TOC entry 4698 (class 0 OID 0)
-- Dependencies: 359
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- TOC entry 4699 (class 0 OID 0)
-- Dependencies: 369
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- TOC entry 4701 (class 0 OID 0)
-- Dependencies: 371
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- TOC entry 4702 (class 0 OID 0)
-- Dependencies: 368
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- TOC entry 4703 (class 0 OID 0)
-- Dependencies: 370
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- TOC entry 4704 (class 0 OID 0)
-- Dependencies: 367
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- TOC entry 4706 (class 0 OID 0)
-- Dependencies: 351
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- TOC entry 4708 (class 0 OID 0)
-- Dependencies: 350
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- TOC entry 4710 (class 0 OID 0)
-- Dependencies: 364
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- TOC entry 4712 (class 0 OID 0)
-- Dependencies: 365
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- TOC entry 4714 (class 0 OID 0)
-- Dependencies: 354
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- TOC entry 4719 (class 0 OID 0)
-- Dependencies: 358
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- TOC entry 4721 (class 0 OID 0)
-- Dependencies: 363
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- TOC entry 4724 (class 0 OID 0)
-- Dependencies: 362
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- TOC entry 4727 (class 0 OID 0)
-- Dependencies: 349
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- TOC entry 4728 (class 0 OID 0)
-- Dependencies: 374
-- Name: TABLE webauthn_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_challenges TO postgres;
GRANT ALL ON TABLE auth.webauthn_challenges TO dashboard_user;


--
-- TOC entry 4729 (class 0 OID 0)
-- Dependencies: 373
-- Name: TABLE webauthn_credentials; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_credentials TO postgres;
GRANT ALL ON TABLE auth.webauthn_credentials TO dashboard_user;


--
-- TOC entry 4730 (class 0 OID 0)
-- Dependencies: 348
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- TOC entry 4731 (class 0 OID 0)
-- Dependencies: 347
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- TOC entry 4732 (class 0 OID 0)
-- Dependencies: 390
-- Name: TABLE accounts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.accounts TO anon;
GRANT ALL ON TABLE public.accounts TO authenticated;
GRANT ALL ON TABLE public.accounts TO service_role;


--
-- TOC entry 4733 (class 0 OID 0)
-- Dependencies: 391
-- Name: TABLE addresses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.addresses TO anon;
GRANT ALL ON TABLE public.addresses TO authenticated;
GRANT ALL ON TABLE public.addresses TO service_role;


--
-- TOC entry 4734 (class 0 OID 0)
-- Dependencies: 392
-- Name: TABLE brands; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.brands TO anon;
GRANT ALL ON TABLE public.brands TO authenticated;
GRANT ALL ON TABLE public.brands TO service_role;


--
-- TOC entry 4735 (class 0 OID 0)
-- Dependencies: 393
-- Name: TABLE bundle_services; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bundle_services TO anon;
GRANT ALL ON TABLE public.bundle_services TO authenticated;
GRANT ALL ON TABLE public.bundle_services TO service_role;


--
-- TOC entry 4736 (class 0 OID 0)
-- Dependencies: 394
-- Name: TABLE cart_item_bundle_services; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cart_item_bundle_services TO anon;
GRANT ALL ON TABLE public.cart_item_bundle_services TO authenticated;
GRANT ALL ON TABLE public.cart_item_bundle_services TO service_role;


--
-- TOC entry 4737 (class 0 OID 0)
-- Dependencies: 395
-- Name: TABLE cart_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cart_items TO anon;
GRANT ALL ON TABLE public.cart_items TO authenticated;
GRANT ALL ON TABLE public.cart_items TO service_role;


--
-- TOC entry 4738 (class 0 OID 0)
-- Dependencies: 396
-- Name: TABLE carts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.carts TO anon;
GRANT ALL ON TABLE public.carts TO authenticated;
GRANT ALL ON TABLE public.carts TO service_role;


--
-- TOC entry 4739 (class 0 OID 0)
-- Dependencies: 397
-- Name: TABLE categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.categories TO anon;
GRANT ALL ON TABLE public.categories TO authenticated;
GRANT ALL ON TABLE public.categories TO service_role;


--
-- TOC entry 4740 (class 0 OID 0)
-- Dependencies: 398
-- Name: TABLE customers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.customers TO anon;
GRANT ALL ON TABLE public.customers TO authenticated;
GRANT ALL ON TABLE public.customers TO service_role;


--
-- TOC entry 4741 (class 0 OID 0)
-- Dependencies: 399
-- Name: TABLE export_log_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.export_log_items TO anon;
GRANT ALL ON TABLE public.export_log_items TO authenticated;
GRANT ALL ON TABLE public.export_log_items TO service_role;


--
-- TOC entry 4742 (class 0 OID 0)
-- Dependencies: 400
-- Name: TABLE export_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.export_logs TO anon;
GRANT ALL ON TABLE public.export_logs TO authenticated;
GRANT ALL ON TABLE public.export_logs TO service_role;


--
-- TOC entry 4743 (class 0 OID 0)
-- Dependencies: 401
-- Name: TABLE favorite_products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.favorite_products TO anon;
GRANT ALL ON TABLE public.favorite_products TO authenticated;
GRANT ALL ON TABLE public.favorite_products TO service_role;


--
-- TOC entry 4744 (class 0 OID 0)
-- Dependencies: 402
-- Name: TABLE import_log_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.import_log_items TO anon;
GRANT ALL ON TABLE public.import_log_items TO authenticated;
GRANT ALL ON TABLE public.import_log_items TO service_role;


--
-- TOC entry 4745 (class 0 OID 0)
-- Dependencies: 403
-- Name: TABLE import_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.import_logs TO anon;
GRANT ALL ON TABLE public.import_logs TO authenticated;
GRANT ALL ON TABLE public.import_logs TO service_role;


--
-- TOC entry 4746 (class 0 OID 0)
-- Dependencies: 404
-- Name: TABLE invoices; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.invoices TO anon;
GRANT ALL ON TABLE public.invoices TO authenticated;
GRANT ALL ON TABLE public.invoices TO service_role;


--
-- TOC entry 4747 (class 0 OID 0)
-- Dependencies: 405
-- Name: TABLE login_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.login_logs TO anon;
GRANT ALL ON TABLE public.login_logs TO authenticated;
GRANT ALL ON TABLE public.login_logs TO service_role;


--
-- TOC entry 4748 (class 0 OID 0)
-- Dependencies: 406
-- Name: TABLE managers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.managers TO anon;
GRANT ALL ON TABLE public.managers TO authenticated;
GRANT ALL ON TABLE public.managers TO service_role;


--
-- TOC entry 4749 (class 0 OID 0)
-- Dependencies: 407
-- Name: TABLE membership_benefits; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.membership_benefits TO anon;
GRANT ALL ON TABLE public.membership_benefits TO authenticated;
GRANT ALL ON TABLE public.membership_benefits TO service_role;


--
-- TOC entry 4750 (class 0 OID 0)
-- Dependencies: 408
-- Name: TABLE memberships; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.memberships TO anon;
GRANT ALL ON TABLE public.memberships TO authenticated;
GRANT ALL ON TABLE public.memberships TO service_role;


--
-- TOC entry 4751 (class 0 OID 0)
-- Dependencies: 409
-- Name: TABLE notification_channels; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notification_channels TO anon;
GRANT ALL ON TABLE public.notification_channels TO authenticated;
GRANT ALL ON TABLE public.notification_channels TO service_role;


--
-- TOC entry 4752 (class 0 OID 0)
-- Dependencies: 410
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notifications TO anon;
GRANT ALL ON TABLE public.notifications TO authenticated;
GRANT ALL ON TABLE public.notifications TO service_role;


--
-- TOC entry 4753 (class 0 OID 0)
-- Dependencies: 411
-- Name: TABLE order_item_bundle_services; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.order_item_bundle_services TO anon;
GRANT ALL ON TABLE public.order_item_bundle_services TO authenticated;
GRANT ALL ON TABLE public.order_item_bundle_services TO service_role;


--
-- TOC entry 4754 (class 0 OID 0)
-- Dependencies: 412
-- Name: TABLE order_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.order_items TO anon;
GRANT ALL ON TABLE public.order_items TO authenticated;
GRANT ALL ON TABLE public.order_items TO service_role;


--
-- TOC entry 4755 (class 0 OID 0)
-- Dependencies: 413
-- Name: TABLE orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.orders TO anon;
GRANT ALL ON TABLE public.orders TO authenticated;
GRANT ALL ON TABLE public.orders TO service_role;


--
-- TOC entry 4756 (class 0 OID 0)
-- Dependencies: 414
-- Name: TABLE payment_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payment_logs TO anon;
GRANT ALL ON TABLE public.payment_logs TO authenticated;
GRANT ALL ON TABLE public.payment_logs TO service_role;


--
-- TOC entry 4757 (class 0 OID 0)
-- Dependencies: 415
-- Name: TABLE payment_methods; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payment_methods TO anon;
GRANT ALL ON TABLE public.payment_methods TO authenticated;
GRANT ALL ON TABLE public.payment_methods TO service_role;


--
-- TOC entry 4758 (class 0 OID 0)
-- Dependencies: 416
-- Name: TABLE product_images; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.product_images TO anon;
GRANT ALL ON TABLE public.product_images TO authenticated;
GRANT ALL ON TABLE public.product_images TO service_role;


--
-- TOC entry 4759 (class 0 OID 0)
-- Dependencies: 417
-- Name: TABLE product_promotions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.product_promotions TO anon;
GRANT ALL ON TABLE public.product_promotions TO authenticated;
GRANT ALL ON TABLE public.product_promotions TO service_role;


--
-- TOC entry 4760 (class 0 OID 0)
-- Dependencies: 418
-- Name: TABLE product_variants; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.product_variants TO anon;
GRANT ALL ON TABLE public.product_variants TO authenticated;
GRANT ALL ON TABLE public.product_variants TO service_role;


--
-- TOC entry 4761 (class 0 OID 0)
-- Dependencies: 419
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.products TO anon;
GRANT ALL ON TABLE public.products TO authenticated;
GRANT ALL ON TABLE public.products TO service_role;


--
-- TOC entry 4762 (class 0 OID 0)
-- Dependencies: 420
-- Name: TABLE promotions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.promotions TO anon;
GRANT ALL ON TABLE public.promotions TO authenticated;
GRANT ALL ON TABLE public.promotions TO service_role;


--
-- TOC entry 4763 (class 0 OID 0)
-- Dependencies: 421
-- Name: TABLE purchase_order_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.purchase_order_items TO anon;
GRANT ALL ON TABLE public.purchase_order_items TO authenticated;
GRANT ALL ON TABLE public.purchase_order_items TO service_role;


--
-- TOC entry 4764 (class 0 OID 0)
-- Dependencies: 422
-- Name: TABLE purchase_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.purchase_orders TO anon;
GRANT ALL ON TABLE public.purchase_orders TO authenticated;
GRANT ALL ON TABLE public.purchase_orders TO service_role;


--
-- TOC entry 4765 (class 0 OID 0)
-- Dependencies: 423
-- Name: TABLE receipts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.receipts TO anon;
GRANT ALL ON TABLE public.receipts TO authenticated;
GRANT ALL ON TABLE public.receipts TO service_role;


--
-- TOC entry 4766 (class 0 OID 0)
-- Dependencies: 424
-- Name: TABLE staffs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.staffs TO anon;
GRANT ALL ON TABLE public.staffs TO authenticated;
GRANT ALL ON TABLE public.staffs TO service_role;


--
-- TOC entry 4767 (class 0 OID 0)
-- Dependencies: 425
-- Name: TABLE suppliers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.suppliers TO anon;
GRANT ALL ON TABLE public.suppliers TO authenticated;
GRANT ALL ON TABLE public.suppliers TO service_role;


--
-- TOC entry 4768 (class 0 OID 0)
-- Dependencies: 426
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- TOC entry 4769 (class 0 OID 0)
-- Dependencies: 381
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- TOC entry 4770 (class 0 OID 0)
-- Dependencies: 375
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- TOC entry 4771 (class 0 OID 0)
-- Dependencies: 378
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- TOC entry 4772 (class 0 OID 0)
-- Dependencies: 377
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- TOC entry 4774 (class 0 OID 0)
-- Dependencies: 383
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- TOC entry 4775 (class 0 OID 0)
-- Dependencies: 387
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- TOC entry 4776 (class 0 OID 0)
-- Dependencies: 388
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- TOC entry 4778 (class 0 OID 0)
-- Dependencies: 384
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- TOC entry 4779 (class 0 OID 0)
-- Dependencies: 385
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- TOC entry 4780 (class 0 OID 0)
-- Dependencies: 386
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- TOC entry 4781 (class 0 OID 0)
-- Dependencies: 389
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- TOC entry 4782 (class 0 OID 0)
-- Dependencies: 355
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- TOC entry 4783 (class 0 OID 0)
-- Dependencies: 356
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- TOC entry 2624 (class 826 OID 16557)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 2625 (class 826 OID 16558)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 2623 (class 826 OID 16556)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- TOC entry 2634 (class 826 OID 16636)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- TOC entry 2633 (class 826 OID 16635)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- TOC entry 2632 (class 826 OID 16634)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- TOC entry 2637 (class 826 OID 16591)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2636 (class 826 OID 16590)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2635 (class 826 OID 16589)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2629 (class 826 OID 16571)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2631 (class 826 OID 16570)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2630 (class 826 OID 16569)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2616 (class 826 OID 16494)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2617 (class 826 OID 16495)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2615 (class 826 OID 16493)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2619 (class 826 OID 16497)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2614 (class 826 OID 16492)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2618 (class 826 OID 16496)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2627 (class 826 OID 16561)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 2628 (class 826 OID 16562)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 2626 (class 826 OID 16560)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- TOC entry 2622 (class 826 OID 16550)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2621 (class 826 OID 16549)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2620 (class 826 OID 16548)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 3850 (class 3466 OID 16575)
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- TOC entry 3853 (class 3466 OID 16654)
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- TOC entry 3855 (class 3466 OID 16666)
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- TOC entry 3854 (class 3466 OID 16657)
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- TOC entry 3851 (class 3466 OID 16576)
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- TOC entry 3852 (class 3466 OID 16577)
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

-- Completed on 2026-07-03 01:33:30

--
-- PostgreSQL database dump complete
--

\unrestrict og9zMK6Fo9V8eq3ZfzwCRZfc7vGugcg3JZnCclvbRqnNcH1fS7cefqDKMlKq7Fw

