'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function login(email: string, password: string) {
  const supabase = await createClient();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 Login Attempt:');
  console.log('   Email:', email);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('❌ Login failed:', error.message);
    return { success: false, error: error.message };
  }

  console.log('✅ Login successful:', data.user?.email);
  console.log('   Session:', data.session ? 'CREATED' : 'NO SESSION');

  revalidatePath('/', 'layout');
  revalidatePath('/station', 'page');
  
  return { success: true };
}

export async function signup(email: string, password: string, nickname: string) {
  const supabase = await createClient();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🆕 Sign Up Attempt:');
  console.log('   Email:', email);
  console.log('   Nickname:', nickname);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Sign up user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
      },
    },
  });

  if (error) {
    console.error('❌ Sign up failed:', error.message);
    return { success: false, error: error.message };
  }

  if (!data.user) {
    console.error('❌ No user data returned');
    return { success: false, error: 'Sign up failed' };
  }

  // Note: Profile is automatically created by database trigger (handle_new_user)
  // No need to manually insert into profiles table
  console.log('✅ Sign up successful:', data.user.email);
  console.log('   Profile will be auto-created by database trigger');

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  
  console.log('🚪 Logging out...');
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('❌ Logout failed:', error.message);
    return { success: false, error: error.message };
  }
  
  console.log('✅ Logout successful');
  
  revalidatePath('/', 'layout');
  return { success: true };
}
