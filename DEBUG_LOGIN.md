# Debug Login Issues

## Quick Diagnostic

Run this command to check if your credentials work:

```bash
cd server
npm run check-login <email> <password>
```

Example:
```bash
npm run check-login jayathuralifecare@gmail.com AdminPass123!
```

## Common Login Issues

### 1. "Invalid email or password"
**Possible causes:**
- Email doesn't exist in database
- Password is incorrect
- Email has wrong case (should be automatically handled)

**Solution:**
- Check if user exists: `npm run check-admin`
- Verify password is correct
- Try resetting password or creating new account

### 2. "Account is deactivated"
**Cause:** `isActive` is set to `false` in database

**Solution:**
- Login as super admin
- Update user in database to set `isActive: true`

### 3. "Your account is pending approval"
**Cause:** Non-patient role (admin/pharmacist/delivery) is not approved

**Solution:**
1. Login as super admin (`jayathuralifecare@gmail.com`)
2. Go to Admin Portal → "User Approvals" tab
3. Click "Approve" on the pending user

### 4. User not found in database
**Cause:** User was never created or was deleted

**Solution:**
- Register again, or
- Run seed script to create super admin: `npm run seed`

## Check User Status

To see all users and their status:
```bash
cd server
npm run check-admin
```

## Test Login Directly

The login route now logs detailed information:
- ✅ Successful logins
- ❌ Failed login attempts with reason

Check your server console when trying to login to see the exact error.

## Super Admin Credentials

If you need to login as super admin:
- Email: `jayathuralifecare@gmail.com`
- Password: `AdminPass123!` (or check `ADMIN_PASSWORD` in `.env`)

If super admin doesn't exist:
```bash
cd server
npm run seed
```

