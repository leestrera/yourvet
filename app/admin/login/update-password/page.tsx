import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import '../login.css'; // Re-use login styles

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const updatePassword = async (formData: FormData) => {
    'use server';
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;
    
    if (password !== confirmPassword) {
      return redirect('/admin/login/update-password?message=Passwords do not match');
    }

    if (password.length < 6) {
        return redirect('/admin/login/update-password?message=Password must be at least 6 characters');
    }

    const supabase = await createClient();
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('Update password error:', error);
      return redirect(`/admin/login/update-password?message=Could not update password: ${error.message}`);
    }

    return redirect(`/admin/login/update-password?success=Password updated successfully`);
  };

  const params = await searchParams;

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h1>Update Password</h1>
          <p>Please enter your new password below.</p>
        </div>
        
        {params.message && (
          <div className="alert alert-error">
            {params.message}
          </div>
        )}
        
        {params.success && (
          <div className="alert alert-success">
            {params.success}
          </div>
        )}
        
        <form action={updatePassword}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input type="password" id="password" name="password" required autoFocus minLength={6} />
          </div>
          
          <button type="submit" className="login-btn">Update Password</button>
        </form>
        
        <div className="login-footer" style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <a href="/admin/login">← Back to Login</a>
        </div>
      </div>
    </div>
  );
}
