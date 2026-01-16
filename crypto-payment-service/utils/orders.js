import { supabase } from "@/lib/supabase"

export async function createOrder(orderData) {
  const { data, error } = await supabase
    .from("orders")
    .insert([{
      ...orderData,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()

  if (error) throw error
  return data[0]
}

export async function updateOrderStatus(orderId, status, txHash = null) {
  const updateData = {
    status,
    updated_at: new Date().toISOString()
  }

  if (txHash) {
    updateData.tx_hash = txHash
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId)
    .select()

  if (error) throw error
  return data[0]
}

export async function getOrder(orderId) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single()

  if (error) throw error
  return data
}

export async function getPendingOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })

  if (error) throw error
  return data
}
