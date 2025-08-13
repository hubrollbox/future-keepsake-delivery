# Security Vulnerabilities Fix Instructions

## Overview

This document addresses two critical security vulnerabilities identified in the Supabase database:

1. **Recipients Table RLS Policy Vulnerability**: The `recipients` table contains sensitive personal data (names, emails, phone numbers, addresses) but lacks proper Row Level Security (RLS) policies, potentially exposing customer data to unauthorized access.

2. **Function Search Path Vulnerability**: Multiple database functions lack the `search_path` parameter, making them vulnerable to search path manipulation attacks.

## Security Risks

### Recipients Table Vulnerability
- **Risk Level**: HIGH
- **Impact**: Unauthorized access to sensitive customer data including:
  - Full names
  - Email addresses
  - Phone numbers
  - Physical addresses
- **Potential Attacks**: Data theft, spam campaigns, identity theft, physical targeting

### Function Search Path Vulnerability
- **Risk Level**: MEDIUM-HIGH
- **Impact**: Potential SQL injection and privilege escalation
- **Affected Functions**:
  - `send_email()`
  - `send_due_capsules()`
  - `invoke_send_keepsakes_function()`
  - `invoke_send_keepsakes_edge_function()`
  - `handle_new_user()`

## Solution

A comprehensive migration file has been created: `supabase/migrations/20250127000000_fix_security_vulnerabilities.sql`

### What the Migration Does

#### 1. Strengthens RLS Policies for Recipients Table
- Ensures RLS is enabled on the `recipients` table
- Removes any dangerous public access policies
- Creates secure policies that restrict access based on keepsake ownership:
  - Users can only access recipients for keepsakes they own
  - Admins have full access to all recipients

#### 2. Fixes Function Search Path Issues
- Adds `SET search_path = public, pg_temp` to all vulnerable functions
- Ensures functions cannot be manipulated through search path attacks
- Maintains function security while preserving functionality

## Manual Application Instructions

### Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Run the migration**:
   ```bash
   supabase migration up --project-ref mlxmymmoysbtnvcehggn
   ```

### Option 2: Using Supabase Dashboard (Alternative)

1. **Access Supabase Dashboard**:
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Navigate to your project: `mlxmymmoysbtnvcehggn`

2. **Open SQL Editor**:
   - Click on "SQL Editor" in the left sidebar
   - Create a new query

3. **Execute the Migration**:
   - Copy the entire content of `supabase/migrations/20250127000000_fix_security_vulnerabilities.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

### Option 3: Using Database Connection (Advanced)

If you have direct database access:

1. Connect to your PostgreSQL database
2. Execute the migration SQL file
3. Verify the changes were applied successfully

## Verification Steps

After applying the migration, verify the fixes:

### 1. Check RLS Policies for Recipients Table

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'recipients';

-- List all policies for recipients table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'recipients';
```

### 2. Check Function Search Path Settings

```sql
-- Check function definitions for search_path
SELECT 
    p.proname as function_name,
    p.prosrc as function_body,
    array_to_string(p.proconfig, ', ') as config_settings
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN (
    'send_email',
    'send_due_capsules', 
    'invoke_send_keepsakes_function',
    'invoke_send_keepsakes_edge_function',
    'handle_new_user',
    'is_admin_user',
    'get_current_user_role'
);
```

### 3. Test Recipients Access Control

```sql
-- Test that users can only see their own recipients
-- (This should only return recipients for keepsakes owned by the current user)
SELECT r.* 
FROM recipients r
JOIN keepsakes k ON r.keepsake_id = k.id
WHERE k.user_id = auth.uid();
```

## Expected Results

After successful application:

1. **Recipients Table**:
   - RLS enabled
   - Secure policies in place
   - Users can only access recipients for their own keepsakes
   - Admins have full access

2. **Functions**:
   - All functions have proper `search_path` settings
   - Functions are protected against search path manipulation
   - Functionality remains unchanged

3. **Security Log**:
   - Entry in `cron_job_logs` table confirming fixes were applied

## Rollback Instructions

If issues occur after applying the migration:

1. **Backup Current State** (before rollback):
   ```sql
   -- Export current policies
   SELECT * FROM pg_policies WHERE tablename = 'recipients';
   ```

2. **Rollback RLS Policies** (if needed):
   ```sql
   -- Remove new policies
   DROP POLICY IF EXISTS "recipients_keepsake_owner_access" ON public.recipients;
   DROP POLICY IF EXISTS "recipients_admin_full_access" ON public.recipients;
   
   -- Re-enable previous policies if they existed
   -- (Check your backup before doing this)
   ```

3. **Rollback Function Changes** (if needed):
   ```sql
   -- Remove search_path from functions
   -- (This is not recommended as it reintroduces the vulnerability)
   ```

## Monitoring and Maintenance

1. **Regular Security Audits**:
   - Review RLS policies quarterly
   - Check for new functions without proper search_path
   - Monitor access logs for suspicious activity

2. **Function Security Checklist**:
   - All new `SECURITY DEFINER` functions must include `SET search_path`
   - Regular review of function permissions
   - Testing of RLS policies with different user roles

## Contact and Support

If you encounter issues during migration:

1. Check the `cron_job_logs` table for error messages
2. Verify your Supabase project permissions
3. Ensure you have admin access to the database
4. Contact your database administrator if needed

## Compliance Notes

These fixes help ensure compliance with:
- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)
- SOC 2 Type II requirements
- General data security best practices

---

**Important**: Apply these fixes as soon as possible to protect sensitive customer data and prevent potential security breaches.