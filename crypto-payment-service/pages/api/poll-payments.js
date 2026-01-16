import { getPendingOrders, updateOrderStatus } from "@/utils/orders"
import { EthereumService } from "@/utils/ethereum"
import { BitcoinService } from "@/utils/bitcoin"

const ethService = new EthereumService()
const btcService = new BitcoinService()

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const pendingOrders = await getPendingOrders()
    const results = []

    for (const order of pendingOrders) {
      let status = null

      if (order.tx_hash) {
        switch (order.crypto) {
          case "btc":
            status = await btcService.getTransactionStatus(order.tx_hash)
            break
          case "eth":
            status = await ethService.getTransactionStatus(order.tx_hash)
            break
          case "usdt":
            status = await ethService.getUSDTTransactionStatus(order.tx_hash)
            break
        }

        if (status !== null) {
          // Handle different status formats: BTC returns string, ETH/USDT returns number
          const orderStatus = (status === 1 || status === "confirmed") ? "confirmed" : "failed"
          await updateOrderStatus(order.id, orderStatus)
          
          results.push({
            orderId: order.id,
            status: orderStatus,
            txHash: order.tx_hash
          })
        }
      }
    }

    res.json({
      success: true,
      processed: results.length,
      results
    })

  } catch (error) {
    console.error("Error in payment poller:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
