# Globa7 Luxury Transportation - bolt.new Migration Guide

## 🚀 Overview

This guide will help you migrate the Globa7 luxury transportation web app from Figma Make to bolt.new.

## ⚠️ Key Architectural Differences

### Figma Make → bolt.new Changes

| Feature | Figma Make | bolt.new |
|---------|------------|----------|
| **Backend** | Supabase Edge Functions + KV Store | You'll need to set up Supabase separately |
| **Routing** | React Router (react-router) | Use react-router-dom instead |
| **Package Manager** | Pre-configured | You control dependencies |
| **Environment Variables** | Auto-configured | Manual setup required |
| **Database** | Pre-configured KV store | You'll set up Supabase tables |

---

## 📋 Step-by-Step Migration Process

### Step 1: Create New bolt.new Project

1. Go to [bolt.new](https://bolt.new)
2. Start a new React + TypeScript + Tailwind project
3. Tell bolt: "Create a luxury transportation booking platform with React, TypeScript, Tailwind CSS, and Vite"

---

### Step 2: Set Up Supabase (Backend)

Since bolt.new doesn't have pre-configured Supabase, you'll need to:

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your `Project URL` and `anon key`

2. **Create Database Tables**

Run these SQL queries in your Supabase SQL Editor:

```sql
-- Users table (extends Supabase Auth)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'client',
  loyalty_points INTEGER DEFAULT 0,
  member_since TIMESTAMPTZ DEFAULT NOW(),
  preferred_payment_method TEXT,
  saved_addresses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2),
  image_url TEXT,
  vehicle_type TEXT,
  duration TEXT,
  max_passengers INTEGER,
  highlights TEXT[],
  inclusions TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  service_id UUID REFERENCES services,
  service_name TEXT,
  pickup_location TEXT,
  dropoff_location TEXT,
  pickup_datetime TIMESTAMPTZ,
  passengers INTEGER,
  vehicle_type TEXT,
  price DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  driver_id UUID,
  special_requests TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drivers table
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  license_number TEXT,
  license_expiry DATE,
  assigned_vehicle TEXT,
  status TEXT DEFAULT 'active',
  rating DECIMAL(3,2) DEFAULT 0,
  total_trips INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tours table
CREATE TABLE tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  duration_hours INTEGER,
  base_price DECIMAL(10,2),
  highlights TEXT[],
  stops JSONB,
  image_url TEXT,
  max_passengers INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  event_type TEXT,
  date TIMESTAMPTZ,
  location TEXT,
  description TEXT,
  services_offered TEXT[],
  pricing JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bundles table
CREATE TABLE service_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  base_price DECIMAL(10,2),
  discount INTEGER,
  included_services TEXT[],
  vehicle_types TEXT[],
  hours_included INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bundles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for services (public read, admin write)
CREATE POLICY "Services are viewable by everyone" ON services
  FOR SELECT USING (is_active = true OR auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
  ));

CREATE POLICY "Admins can insert services" ON services
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
  ));

CREATE POLICY "Admins can update services" ON services
  FOR UPDATE USING (auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
  ));

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT id FROM user_profiles WHERE role = 'admin')
  );

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update bookings" ON bookings
  FOR UPDATE USING (auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
  ));

-- RLS Policies for drivers (admin only)
CREATE POLICY "Admins can manage drivers" ON drivers
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
  ));

-- RLS Policies for tours (public read, admin write)
CREATE POLICY "Tours are viewable by everyone" ON tours
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage tours" ON tours
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
  ));

-- RLS Policies for bundles (public read, admin write)
CREATE POLICY "Bundles are viewable by everyone" ON service_bundles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage bundles" ON service_bundles
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
  ));

-- Create default admin user (run this after setting up auth)
-- You'll need to manually create the user first in Supabase Auth, then run:
-- INSERT INTO user_profiles (id, email, name, role)
-- VALUES ('your-user-id-from-auth', 'admin@globa7.com', 'Globa7 Administrator', 'admin');
```

3. **Create Database Functions**

```sql
-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'phone',
    CASE 
      WHEN NEW.email LIKE '%admin%' OR NEW.email = 'admin@globa7.com' 
      THEN 'admin' 
      ELSE 'client' 
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

### Step 3: Install Dependencies

Create a `package.json` with all required dependencies:

```json
{
  "name": "globa7-luxury-transportation",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "@supabase/supabase-js": "^2.39.0",
    "motion": "^11.11.17",
    "lucide-react": "^0.344.0",
    "sonner": "^1.4.0",
    "date-fns": "^3.3.1",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.0",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35"
  }
}
```

---

### Step 4: Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Replace with your actual Supabase project URL and anon key.

---

### Step 5: Update Import Statements

Replace all instances throughout your code:

**Before (Figma Make):**
```typescript
import { createClient } from 'npm:@supabase/supabase-js@2';
```

**After (bolt.new):**
```typescript
import { createClient } from '@supabase/supabase-js';
```

**Routing changes:**
```typescript
// Before
import { RouterProvider, createBrowserRouter } from 'react-router';

// After
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
```

---

### Step 6: Create Supabase Client

Create `/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

### Step 7: Update API Calls

Since bolt.new doesn't have the pre-configured Edge Functions, you'll need to update your API calls to use Supabase directly:

**Before (Figma Make with Edge Functions):**
```typescript
const response = await fetch(`${API_BASE}/admin/services`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify(serviceData),
});
```

**After (bolt.new with Supabase):**
```typescript
import { supabase } from '../lib/supabase';

const { data, error } = await supabase
  .from('services')
  .insert([serviceData])
  .select()
  .single();

if (error) throw error;
```

---

### Step 8: Update Auth Context

Replace your `AuthContext.tsx` to use Supabase directly:

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserProfile(authUser: SupabaseUser) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profile) {
      setUser({
        id: authUser.id,
        email: authUser.email!,
        name: profile.name,
        role: profile.role,
      });
    }
    setLoading(false);
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const user = {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.name,
      role: profile?.role || 'client',
    };

    setUser(user);
    return user;
  }

  async function signUp(email: string, password: string, name: string, phone: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
        },
      },
    });

    if (error) throw error;

    // Profile is automatically created by the trigger
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

---

### Step 9: Update Service Creation Modal

Replace API calls with Supabase:

```typescript
// Before
const response = await fetch(`${API_BASE}/admin/services`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token}`,
  },
  body: JSON.stringify(serviceData),
});

// After
const { data, error } = await supabase
  .from('services')
  .insert([{
    name: formData.name,
    category: formData.category,
    description: formData.description,
    base_price: parseFloat(formData.basePrice),
    image_url: uploadedImageUrl, // You'll need to upload to Supabase Storage
    vehicle_type: formData.vehicleType,
    duration: formData.duration,
    max_passengers: parseInt(formData.maxPassengers),
    highlights: formData.highlights.split('\n').filter(Boolean),
    inclusions: formData.inclusions.split('\n').filter(Boolean),
  }])
  .select()
  .single();

if (error) throw error;
```

---

### Step 10: Supabase Storage for Images

Add image upload functionality:

```typescript
async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `services/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('service-images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('service-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
```

Don't forget to create the `service-images` bucket in Supabase Storage (Settings → Storage).

---

### Step 11: File Structure

Your bolt.new project should have this structure:

```
/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── Navigation.tsx
│   │   │   ├── ServiceCreationModal.tsx
│   │   │   ├── BookingWizard.tsx
│   │   │   └── ... (all other components)
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── AuthPage.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── PassengerPortal.tsx
│   │   │   └── ... (all other pages)
│   │   ├── App.tsx
│   │   └── routes.ts
│   ├── lib/
│   │   └── supabase.ts
│   ├── styles/
│   │   ├── theme.css
│   │   └── fonts.css
│   ├── main.tsx
│   └── index.css
├── .env
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

### Step 12: Tailwind Configuration

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        charcoal: '#1A1A1A',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

### Step 13: Import Fonts

Add to your `index.html`:

```html
<head>
  <!-- ... other meta tags ... -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
```

---

## 🔑 Key Migration Checklist

- [ ] Create Supabase project
- [ ] Run all SQL migrations
- [ ] Set up database tables
- [ ] Create RLS policies
- [ ] Create storage bucket for images
- [ ] Update environment variables
- [ ] Replace all API calls with Supabase queries
- [ ] Update routing from `react-router` to `react-router-dom`
- [ ] Update AuthContext to use Supabase directly
- [ ] Test authentication flow
- [ ] Test service creation
- [ ] Test booking flow
- [ ] Test admin dashboard
- [ ] Upload all fonts and assets

---

## 🎨 Design System Tokens

Make sure to include these CSS variables in your `theme.css`:

```css
:root {
  /* Colors */
  --color-gold: #D4AF37;
  --color-black: #000000;
  --color-charcoal: #1A1A1A;
  
  /* Fonts */
  --font-serif: 'Cormorant Garamond', serif;
  --font-sans: 'Montserrat', sans-serif;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Shadows */
  --shadow-gold: 0 0 20px rgba(212, 175, 55, 0.3);
}
```

---

## 🚨 Common Migration Issues

### Issue 1: "Module not found: react-router"
**Solution:** Change all imports from `'react-router'` to `'react-router-dom'`

### Issue 2: Environment variables not working
**Solution:** Make sure you prefix with `VITE_` and restart dev server

### Issue 3: Supabase auth not working
**Solution:** Check that you've created the trigger function for auto-creating user profiles

### Issue 4: RLS blocking queries
**Solution:** Verify your RLS policies and ensure user has correct role in `user_profiles` table

### Issue 5: Images not uploading
**Solution:** Create storage bucket in Supabase and set proper permissions

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Motion (Framer Motion) Docs](https://motion.dev)

---

## 🎯 Testing Your Migration

After migration, test these critical flows:

1. **Auth Flow**
   - Sign up new user
   - Sign in with admin@globa7.com
   - Sign out

2. **Admin Dashboard**
   - Create new service
   - Upload service image
   - Edit service
   - Delete service

3. **Booking Flow**
   - Browse services
   - Create booking
   - View booking status
   - Track ride

4. **Driver Portal**
   - View assigned rides
   - Update ride status
   - Complete ride

---

## 💡 Pro Tips

1. **Use Supabase CLI** for local development
2. **Enable database webhooks** for real-time updates
3. **Set up backup policies** for production data
4. **Use Supabase Edge Functions** if you need custom server logic
5. **Enable email auth** in Supabase settings (currently disabled in Figma Make)

---

## 🆘 Need Help?

If you encounter issues during migration:

1. Check Supabase logs in your dashboard
2. Verify RLS policies are correct
3. Ensure environment variables are set
4. Check browser console for errors
5. Verify auth user exists in `auth.users` table

---

**Good luck with your migration! 🚀**

The Globa7 platform is a beautiful, world-class application that will shine on bolt.new with full database control and flexibility.
