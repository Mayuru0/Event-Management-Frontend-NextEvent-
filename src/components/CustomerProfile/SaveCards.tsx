"use client";

import { useState } from "react";
import { Pencil, CreditCard, Plus, ShieldCheck } from "lucide-react";
import Image from "next/image";

const savedCards = [
  { type: "visa", number: "41xx xxxx xxxx 6787", name: "Jake Paul", exp: "10/26" },
  { type: "mastercard", number: "41xx xxxx xxxx 6787", name: "Jake Paul", exp: "10/26" },
  { type: "visa", number: "41xx xxxx xxxx 6787", name: "Jake Paul", exp: "10/26" },
  { type: "mastercard", number: "41xx xxxx xxxx 6787", name: "Jake Paul", exp: "10/26" },
];

const cardGradients = [
  "from-[#6200EE]/30 to-[#03DAC6]/20",
  "from-[#03DAC6]/20 to-[#6200EE]/30",
  "from-[#CF6679]/20 to-[#6200EE]/30",
  "from-[#6200EE]/20 to-[#CF6679]/20",
];

const SaveCards = () => {
  const [selectedCard, setSelectedCard] = useState(0);

  return (
    <div className="bg-[#1A1A1A] rounded-3xl md:rounded-r-3xl md:mt-28 overflow-hidden">
      {/* Top gradient bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#6200EE] via-[#03DAC6] to-[#6200EE]" />

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 text-[#03DAC6]" />
              <h2 className="text-2xl font-bold text-white tracking-tight">Saved Cards</h2>
            </div>
            <p className="text-gray-500 text-sm">Manage your saved payment cards for faster checkout.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#6200EE] hover:bg-[#6200EE]/90 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            <Plus className="w-4 h-4" />
            Add New Card
          </button>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 mb-6 p-3 bg-[#03DAC6]/5 border border-[#03DAC6]/10 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-[#03DAC6] shrink-0" />
          <p className="text-xs text-gray-500">Your card information is encrypted and stored securely.</p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#242424] text-gray-400 text-left">
                <th className="px-4 py-3 font-medium rounded-tl-xl w-12">Default</th>
                <th className="px-4 py-3 font-medium">Card</th>
                <th className="px-4 py-3 font-medium">Name on Card</th>
                <th className="px-4 py-3 font-medium">Expires</th>
                <th className="px-4 py-3 font-medium text-center rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {savedCards.map((card, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedCard(index)}
                  className={`cursor-pointer transition-colors ${
                    selectedCard === index ? "bg-[#6200EE]/8" : "hover:bg-white/3"
                  }`}
                >
                  <td className="px-4 py-3.5 text-center">
                    <input
                      type="radio"
                      name="defaultCard"
                      checked={selectedCard === index}
                      onChange={() => setSelectedCard(index)}
                      className="w-4 h-4 accent-[#6200EE] cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-6 bg-white rounded-md overflow-hidden shrink-0">
                        <Image
                          src={`/images/${card.type}.jpg`}
                          alt={`${card.type} logo`}
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                      <span className="text-gray-300 font-mono text-xs tracking-wider">{card.number}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-300">{card.name}</td>
                  <td className="px-4 py-3.5 text-gray-400">
                    <span className={`text-xs font-medium ${
                      selectedCard === index ? "text-[#03DAC6]" : "text-gray-500"
                    }`}>
                      Exp {card.exp}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {savedCards.map((card, index) => (
            <div
              key={index}
              onClick={() => setSelectedCard(index)}
              className={`relative overflow-hidden p-4 rounded-xl border cursor-pointer transition-all ${
                selectedCard === index
                  ? "border-[#6200EE]/40 bg-gradient-to-br " + cardGradients[index % cardGradients.length]
                  : "border-white/8 bg-[#202020] hover:border-white/12"
              }`}
            >
              {selectedCard === index && (
                <div className="absolute top-3 right-3">
                  <span className="bg-[#03DAC6] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">DEFAULT</span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-7 bg-white rounded-md overflow-hidden shrink-0">
                  <Image
                    src={`/images/${card.type}.jpg`}
                    alt={`${card.type} logo`}
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                <span className="text-gray-300 font-mono text-sm tracking-wider">{card.number}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                <div>
                  <p className="text-gray-600 mb-0.5">Cardholder</p>
                  <p className="text-gray-300 font-medium">{card.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-0.5">Expires</p>
                  <p className="text-gray-300 font-medium">{card.exp}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedCard(index); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selectedCard === index
                      ? "bg-[#6200EE]/20 text-[#03DAC6] border-[#6200EE]/30"
                      : "bg-white/5 text-gray-400 border-white/10"
                  }`}
                >
                  {selectedCard === index ? "✓ Default" : "Set as Default"}
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SaveCards;
