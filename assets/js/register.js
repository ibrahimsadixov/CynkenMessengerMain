
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
  
  const username = document.getElementById("username");
const password = document.getElementById("password");
const signUp = document.getElementById("signUp");
let isSignUpDisabled = false;

const messageMeDb = firebase.database().ref("users");

document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSignUpDisabled) {
        return;
    }

    signUp.disabled = true;
    isSignUpDisabled = true;

    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();

    // Validate username length
    const minUsernameLength = 3;
    const maxUsernameLength = 20;

    if (usernameValue.length < minUsernameLength || usernameValue.length > maxUsernameLength) {
        alert(`Username must be between ${minUsernameLength} and ${maxUsernameLength} characters.`);
        signUp.disabled = false;
        isSignUpDisabled = false;
        return;
    }

    // Validate password
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(passwordValue);
    const hasNumber = /\d/.test(passwordValue);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

    if (passwordValue.length < minLength || !hasLetter || !hasNumber || !hasSpecialChar) {
        alert('Password must meet the following criteria:\n' +
            `- At least ${minLength} characters long\n` +
            `- Contains at least one letter\n` +
            `- Contains at least one number\n` +
            `- Contains at least one special character`);
        signUp.disabled = false;
        isSignUpDisabled = false;
        return;
    }

    try {
        const snapshot = await messageMeDb.orderByChild("name").equalTo(usernameValue).once("value");

        if (snapshot.exists()) {
            alert('Username already exists!');
        } else {
            await messageMeDb.push({
                name: usernameValue,
                password: passwordValue,
            });

            localStorage.setItem('usernameMessage', usernameValue);
            localStorage.setItem('passwordMessage', passwordValue);

            username.value = '';
            password.value = '';

            window.location.href = "message.htm";
        }
    } catch (error) {
        console.error("Error in database operation:", error);
    } finally {
        signUp.disabled = false;
        isSignUpDisabled = false;
    }
});