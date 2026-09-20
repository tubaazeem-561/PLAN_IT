import { supabase } from './supabase'

function toSyntheticEmail(username) {
  return `${username.trim().toLowerCase()}@planit.internal`
}

export async function signUp(username, password) {
  const cleanUsername = username.trim().toLowerCase()

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', cleanUsername)
    .maybeSingle()

  if (existing) {
    throw new Error('That username is already taken')
  }

  const { data, error } = await supabase.auth.signUp({
    email: toSyntheticEmail(cleanUsername),
    password,
  })

  if (error) throw error

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: data.user.id, username: cleanUsername })

  if (profileError) throw profileError

  return data.user
}

export async function signIn(username, password) {
  const cleanUsername = username.trim().toLowerCase()

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', cleanUsername)
    .maybeSingle()

  if (!profile) {
    throw new Error('Invalid username or password')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: toSyntheticEmail(cleanUsername),
    password,
  })

  if (error) throw new Error('Invalid username or password')

  return data.user
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}