const chatArea = document.getElementById("chatArea");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// ⚠️ Mets ta nouvelle clé Groq ici (APRÈS REGÉNÉRATION)
const API_KEY = "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";

function addMessage(text, sender) {

  const message = document.createElement("div");

  message.classList.add("message", sender);

  message.innerHTML = `
    <div class="avatar">
      ${sender === "user" ? "U" : "AI"}
    </div>

    <div class="message-content">
      ${text}
    </div>
  `;

  chatArea.appendChild(message);
  chatArea.scrollTop = chatArea.scrollHeight;
}

async function sendMessage() {

  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  // message loading
  const loadingMsg = document.createElement("div");
  loadingMsg.classList.add("message", "bot");
  loadingMsg.innerHTML = `
    <div class="avatar">AI</div>
    <div class="message-content">Typing...</div>
  `;
  chatArea.appendChild(loadingMsg);

  try {

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },

        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "user",
              content: text
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(data);

    const reply = data.choices?.[0]?.message?.content || "No response";

    loadingMsg.querySelector(".message-content").innerText = reply;

  } catch (error) {

    console.log(error);
    loadingMsg.querySelector(".message-content").innerText =
      "Error connecting to Groq API";

  }
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (e) => {

  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }

});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
        }
