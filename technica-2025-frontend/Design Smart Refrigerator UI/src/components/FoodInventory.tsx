import { useState, useEffect } from "react";
import {
  Apple,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Camera,
  Scan,
  Receipt,
  PenSquare,
  ChefHat,
  Sparkles,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { GoogleGenAI } from "@google/genai";

import { ELEVENLABS_API_KEY, GEMINI_KEY } from "../../keys";
import { object } from "@elevenlabs/elevenlabs-js/core/schemas";
import CameraCapture from "./CameraCapture";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  expiryDate: string;
  daysUntilExpiry: number;
}

interface Recipe {
  id: string;
  name: string;
  emoji: string;
  ingredients: string[];
  wasteReduction: string;
}

export function FoodInventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);
  const [loadingState, setLoadingState] = useState("none");
  const [voiceState, setVoiceState] = useState("none");
  const [showCameraDialog, setShowCameraDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [uploadedReceipt, setUploadedReceipt] = useState<{
  file: File | null;
  preview: string | null;
} | null>(null);
const [showReceiptDialog, setShowReceiptDialog] = useState(false);

  const [uploadedFile, setUploadedFile] = useState<{
  file: File | null;
  preview: string | null;
} | null>(null);


const handleReceiptUpload = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*,application/pdf"; // allow images or PDFs for receipts
  input.onchange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedReceipt({ file, preview: URL.createObjectURL(file) });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", "b63930be-fdf4-4f43-811f-2427e4157b3b");

    try {
      const res = await fetch("http://127.0.0.1:8000/parse-receipt", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Parsed receipt data:", data);

      setAlertMessage("Uploaded successfully!");
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setAlertMessage("Upload failed");
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  input.click();
};

const handleReceiptReupload = () => {
  setUploadedReceipt(null);
  handleReceiptUpload();
};


const handleFileSelect = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile({ file, preview: URL.createObjectURL(file) });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", "b63930be-fdf4-4f43-811f-2427e4157b3b");
      fetch("http://127.0.0.1:8000/detect-food", { method: "POST", body: formData })
        .then((res) => res.json())
        .then(console.log)
        .catch(console.error);
      
      setAlertMessage("Uploaded successfully!");  
    }
  };
  input.click();
};

const handleReupload = () => {
  setUploadedFile(null);
  handleFileSelect();
};



  useEffect(() => {
    const loggedIn = true;
    const myprompt =
      "Given the following text explaining what foods a user wants to record in an app, return a structured object in the json format specified. Output format: a list of each food mentioned. Object format: {name: String, quantity: 'small', 'medium', 'large', date: string in the format YEAR-DATE-MONTH}. Quantity should reflect roughly how much of that food they specified (use small if not specified). Date should specify when they acquired the food (use today's date, November 15 2025, as reference and if not specified). Do not include ```json``` wrapping the result, it should only be [] wrapping. Text:  ";

    const createBulletedString = (items: any) => {
      // Map over the array to format each item, then join them with newlines
      return items
        .map((item: { name: any; quantity: any; date: any }) => {
          return `- ${item.name}\n   * Quantity: ${item.quantity}\n   * Date: ${item.date}`;
        })
        .join("\n");
    };

    async function addToDB(input_json: string) {
      if (loggedIn) {
        try {
          const response = await fetch("http://127.0.0.1:8000/add-food", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: input_json, //JSON.stringify({ snip: snip.trim(), artist, song, username }),
          });

          if (response.ok) {
            const res = await response.text();

            if (res === "True") {
              console.log("Saved to db!");
              alert("Saved!");
            } else {
              console.log("Error saving");
              alert("There was an error, please try again");
            }
          } else {
            // Handle errors
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Please log in to save!");
      }
    }

    async function getResponse(voiceTest: string) {
      const ai = new GoogleGenAI({
        apiKey: GEMINI_KEY,
      });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: myprompt + voiceTest, //"I bought 2 apples and a bottle of milk yesterday",
      });
      console.log(response.text);

      if (response.text != "[]") {
        try {
          const obj = JSON.parse(response.text!);
          console.log(obj);

          const res = confirm(
            `Add the following items to your inventory? \n\n${createBulletedString(
              obj
            )}`
          );
          obj._id = "b63930be-fdf4-4f43-811f-2427e4157b3b";
          await addToDB(obj);
          setLoadingState("none");
        } catch (e) {
          console.log("Error parsing JSON:", e);
          return;
        }
      }
    }

    const elevTest = async (blob: Blob) => {
      const elevenlabs = new ElevenLabsClient({
        apiKey: ELEVENLABS_API_KEY,
      });

      // const response = await fetch(
      //   "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
      // );
      // const audioBlob = new Blob([await response.arrayBuffer()], {
      //   type: "audio/mp3",
      // });

      const audioBlob = blob;

      const transcription = await elevenlabs.speechToText.convert({
        file: audioBlob,
        modelId: "scribe_v1", // Model to use
        tagAudioEvents: true, // Tag audio events like laughter, applause, etc.
        languageCode: "eng", // Language of the audio file. If set to null, the model will detect the language automatically.
        diarize: true, // Whether to annotate who is speaking
      });

      console.log(transcription);

      await getResponse(transcription.text);
    };

    const recordTest = () => {
      // 1. Select DOM elements and cast them to their specific HTML types
      const record = document.querySelector(".record") as HTMLButtonElement;
      const stopButton = document.querySelector(".stop") as HTMLButtonElement; // Renamed to stopButton to avoid collision with 'stop' method
      const soundClips = document.querySelector(".sound-clips") as HTMLElement;

      if (stopButton) stopButton.disabled = true;

      // Main block for doing the audio recording
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("The mediaDevices.getUserMedia() method is supported.");

        const constraints = { audio: true };
        let chunks: Blob[] = []; // Explicitly type the array as Blobs

        const onSuccess = (stream: MediaStream) => {
          const mediaRecorder = new MediaRecorder(stream);

          record.onclick = () => {
            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("Recorder started.");
            record.style.background = "red";

            stopButton.disabled = false;
            record.disabled = true;
          };

          stopButton.onclick = () => {
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("Recorder stopped.");
            record.style.background = "";
            record.style.color = "";

            stopButton.disabled = true;
            record.disabled = false;
          };

          mediaRecorder.onstop = (e: Event) => {
            console.log(
              "Last data to read (after MediaRecorder.stop() called)."
            );

            const clipName = null;
            // = prompt(
            //   "Enter a name for your sound clip?",
            //   "My unnamed clip"
            // );

            const clipContainer = document.createElement("article");
            const clipLabel = document.createElement("p");
            const audio = document.createElement("audio");
            const deleteButton = document.createElement("button");

            clipContainer.classList.add("clip");
            audio.setAttribute("controls", "");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete";

            if (clipName === null) {
              clipLabel.textContent = "My unnamed clip";
            } else {
              clipLabel.textContent = clipName;
            }

            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);
            soundClips.appendChild(clipContainer);

            audio.controls = true;
            const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
            chunks = [];
            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
            console.log("recorder stopped");

            deleteButton.onclick = (e: MouseEvent) => {
              // We need to cast target to HTMLElement to access .closest()
              const target = e.target as HTMLElement;
              target.closest(".clip")?.remove();
            };

            clipLabel.onclick = () => {
              const existingName = clipLabel.textContent;
              const newClipName = null;
              //prompt(
              //   "Enter a new name for your sound clip?"
              // );
              if (newClipName === null) {
                clipLabel.textContent = existingName;
              } else {
                clipLabel.textContent = newClipName;
              }
            };

            setLoadingState("block");
            elevTest(blob);
          };

          // Type the event as BlobEvent to access .data
          mediaRecorder.ondataavailable = (e: BlobEvent) => {
            chunks.push(e.data);
          };
        };

        const onError = (err: unknown) => {
          console.log("The following error occured: " + err);
        };

        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(onSuccess, onError);
      } else {
        console.log(
          "MediaDevices.getUserMedia() not supported on your browser!"
        );
      }
    };
    recordTest();
  }, []);

  const foodItems: FoodItem[] = [
    {
      id: "1",
      name: "Organic Milk",
      category: "Dairy",
      quantity: 1,
      expiryDate: "Nov 18, 2025",
      daysUntilExpiry: 3,
    },
    {
      id: "2",
      name: "Fresh Strawberries",
      category: "Fruits",
      quantity: 1,
      expiryDate: "Nov 16, 2025",
      daysUntilExpiry: 1,
    },
    {
      id: "3",
      name: "Cheddar Cheese",
      category: "Dairy",
      quantity: 1,
      expiryDate: "Nov 25, 2025",
      daysUntilExpiry: 10,
    },
    {
      id: "4",
      name: "Baby Spinach",
      category: "Vegetables",
      quantity: 1,
      expiryDate: "Nov 17, 2025",
      daysUntilExpiry: 2,
    },
    {
      id: "5",
      name: "Greek Yogurt",
      category: "Dairy",
      quantity: 4,
      expiryDate: "Nov 22, 2025",
      daysUntilExpiry: 7,
    },
    {
      id: "6",
      name: "Bell Peppers",
      category: "Vegetables",
      quantity: 3,
      expiryDate: "Nov 20, 2025",
      daysUntilExpiry: 5,
    },
  ];

  const recipes: Recipe[] = [
    {
      id: "1",
      name: "Strawberry Spinach Smoothie",
      emoji: "🥤",
      ingredients: ["Strawberries", "Spinach", "Yogurt", "Milk"],
      wasteReduction: "Uses expiring strawberries & spinach!",
    },
    {
      id: "2",
      name: "Veggie Cheese Omelette",
      emoji: "🍳",
      ingredients: ["Bell Peppers", "Spinach", "Cheddar", "Milk"],
      wasteReduction: "Perfect for expiring veggies!",
    },
    {
      id: "3",
      name: "Greek Yogurt Parfait",
      emoji: "🥣",
      ingredients: ["Greek Yogurt", "Strawberries"],
      wasteReduction: "Quick & uses expiring berries!",
    },
  ];

  const openVoiceDialog = () => {
    setShowAddDialog(false);
    setShowVoiceDialog(true);
  };

  const inputSelectFunc = (optionId: string) => {
    if (optionId === "voice") {
      setVoiceState("block");
      setShowAddDialog(false);
    } else if (optionId === "camera") {
      setShowAddDialog(false);
      setShowCameraDialog(true);
    }
    else if (optionId == "receipt")
    {
      setShowAddDialog(false)
      setShowReceiptDialog(true)
    }
  };

  const getExpiryStatus = (days: number) => {
    if (days <= 1)
      return {
        color: "bg-red-100 text-red-700 border-red-300",
        icon: AlertCircle,
        text: "Expires Soon!",
      };
    if (days <= 3)
      return {
        color:
          "bg-[var(--eco-yellow)] text-[var(--eco-dark)] border-[var(--eco-yellow)]",
        icon: Clock,
        text: `${days} days left`,
      };
    return {
      color:
        "bg-[var(--eco-mint)] text-[var(--eco-green)] border-[var(--eco-green)]/30",
      icon: CheckCircle,
      text: `${days} days left`,
    };
  };

  const filteredItems = foodItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const expiringSoon = foodItems.filter(
    (item) => item.daysUntilExpiry <= 3
  ).length;

  const addOptions = [
    {
      id: "camera",
      title: "Camera Scan",
      description: "Take a photo of your items",
      icon: Camera,
      color: "from-[#88B68E] to-[#7AA580]",
      emoji: "📸",
    },
    {
      id: "voice",
      title: "Voice Input",
      description: "Tell us foods to add",
      icon: Scan,
      color: "from-[#A8DAFF] to-[#7CB8E8]",
      emoji: "🗣️",
    },
    {
      id: "receipt",
      title: "Receipt Scan",
      description: "Upload shopping receipt",
      icon: Receipt,
      color: "from-[#FFD6E8] to-[#FFC2DE]",
      emoji: "🧾",
    },
    {
      id: "manual",
      title: "Manual Entry",
      description: "Type in item details",
      icon: PenSquare,
      color: "from-[#FFF281] to-[#FFE066]",
      emoji: "✏️",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className="p-4 rounded-xl text-white shadow-md"
          style={{
            background: "linear-gradient(135deg, #88B68E 0%, #7AA580 100%)",
            border: "3px solid white",
          }}
        >
          <div className="text-2xl font-semibold">{foodItems.length}</div>
          <div className="text-xs opacity-90">Total Items</div>
        </div>
        <div
          className="p-4 rounded-xl text-[var(--eco-dark)] shadow-md"
          style={{
            background: "var(--eco-yellow)",
            border: "3px solid white",
          }}
        >
          <div className="text-2xl font-semibold">{expiringSoon}</div>
          <div className="text-xs opacity-80">Expiring Soon</div>
        </div>
        <div
          className="p-4 rounded-xl text-[var(--eco-dark)] shadow-md"
          style={{
            background: "var(--eco-pink)",
            border: "3px solid white",
          }}
        >
          <div className="text-2xl font-semibold">6</div>
          <div className="text-xs opacity-80">Categories</div>
        </div>
      </div>

      {/* Add Item Button */}
      <Button
        onClick={() => setShowAddDialog(true)}
        className="w-full bg-[var(--eco-green)] hover:bg-[var(--eco-dark)] text-white rounded-xl h-12"
        style={{
          border: "3px solid white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Plus className="w-5 h-5 mr-2" />
        Add New Items
      </Button>

      {/* Voice Dialog */}
      <Dialog open={showVoiceDialog} onOpenChange={setShowVoiceDialog}>
        <DialogContent
          className="max-w-md"
          style={{
            borderRadius: "24px",
            border: "4px solid var(--eco-pink)",
            background: "linear-gradient(135deg, #FFFEF7 0%, #E8F5E9 100%)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-[var(--eco-green)] flex items-center justify-center gap-2">
              <span>✨</span>
              <span>Voice Input for Your Food!</span>
              <span>✨</span>
            </DialogTitle>
            <DialogDescription className="text-center text-[var(--eco-dark)]/70 text-sm">
              Tell us the items you'd like to add and mention quantity + date of
              purchase ♡
            </DialogDescription>
          </DialogHeader>

          <section className="main-controls">
            <div id="buttons">
              <button className="record">Record</button>
              <button className="stop">Stop</button>
              <Button
                className="record w-full bg-[var(--eco-green)] hover:bg-[var(--eco-dark)] text-white rounded-xl h-12"
                style={{
                  border: "3px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                Record
              </Button>
              <Button
                className="stop w-full bg-[var(--eco-green)] hover:bg-[var(--eco-dark)] text-white rounded-xl h-12"
                style={{
                  border: "3px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                Stop
              </Button>
            </div>
          </section>

          <section className="sound-clips">
            {/* In a real React app, you would map over an array
              of sound clips in state and render them here. */}
          </section>

          <div className="pt-4">
            <Button
              onClick={() => setShowAddDialog(false)}
              variant="outline"
              className="w-full rounded-xl border-2 border-[var(--eco-green)]/30 hover:bg-[var(--eco-mint)]"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div style={{ display: voiceState }}>
        <p>Voice Input 🗣️</p>
        <section className="main-controls">
          <div id="buttons">
            <button
              className="record w-full bg-[var(--eco-green)] hover:bg-[var(--eco-dark)] text-white rounded-xl h-12"
              style={{
                border: "3px solid white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              Record
            </button>
            <button
              className="stop w-full bg-[var(--eco-green)] hover:bg-[var(--eco-dark)] text-white rounded-xl h-12"
              style={{
                border: "3px solid white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              Stop
            </button>
          </div>
        </section>

        <section className="sound-clips" style={{ display: "none" }}></section>
        <p id="loading-text" style={{ display: loadingState }}>
          Processing...
        </p>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent
          className="max-w-md"
          style={{
            borderRadius: "24px",
            border: "4px solid var(--eco-pink)",
            background: "linear-gradient(135deg, #FFFEF7 0%, #E8F5E9 100%)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-[var(--eco-green)] flex items-center justify-center gap-2">
              <span>✨</span>
              <span>Add New Items</span>
              <span>✨</span>
            </DialogTitle>
            <DialogDescription className="text-center text-[var(--eco-dark)]/70 text-sm">
              Choose how you'd like to add your item ♡
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 pt-4">
            {addOptions.map((option) => {
              const Icon = option.icon;

              return (
                <button
                  onClick={() => inputSelectFunc(option.id)}
                  key={option.id}
                  className="p-5 bg-white rounded-2xl border-3 border-white shadow-md hover:scale-105 transition-all"
                  style={{
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
                      style={{
                        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                        border: "3px solid white",
                      }}
                      className={`bg-gradient-to-br ${option.color}`}
                    >
                      <div className="text-2xl">{option.emoji}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-sm text-[var(--eco-dark)] mb-1">
                        {option.title}
                      </div>
                      <div className="text-xs text-[var(--eco-dark)]/60">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4">
            <Button
              onClick={() => setShowAddDialog(false)}
              variant="outline"
              className="w-full rounded-xl border-2 border-[var(--eco-green)]/30 hover:bg-[var(--eco-mint)]"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Camera Scan */}
<Dialog open={showCameraDialog} onOpenChange={setShowCameraDialog}>
  <DialogContent
    className="max-w-md"
    style={{
      borderRadius: "24px",
      border: "4px solid var(--eco-green)",
      background: "linear-gradient(135deg, #FFFEF7 0%, #E8F5E9 100%)",
    }}
  >
    <DialogHeader>
      <DialogTitle className="text-center text-xl text-[var(--eco-green)] flex items-center justify-center gap-2">
        📸 Add Items via Camera
      </DialogTitle>
      <DialogDescription className="text-center text-[var(--eco-dark)]/70 text-sm">
        Take a photo of your groceries or upload an image ♡
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4 mt-2">

      {/* Live Camera Capture */}
      <CameraCapture
        onCapture={(dataUrl) => {
          console.log("Captured photo (base64):", dataUrl);
          setUploadedFile({ preview: dataUrl, file: null });
        }}
      />

      {/* File Upload */}
      {uploadedFile ? (
        <>
          {/* Show preview */}
          {uploadedFile.preview && (
            <img
              src={uploadedFile.preview}
              alt="Uploaded"
              className="w-full h-64 object-cover rounded-xl border"
            />
          )}
          <button
            onClick={handleReupload}
            className="w-full bg-[var(--eco-green)] text-white rounded-xl h-12 border-2 border-white shadow-md"
          >
            Re-upload
          </button>
        </>
      ) : (
        <button
          onClick={handleFileSelect}
          className="w-full bg-white hover:bg-[var(--eco-mint)] rounded-xl h-12 border-2 border-[var(--eco-green)]/30 shadow-md text-[var(--eco-dark)]"
        >
          Upload From Device
        </button>
      )}

      {alertMessage && (
        <div className="p-2 rounded-md bg-green-100 text-green-800 text-center">
          {alertMessage}
        </div>
      )}
    </div>

    <div className="pt-4">
      <Button
        onClick={() => setShowCameraDialog(false)}
        variant="outline"
        className="w-full rounded-xl border-2 border-[var(--eco-green)]/30 hover:bg-[var(--eco-mint)]"
      >
        Cancel
      </Button>
    </div>
  </DialogContent>
</Dialog>


{/* receipt scan */}
<Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
  <DialogContent
    className="max-w-md"
    style={{
      borderRadius: "24px",
      border: "4px solid var(--eco-green)",
      background: "linear-gradient(135deg, #FFFEF7 0%, #E8F5E9 100%)",
    }}
  >
    <DialogHeader>
      <DialogTitle className="text-center text-xl text-[var(--eco-green)] flex items-center justify-center gap-2">
        🧾 Add Items via Receipt
      </DialogTitle>
      <DialogDescription className="text-center text-[var(--eco-dark)]/70 text-sm">
        Upload your shopping receipt and we'll parse your items ♡
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4 mt-2">
      {uploadedReceipt ? (
        <>
          {uploadedReceipt.preview && (
            <img
              src={uploadedReceipt.preview}
              alt="Uploaded Receipt"
              className="w-full h-64 object-cover rounded-xl border"
            />
          )}
          <button
            onClick={handleReceiptReupload}
            className="w-full bg-[var(--eco-green)] text-white rounded-xl h-12 border-2 border-white shadow-md"
          >
            Re-upload
          </button>
        </>
      ) : (
        <button
          onClick={handleReceiptUpload}
          className="w-full bg-white hover:bg-[var(--eco-mint)] rounded-xl h-12 border-2 border-[var(--eco-green)]/30 shadow-md text-[var(--eco-dark)]"
        >
          Upload Receipt
        </button>
      )}

      {alertMessage && (
        <div className="p-2 rounded-md bg-green-100 text-green-800 text-center">
          {alertMessage}
        </div>
      )}
    </div>

    <div className="pt-4">
      <Button
        onClick={() => setShowReceiptDialog(false)}
        variant="outline"
        className="w-full rounded-xl border-2 border-[var(--eco-green)]/30 hover:bg-[var(--eco-mint)]"
      >
        Cancel
      </Button>
    </div>
  </DialogContent>
</Dialog>




      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--eco-dark)]/40" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your food inventory..."
          className="pl-10 bg-white border-2 border-[var(--eco-green)]/20 focus:border-[var(--eco-green)] rounded-xl"
        />
      </div>

      {/* Zero Waste Recipe Suggestions */}
      <div
        className="p-4 rounded-xl shadow-md"
        style={{
          background: "linear-gradient(135deg, #FFF8DC 0%, #FFFEF7 100%)",
          border: "3px solid var(--eco-green)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <ChefHat className="w-5 h-5 text-[var(--eco-green)]" />
          <h3 className="font-bold text-[var(--eco-dark)]">
            Zero Waste Recipes
          </h3>
          <Sparkles className="w-4 h-4 text-[var(--eco-yellow)]" />
        </div>
        <p className="text-xs text-[var(--eco-dark)]/70 mb-3">
          Based on items expiring soon ♡
        </p>

        <div className="space-y-2">
          {recipes.map((recipe) => (
            <button
              key={recipe.id}
              className="w-full text-left p-3 bg-white rounded-xl border-2 border-[var(--eco-green)]/20 hover:border-[var(--eco-green)]/50 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{recipe.emoji}</div>
                <div className="flex-1">
                  <div className="font-semibold text-[var(--eco-dark)] text-sm mb-1">
                    {recipe.name}
                  </div>
                  <div className="text-xs text-[var(--eco-dark)]/60 mb-1">
                    {recipe.ingredients.join(", ")}
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs bg-[var(--eco-mint)] text-[var(--eco-green)] px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    {recipe.wasteReduction}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Food Items List */}
      <div className="space-y-2">
        {filteredItems.map((item) => {
          const status = getExpiryStatus(item.daysUntilExpiry);
          const StatusIcon = status.icon;

          return (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border-2 border-[var(--eco-green)]/10 hover:border-[var(--eco-green)]/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[var(--eco-dark)]">
                      {item.name}
                    </h4>
                    {item.quantity > 1 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-[var(--eco-mint)] text-[var(--eco-green)] border-0"
                      >
                        ×{item.quantity}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-[var(--eco-dark)]/60 mb-2">
                    {item.category}
                  </div>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${status.color}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {status.text}
                  </div>
                </div>
                <div className="text-right text-xs text-[var(--eco-dark)]/60">
                  <div>Expires</div>
                  <div className="font-medium text-[var(--eco-dark)]">
                    {item.expiryDate}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
