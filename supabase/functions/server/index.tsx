import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { initializeDatabase, resetDatabase } from "./data-initialization.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// Auto-create default admin account on startup
async function ensureDefaultAdmin() {
  try {
    console.log("Checking for default admin account...");
    
    // Check if default admin exists
    const { data: existingUser, error: getUserError } = await supabase.auth.admin.listUsers();
    
    const adminEmail = "admin@globa7.com";
    const adminExists = existingUser?.users?.some(u => u.email === adminEmail);
    
    if (!adminExists) {
      console.log("Creating default admin account: admin@globa7.com");
      
      const { data, error } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: "admin123",
        user_metadata: { name: "Globa7 Administrator" },
        email_confirm: true,
      });
      
      if (error) {
        console.error("Error creating default admin:", error.message);
      } else if (data.user) {
        await kv.set(`user:${data.user.id}:role`, "admin");
        await kv.set(`user:${data.user.id}:profile`, JSON.stringify({
          name: "Globa7 Administrator",
          email: adminEmail,
          phone: "",
          loyaltyPoints: 0,
          memberSince: new Date().toISOString(),
          preferredPaymentMethod: null,
          savedAddresses: [],
        }));
        console.log("✓ Default admin account created successfully");
      }
    } else {
      // Ensure the admin role is set
      const adminUser = existingUser?.users?.find(u => u.email === adminEmail);
      if (adminUser) {
        const role = await kv.get(`user:${adminUser.id}:role`);
        if (role !== "admin") {
          await kv.set(`user:${adminUser.id}:role`, "admin");
          console.log("✓ Admin role set for existing admin@globa7.com account");
        } else {
          console.log("✓ Default admin account already exists");
        }
      }
    }
  } catch (error) {
    console.error("Error in ensureDefaultAdmin:", error);
  }
}

// Run on startup
ensureDefaultAdmin();

// Helper function to authenticate user
async function authenticateUser(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, error: "No authorization header" };
  }

  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { user: null, error: "Invalid token" };
  }

  return { user, error: null };
}

// Helper function to check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  const result = await kv.get(`user:${userId}:role`);
  return result === "admin";
}

// Health check endpoint
app.get("/make-server-12e765ba/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Sign up new user
app.post("/make-server-12e765ba/auth/signup", async (c) => {
  try {
    const { email, password, name, phone } = await c.req.json();

    // Create user with Supabase auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Automatically set admin role for admin@globa7.com or any email containing "admin"
    const role = email.toLowerCase().includes('admin') || email === 'admin@globa7.com' ? 'admin' : 'client';
    await kv.set(`user:${data.user.id}:role`, role);
    
    // Initialize user profile
    await kv.set(`user:${data.user.id}:profile`, JSON.stringify({
      name,
      email,
      phone,
      loyaltyPoints: 0,
      memberSince: new Date().toISOString(),
      preferredPaymentMethod: null,
      savedAddresses: [],
    }));

    console.log(`User created with role: ${role}`);

    return c.json({ 
      message: "User created successfully", 
      userId: data.user.id,
      role: role
    });
  } catch (error) {
    console.log(`Error in signup route: ${error}`);
    return c.json({ error: "Signup failed" }, 500);
  }
});

// Sign in user
app.post("/make-server-12e765ba/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Error during sign in: ${error.message}`);
      return c.json({ error: error.message }, 401);
    }

    // Get user role
    const role = await kv.get(`user:${data.user.id}:role`);
    
    // If role doesn't exist, check if user should be admin and set it
    let userRole = role;
    if (!userRole) {
      // Automatically set admin role for admin@globa7.com or any email containing "admin"
      if (data.user.email.toLowerCase().includes('admin') || data.user.email === 'admin@globa7.com') {
        userRole = 'admin';
        await kv.set(`user:${data.user.id}:role`, 'admin');
      } else {
        userRole = 'client';
      }
    }

    return c.json({
      accessToken: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        role: userRole,
      },
    });
  } catch (error) {
    console.log(`Error in signin route: ${error}`);
    return c.json({ error: "Sign in failed" }, 500);
  }
});

// Get current user session
app.get("/make-server-12e765ba/auth/me", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);

  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const role = await kv.get(`user:${user.id}:role`);
  
  // If role doesn't exist, check if user should be admin and set it
  let userRole = role;
  if (!userRole) {
    // Automatically set admin role for admin@globa7.com or any email containing "admin"
    if (user.email.toLowerCase().includes('admin') || user.email === 'admin@globa7.com') {
      userRole = 'admin';
      await kv.set(`user:${user.id}:role`, 'admin');
    } else {
      userRole = 'client';
    }
  }
  
  const profileData = await kv.get(`user:${user.id}:profile`);
  const profile = profileData ? JSON.parse(profileData) : null;

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name,
      role: userRole,
      profile,
    },
  });
});

// ============================================
// CLIENT ROUTES
// ============================================

// Get user profile
app.get("/make-server-12e765ba/client/profile", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const profileData = await kv.get(`user:${user.id}:profile`);
  const profile = profileData ? JSON.parse(profileData) : null;

  return c.json({ profile });
});

// Update user profile
app.put("/make-server-12e765ba/client/profile", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const updates = await c.req.json();
    const currentData = await kv.get(`user:${user.id}:profile`);
    const currentProfile = currentData ? JSON.parse(currentData) : {};

    const updatedProfile = { ...currentProfile, ...updates };
    await kv.set(`user:${user.id}:profile`, JSON.stringify(updatedProfile));

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log(`Error updating profile: ${error}`);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// Create booking
app.post("/make-server-12e765ba/client/bookings", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const bookingData = await c.req.json();
    const bookingId = `booking:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;

    const booking = {
      id: bookingId,
      userId: user.id,
      ...bookingData,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await kv.set(bookingId, JSON.stringify(booking));
    await kv.set(`user:${user.id}:bookings:${bookingId}`, bookingId);

    // Add to global bookings list
    await kv.set(`global:bookings:${bookingId}`, bookingId);

    return c.json({ booking });
  } catch (error) {
    console.log(`Error creating booking: ${error}`);
    return c.json({ error: "Failed to create booking" }, 500);
  }
});

// Get user bookings
app.get("/make-server-12e765ba/client/bookings", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const bookingKeys = await kv.getByPrefix(`user:${user.id}:bookings:`);
    const bookings = [];

    for (const key of bookingKeys) {
      const bookingId = key.value;
      const bookingData = await kv.get(bookingId);
      if (bookingData) {
        bookings.push(JSON.parse(bookingData));
      }
    }

    // Sort by creation date, newest first
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ bookings });
  } catch (error) {
    console.log(`Error fetching bookings: ${error}`);
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

// Get single booking
app.get("/make-server-12e765ba/client/bookings/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const bookingId = c.req.param("id");
  const bookingData = await kv.get(bookingId);

  if (!bookingData) {
    return c.json({ error: "Booking not found" }, 404);
  }

  const booking = JSON.parse(bookingData);

  // Verify booking belongs to user
  if (booking.userId !== user.id) {
    return c.json({ error: "Forbidden" }, 403);
  }

  return c.json({ booking });
});

// Save address
app.post("/make-server-12e765ba/client/addresses", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const addressData = await c.req.json();
    const currentData = await kv.get(`user:${user.id}:profile`);
    const profile = currentData ? JSON.parse(currentData) : {};

    const addressId = `addr:${Date.now()}`;
    const newAddress = { id: addressId, ...addressData };

    profile.savedAddresses = profile.savedAddresses || [];
    profile.savedAddresses.push(newAddress);

    await kv.set(`user:${user.id}:profile`, JSON.stringify(profile));

    return c.json({ address: newAddress });
  } catch (error) {
    console.log(`Error saving address: ${error}`);
    return c.json({ error: "Failed to save address" }, 500);
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

// Get all bookings (admin only)
app.get("/make-server-12e765ba/admin/bookings", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const bookingKeys = await kv.getByPrefix("global:bookings:");
    const bookings = [];

    for (const key of bookingKeys) {
      const bookingId = key.value;
      const bookingData = await kv.get(bookingId);
      if (bookingData) {
        bookings.push(JSON.parse(bookingData));
      }
    }

    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ bookings });
  } catch (error) {
    console.log(`Error fetching all bookings: ${error}`);
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

// Update booking status (admin only)
app.put("/make-server-12e765ba/admin/bookings/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const bookingId = c.req.param("id");
    const updates = await c.req.json();

    const bookingData = await kv.get(bookingId);
    if (!bookingData) {
      return c.json({ error: "Booking not found" }, 404);
    }

    const booking = JSON.parse(bookingData);
    const updatedBooking = { ...booking, ...updates, updatedAt: new Date().toISOString() };

    await kv.set(bookingId, JSON.stringify(updatedBooking));

    return c.json({ booking: updatedBooking });
  } catch (error) {
    console.log(`Error updating booking: ${error}`);
    return c.json({ error: "Failed to update booking" }, 500);
  }
});

// Get pricing configuration (admin only)
app.get("/make-server-12e765ba/admin/pricing", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  const pricingData = await kv.get("admin:pricing");
  const pricing = pricingData ? JSON.parse(pricingData) : getDefaultPricing();

  return c.json({ pricing });
});

// Update pricing (admin only)
app.put("/make-server-12e765ba/admin/pricing", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const pricing = await c.req.json();
    await kv.set("admin:pricing", JSON.stringify(pricing));

    return c.json({ pricing });
  } catch (error) {
    console.log(`Error updating pricing: ${error}`);
    return c.json({ error: "Failed to update pricing" }, 500);
  }
});

// Get service bundles
app.get("/make-server-12e765ba/admin/bundles", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const bundleKeys = await kv.getByPrefix("admin:bundle:");
    const bundles = [];

    for (const key of bundleKeys) {
      const bundleData = await kv.get(key.key);
      if (bundleData) {
        bundles.push(JSON.parse(bundleData));
      }
    }

    return c.json({ bundles });
  } catch (error) {
    console.log(`Error fetching bundles: ${error}`);
    return c.json({ error: "Failed to fetch bundles" }, 500);
  }
});

// Create service bundle
app.post("/make-server-12e765ba/admin/bundles", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const bundleData = await c.req.json();
    const bundleId = `admin:bundle:${Date.now()}`;

    const bundle = {
      id: bundleId,
      ...bundleData,
      createdAt: new Date().toISOString(),
    };

    await kv.set(bundleId, JSON.stringify(bundle));

    return c.json({ bundle });
  } catch (error) {
    console.log(`Error creating bundle: ${error}`);
    return c.json({ error: "Failed to create bundle" }, 500);
  }
});

// Update bundle
app.put("/make-server-12e765ba/admin/bundles/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const bundleId = c.req.param("id");
    const updates = await c.req.json();

    const bundleData = await kv.get(bundleId);
    if (!bundleData) {
      return c.json({ error: "Bundle not found" }, 404);
    }

    const bundle = JSON.parse(bundleData);
    const updatedBundle = { ...bundle, ...updates, updatedAt: new Date().toISOString() };

    await kv.set(bundleId, JSON.stringify(updatedBundle));

    return c.json({ bundle: updatedBundle });
  } catch (error) {
    console.log(`Error updating bundle: ${error}`);
    return c.json({ error: "Failed to update bundle" }, 500);
  }
});

// Delete bundle
app.delete("/make-server-12e765ba/admin/bundles/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const bundleId = c.req.param("id");
    await kv.del(bundleId);

    return c.json({ message: "Bundle deleted successfully" });
  } catch (error) {
    console.log(`Error deleting bundle: ${error}`);
    return c.json({ error: "Failed to delete bundle" }, 500);
  }
});

// Get drivers
app.get("/make-server-12e765ba/admin/drivers", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const driverKeys = await kv.getByPrefix("admin:driver:");
    const drivers = [];

    for (const key of driverKeys) {
      const driverData = await kv.get(key.key);
      if (driverData) {
        drivers.push(JSON.parse(driverData));
      }
    }

    return c.json({ drivers });
  } catch (error) {
    console.log(`Error fetching drivers: ${error}`);
    return c.json({ error: "Failed to fetch drivers" }, 500);
  }
});

// Create driver
app.post("/make-server-12e765ba/admin/drivers", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const driverData = await c.req.json();
    const driverId = `admin:driver:${Date.now()}`;

    const driver = {
      id: driverId,
      ...driverData,
      createdAt: new Date().toISOString(),
    };

    await kv.set(driverId, JSON.stringify(driver));

    return c.json({ driver });
  } catch (error) {
    console.log(`Error creating driver: ${error}`);
    return c.json({ error: "Failed to create driver" }, 500);
  }
});

// Update driver
app.put("/make-server-12e765ba/admin/drivers/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const driverId = c.req.param("id");
    const updates = await c.req.json();

    const driverData = await kv.get(driverId);
    if (!driverData) {
      return c.json({ error: "Driver not found" }, 404);
    }

    const driver = JSON.parse(driverData);
    const updatedDriver = { ...driver, ...updates, updatedAt: new Date().toISOString() };

    await kv.set(driverId, JSON.stringify(updatedDriver));

    return c.json({ driver: updatedDriver });
  } catch (error) {
    console.log(`Error updating driver: ${error}`);
    return c.json({ error: "Failed to update driver" }, 500);
  }
});

// Delete driver
app.delete("/make-server-12e765ba/admin/drivers/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const driverId = c.req.param("id");
    await kv.del(driverId);

    return c.json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.log(`Error deleting driver: ${error}`);
    return c.json({ error: "Failed to delete driver" }, 500);
  }
});

// Get analytics dashboard data
app.get("/make-server-12e765ba/admin/analytics", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const bookingKeys = await kv.getByPrefix("global:bookings:");
    const bookings = [];

    for (const key of bookingKeys) {
      const bookingId = key.value;
      const bookingData = await kv.get(bookingId);
      if (bookingData) {
        bookings.push(JSON.parse(bookingData));
      }
    }

    // Calculate analytics
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0);
    const pendingBookings = bookings.filter(b => b.status === "pending").length;
    const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
    const completedBookings = bookings.filter(b => b.status === "completed").length;

    return c.json({
      analytics: {
        totalBookings,
        totalRevenue,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        recentBookings: bookings.slice(0, 10),
      },
    });
  } catch (error) {
    console.log(`Error fetching analytics: ${error}`);
    return c.json({ error: "Failed to fetch analytics" }, 500);
  }
});

// Promote user to admin (requires existing admin or special setup)
app.post("/make-server-12e765ba/admin/promote-user", async (c) => {
  try {
    const { userId, email, secretKey } = await c.req.json();
    
    // For initial setup, allow promotion with a secret key or if user email contains admin
    const isInitialSetup = secretKey === 'globa7-initial-setup-2024' || email?.toLowerCase().includes('admin');
    
    if (!isInitialSetup) {
      const { user, error } = await authenticateUser(c.req.raw);
      if (error || !user) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const userIsAdmin = await isAdmin(user.id);
      if (!userIsAdmin) {
        return c.json({ error: "Forbidden - Admin access required" }, 403);
      }
    }

    // If email provided, find user by email
    let targetUserId = userId;
    if (email && !userId) {
      // In a real system, you'd look up user by email
      // For now, we'll just update based on the current authenticated user if they have admin email
      const { user } = await authenticateUser(c.req.raw);
      if (user && user.email?.toLowerCase().includes('admin')) {
        targetUserId = user.id;
      }
    }

    if (!targetUserId) {
      return c.json({ error: "User ID required" }, 400);
    }

    await kv.set(`user:${targetUserId}:role`, "admin");
    
    return c.json({ 
      message: "User promoted to admin successfully",
      userId: targetUserId 
    });
  } catch (error) {
    console.log(`Error promoting user: ${error}`);
    return c.json({ error: "Failed to promote user" }, 500);
  }
});

// ============================================
// DATABASE MANAGEMENT ROUTES (Admin only)
// ============================================

// Initialize database with default data
app.post("/make-server-12e765ba/admin/init-database", async (c) => {
  try {
    const result = await initializeDatabase();
    return c.json(result);
  } catch (error) {
    console.log(`Error initializing database: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Reset database (clear all data)
app.post("/make-server-12e765ba/admin/reset-database", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const result = await resetDatabase();
    return c.json(result);
  } catch (error) {
    console.log(`Error resetting database: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ============================================
// AFFILIATE DRIVER MANAGEMENT
// ============================================

// Generate affiliate invitation link
app.post("/make-server-12e765ba/admin/generate-affiliate-invite", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const inviteCode = crypto.randomUUID();
    const inviteData = {
      code: inviteCode,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      used: false,
    };
    
    await kv.set(`affiliate_invite:${inviteCode}`, JSON.stringify(inviteData));
    
    // Generate the full invite URL
    const inviteUrl = `${c.req.header('origin') || 'https://your-domain.com'}/driver-application?invite=${inviteCode}`;
    
    return c.json({ 
      success: true,
      inviteCode,
      inviteUrl,
      expiresAt: inviteData.expiresAt,
    });
  } catch (error) {
    console.log(`Error generating affiliate invite: ${error}`);
    return c.json({ error: "Failed to generate invite" }, 500);
  }
});

// Verify affiliate invite code
app.get("/make-server-12e765ba/affiliate/verify-invite/:code", async (c) => {
  const code = c.req.param('code');
  
  try {
    const inviteData = await kv.get(`affiliate_invite:${code}`);
    
    if (!inviteData) {
      return c.json({ valid: false, error: "Invalid invite code" }, 404);
    }
    
    const invite = JSON.parse(inviteData);
    
    if (invite.used) {
      return c.json({ valid: false, error: "Invite code already used" }, 400);
    }
    
    if (new Date(invite.expiresAt) < new Date()) {
      return c.json({ valid: false, error: "Invite code expired" }, 400);
    }
    
    return c.json({ valid: true, invite });
  } catch (error) {
    console.log(`Error verifying invite: ${error}`);
    return c.json({ error: "Failed to verify invite" }, 500);
  }
});

// Submit affiliate driver application
app.post("/make-server-12e765ba/affiliate/submit-application", async (c) => {
  try {
    const applicationData = await c.req.json();
    
    // Verify invite code
    const inviteData = await kv.get(`affiliate_invite:${applicationData.inviteCode}`);
    if (!inviteData) {
      return c.json({ error: "Invalid invite code" }, 400);
    }
    
    const invite = JSON.parse(inviteData);
    if (invite.used || new Date(invite.expiresAt) < new Date()) {
      return c.json({ error: "Invalid or expired invite code" }, 400);
    }
    
    // Generate application ID
    const appId = `affiliate_app:${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;
    
    const application = {
      id: appId,
      ...applicationData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Save application
    await kv.set(appId, JSON.stringify(application));
    
    // Mark invite as used
    invite.used = true;
    invite.usedBy = applicationData.email;
    invite.usedAt = new Date().toISOString();
    await kv.set(`affiliate_invite:${applicationData.inviteCode}`, JSON.stringify(invite));
    
    return c.json({ 
      success: true, 
      applicationId: appId,
      message: "Application submitted successfully" 
    });
  } catch (error) {
    console.log(`Error submitting application: ${error}`);
    return c.json({ error: "Failed to submit application" }, 500);
  }
});

// Get all affiliate applications (Admin only)
app.get("/make-server-12e765ba/admin/affiliate-applications", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const appKeys = await kv.getByPrefix("affiliate_app:");
    const applications = [];
    
    for (const key of appKeys) {
      const appData = await kv.get(key.key);
      if (appData) {
        applications.push(JSON.parse(appData));
      }
    }
    
    // Sort by date (newest first)
    applications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ applications });
  } catch (error) {
    console.log(`Error fetching applications: ${error}`);
    return c.json({ error: "Failed to fetch applications" }, 500);
  }
});

// Update affiliate application status (Admin only)
app.post("/make-server-12e765ba/admin/affiliate-applications/:id/status", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  const appId = c.req.param('id');
  const { status, reviewNotes, rejectionReason } = await c.req.json();

  try {
    const appData = await kv.get(appId);
    if (!appData) {
      return c.json({ error: "Application not found" }, 404);
    }
    
    const application = JSON.parse(appData);
    application.status = status;
    application.reviewNotes = reviewNotes;
    application.reviewedBy = user.id;
    application.reviewedAt = new Date().toISOString();
    application.updatedAt = new Date().toISOString();
    
    if (status === 'approved') {
      application.approvedAt = new Date().toISOString();
      
      // Create driver profile from application
      const driverId = `driver:${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;
      const driver = {
        id: driverId,
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        licenseNumber: application.licenseNumber,
        licenseExpiry: application.licenseExpiry,
        cdlClass: application.cdlClass,
        certifications: [],
        status: 'active',
        rating: 5.0,
        totalTrips: 0,
        totalRevenue: 0,
        yearsOfExperience: 0,
        schedule: [],
        hireDate: new Date().toISOString(),
        dateOfBirth: application.dateOfBirth,
        backgroundCheckDate: application.backgroundCheckDate || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileImageUrl: application.documents.profilePhoto,
        languages: ['English'],
        // Affiliate-specific fields
        isAffiliate: true,
        affiliateId: appId,
        commissionRate: application.commissionRate || 70,
        totalEarnings: 0,
        pendingPayout: 0,
        joinedDate: new Date().toISOString(),
      };
      
      await kv.set(driverId, JSON.stringify(driver));
      application.driverId = driverId;
    } else if (status === 'rejected') {
      application.rejectedAt = new Date().toISOString();
      application.rejectionReason = rejectionReason;
    }
    
    await kv.set(appId, JSON.stringify(application));
    
    return c.json({ success: true, application });
  } catch (error) {
    console.log(`Error updating application: ${error}`);
    return c.json({ error: "Failed to update application" }, 500);
  }
});

// ============================================
// PRICING MANAGEMENT
// ============================================

// Update pricing (Admin only)
app.post("/make-server-12e765ba/admin/pricing", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const pricingData = await c.req.json();
    pricingData.updatedAt = new Date().toISOString();
    pricingData.updatedBy = user.id;
    
    await kv.set("pricing:global", JSON.stringify(pricingData));
    
    return c.json({ success: true, pricing: pricingData });
  } catch (error) {
    console.log(`Error updating pricing: ${error}`);
    return c.json({ error: "Failed to update pricing" }, 500);
  }
});

// ============================================
// VEHICLE MANAGEMENT
// ============================================

// Add new vehicle (Admin only)
app.post("/make-server-12e765ba/admin/vehicles", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const vehicleData = await c.req.json();
    const vehicleId = `vehicle:${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;
    
    const vehicle = {
      id: vehicleId,
      ...vehicleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(vehicleId, JSON.stringify(vehicle));
    
    return c.json({ success: true, vehicle });
  } catch (error) {
    console.log(`Error adding vehicle: ${error}`);
    return c.json({ error: "Failed to add vehicle" }, 500);
  }
});

// Update vehicle (Admin only)
app.put("/make-server-12e765ba/admin/vehicles/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  const vehicleId = c.req.param('id');

  try {
    const existingData = await kv.get(vehicleId);
    if (!existingData) {
      return c.json({ error: "Vehicle not found" }, 404);
    }
    
    const vehicleData = await c.req.json();
    const vehicle = {
      ...JSON.parse(existingData),
      ...vehicleData,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(vehicleId, JSON.stringify(vehicle));
    
    return c.json({ success: true, vehicle });
  } catch (error) {
    console.log(`Error updating vehicle: ${error}`);
    return c.json({ error: "Failed to update vehicle" }, 500);
  }
});

// Delete vehicle (Admin only)
app.delete("/make-server-12e765ba/admin/vehicles/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  const vehicleId = c.req.param('id');

  try {
    await kv.del(vehicleId);
    return c.json({ success: true, message: "Vehicle deleted" });
  } catch (error) {
    console.log(`Error deleting vehicle: ${error}`);
    return c.json({ error: "Failed to delete vehicle" }, 500);
  }
});

// ============================================
// SERVICE BUNDLE MANAGEMENT
// ============================================

// Add new bundle (Admin only)
app.post("/make-server-12e765ba/admin/bundles", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const bundleData = await c.req.json();
    const bundleId = `bundle:${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;
    
    const bundle = {
      id: bundleId,
      ...bundleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      popularityScore: 0,
      totalSales: 0,
    };
    
    await kv.set(bundleId, JSON.stringify(bundle));
    
    return c.json({ success: true, bundle });
  } catch (error) {
    console.log(`Error adding bundle: ${error}`);
    return c.json({ error: "Failed to add bundle" }, 500);
  }
});

// Update bundle (Admin only)
app.put("/make-server-12e765ba/admin/bundles/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  const bundleId = c.req.param('id');

  try {
    const existingData = await kv.get(bundleId);
    if (!existingData) {
      return c.json({ error: "Bundle not found" }, 404);
    }
    
    const bundleData = await c.req.json();
    const bundle = {
      ...JSON.parse(existingData),
      ...bundleData,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(bundleId, JSON.stringify(bundle));
    
    return c.json({ success: true, bundle });
  } catch (error) {
    console.log(`Error updating bundle: ${error}`);
    return c.json({ error: "Failed to update bundle" }, 500);
  }
});

// Delete bundle (Admin only)
app.delete("/make-server-12e765ba/admin/bundles/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  const bundleId = c.req.param('id');

  try {
    await kv.del(bundleId);
    return c.json({ success: true, message: "Bundle deleted" });
  } catch (error) {
    console.log(`Error deleting bundle: ${error}`);
    return c.json({ error: "Failed to delete bundle" }, 500);
  }
});

// Get all vehicles (public endpoint for booking form)
app.get("/make-server-12e765ba/vehicles", async (c) => {
  try {
    const vehicleKeys = await kv.getByPrefix("vehicle:");
    const vehicles = [];

    for (const key of vehicleKeys) {
      const vehicleData = await kv.get(key.key);
      if (vehicleData) {
        const vehicle = JSON.parse(vehicleData);
        if (vehicle.status === 'available') {
          vehicles.push(vehicle);
        }
      }
    }

    return c.json({ vehicles });
  } catch (error) {
    console.log(`Error fetching vehicles: ${error}`);
    return c.json({ error: "Failed to fetch vehicles" }, 500);
  }
});

// Get service bundles (public endpoint)
app.get("/make-server-12e765ba/bundles", async (c) => {
  try {
    const bundleKeys = await kv.getByPrefix("bundle:");
    const bundles = [];

    for (const key of bundleKeys) {
      const bundleData = await kv.get(key.key);
      if (bundleData) {
        const bundle = JSON.parse(bundleData);
        if (bundle.isActive) {
          bundles.push(bundle);
        }
      }
    }

    return c.json({ bundles });
  } catch (error) {
    console.log(`Error fetching bundles: ${error}`);
    return c.json({ error: "Failed to fetch bundles" }, 500);
  }
});

// Get pricing (public endpoint for quote calculator)
app.get("/make-server-12e765ba/pricing", async (c) => {
  try {
    const pricingData = await kv.get("pricing:global");
    const pricing = pricingData ? JSON.parse(pricingData) : getDefaultPricing();
    return c.json({ pricing });
  } catch (error) {
    console.log(`Error fetching pricing: ${error}`);
    return c.json({ error: "Failed to fetch pricing" }, 500);
  }
});

// Helper function for default pricing
function getDefaultPricing() {
  return {
    baseRates: {
      sedan: 75,
      suv: 95,
      luxury: 150,
      sprinter: 200,
    },
    zones: {
      airport: 1.0,
      downtown: 1.1,
      uptown: 1.15,
      westBank: 1.2,
    },
    timeMultipliers: {
      peakHours: 1.25,
      lateNight: 1.35,
      weekends: 1.15,
      holidays: 1.5,
    },
  };
}

// ============================================
// SERVICE MANAGEMENT ROUTES
// ============================================

// Create new service
app.post("/make-server-12e765ba/admin/services", async (c) => {
  try {
    const { user, error } = await authenticateUser(c.req.raw);
    
    if (error || !user) {
      console.log(`Service creation - Auth error: ${error || 'No user'}`);
      return c.json({ success: false, error: `Unauthorized: ${error || 'No user'}` }, 401);
    }

    console.log(`Service creation attempt by user: ${user.id}, email: ${user.email}`);
    
    const userIsAdmin = await isAdmin(user.id);
    console.log(`User ${user.id} admin status: ${userIsAdmin}`);
    
    if (!userIsAdmin) {
      return c.json({ success: false, error: "Forbidden - Admin access required. Please log in with an admin account." }, 403);
    }

    const serviceData = await c.req.json();
    console.log(`Service data received:`, { name: serviceData.name, category: serviceData.category });
    
    const serviceId = `service:${crypto.randomUUID()}`;
    
    const service = {
      id: serviceId,
      ...serviceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.id,
    };

    await kv.set(serviceId, JSON.stringify(service));

    console.log(`✓ Service created successfully: ${serviceId} - ${service.name}`);
    return c.json({ success: true, service, serviceId });
  } catch (error) {
    console.log(`✗ Error creating service: ${error}`);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.json({ success: false, error: `Failed to create service: ${errorMessage}` }, 500);
  }
});

// Get all services (public - no auth required)
app.get("/make-server-12e765ba/services", async (c) => {
  try {
    const servicesData = await kv.getByPrefix("service:");
    const services = servicesData
      .map((data: string) => JSON.parse(data))
      .filter((service: any) => service.isActive) // Only return active services
      .sort((a: any, b: any) => {
        // Featured services first
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        // Then by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    return c.json({ success: true, services });
  } catch (error) {
    console.log(`Error fetching services: ${error}`);
    return c.json({ success: false, error: "Failed to fetch services" }, 500);
  }
});

// Get single service by ID (public)
app.get("/make-server-12e765ba/services/:id", async (c) => {
  try {
    const serviceId = c.req.param("id");
    const serviceData = await kv.get(serviceId);
    
    if (!serviceData) {
      return c.json({ error: "Service not found" }, 404);
    }

    const service = JSON.parse(serviceData);
    return c.json({ success: true, service });
  } catch (error) {
    console.log(`Error fetching service: ${error}`);
    return c.json({ success: false, error: "Failed to fetch service" }, 500);
  }
});

// Update service
app.put("/make-server-12e765ba/admin/services/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const serviceId = c.req.param("id");
    const updates = await c.req.json();

    const serviceData = await kv.get(serviceId);
    if (!serviceData) {
      return c.json({ error: "Service not found" }, 404);
    }

    const service = JSON.parse(serviceData);
    const updatedService = {
      ...service,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id,
    };

    await kv.set(serviceId, JSON.stringify(updatedService));

    console.log(`Service updated: ${serviceId}`);
    return c.json({ success: true, service: updatedService });
  } catch (error) {
    console.log(`Error updating service: ${error}`);
    return c.json({ success: false, error: "Failed to update service" }, 500);
  }
});

// Delete service
app.delete("/make-server-12e765ba/admin/services/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const serviceId = c.req.param("id");
    await kv.del(serviceId);

    console.log(`Service deleted: ${serviceId}`);
    return c.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.log(`Error deleting service: ${error}`);
    return c.json({ success: false, error: "Failed to delete service" }, 500);
  }
});

// ============================================
// BOOKING ROUTES
// ============================================

// Create booking
app.post("/make-server-12e765ba/bookings", async (c) => {
  try {
    const bookingData = await c.req.json();
    const bookingId = `booking:${crypto.randomUUID()}`;
    
    const booking = {
      id: bookingId,
      ...bookingData,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(bookingId, JSON.stringify(booking));

    console.log(`Booking created: ${bookingId}`);
    return c.json({ success: true, booking, bookingId });
  } catch (error) {
    console.log(`Error creating booking: ${error}`);
    return c.json({ success: false, error: "Failed to create booking" }, 500);
  }
});

// ============================================
// WEBSITE BUILDER ROUTES (Admin only)
// ============================================

// Ensure storage buckets exist on startup
async function ensureStorageBucket() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    // Website images bucket
    const websiteBucketName = 'make-12e765ba-website-images';
    const websiteBucketExists = buckets?.some(bucket => bucket.name === websiteBucketName);
    
    if (!websiteBucketExists) {
      await supabase.storage.createBucket(websiteBucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      console.log(`✓ Created storage bucket: ${websiteBucketName}`);
    }

    // Vehicle images bucket
    const vehicleBucketName = 'make-12e765ba-vehicles';
    const vehicleBucketExists = buckets?.some(bucket => bucket.name === vehicleBucketName);
    
    if (!vehicleBucketExists) {
      await supabase.storage.createBucket(vehicleBucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      console.log(`✓ Created storage bucket: ${vehicleBucketName}`);
    }
  } catch (error) {
    console.error("Error ensuring storage buckets:", error);
  }
}

// Run on startup
ensureStorageBucket();

// Get all uploaded images
app.get("/make-server-12e765ba/admin/images", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const images = await kv.getByPrefix("website:image:");
    return c.json({ images: images || [] });
  } catch (error) {
    console.log(`Error fetching images: ${error}`);
    return c.json({ error: "Failed to fetch images" }, 500);
  }
});

// Upload image metadata (actual file is uploaded to Supabase Storage client-side)
app.post("/make-server-12e765ba/admin/images", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const { url, name, size } = await c.req.json();
    const imageId = `website:image:${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const imageData = {
      id: imageId,
      url,
      name,
      size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user.id,
    };

    await kv.set(imageId, JSON.stringify(imageData));
    
    return c.json({ success: true, image: imageData });
  } catch (error) {
    console.log(`Error saving image metadata: ${error}`);
    return c.json({ error: "Failed to save image" }, 500);
  }
});

// Delete image
app.delete("/make-server-12e765ba/admin/images/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const imageId = c.req.param("id");
    await kv.del(`website:image:${imageId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting image: ${error}`);
    return c.json({ error: "Failed to delete image" }, 500);
  }
});

// Upload vehicle image
app.post("/make-server-12e765ba/admin/vehicles/upload-image", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    // First, ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const vehicleBucketName = 'make-12e765ba-vehicles';
    const bucketExists = buckets?.some(bucket => bucket.name === vehicleBucketName);
    
    if (!bucketExists) {
      console.log("Bucket doesn't exist, creating now...");
      const { error: createError } = await supabase.storage.createBucket(vehicleBucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (createError) {
        console.error("Error creating bucket:", createError);
        return c.json({ error: `Bucket creation failed: ${createError.message}` }, 500);
      }
      console.log(`✓ Created storage bucket: ${vehicleBucketName}`);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error("No file in formData");
      return c.json({ error: "No file provided" }, 400);
    }

    console.log("File received:", file.name, file.type, file.size);

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `vehicle-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `vehicles/${fileName}`;

    // Convert file to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    console.log("Uploading to:", filePath);

    // Upload to Supabase Storage using service role
    const { data, error: uploadError } = await supabase.storage
      .from('make-12e765ba-vehicles')
      .upload(filePath, uint8Array, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return c.json({ error: `Upload failed: ${uploadError.message}` }, 500);
    }

    console.log("Upload successful:", data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('make-12e765ba-vehicles')
      .getPublicUrl(filePath);

    console.log("Public URL:", urlData.publicUrl);

    return c.json({ success: true, url: urlData.publicUrl });
  } catch (error) {
    console.error(`Error uploading vehicle image:`, error);
    return c.json({ error: `Failed to upload image: ${error.message || error}` }, 500);
  }
});

// Upload image to gallery with category
app.post("/make-server-12e765ba/admin/vehicles/upload-to-gallery", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    
    if (!file) {
      console.error("No file in formData");
      return c.json({ error: "No file provided" }, 400);
    }

    if (!category) {
      console.error("No category provided");
      return c.json({ error: "No category provided" }, 400);
    }

    console.log("File received:", file.name, file.type, file.size);
    console.log("Category:", category);

    // Determine bucket name based on category
    const bucketName = `make-12e765ba-${category}`;
    
    // Check if bucket exists, create if not
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Bucket doesn't exist, creating: ${bucketName}`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (createError) {
        console.error("Error creating bucket:", createError);
        return c.json({ error: `Bucket creation failed: ${createError.message}` }, 500);
      }
      console.log(`✓ Created storage bucket: ${bucketName}`);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${category}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Convert file to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    console.log("Uploading to bucket:", bucketName, "File:", fileName);

    // Upload to Supabase Storage using service role
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return c.json({ error: `Upload failed: ${uploadError.message}` }, 500);
    }

    console.log("Upload successful:", data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log("Public URL:", urlData.publicUrl);

    return c.json({ 
      success: true, 
      url: urlData.publicUrl,
      bucket: bucketName,
      fileName: fileName
    });
  } catch (error) {
    console.error(`Error uploading to gallery:`, error);
    return c.json({ error: `Failed to upload image: ${error.message || error}` }, 500);
  }
});

// List all vehicle images from storage
app.get("/make-server-12e765ba/admin/vehicles/images", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    // Get all buckets
    const { data: buckets, error: listBucketsError } = await supabase.storage.listBuckets();
    
    if (listBucketsError) {
      console.error("Error listing buckets:", listBucketsError);
      return c.json({ error: `Failed to list buckets: ${listBucketsError.message}` }, 500);
    }

    const vehicleBuckets = buckets?.filter(bucket => 
      bucket.name.startsWith('make-12e765ba-') && 
      (bucket.name.includes('vehicle') || bucket.name.includes('passenger') || 
       bucket.name.includes('sprinter') || bucket.name.includes('coach') || 
       bucket.name.includes('minibus') || bucket.name.toLowerCase().includes('cadillac'))
    ) || [];

    console.log('Found vehicle buckets:', vehicleBuckets.map(b => b.name));

    const allImages: any[] = [];

    // List files from each bucket
    for (const bucket of vehicleBuckets) {
      const { data: files, error: listError } = await supabase.storage
        .from(bucket.name)
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

      if (listError) {
        console.error(`Error listing files from ${bucket.name}:`, listError);
        continue;
      }

      if (files) {
        for (const file of files) {
          // Try to get signed URL for private buckets, fallback to public URL
          const { data: signedUrlData, error: signedError } = await supabase.storage
            .from(bucket.name)
            .createSignedUrl(file.name, 60 * 60 * 24 * 7); // 7 days

          let imageUrl;
          if (signedUrlData && !signedError) {
            imageUrl = signedUrlData.signedUrl;
          } else {
            // Fallback to public URL
            const { data: urlData } = supabase.storage
              .from(bucket.name)
              .getPublicUrl(file.name);
            imageUrl = urlData.publicUrl;
          }

          allImages.push({
            name: file.name,
            url: imageUrl,
            bucket: bucket.name,
            size: file.metadata?.size || 0,
            createdAt: file.created_at,
          });
        }
      }
    }

    console.log(`Returning ${allImages.length} images from vehicle buckets`);
    return c.json({ success: true, images: allImages });
  } catch (error) {
    console.error(`Error listing vehicle images:`, error);
    return c.json({ error: `Failed to list images: ${error.message || error}` }, 500);
  }
});

// Get all carousels
app.get("/make-server-12e765ba/admin/carousels", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const carousels = await kv.getByPrefix("website:carousel:");
    return c.json({ carousels: carousels || [] });
  } catch (error) {
    console.log(`Error fetching carousels: ${error}`);
    return c.json({ error: "Failed to fetch carousels" }, 500);
  }
});

// Create carousel
app.post("/make-server-12e765ba/admin/carousels", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const carouselData = await c.req.json();
    const carouselId = `website:carousel:${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const carousel = {
      id: carouselId,
      ...carouselData,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    };

    await kv.set(carouselId, JSON.stringify(carousel));
    
    return c.json({ success: true, carousel });
  } catch (error) {
    console.log(`Error creating carousel: ${error}`);
    return c.json({ error: "Failed to create carousel" }, 500);
  }
});

// Update carousel
app.put("/make-server-12e765ba/admin/carousels/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const carouselId = c.req.param("id");
    const updates = await c.req.json();
    
    const existing = await kv.get(`website:carousel:${carouselId}`);
    if (!existing) {
      return c.json({ error: "Carousel not found" }, 404);
    }

    const carousel = {
      ...JSON.parse(existing),
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`website:carousel:${carouselId}`, JSON.stringify(carousel));
    
    return c.json({ success: true, carousel });
  } catch (error) {
    console.log(`Error updating carousel: ${error}`);
    return c.json({ error: "Failed to update carousel" }, 500);
  }
});

// Delete carousel
app.delete("/make-server-12e765ba/admin/carousels/:id", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const carouselId = c.req.param("id");
    await kv.del(`website:carousel:${carouselId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting carousel: ${error}`);
    return c.json({ error: "Failed to delete carousel" }, 500);
  }
});

// Get page content
app.get("/make-server-12e765ba/admin/page-content", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const pageContentData = await kv.get("website:page-content");
    const sections = pageContentData ? JSON.parse(pageContentData) : [];
    
    return c.json({ sections });
  } catch (error) {
    console.log(`Error fetching page content: ${error}`);
    return c.json({ error: "Failed to fetch page content" }, 500);
  }
});

// Save page content
app.post("/make-server-12e765ba/admin/page-content", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  if (error || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  try {
    const { sections } = await c.req.json();
    
    await kv.set("website:page-content", JSON.stringify(sections));
    
    return c.json({ success: true, sections });
  } catch (error) {
    console.log(`Error saving page content: ${error}`);
    return c.json({ error: "Failed to save page content" }, 500);
  }
});

Deno.serve(app.fetch);