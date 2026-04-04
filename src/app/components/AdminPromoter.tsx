import { ShieldCheck, Crown, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { supabase } from '../../../utils/supabase/client';
import { motion } from 'motion/react';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-12e765ba`;

export function AdminPromoter() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setChecking(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      });

      const data = await response.json();
      setIsAdmin(data.user?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setChecking(false);
    }
  };

  const promoteToAdmin = async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Try to promote using the special endpoint
      const response = await fetch(`${API_BASE}/admin/promote-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          secretKey: 'globa7-initial-setup-2024',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('✅ You are now an admin!');
        setIsAdmin(true);
        // Refresh the page to update auth context
        window.location.reload();
      } else {
        toast.error(data.error || 'Failed to promote to admin');
      }
    } catch (error) {
      console.error('Error promoting to admin:', error);
      toast.error('Failed to promote to admin');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-charcoal border border-gold/20 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2">
            <motion.div
              className="h-4 w-4 border-2 border-gold border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-sm">Checking admin status...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-charcoal border border-gold/30 rounded-lg p-4 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-3">
          <Crown className={`h-5 w-5 ${isAdmin ? 'text-gold' : 'text-gray-400'}`} />
          <div>
            <h3 className="text-white font-semibold text-sm">Admin Access</h3>
            <p className="text-gray-400 text-xs">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={isAdmin ? 'bg-green-500' : 'bg-gray-600'}>
            {isAdmin ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Admin
              </>
            ) : (
              <>
                <X className="h-3 w-3 mr-1" />
                Not Admin
              </>
            )}
          </Badge>

          {!isAdmin && (
            <Button
              size="sm"
              onClick={promoteToAdmin}
              disabled={loading}
              className="bg-gold text-black hover:bg-gold/90 text-xs h-7"
            >
              {loading ? (
                <motion.div
                  className="h-3 w-3 border-2 border-black border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                'Make Me Admin'
              )}
            </Button>
          )}
        </div>

        {isAdmin && (
          <p className="text-xs text-green-400 mt-2">✓ You can create services now!</p>
        )}
      </motion.div>
    </div>
  );
}