let isChatOpen = false;
const baseUrl = 'https://codemasters.xyz/';
let storeMsg = [];

function openChat() {
    if (isChatOpen === false) {
        isChatOpen = true;
        document.getElementById("js-msg-head").classList.remove("d-none");
        document.getElementById("js-msg-body").classList.remove("d-none");
        document.getElementById("js-landing").classList.add("d-none");
    }
}

function handelTagClick(text) {
    openChat();
    addMsg(text);
    loadingMsg();

    handelRequest(text);
}

document.getElementById("js-input-send").addEventListener("click", function (event) {
    event.preventDefault();
    send();
});

document.getElementById("js-message-send").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        send();
    }
    disableHandelSendButton()
});

function disableHandelSendButton() {
    let msg = document.getElementById("js-message-send").value;
    let buttonElement = document.getElementById("js-input-send");

    if (msg.trim() !== '') {
        buttonElement.disabled = false;
        buttonElement.classList.add('input-send');
    } else {
        buttonElement.disabled = true;
        buttonElement.classList.remove('input-send');
    }
}

function handelRequest(msg) {
    let url = `${baseUrl}chat`;

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/8.6.1'},
        body: `{"message": "${msg}"}`
      };
      
      fetch(url, options)
        .then(response => response.json())
        .then(response => {
            addResponseMsg(response?.answer);
            removeLoadingMsg()
        })
        .catch(err => console.error(err));
}

function send() {
    let msg = document.getElementById("js-message-send").value;
    if (msg.trim() == "") return;
    openChat();
    addMsg(msg);
    loadingMsg();
    handelRequest(msg);
}

function addMsg(msg, isStore) {
    var div = document.createElement("li");
    div.innerHTML = `<p>${msg}</p>`;
    div.className = "repaly";
    document.getElementById("message-box").appendChild(div);
    //SEND MESSAGE TO API
    document.getElementById("js-message-send").value = "";
    document.getElementById("js-msg-body").scrollTop = document.getElementById(
        "message-box"
    ).scrollHeight;
    if (!isStore) storeMessages('repaly', msg)
}

function loadingMsg() {
    var div = document.createElement("li");
    div.innerHTML = "<div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>";
    div.className = "sender chat-message-loading";
    document.getElementById("message-box").appendChild(div);
    document.getElementById("js-msg-body").scrollTop = document.getElementById(
        "message-box"
    ).scrollHeight;
    running = false;
}

function removeLoadingMsg() {
    document.querySelectorAll(".chat-message-loading").forEach(el => el.remove());
}

function addResponseMsg(msg, isStore) {
    var div = document.createElement("li");
    div.innerHTML = `<p>${msg}</p>`;
    div.className = "sender";
    document.getElementById("message-box").appendChild(div);
    document.getElementById("js-msg-body").scrollTop = document.getElementById(
        "message-box"
    ).scrollHeight;
    running = false;
    if (!isStore) storeMessages('sender', msg)
}

function storeMessages(type, msg) {
    if (storeMsg.length > 200) {
        storeMsg.shift();
    }  
    storeMsg.push({type, msg});
    localStorage.setItem("nextChat", JSON.stringify(storeMsg));
}

function initialLoad() {
    let msgs = localStorage.getItem("nextChat");

    if (msgs) {
        storeMsg = JSON.parse(msgs);
        if (storeMsg?.length) {
            openChat();
            storeMsg.forEach(item => {
                console.log("item", item);

                if (item.type === 'sender') {
                    addResponseMsg(item.msg, true)
                } 
                if (item.type === 'repaly') {
                    addMsg(item.msg, true)
                }
            })
        }
    }
}