import { CreditCard } from "lucide-react"

function Wallet() {
  // Sample transaction data
  const transactions = [
    { id: "R7B2832732899", date: "Jan 27, 2024", account: "86/47/47283", amount: "$98.87", status: "Unsuccess" },
    { id: "R7B2832732900", date: "Jan 25, 2024", account: "86/47/47283", amount: "$120.50", status: "Success" },
    { id: "R7B2832732901", date: "Jan 22, 2024", account: "86/47/47283", amount: "$45.30", status: "Unsuccess" },
    { id: "R7B2832732902", date: "Jan 18, 2024", account: "86/47/47283", amount: "$76.99", status: "Success" },
  ]

  return (
    <div className="p-4 sm:p-6 py-28 max-w-4xl mx-auto bg-transparent rounded-3xl md:rounded-r-3xl mt-28">
      {/* Wallet Header with Withdraw Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h1 className="text-xl font-bold text-white">Wallet</h1>
        <button className="bg-violet-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 self-start sm:self-auto">
          Withdraw
          <CreditCard className="w-4 h-4" />
        </button>
      </div>

      <p className="text-gray-300 text-sm mb-6">Manage your balance and view transaction history.</p>

      {/* Current Balance */}
      <div className="mb-6 bg-neutral-800 p-4 rounded-lg sm:bg-transparent sm:p-0">
        <h2 className="text-gray-400 text-sm">Current Balance</h2>
        <p className="text-3xl font-bold text-cyan-400">$167.97</p>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-md font-semibold text-gray-300 mb-3">Transaction History</h2>

        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden md:block overflow-x-auto md:mb-32">
          <table className="w-full border border-gray-500 text-sm">
            <thead className="bg-gray-400 text-gray-900">
              <tr>
                <th className="px-4 py-2 text-left">Invoice ID</th>
                <th className="px-9 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Account No.</th>
                <th className="px-4 py-2 text-center">Amount</th>
                <th className="px-8 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="bg-neutral-800 divide-y divide-gray-700">
              {transactions.map((transaction, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 text-gray-400">{transaction.id}</td>
                  <td className="px-4 py-2 text-gray-400">{transaction.date}</td>
                  <td className="px-4 py-2 text-gray-400">{transaction.account}</td>
                  <td className="px-4 py-2 text-gray-400 text-center">{transaction.amount}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-md w-20 h-6 text-center inline-block ${
                        transaction.status === "Unsuccess" ? "bg-red-300 text-red-800" : "bg-green-300 text-green-900"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout - Shown only on mobile */}
        <div className="md:hidden space-y-4">
          {transactions.map((transaction, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-700 bg-neutral-800">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-400">Invoice ID</p>
                  <p className="text-sm text-gray-300">{transaction.id}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-md inline-block ${
                    transaction.status === "Unsuccess" ? "bg-red-300 text-red-800" : "bg-green-300 text-green-900"
                  }`}
                >
                  {transaction.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-gray-300">{transaction.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Account No.</p>
                  <p className="text-gray-300">{transaction.account}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Amount</p>
                  <p className="text-gray-300 font-medium">{transaction.amount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wallet

