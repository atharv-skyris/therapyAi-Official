const orb_btn = document.querySelector(".spline_center_circle");
let isRecording = false;

let finalTranscript = "";
async function sendToBackend(transcript) {
  console.log("sending user prompt to backend");
  // finalTranscript = "";
  try {
    let response = await fetch("/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userPrompt: transcript || "Hey what's up how are u",
        audioRes: true
      }),
    });
    console.log("sended");
    response = await response.json();
    console.log(response)
    let output = response.data
    if(!response.success){
      alert(output)
    }else{
      finalTranscript = ""
      
      const audioSrc = "data:audio/wav;base64," + output;
      const audio = new Audio(audioSrc);
      audio.play();
    }
    // alert(response.message);
  } catch (error) {
    console.log(error)
  }
}

const recog = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition)();
recog.continuous = true;
// recog.interimResults = true;
recog.lang = "en-US";

recog.onend = async () => {
  console.log("Speech recognition service onend func");
  if (isRecording) {
    console.log("recording is continued restarted");  
    recog.start();
  } else {
    console.log("recording is stoped");
    console.log(finalTranscript);
    await sendToBackend(finalTranscript);
  }
};

recog.onerror = (event) => {
  console.log("Speech recognition service onerror func");
  console.error("Speech recognition error:", event.error);
  isRecording = false;
  orb_btn.textContent = "Start Recording"; // Reset UI on error
};

recog.onresult = (e) => {
  console.log("Speech recognition service onresult func");
  console.log(e);
  finalTranscript += " " + e.results[0][0].transcript;
};

orb_btn.addEventListener("click", () => {
  console.log("orb clicked");
  if (isRecording) {
    recog.stop();
  } else {
    recog.start();
  }

  isRecording = !isRecording;
});
