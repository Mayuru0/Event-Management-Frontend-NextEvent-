import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-regular-svg-icons';

function Wallet() {
  return (
    <div className="p-6 py-28 max-w-4xl mx-auto bg-transparent rounded-lg mt-28">
      {/* Wallet Header with Withdraw Button */}
      <div className="flex justify-between items-center mb-4 ">
        <h1 className="text-xl font-bold text-white">Wallet</h1>
        <button className="bg-violet-800 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          Withdraw
          <FontAwesomeIcon icon={faCreditCard} className="w-4 h-4" />
        </button>
      </div>

      <p className="text-gray-300 text-sm mb-6">Manage your balance and view transaction history.</p>

      {/* Current Balance */}
      <div className="mb-6">
        <h2 className="text-gray-400 text-sm">Current Balance</h2>
        <p className="text-3xl font-bold text-cyan-400">$167.97</p>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-md font-semibold text-gray-300 mb-3">Transaction History</h2>
        <div className="overflow-x-auto">
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
              {[...Array(4)].map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 text-gray-400">R7B2832732899</td>
                  <td className="px-4 py-2 text-gray-400">Jan 27, 2024</td>
                  <td className="px-4 py-2 text-gray-400">86/47/47283</td>
                  <td className="px-4 py-2 text-gray-400 text-center">$98.87</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-md w-20 h-6 text-center inline-block ${
                      i % 2 === 0 ? 'bg-red-300 text-red-800' : 'bg-green-300 text-green-900'
                    }`}>
                      {i % 2 === 0 ? 'Unsuccess' : 'Success'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Wallet;