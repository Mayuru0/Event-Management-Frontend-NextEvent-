"use client"

import { useState } from "react"
import { Pen } from "lucide-react"
import Image from "next/image"

// Mock data for saved cards
const savedCards = [
  { type: "visa", number: "41xx xxxx xxxx 6787", name: "Jake Paul", exp: "10/26" },
  { type: "mastercard", number: "41xx xxxx xxxx 6787", name: "Jake Paul", exp: "10/26" },
  { type: "visa", number: "41xx xxxx xxxx 6787", name: "Jake Paul", exp: "10/26" },
  { type: "mastercard", number: "41xx xxxx xxxx 6787", name: "Jake Paul", exp: "10/26" },
]

const SaveCards = () => {
  const [selectedCard, setSelectedCard] = useState(0)

  return (
    <div className="bg-[#1F1F1F] rounded-3xl md:rounded-r-3xl md:mt-28  text-white flex justify-center items-center">
      <div className="w-full max-w-4xl py-8 px-4 md:py-12 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">Saved Cards</h2>
            <p className="text-gray-400 text-sm">Manage your saved payment cards for faster checkout.</p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm flex items-center self-start sm:self-auto">
            Add New <span className="ml-2">+</span>
          </button>
        </div>

        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden md:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-400 text-black text-left">
                <th className="p-2 rounded-l-lg">Default</th>
                <th className="p-2">Card No</th>
                <th className="p-2">Name on Card</th>
                <th className="p-2">Exp Date</th>
                <th className="p-2 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {savedCards.map((card, index) => (
                <tr key={index} className="bg-[#1F1F1F] border-b border-gray-700">
                  {/* Default Radio Button */}
                  <td className="p-2">
                    <input
                      type="radio"
                      name="defaultCard"
                      checked={selectedCard === index}
                      onChange={() => setSelectedCard(index)}
                      className="w-4 h-4 accent-white"
                    />
                  </td>

                  {/* Card Number with Logo */}
                  <td className="p-2 flex items-center gap-2">
                    <div className="relative w-8 h-5 bg-white rounded">
                      <Image
                        src={`/images/${card.type}.jpg`}
                        alt={`${card.type} logo`}
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                    {card.number}
                  </td>

                  {/* Name on Card */}
                  <td className="p-2">{card.name}</td>

                  {/* Expiry Date */}
                  <td className="p-2">{card.exp}</td>

                  {/* Update Button */}
                  <td className="p-2">
                    <button className="flex items-center bg-teal-400 text-black px-3 py-1 rounded-lg">
                      Update <Pen className="ml-2 w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout - Shown only on mobile */}
        <div className="md:hidden space-y-4">
          {savedCards.map((card, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${selectedCard === index ? "border-purple-600" : "border-gray-700"} bg-[#2A2A2A]`}
            >
              <div className="flex justify-between items-start mb-3 ">
                <div className="flex items-center gap-2">
                  <div className="relative w-10 h-6 bg-white rounded ">
                    <Image
                      src={`/images/${card.type}.jpg`}
                      alt={`${card.type} logo`}
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <span className="font-medium">{card.number}</span>
                </div>
                <input
                  type="radio"
                  name="defaultCardMobile"
                  checked={selectedCard === index}
                  onChange={() => setSelectedCard(index)}
                  className="w-4 h-4 accent-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-3">
                <div>
                  <p className="text-xs text-gray-400">Name on Card</p>
                  <p>{card.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Exp Date</p>
                  <p>{card.exp}</p>
                </div>
              </div>

              <button className="flex items-center bg-teal-400 text-black px-3 py-1 rounded-lg text-sm">
                Update <Pen className="ml-2 w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SaveCards

