import { useEffect, useState } from "react";
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
import { TemperatureControl } from "./components/TemperatureControl";
import { FoodInventory } from "./components/FoodInventory";
import { ShoppingList } from "./components/ShoppingList";
import { EnergyMonitor } from "./components/EnergyMonitor";

type Tab = "inventory" | "shopping";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("inventory");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }); // e.g., "Nov 15"

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }); //


  const tabs = [
    { id: "inventory" as Tab, label: "Inventory", icon: Package },
    { id: "shopping" as Tab, label: "Shop", icon: ShoppingCart },
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

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* REFRIGERATOR */}
        <div className="relative">
          {/* Top of Fridge with scalloped edge */}
          <div className="w-full h-8 bg-gradient-to-b from-[#9DC8A3] to-[#88B68E] rounded-t-3xl relative"></div>

          {/* Main Fridge Body */}
          <div
            className="bg-white p-4 shadow-2xl"
            style={{
              border: "6px solid #E8F5E9",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15), inset 0 0 0 2px white",
            }}
          >
            {/* Side-by-side Doors Container */}
            <div className="flex">
              {/* RIGHT DOOR - With Touchscreen */}
              <div
                className=" h-[680px] shadow-xl"
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
                      {/* Decorative dots pattern */}
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
                          <div className="font-medium">{formattedDate} ♡</div>
                          <div className="opacity-90 text-[9px]">{formattedTime}</div>
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

                    {/* Tab Content - Fixed height with scroll */}
                    <div
                      className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-[var(--eco-mint)]/30"
                      style={{ minHeight: 0 }}
                    >
                      <div className="p-4">
                        {activeTab === "inventory" && <FoodInventory />}
                        {activeTab === "shopping" && <ShoppingList />}
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
