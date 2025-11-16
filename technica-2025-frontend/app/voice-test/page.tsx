"use client";
import React from "react";
import { useEffect, useState } from "react";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

import { ELEVENLABS_API_KEY, GEMINI_KEY } from "@/keys";

export default function VoiceTest() {
  useEffect(() => {
    const loggedIn = true;
    const myprompt =
      "Given the following text explaining what foods a user wants to record in an app, return a structured object in the json format specified. Output format: a list of each food mentioned. Object format: {name: String, quantity: 'small', 'medium', 'large', date: string in the format YEAR-DATE-MONTH}. Quantity should reflect roughly how much of that food they specified (use small if not specified). Date should specify when they acquired the food (use today's date, November 15 2025, as reference and if not specified). Text:  ";
    console.log(process.env);

    async function addToDB(input_json: string) {
      if (loggedIn) {
        try {
          const response = await fetch("http://127.0.0.1:8000/add-to-db", {
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
        contents: myprompt + voiceTest,
      });
      console.log(response.text);
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

            const clipName = prompt(
              "Enter a name for your sound clip?",
              "My unnamed clip"
            );

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
              const newClipName = prompt(
                "Enter a new name for your sound clip?"
              );
              if (newClipName === null) {
                clipLabel.textContent = existingName;
              } else {
                clipLabel.textContent = newClipName;
              }
            };

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

  return (
    <>
      <div className="wrapper">
        <header>
          <h1>Web dictaphone</h1>
        </header>

        <section className="main-controls">
          <div id="buttons">
            <button className="record">Record</button>
            <button className="stop">Stop</button>
          </div>
        </section>

        <section className="sound-clips">
          {/* In a real React app, you would map over an array
              of sound clips in state and render them here. */}
        </section>
      </div>

      <input type="checkbox" id="toggle" />
    </>
  );
}
