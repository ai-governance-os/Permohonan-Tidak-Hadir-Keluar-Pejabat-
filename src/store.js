import { supabase } from './supabaseClient'

export async function getPermohonan() {
  try {
    const { data, error } = await supabase
      .from('permohonan')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.error("Error fetching data:", err)
    return []
  }
}

export async function tambahPermohonan(item) {
  try {
    const { data, error } = await supabase
      .from('permohonan')
      .insert([item])
    
    if (error) throw error
    return { success: true }
  } catch (err) {
    console.error("Error inserting data:", err)
    return { success: false, error: err }
  }
}

export async function kemaskiniPermohonan(id, kemaskini) {
  try {
    const { data, error } = await supabase
      .from('permohonan')
      .update(kemaskini)
      .eq('id', id)
    
    if (error) throw error
    return { success: true }
  } catch (err) {
    console.error("Error updating data:", err)
    return { success: false, error: err }
  }
}
