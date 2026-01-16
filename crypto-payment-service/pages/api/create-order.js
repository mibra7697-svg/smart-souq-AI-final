import { createOrder } from "@/utils/orders"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { amount, crypto, customerEmail, customerName } = req.body

  if (!amount || !crypto || !customerEmail) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const adminWallets = {
      btc: process.env.ADMIN_WALLET_BTC,
      eth: process.env.ADMIN_WALLET_ETH,
      usdt: process.env.ADMIN_WALLET_USDT
    }

    const orderData = {
      id: orderId,
      amount: parseFloat(amount),
      crypto: crypto.toLowerCase(),
      customer_email: customerEmail,
      customer_name: customerName || "",
      admin_wallet: adminWallets[crypto.toLowerCase()],
      expected_amount: parseFloat(amount)
    }

    const order = await createOrder(orderData)

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        crypto: order.crypto,
        adminWallet: order.admin_wallet,
        status: order.status,
        createdAt: order.created_at
      }
    })

  } catch (error) {
    console.error("Error creating order:", error)
    res.status(500).json({ error: "Failed to create order" })
  }
}
