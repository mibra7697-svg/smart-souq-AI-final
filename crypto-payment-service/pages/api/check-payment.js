import { EthereumService } from "@/utils/ethereum"
import { BitcoinService } from "@/utils/bitcoin"
import { updateOrderStatus } from "@/utils/orders"

const ethService = new EthereumService()
const btcService = new BitcoinService()

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { orderId, crypto, txHash } = req.body

  if (!orderId || !crypto || !txHash) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    let status = null

    switch (crypto.toLowerCase()) {
      case "btc":
        status = await btcService.getTransactionStatus(txHash)
        break
      case "eth":
        status = await ethService.getTransactionStatus(txHash)
        break
      case "usdt":
        status = await ethService.getUSDTTransactionStatus(txHash)
        break
      default:
        return res.status(400).json({ error: "Unsupported cryptocurrency" })
    }

    if (status === null) {
      return res.status(404).json({ error: "Transaction not found" })
    }

    const orderStatus = status === 1 ? "confirmed" : "failed"
    await updateOrderStatus(orderId, orderStatus, txHash)

    res.json({ 
      success: true, 
      status: orderStatus,
      txHash,
      orderId
    })

  } catch (error) {
    console.error("Error checking payment:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
