import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import '../login.css'; // Re-use login styles

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; success?: string }>
}) {
  const resetPassword = async (formData: FormData) => {
    'use server';
    const email = formData.get('email') as string;
    
    if (!email) {
      return redirect('/admin/login/reset-password?message=Email is required');
    }

    const supabase = await createClient();
    
    // Get headers to determine the origin dynamically
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const origin = `${protocol}://${host}`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/api/auth/callback?redirect_to=/admin/login/update-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      return redirect(`/admin/login/reset-password?message=Could not send reset email. Try again.`);
    }

    return redirect(`/admin/login/reset-password?success=Check your email for the password reset link!`);
  };

  const params = await searchParams;

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h1>Reset Password</h1>
          <p>Your Vet Admin</p>
        </div>
        
        {params.message && (
          <div className="alert alert-error" style={{ marginBottom: '1rem', color: 'red' }}>
            {params.message}
          </div>
        )}

        {params.success && (
          <div className="alert alert-success" style={{ marginBottom: '1rem', color: 'green', backgroundColor: '#e6ffe6', padding: '1rem', borderRadius: '4px' }}>
            {params.success}
          </div>
        )}
        
        {!params.success && (
          <form action={resetPassword}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" required autoFocus placeholder="admin@example.com" />
            </div>
            
            <button type="submit" className="login-btn">Send Reset Email</button>
          </form>
        )}
        
        <div className="login-footer" style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <a href="/admin/login">← Back to Login</a>
        </div>
      </div>
    </div>
  );
}
