import "./style.css";
import { TestingMinigameSdk, MinigameSdk, ParentOpcodes } from "@someonesays/minigame-sdk";
import type { BaseMinigameSdk } from "@someonesays/minigame-sdk";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing app");

app.innerHTML = `
  <div>
    <h2>This is a test minigame intended to show what you can do with the MinigameSDK.</h2>
    <p>I recommend having DevTools → Console open when playing this "minigame".</p>
    <div class="card">
      Send event:<br>
      <select id="event">
        <option value=""></option>
        <option value="endGame">endGame</option>
        <option value="saveLocalData">saveLocalData</option>
        <option value="setGameState">setGameState</option>
        <option value="setPlayerState">setPlayerState</option>
        <option value="sendGameMessage">sendGameMessage</option>
        <option value="sendPlayerMessage">sendPlayerMessage</option>
        <option value="sendPrivateMessage">sendPrivateMessage</option>
        <option value="sendBinaryGameMessage">sendBinaryGameMessage</option>
        <option value="sendBinaryPlayerMessage">sendBinaryPlayerMessage</option>
        <option value="sendBinaryPrivateMessage">sendBinaryPrivateMessage</option>
      </select><br>
      <span id="options"></span><br>
      <button id="send" style="display:none">Send</button><br>
      <br>
      Event logs:<br>
      <textarea id="logs" rows="10" cols="75" disabled></textarea><br><br>
      Data:<br>
      <p><textarea id="data" disabled></textarea></p>

    </div>
  </div>
`;

// Get textarea and make a logEvent function
const logsTextarea = document.getElementById("logs") as HTMLTextAreaElement;
function logEvent(event: string, value: object) {
  console.debug("[MINIGAME]", event, value);
  logsTextarea.value += `${event}: ${JSON.stringify(value)}\n\n`;
}

// Initialize MinigameSdk
let sdk: BaseMinigameSdk;
if (import.meta.env.MODE === "development") {
  sdk = new TestingMinigameSdk({
    minigameId: import.meta.env.VITE_MINIGAME_ID,
    testingAccessCode: import.meta.env.VITE_TESTING_ACCESS_CODE,
    playersToStart: 1,
  });
} else {
  sdk = new MinigameSdk();
}

console.debug("[MINIGAME] SDK", sdk);

// Handle events
const eventSelect = document.getElementById("event") as HTMLSelectElement;
const optionsSpan = document.getElementById("options") as HTMLSpanElement;
const sendButton = document.getElementById("send") as HTMLButtonElement;

// Set the data
const dataDiv = document.getElementById("data");
if (!dataDiv) throw new Error("Missing data div");

setInterval(() => {
  if (!sdk.data) return;
  dataDiv.innerHTML = JSON.stringify(sdk.data, null, 2);
}, 100);

// Handles SDK logic
sdk.ready();

sdk.once(ParentOpcodes.READY, (evt) => {
  logEvent("Ready", evt);
});

sdk.on(ParentOpcodes.UPDATE_SETTINGS, (evt) => {
  logEvent("UpdateSettings", evt);
});

sdk.once(ParentOpcodes.START_GAME, (evt) => {
  logEvent("StartGame", evt);
});

sdk.on(ParentOpcodes.MINIGAME_PLAYER_READY, (evt) => {
  logEvent("MinigamePlayerReady", evt);
});

sdk.on(ParentOpcodes.PLAYER_LEFT, (evt) => {
  logEvent("PlayerLeft", evt);
});

sdk.on(ParentOpcodes.UPDATED_GAME_STATE, (evt) => {
  logEvent("UpdatedGameState", evt);
});

sdk.on(ParentOpcodes.UPDATED_PLAYER_STATE, (evt) => {
  logEvent("UpdatedPlayerState", evt);
});

sdk.on(ParentOpcodes.RECEIVED_GAME_MESSAGE, (evt) => {
  logEvent("ReceivedGameMessage", evt);
});

sdk.on(ParentOpcodes.RECEIVED_PLAYER_MESSAGE, (evt) => {
  logEvent("ReceivedPlayerMessage", evt);
});

sdk.on(ParentOpcodes.RECEIVED_PRIVATE_MESSAGE, (evt) => {
  logEvent("ReceivedPrivateMessage", evt);
});

sdk.on(ParentOpcodes.RECEIVED_BINARY_GAME_MESSAGE, (evt) => {
  logEvent("ReceivedBinaryGameMessage", evt);
});

sdk.on(ParentOpcodes.RECEIVED_BINARY_PLAYER_MESSAGE, (evt) => {
  logEvent("ReceivedBinaryPlayerMessage", { user: evt.user, message: evt.message });
});

sdk.on(ParentOpcodes.RECEIVED_BINARY_PRIVATE_MESSAGE, (evt) => {
  logEvent("ReceivedBinaryPrivateMessage", { fromUser: evt.fromUser, toUser: evt.toUser, message: evt.message });
});

eventSelect.onchange = () => {
  if (!eventSelect.value) {
    sendButton.style.display = "none";
    optionsSpan.innerHTML = "";
    return;
  }

  sendButton.style.display = "";

  switch (eventSelect.value) {
    case "endGame":
      optionsSpan.innerHTML = "";
      break;
    case "saveLocalData":
      optionsSpan.innerHTML = `Data: <input id="data">`;
      break;
    case "setGameState":
      optionsSpan.innerHTML = `State: <input id="state">`;
      break;
    case "setPlayerState":
      optionsSpan.innerHTML = `
        Player ID / User: <input id="user" type="number"><br>
        State: <input id="state">
      `;
      break;
    case "sendGameMessage":
      optionsSpan.innerHTML = `Message: <input id="message">`;
      break;
    case "sendPlayerMessage":
      optionsSpan.innerHTML = `Message: <input id="message">`;
      break;
    case "sendPrivateMessage":
      optionsSpan.innerHTML = `
        To player ID / user: <input id="user" type="number"><br>
        Message: <input id="message">
      `;
      break;
    case "sendBinaryGameMessage":
      optionsSpan.innerHTML = `Message: <input id="message" value="[]">`;
      break;
    case "sendBinaryPlayerMessage":
      optionsSpan.innerHTML = `Message: <input id="message" value="[]">`;
      break;
    case "sendBinaryPrivateMessage":
      optionsSpan.innerHTML = `
        To player ID / user: <input id="user" type="number"><br>
        Message: <input id="message" value="[]">
      `;
      break;
  }
};

sendButton.onclick = () => {
  switch (eventSelect.value) {
    case "endGame": {
      return sdk.endGame();
    }
    case "saveLocalData": {
      const data = (document.getElementById("data") as HTMLInputElement).value;
      return sdk.saveLocalData({ data });
    }
    case "setGameState": {
      let state = (document.getElementById("state") as HTMLInputElement).value;
      try {
        state = JSON.parse(state);
      } catch (err) {}
      return sdk.setGameState({ state });
    }
    case "setPlayerState": {
      const user = Number((document.getElementById("user") as HTMLInputElement).value);
      let state = (document.getElementById("state") as HTMLInputElement).value;
      try {
        state = JSON.parse(state);
      } catch (err) {}
      return sdk.setPlayerState({ user, state });
    }
    case "sendGameMessage": {
      let message = (document.getElementById("message") as HTMLInputElement).value;
      try {
        message = JSON.parse(message);
      } catch (err) {}
      return sdk.sendGameMessage({ message });
    }
    case "sendPlayerMessage": {
      let message = (document.getElementById("message") as HTMLInputElement).value;
      try {
        message = JSON.parse(message);
      } catch (err) {}
      return sdk.sendPlayerMessage({ message });
    }
    case "sendPrivateMessage": {
      const userInput = document.getElementById("user") as HTMLInputElement;
      const user = userInput.value !== "" ? Number(userInput.value) : undefined;
      let message = (document.getElementById("message") as HTMLInputElement).value;
      try {
        message = JSON.parse(message);
      } catch (err) {}
      return sdk.sendPrivateMessage({ user, message });
    }
    case "sendBinaryGameMessage": {
      let message = JSON.parse((document.getElementById("message") as HTMLInputElement).value);
      return sdk.sendBinaryGameMessage({ message: new Uint8Array(message) });
    }
    case "sendBinaryPlayerMessage": {
      let message = JSON.parse((document.getElementById("message") as HTMLInputElement).value);
      return sdk.sendBinaryPlayerMessage({ message: new Uint8Array(message) });
    }
    case "sendBinaryPrivateMessage": {
      const userInput = document.getElementById("user") as HTMLInputElement;
      const user = userInput.value !== "" ? Number(userInput.value) : undefined;
      console.log(user);
      let message = JSON.parse((document.getElementById("message") as HTMLInputElement).value);
      return sdk.sendBinaryPrivateMessage({ user, message: new Uint8Array(message) });
    }
  }
};
