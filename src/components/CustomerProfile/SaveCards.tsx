"use client";  // 👈 Add this line at the very top

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import visa from "./../../../public/images/visa.jpg";
import master from "./../../../public/images/mastercard.jpg";

const savedCards = [
  { type: "visa", number: "41xx xxxx xxxx 6787", name: "Jake Paul", exp: "10/26" },
  { type: "mastercard", number: "41xx xxxx xxxx 6787", name: "Jake Paul", exp: "10/26" },
  { type: "visa", number: "41xx xxxx xxxx 6787", name: "Jake Paul", exp: "10/26" },
  { type: "mastercard", number: "41xx xxxx xxxx 6787", name: "Jake Paul", exp: "10/26" },
];

const SaveCards = () => {
  const [selectedCard, setSelectedCard] = useState(0);

  return (
    <div className="bg-[#1F1F1F] rounded-r-3xl mt-28 text-white flex justify-center items-center">
      <div className="w-full max-w-4xl py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Saved Cards</h2>
            <p className="text-gray-400 text-sm">
              Manage your saved payment cards for faster checkout.
            </p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm flex items-center">
            Add New <span className="ml-2">+</span>
          </button>
        </div>

        {/* Table */}
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-400 text-black text-left">
              <th className="p-2">Default</th>
              <th className="p-2">Card No</th>
              <th className="p-2">Name on Card</th>
              <th className="p-2">Exp Date</th>
              <th className="p-2">Action</th>
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
                  <Image
                    src={card.type === "visa" ? visa : master}
                    alt="Card Logo"
                    width={24}
                    height={16}
                  />

                  {card.number}
                </td>

                {/* Name on Card */}
                <td className="p-2">{card.name}</td>

                {/* Expiry Date */}
                <td className="p-2">{card.exp}</td>

                {/* Update Button */}
                <td className="p-2">
                  <button className="flex items-center bg-teal-400 text-black px-3 py-1 rounded-lg">
                    Update <FontAwesomeIcon icon={faPen} className="ml-2 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaveCards;
