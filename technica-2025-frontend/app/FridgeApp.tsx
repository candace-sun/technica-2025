"use client";

import { useState } from "react";
import {
  Thermometer,
  Package,
  ShoppingCart,
  Zap,
  Droplets,
  Heart,
  Flower2,
  Leaf,
} from "lucide-react";

import { TemperatureControl } from "../components/TemperatureControl";
import { FoodInventory } from "../components/FoodInventory";
import { ShoppingList } from "../components/ShoppingList";
import { EnergyMonitor } from "../components/EnergyMonitor";

type Tab = "temperature" | "inventory" | "shopping" | "energy";

export default function FridgeApp() {
  const [activeTab, setActiveTab] = useState<Tab>("temperature");

  const tabs = [
    { id: "temperature" as Tab, label: "Temp", icon: Thermometer },
    { id: "inventory" as Tab, label: "Inventory", icon: Package },
    { id: "shopping" as Tab, label: "Shop", icon: ShoppingCart },
    { id: "energy" as Tab, label: "Energy", icon: Zap },
  ];

  return (
    <div
      className="min-h-screen p-8 flex items-center justify-center relative overflow-hidden"
      style={{
        background: `
          repeating-linear-gradient(
            0deg,
            #FFD6E8 0px,
            #FFD6E8 20px,
            #FFFEF7 20px,
            #FFFEF7 40px
          ),
          repeating-linear-gradient(
            90deg,
            #E8F5E9 0px,
            #E8F5E9 20px,
            #FFFEF7 20px,
            #FFFEF7 40px
          )
        `,
        backgroundBlendMode: "multiply",
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-12 left-12 opacity-40">
        <Heart className="w-16 h-16 text-[var(--eco-pink)] fill-[var(--eco-pink)]" />
      </div>
      <div className="absolute top-24 right-16 opacity-40">
        <Flower2 className="w-20 h-20 text-[var(--eco-green)] fill-[var(--eco-green)]" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-40">
        <Leaf className="w-14 h-14 text-[var(--eco-green)] fill-[var(--eco-green)]" />
      </div>

      <div className="w-full max-w-[920px] mx-auto relative z-10">
        {/* REFRIGERATOR */}
        <div className="relative">
          {/* Top of Fridge with scalloped edge */}
          <div className="w-full h-8 bg-gradient-to-b from-[#9DC8A3] to-[#88B68E] rounded-t-3xl relative">
            <div
              className="absolute bottom-0 left-0 right-0 h-2 bg-white"
              style={{
                clipPath:
                  "polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)",
              }}
            ></div>
          </div>

          {/* Main Fridge Body */}
          <div
            className="bg-white p-4 shadow-2xl"
            style={{
              border: "6px solid #E8F5E9",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.15), inset 0 0 0 2px white",
            }}
          >
            {/* Side-by-side Doors Container */}
            <div className="flex gap-4">
              {/* LEFT DOOR */}
              <div
                className="w-[440px] relative h-[680px] shadow-xl flex flex-col"
                style={{
                  background:
                    "linear-gradient(135deg, #9DC8A3 0%, #88B68E 50%, #7AA580 100%)",
                  borderRadius: "24px",
                  border: "5px solid white",
                  boxShadow:
                    "inset 0 2px 20px rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.12)",
                }}
              >
                {/* Brand Badge */}
                <div className="flex justify-center pt-8 pb-6">
                  <div
                    className="bg-white px-6 py-3 shadow-lg"
                    style={{
                      borderRadius: "20px",
                      border: "4px solid #FFD6E8",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    <div className="text-center">
                      <div className="text-xl font-bold text-[var(--eco-green)] flex items-center gap-2 justify-center">
                        <span>🌿</span>
                        <span>EcoFridge</span>
                        <span>🌿</span>
                      </div>
                      <div className="text-[10px] text-[var(--eco-dark)] tracking-wider mt-0.5">
                        ♡ SMART & SWEET ♡
                      </div>
                    </div>
                  </div>
                </div>

                {/* Water/Ice Dispenser */}
                <div className="flex justify-center px-8">
                  <div
                    className="bg-white p-5 shadow-xl w-full max-w-[280px]"
                    style={{
                      borderRadius: "24px",
                      border: "4px solid #FFF8DC",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                    }}
                  >
                    <div className="text-center mb-3">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#88B68E] to-[#7AA580] px-4 py-1.5 rounded-full mb-2">
                        <Droplets className="w-5 h-5 text-white" />
                        <span className="text-xs font-bold text-white">
                          DISPENSER
                        </span>
                      </div>
                    </div>

                    {/* Dispenser Area */}
                    <div
                      className="h-32 bg-gradient-to-b from-[#E8F5E9] to-[#D4EBD9] relative overflow-hidden mb-3 flex items-center justify-center"
                      style={{
                        borderRadius: "16px",
                        border: "3px solid #E8F5E9",
                      }}
                    >
                      <div className="text-4xl opacity-20">💧</div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-[var(--eco-green)] rounded-full border-3 border-white shadow-inner"></div>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="bg-gradient-to-br from-[#88B68E] to-[#7AA580] hover:from-[#7AA580] hover:to-[#6B9471] text-white text-xs py-2.5 font-bold transition-all hover:scale-105"
                        style={{
                          borderRadius: "12px",
                          border: "3px solid white",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        💧 Water
                      </button>
                      <button
                        className="bg-gradient-to-br from-[#A8DAFF] to-[#7CB8E8] hover:from-[#7CB8E8] hover:to-[#6BA3D1] text-white text-xs py-2.5 font-bold transition-all hover:scale-105"
                        style={{
                          borderRadius: "12px",
                          border: "3px solid white",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        ❄️ Ice
                      </button>
                    </div>
                  </div>
                </div>

                {/* Eco Badge */}
                <div className="flex-1 flex items-end justify-center pb-8">
                  <div
                    className="bg-[var(--eco-yellow)] px-5 py-2.5 shadow-lg"
                    style={{
                      borderRadius: "20px",
                      border: "4px solid white",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🌱</span>
                      <span className="text-xs font-bold text-[var(--eco-dark)]">
                        ECO MODE ♡
                      </span>
                      <span className="text-xl">✨</span>
                    </div>
                  </div>
                </div>

                {/* Cute stickers */}
                <div className="absolute top-[280px] right-8 text-3xl">🐸</div>
                <div className="absolute bottom-32 left-8 text-2xl">🌸</div>

                {/* Left Door Handle */}
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-56 bg-gradient-to-r from-[#E8F5E9] via-white to-[#E8F5E9] shadow-xl"
                  style={{ borderRadius: "12px" }}
                ></div>
              </div>

              {/* RIGHT DOOR - With Touchscreen */}
              <div
                className="w-[440px] relative h-[680px] shadow-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #9DC8A3 0%, #88B68E 50%, #7AA580 100%)",
                  borderRadius: "24px",
                  border: "5px solid white",
                  boxShadow:
                    "inset 0 2px 20px rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.12)",
                }}
              >
                {/* Touchscreen Display */}
                <div
                  className="absolute inset-6 bg-white shadow-2xl overflow-hidden"
                  style={{
                    borderRadius: "28px",
                    border: "6px solid #FFD6E8",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.2), inset 0 0 0 2px white",
                  }}
                >
                  <div className="h-full bg-gradient-to-br from-[var(--eco-cream)] to-white rounded-xl overflow-hidden flex flex-col">
                    {/* Screen Header */}
                    <div
                      className="px-4 py-3 text-white relative overflow-hidden flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #88B68E 0%, #7AA580 100%)",
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, white 1px, transparent 1px)",
                          backgroundSize: "12px 12px",
                        }}
                      ></div>

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🌿</span>
                          <div>
                            <h2 className="font-bold text-sm">
                              EcoFridge Control
                            </h2>
                            <p className="text-[9px] opacity-90">
                              ✿ Smart Dashboard ✿
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-xs bg-white/20 backdrop-blur px-3 py-1.5 rounded-full border border-white/30">
                          <div className="font-medium">Nov 15 ♡</div>
                          <div className="opacity-90 text-[9px]">2:34 PM</div>
                        </div>
                      </div>
                    </div>

                    {/* Tab Navigation */}
                    <div
                      className="grid grid-cols-4 gap-1 p-2 flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, #FFF8DC, #FFFEF7)",
                      }}
                    >
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-2 flex flex-col items-center gap-1 transition-all ${
                              isActive ? "scale-105" : "hover:scale-102"
                            }`}
                            style={{
                              background: isActive ? "white" : "transparent",
                              borderRadius: "16px",
                              border: isActive
                                ? "3px solid var(--eco-pink)"
                                : "3px solid transparent",
                              boxShadow: isActive
                                ? "0 4px 12px rgba(0,0,0,0.1)"
                                : "none",
                            }}
                          >
                            <Icon
                              className={`w-5 h-5 ${
                                isActive
                                  ? "text-[var(--eco-green)]"
                                  : "text-[var(--eco-dark)]/60"
                              } transition-transform`}
                            />
                            <span
                              className={`text-[10px] font-medium ${
                                isActive
                                  ? "text-[var(--eco-green)]"
                                  : "text-[var(--eco-dark)]/60"
                              }`}
                            >
                              {tab.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Tab Content */}
                    <div
                      className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-[var(--eco-mint)]/30"
                      style={{ minHeight: 0 }}
                    >
                      <div className="p-4">
                        {activeTab === "temperature" && <TemperatureControl />}
                        {activeTab === "inventory" && <FoodInventory />}
                        {activeTab === "shopping" && <ShoppingList />}
                        {activeTab === "energy" && <EnergyMonitor />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cute stickers */}
                <div className="absolute top-16 left-6 text-2xl">☕</div>
                <div className="absolute bottom-20 right-6 text-3xl">🐰</div>

                {/* Right Door Handle */}
                <div
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-56 bg-gradient-to-r from-[#E8F5E9] via-white to-[#E8F5E9] shadow-xl"
                  style={{ borderRadius: "12px" }}
                ></div>
              </div>
            </div>

            {/* Freezer Drawer */}
            <div
              className="mt-4 h-[180px] relative shadow-xl flex flex-col items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #88B68E 0%, #7AA580 50%, #6B9471 100%)",
                borderRadius: "24px",
                border: "5px solid white",
                boxShadow:
                  "inset 0 2px 20px rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              {/* Freezer Label */}
              <div
                className="bg-white px-6 py-2 shadow-lg mb-4"
                style={{
                  borderRadius: "16px",
                  border: "4px solid #A8DAFF",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                }}
              >
                <p className="text-xs font-bold text-[var(--eco-green)] tracking-wider flex items-center gap-2">
                  <span>❄️</span>
                  <span>FREEZER</span>
                  <span>❄️</span>
                </p>
              </div>

              {/* Freezer Stats */}
              <div className="flex gap-8 mb-6">
                <div className="text-center bg-white/20 backdrop-blur px-4 py-2 rounded-2xl border-2 border-white/40">
                  <div className="text-2xl font-bold text-white">0°F</div>
                  <div className="text-[9px] text-white/80 mt-1">TEMP</div>
                </div>
                <div className="text-center bg-white/20 backdrop-blur px-4 py-2 rounded-2xl border-2 border-white/40">
                  <div className="text-2xl font-bold text-white">32</div>
                  <div className="text-[9px] text-white/80 mt-1">ITEMS</div>
                </div>
                <div className="text-center bg-white/20 backdrop-blur px-4 py-2 rounded-2xl border-2 border-white/40">
                  <div className="text-2xl font-bold text-white">85%</div>
                  <div className="text-[9px] text-white/80 mt-1">FULL</div>
                </div>
              </div>

              {/* Freezer Handle */}
              <div
                className="w-64 h-4 bg-gradient-to-b from-white via-[#E8F5E9] to-white shadow-xl"
                style={{ borderRadius: "12px" }}
              ></div>

              {/* Snowflake decorations */}
              <div className="absolute top-6 right-12 text-xl opacity-30 text-white">
                ❄️
              </div>
              <div className="absolute bottom-6 left-12 text-lg opacity-30 text-white">
                ❄️
              </div>
            </div>
          </div>

          {/* Bottom scalloped edge */}
          <div className="w-full h-2 bg-white relative">
            <div
              className="absolute top-0 left-0 right-0 h-full bg-[#88B68E]"
              style={{
                clipPath:
                  "polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)",
              }}
            ></div>
          </div>

          {/* Bottom Grill */}
          <div
            className="w-full h-12 bg-[var(--eco-green)] flex items-center justify-center gap-1 px-12 mt-2 shadow-lg"
            style={{
              borderRadius: "16px",
              border: "4px solid white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-5 bg-[var(--eco-dark)]/30 rounded-full"
              ></div>
            ))}
          </div>
        </div>

        {/* Info Footer */}
        <div
          className="mt-8 text-center bg-white/80 backdrop-blur py-3 px-6 mx-auto shadow-lg"
          style={{
            borderRadius: "24px",
            border: "4px solid var(--eco-pink)",
            maxWidth: "500px",
          }}
        >
          <p className="flex items-center justify-center gap-2 text-[var(--eco-dark)] font-medium">
            <span>🌍</span>
            <span>Keeping your food fresh & the planet happy!</span>
            <span>💚</span>
          </p>
        </div>
      </div>
    </div>
  );
}
