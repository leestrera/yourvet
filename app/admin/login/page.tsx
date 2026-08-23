import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import './login.css';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>}) {
  const login = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      return redirect('/admin/login?message=Could not authenticate user')
    }
    return redirect('/admin')
  }

  const logout = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/admin/login')
  }

  // Handle logout POST from the sidebar form
  if ((await searchParams).message === 'logout_trigger') {
      // Actually we will handle logout via a server action above.
  }

  return (
    <div className="login-container">
        <div className="login-header">
            <h1>Admin Login</h1>
            <p>Your Vet</p>
        </div>
        
        {(await searchParams).message && (
            <div className="alert alert-error">
                {(await searchParams).message}
            </div>
        )}
        
        <form action={login}>
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" required autoFocus />
            </div>
            
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
            </div>
            
            <button type="submit" className="login-btn">Login</button>
        </form>
        
        <div className="back-link">
            <a href="/">← Back to Website</a>
        </div>
    </div>
  );
}
