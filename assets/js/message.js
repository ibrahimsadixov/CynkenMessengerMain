
const firebaseConfig = {
    apiKey: "AIzaSyCQuABLnB7AZXyHCnkLBKOWI_InltaR_fw",
    authDomain: "message-e092c.firebaseapp.com",
    databaseURL: "https://message-e092c-default-rtdb.firebaseio.com",
    projectId: "message-e092c",
    storageBucket: "message-e092c.appspot.com",
    messagingSenderId: "818764436281",
    appId: "1:818764436281:web:2bb174a3923a79c952cee8",
    measurementId: "G-SHH7HYBN3T"
};

firebase.initializeApp(firebaseConfig);

const storedUsername = localStorage.getItem('usernameMessage');
const storedPassword = localStorage.getItem('passwordMessage');
const notificationSound = document.getElementById("notification")
const notSwitch = document.getElementById("notificationSwitch")
const mobileClose = document.getElementById("mobileClose")
const not = document.getElementById("not")
let totalUnseenMessages = 0;
let isPageVisible = true;
let letNot = localStorage.getItem('letNot');

window.onload = () => {
    if (window.innerWidth <= 480) {
        right.classList.add("closed");
        left.classList.add("open");
        right.classList.remove("open");
        left.classList.remove("closed");

    }
};



if (letNot === null || letNot === undefined) {
    letNot = true;
} else {
    letNot = letNot === 'true';
}

function switcher() {
    if (!letNot) {
        letNot = true;
        not.classList.add("fa-bell");
        not.classList.remove("fa-bell-slash");
    } else {
        letNot = false;
        not.classList.remove("fa-bell");
        not.classList.add("fa-bell-slash");
    }

    localStorage.setItem('letNot', letNot);
}

notSwitch.addEventListener("click", () => {
    switcher();
});





document.addEventListener("visibilitychange", () => {
    isPageVisible = !document.hidden;
   
});




const messageMeDb = firebase.database().ref("users")
messageMeDb.on("value", (snapshot) => {
    const userList = document.getElementById("userList");

    userList.innerHTML = "";

if (snapshot.exists()) {
   
    snapshot.forEach((user) => {
      
        const username = user.val().name;
        
        const userphoto = user.val().photo;

        const listItem = document.createElement("li");
        listItem.classList.add("listItem");


        const usersImages = document.createElement("img");
        usersImages.classList.add("profileImage");
        if (userphoto==null) {
            usersImages.src = "./assets/images/logo/comandantelogo.png";    
        } else {
            usersImages.src = userphoto;
        
        }
        listItem.appendChild(usersImages);

        const users = document.createElement("span");
        users.textContent = username;
        users.classList.add("username")
    
        const lastMessageSpan = document.createElement("span");
        lastMessageSpan.classList.add("lastMessage");

  const countSpan = document.createElement("span");
            countSpan.classList.add("countSpan");

            
       
        const lastMessageRefCurrentUserToOther = firebase.database().ref("conversations").child(`${storedUsername}_${username}`).limitToLast(1);
        const lastMessageRefOtherUserToCurrent = firebase.database().ref("conversations").child(`${username}_${storedUsername}`).limitToLast(1);


        const unseenRefCtoO = firebase.database().ref("conversations").child(`${storedUsername}_${username}`).limitToLast(10);
        const unseenRefOtoC = firebase.database().ref("conversations").child(`${username}_${storedUsername}`).limitToLast(10);
        let countCtoO = 0;
        let countOtoC = 0;

        const handleUnseenMessages = () => {
            const totalUnseen = countCtoO + countOtoC;
            totalUnseenMessages = totalUnseen;

            if (totalUnseenMessages > 0 && !isPageVisible && letNot) {
           
                notificationSound.play();
            }

            
            if (countCtoO === 0) {
                countCtoO = "";
            }
            if (countOtoC === 0) {
                countOtoC = "";
            }
          
            countSpan.textContent = ` ${countCtoO} ${countOtoC}`;
            if (countSpan.textContent.trim() !== "") {
                listItem.appendChild(countSpan);
            } else {
                listItem.removeChild(countSpan);
            }

        
        };
        
        if (username!=storedUsername) {
            
        }
        unseenRefCtoO.on("child_added", (unseenMessageSnapshot) => {
           
            
            const unseenMessage = unseenMessageSnapshot.val();
            if (unseenMessage.sender !== storedUsername && unseenMessage.seen === false) {
                countCtoO++;
              
                handleUnseenMessages();
            }
        });
        
        unseenRefCtoO.on("child_changed", (unseenMessageSnapshot) => {
            const unseenMessage = unseenMessageSnapshot.val();
            if (unseenMessage.sender !== storedUsername && unseenMessage.seen === true) {
                countCtoO--;
                handleUnseenMessages();
            }
        });
        
        unseenRefOtoC.on("child_added", (unseenMessageSnapshot) => {
          
            const unseenMessage = unseenMessageSnapshot.val();
            if (unseenMessage.sender !== storedUsername && unseenMessage.seen === false) {
               
                if (!isPageVisible && letNot) {
                        
                    notificationSound.play()
                }
            
                countOtoC++;
              
                handleUnseenMessages();
            }
        });
        
        unseenRefOtoC.on("child_changed", (unseenMessageSnapshot) => {
            const unseenMessage = unseenMessageSnapshot.val();
            if (unseenMessage.sender !== storedUsername && unseenMessage.seen === true) {
      
                countOtoC--;
                handleUnseenMessages();
            }
        });
        
        

        lastMessageRefCurrentUserToOther.on("child_added", (lastMessageSnapshot) => {
            const lastMessage = lastMessageSnapshot.val();
            const timestamp = lastMessage.timestamp;
            const formattedTime = formatTimestamp(timestamp);
            lastMessageSpan.textContent = `${lastMessage.sender === storedUsername ? "" : ""}${formattedTime}`;
            order();
            
        });
        
        lastMessageRefOtherUserToCurrent.on("child_added", (lastMessageSnapshot) => {
            const lastMessage = lastMessageSnapshot.val();
            const timestamp = lastMessage.timestamp;
            const formattedTime = formatTimestamp(timestamp);
            lastMessageSpan.textContent = formattedTime;
            order();
          
        });

        
        function formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            const options = { hour12: false };
            const formattedTime = date.toLocaleString(undefined, options);
            return formattedTime;
        }
        
        

        listItem.appendChild(users);
    
        listItem.appendChild(lastMessageSpan);

    
        

        listItem.addEventListener("click", (event) => {
            if (window.innerWidth<=480) {
                
                left.classList.add("closed")
                left.classList.remove("open")
                right.classList.add("open")
                right.classList.remove("closed")
                
                
            }
            let otherUsername = username;
            if (event.target === listItem || listItem.contains(event.target)) {

               const otherUserImage = userphoto;
               displayUserMessages(otherUsername, otherUserImage);
            }
        });

        userList.appendChild(listItem);
    });
} 
});


function order() {
    const userList = document.getElementById("userList");
    const listItems = Array.from(userList.querySelectorAll(".listItem"));

    const sortedListItems = listItems.sort((a, b) => {
        const timestampA = extractTimestamp(a.querySelector(".lastMessage").textContent);
        const timestampB = extractTimestamp(b.querySelector(".lastMessage").textContent);

        return timestampB - timestampA;
    });

    sortedListItems.forEach(item => userList.appendChild(item));
}

function extractTimestamp(formattedTime) {
    const date = new Date(formattedTime);

    if (!isNaN(date.getTime())) {
        return date.getTime();
    }

    return 0;
}


order();




messageMeDb.orderByChild("name").equalTo(storedUsername).once("value", (snapshot) => {
    if (snapshot.exists()) {
        snapshot.forEach((user) => {
            const storedDbPassword = user.val().password;
            if (storedPassword === storedDbPassword) {
                const displayUsernameElement = document.getElementById("displayUsername");
                displayUsernameElement.textContent = `${storedUsername}`;

                const displayProfileImageElement = document.getElementById("displayProfileImage");
                const storedProfileImageUrl = user.val().photo;      
                if (storedProfileImageUrl) {
                    displayProfileImageElement.src = storedProfileImageUrl;
                } else {
                
                    displayProfileImageElement.src = "./assets/images/logo/comandantelogo.png";
                }
            } else {
                alert('Incorrect password!');
                document.getElementById("displayUsername").textContent = "";
            }
        });
    } else {
        
        document.getElementById("displayUsername").textContent = "";
        window.location.href = "index.htm";
    }
});

function handleMessageInput(event, otherUsername) {
    if (event.key === 'Enter' && !event.shiftKey) {
        sendMessage(otherUsername);
        event.preventDefault();
    }
}

const userMessagesContainer = document.getElementById("userMessagesContainer");
const left = document.getElementById("left");
const right = document.getElementById("right");
// mobile


mobileClose.addEventListener("click",()=>{
   

    left.classList.add("open")
        left.classList.remove("closed")
        right.classList.add("closed")
        right.classList.remove("open")
        userMessagesContainer.innerHTML=""
   
})


// mobile
function displayUserMessages(otherUsername, otherUserImage) {
    console.log("birinici "+otherUsername)
    clickedUsername=otherUsername
   
    const userMessagesContainer = document.getElementById("userMessagesContainer");
    userMessagesContainer.innerHTML = "";
  
    if (otherUserImage==null) {
        otherUserImage = "./assets/images/logo/comandantelogo.png";    
    } 


    userMessagesContainer.innerHTML = `
    <div class="otherUser">
        <img class="profileImage" src="${otherUserImage}"/>
        <h3 id="a">${otherUsername}</h3>
    </div>
    <form id="messageForm" onsubmit="return false;">
        <ul  style="height: ${window.innerWidth > 480 ? window.innerHeight - 180 : window.innerHeight - 250}px;" id="messageList" id="messageList"></ul>
        <div class="myMessage">
            <textarea type="text" id="messageInput" placeholder="Mesajınızı yazın..." style="resize: none;">
           </textarea>
            <button class="sendBtn" onclick="sendMessage('${otherUsername}')">GÖNDƏR</button>
        </div>
    </form>
`;




 
    const messageList = document.getElementById("messageList");
    
    
   
    
    let combinedRefs;

    if (otherUsername !== storedUsername) {
        const conversationRef1 = firebase.database().ref("conversations").child(`${storedUsername}_${otherUsername}`);
        const conversationRef2 = firebase.database().ref("conversations").child(`${otherUsername}_${storedUsername}`);
        combinedRefs = [conversationRef1, conversationRef2];
    } else if (otherUsername === storedUsername) {
        const conversationRef2 = firebase.database().ref("conversations").child(`${otherUsername}_${storedUsername}`);
        combinedRefs = [conversationRef2];
   
    }
    
    combinedRefs.forEach((conversationRef) => {

        conversationRef.orderByChild('timestamp').on("child_added", (snapshot) => {
            const message = snapshot.val();
            const listItem = document.createElement("li");
            const messageTime = new Date(message.timestamp).toLocaleTimeString();

        
      
            if (message.sender === storedUsername ) {
                const me = document.createElement("span");
                const time = document.createElement("sub");
                time.classList.add("time");
                time.textContent = `${messageTime}`;
                time.style.justifyContent = "flex-end";
                time.style.right = "20px";
                me.textContent = `${message.text}`;
                me.classList.add("me");
                me.appendChild(time);
                listItem.style.justifyContent = "flex-end";

               
                const seen = document.createElement("div");
                seen.classList.add("seen");
                listItem.appendChild(seen);
                snapshot.ref.child('seen').on('value', (seenSnapshot) => {
                    seen.classList.add(seenSnapshot.val() ? "seen-active" : "");
                });

                listItem.appendChild(me);
            } else if (message.sender === otherUsername) {
                const other = document.createElement("span");
                const time = document.createElement("sub");
                time.classList.add("time");
                time.textContent = `${messageTime}`;
                time.style.justifyContent = "flex-start";
                time.style.left = "0px";
                other.textContent = `${message.text}`;
                other.classList.add("other");
                other.appendChild(time);
                listItem.style.justifyContent = "flex-start";
                listItem.appendChild(other);

                if (message.sender === clickedUsername && !message.seen && isPageVisible) {
            
                    snapshot.ref.child('seen').set(true);
                }
             

               window.addEventListener("focus", () => {
                if (message.sender === clickedUsername && !message.seen && isPageVisible) {
                   
                    snapshot.ref.child('seen').set(true);
                }
             
            });
                
            }
            messageList.appendChild(listItem);
            
            requestAnimationFrame(() => {
                messageList.scrollTop = messageList.scrollHeight;
            });

        });
        
     

    });

    
 
    

    const messageInput = document.getElementById("messageInput");
    messageInput.addEventListener("keydown", (event) => {
        handleMessageInput(event, otherUsername);
    });

}



function sendMessage(otherUsername) {
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();

    if (messageText !== "") {
        sendMessageToConversation(storedUsername, otherUsername, messageText);
        messageInput.value = "";
    }
}


function sendMessageToConversation(sender, receiver, text) {

    const conversationKey = [sender, receiver].sort().join('_');
    const conversationRef = firebase.database().ref("conversations").child(conversationKey);

    conversationRef.push({
        sender: sender,
        text: text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        seen: false
    });
 
}




const search = document.getElementById("search")


search.addEventListener("input",()=> {
    const searchTerm = search.value.toLowerCase();
    const userList = document.getElementById("userList");

    for (let i = 0; i < userList.children.length; i++) {
        const listItem = userList.children[i];
        const username = listItem.textContent.toLowerCase();

        if (username.includes(searchTerm)) {
            listItem.style.display = "flex";
        } else {
            listItem.style.display = "none";
        }
    }
});

document.getElementById('imageUpload').addEventListener('change', function (e) {
    const fileInput = e.target;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        const storageRef = firebase.storage().ref(`profileImages/${storedUsername}`);
        const uploadTask = storageRef.put(file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
              
            },
            (error) => {
                console.error('Error uploading image:', error);
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    messageMeDb.orderByChild('name').equalTo(storedUsername).once('child_added', (userSnapshot) => {
                        const userId = userSnapshot.key;
                        messageMeDb.child(userId).update({ photo: downloadURL });

                        // Update the profile image without reloading the user list
                        document.getElementById('displayProfileImage').src = downloadURL;
                    });
                });
            }
        );
    }
});

const users = [
    { username: "ibrahimsadixov", defaultMessage: "Yunan tanrım, sizi sevirəm! Yaxşı ki, varsınız!" },
    { username: "analmaster", defaultMessage: "haqq yolu varkən, pox yoluna getdin..." },
  ]

  const container = document.querySelector(".container");
const kingButton = document.getElementById("kingButton");

let kingCreated = false; 

kingButton.addEventListener("click", () => {
  if (!kingCreated) {
    const king = document.createElement("div");
    king.classList.add("king");
    const close = document.createElement("div");
    close.classList.add("close");
    close.innerHTML = "X";
    king.appendChild(close);
    close.addEventListener("click", () => {
      kingCreated = false;
      container.removeChild(king);
    });
    users.forEach((user) => {
      createUser(user, king);
    });

    kingCreated = true;
  }
});

function createUser(user, king) {
  const kingAccount = document.createElement("div");
  kingAccount.classList.add("kingAccount");

  const text = document.createElement("p");
  text.classList.add("text");
  text.innerHTML = `"Üzərinə iki dəfə klik edərək xüsusi şəkildə hazırlanmış default mesajı göndərin"`;

  king.appendChild(text);

  const crown = document.createElement("i");
  crown.classList = "fa-solid fa-crown crown";

  const kingImage = document.createElement("img");
  kingImage.classList.add("profileImage");

  const kingImageHolder = document.createElement("div");
  kingImageHolder.classList.add("kingImageHolder");

  kingImageHolder.appendChild(crown);

  const done = document.createElement("div");
  done.classList.add("done");
  done.innerHTML = "Mesaj uğurla göndərildi!";

  const dblclickHandler = () => {
    const defaultMessage = user.defaultMessage || "Default Message";

    sendMessageToConversation(storedUsername, user.username, defaultMessage);

    container.appendChild(done);

    setTimeout(() => {
      container.removeChild(done);
    }, 1000);
  };

  kingAccount.addEventListener("dblclick", dblclickHandler);

  messageMeDb.orderByChild("name").equalTo(user.username).once("child_added", (snapshot) => {
    const storedProfileImageUrl = snapshot.val().photo;
    const storedUsername = snapshot.val().name;

    kingImage.src = storedProfileImageUrl || "./assets/images/logo/comandantelogo.png";
    kingImageHolder.appendChild(kingImage);

    const kingName = document.createElement("span");
    kingName.textContent = storedUsername;
    kingName.classList.add("username");
    kingAccount.appendChild(kingImageHolder);
    kingAccount.appendChild(kingName);
    king.appendChild(kingAccount);

    if (!kingCreated) {
      container.appendChild(king);
    }
  });
}

