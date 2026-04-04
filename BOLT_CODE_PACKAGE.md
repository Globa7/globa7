# Globa7 - Complete Code Package for bolt.new

## Quick Start Commands

```bash
# 1. Create new Vite + React + TypeScript project
npm create vite@latest globa7-app -- --template react-ts

# 2. Navigate to project
cd globa7-app

# 3. Install dependencies
npm install react-router-dom @supabase/supabase-js motion lucide-react sonner date-fns recharts

# 4. Install dev dependencies
npm install -D tailwindcss@next autoprefixer postcss

# 5. Initialize Tailwind
npx tailwindcss init -p
```

---

## 📁 Complete File Structure

```
globa7-app/
├── public/
├── src/
│   ├── lib/
│   │   └── supabase.ts
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── label.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── ServiceCreationModal.tsx
│   │   │   └── BookingWizard.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── AuthPage.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── App.tsx
│   │   └── routes.ts
│   ├── styles/
│   │   └── theme.css
│   ├── main.tsx
│   └── index.css
├── .env
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 📄 Essential Configuration Files

### `.env`
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### `tailwind.config.js`
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

### `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### `index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Globa7 - Luxury Transportation</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 🎨 Core Files

### `/src/lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'admin' | 'client' | 'driver';
  loyalty_points: number;
  member_since: string;
  preferred_payment_method?: string;
  saved_addresses: any[];
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description?: string;
  base_price: number;
  image_url?: string;
  vehicle_type?: string;
  duration?: string;
  max_passengers?: number;
  highlights?: string[];
  inclusions?: string[];
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  service_id?: string;
  service_name?: string;
  pickup_location?: string;
  dropoff_location?: string;
  pickup_datetime?: string;
  passengers?: number;
  vehicle_type?: string;
  price?: number;
  status: 'pending' | 'confirmed' | 'en-route' | 'arrived' | 'in-progress' | 'completed' | 'cancelled';
  driver_id?: string;
  special_requests?: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}
```

### `/src/styles/theme.css`
```css
@import 'tailwindcss';

:root {
  /* Colors */
  --color-gold: #D4AF37;
  --color-black: #000000;
  --color-charcoal: #1A1A1A;
  --color-gray-dark: #2A2A2A;
  --color-gray: #4A4A4A;
  --color-gray-light: #6A6A6A;
  
  /* Fonts */
  --font-serif: 'Cormorant Garamond', serif;
  --font-sans: 'Montserrat', sans-serif;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-gold: 0 0 20px rgba(212, 175, 55, 0.3);
  --shadow-gold-lg: 0 0 40px rgba(212, 175, 55, 0.4);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
}

/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-black);
  color: white;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);
  font-weight: 600;
  line-height: 1.2;
  color: white;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 0.875rem;
}

h3 {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

/* Custom Utilities */
.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
  color: black;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-gold);
}

.btn-gold:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-gold-lg);
}

.btn-gold:active {
  transform: translateY(0);
}

.text-gold {
  color: var(--color-gold);
}

.bg-charcoal {
  background-color: var(--color-charcoal);
}

.border-gold {
  border-color: var(--color-gold);
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--color-charcoal);
}

::-webkit-scrollbar-thumb {
  background: var(--color-gold);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #F4D03F;
}
```

### `/src/index.css`
```css
@import './styles/theme.css';
```

### `/src/main.tsx`
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### `/src/app/App.tsx`
```typescript
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        theme="dark"
        richColors
        closeButton
      />
    </AuthProvider>
  );
}
```

### `/src/app/routes.ts`
```typescript
import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { PassengerPortal } from './pages/PassengerPortal';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '/portal',
    element: <PassengerPortal />,
  },
]);
```

---

## 🔐 Updated Auth Context (Supabase Direct)

### `/src/app/contexts/AuthContext.tsx`
```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
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
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;

      if (profile) {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          name: profile.name,
          role: profile.role,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string): Promise<User> {
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

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.name,
      role: profile?.role || 'client',
    };

    setUser(user);
    return user;
  }

  async function signUp(email: string, password: string, name: string, phone: string) {
    const { error } = await supabase.auth.signUp({
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

## 🎯 UI Components (Shadcn-style)

### `/src/app/components/ui/button.tsx`
```typescript
import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={className}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
```

### `/src/app/components/ui/input.tsx`
```typescript
import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={className}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### `/src/app/components/ui/label.tsx`
```typescript
import * as React from "react"

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={className}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
```

---

## 🗄️ Service Management (Supabase Direct)

### Example: Creating a Service

```typescript
import { supabase } from '../../lib/supabase';

async function createService(formData: any, imageFile: File | null) {
  // 1. Upload image if provided
  let imageUrl = null;
  
  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `services/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('service-images')
      .upload(filePath, imageFile);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('service-images')
      .getPublicUrl(filePath);

    imageUrl = data.publicUrl;
  }

  // 2. Create service record
  const { data, error } = await supabase
    .from('services')
    .insert([{
      name: formData.name,
      category: formData.category,
      description: formData.description,
      base_price: parseFloat(formData.basePrice),
      image_url: imageUrl,
      vehicle_type: formData.vehicleType,
      duration: formData.duration,
      max_passengers: parseInt(formData.maxPassengers),
      highlights: formData.highlights.split('\n').filter(Boolean),
      inclusions: formData.inclusions.split('\n').filter(Boolean),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### Example: Fetching Services

```typescript
async function fetchServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
```

### Example: Creating a Booking

```typescript
async function createBooking(bookingData: any) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      user_id: user.id,
      ...bookingData,
      status: 'pending',
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

## 📦 Complete package.json

```json
{
  "name": "globa7-luxury-transportation",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
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
    "typescript": "^5.3.3",
    "vite": "^5.1.0",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0"
  }
}
```

---

## 🎬 Getting Started After Setup

```bash
# 1. Start development server
npm run dev

# 2. Open browser to http://localhost:3000

# 3. Login with default admin
# Email: admin@globa7.com
# Password: admin123
```

---

## ✅ Migration Complete!

You now have all the code needed to run Globa7 on bolt.new with full Supabase integration!
