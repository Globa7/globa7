# Globa7 Luxury Transportation - Admin Setup

## Creating Your First Admin Account

To create an admin account, you'll need to:

1. **Sign up as a normal user** through the Sign Up page
2. **Use the Supabase dashboard** to manually set the user role to "admin"

### Step-by-Step Process:

#### Option 1: Manual Setup (Recommended)
1. Go to `/auth` and create an account with your admin credentials
2. The system will automatically create the user with "client" role
3. After testing the platform, you can manually promote any user to admin by having them contact you

#### Option 2: Using Demo Credentials (For Testing)
For development and testing purposes, you can use these credentials:
- Email: `admin@globa7.com`
- Password: `admin123`

**Important**: You'll need to create this account first by:
1. Going to `/auth`
2. Signing up with the above credentials
3. Then manually update the role in the KV store through the Supabase function

### How the System Works

**User Roles:**
- `client` - Default role for all new signups
- `admin` - Full access to admin dashboard and business management

**Role Storage:**
The user's role is stored in the key-value store with the key pattern:
```
user:{userId}:role
```

### Promoting a User to Admin

To promote a user to admin, you would typically:

1. **Have them sign up normally** through `/auth`
2. **Get their user ID** from the authentication system
3. **Update their role** in the KV store to "admin"

Since this is a development environment, for production use you should:
- Create a super admin interface
- Implement proper role management
- Add audit logging for role changes
- Require multi-factor authentication for admin accounts

### Security Best Practices

1. **Use Strong Passwords**: Minimum 12 characters with mixed case, numbers, and symbols
2. **Limit Admin Access**: Only grant admin role to trusted personnel
3. **Monitor Admin Actions**: Track all changes made through the admin dashboard
4. **Regular Audits**: Review admin activities periodically
5. **Separate Accounts**: Don't use the same account for client and admin access

### Testing the Platform

**As a Client:**
1. Sign up with a regular email
2. Make a test booking
3. View your portal at `/portal`
4. Check booking history and profile

**As an Admin:**
1. Sign in with admin credentials
2. Access admin dashboard at `/admin`
3. Test pricing configuration
4. Create test bundles
5. Add sample drivers
6. Manage bookings

---

**Note**: This is a development platform. For production deployment, implement proper role-based access control with your infrastructure provider.
