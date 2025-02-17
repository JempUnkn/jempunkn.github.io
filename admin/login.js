const PASTEBIN_RAW_URL = "https://gist.githubusercontent.com/JempUnkn/0ad5ebbb4a25b8e54711e5011a993b68/raw/f1e9490a30fb2537f1b20e8f6f2e0324c87938d0/empy"; // Link RAW do Pastebin

async function getEncryptedData() {
    try {
        document.getElementById("error-message").style.display = "none"; // Ocultar mensagem de erro
        document.getElementById("loading-message").style.display = "block"; // Mostrar mensagem de carregamento
        const response = await fetch(PASTEBIN_RAW_URL);
        document.getElementById("loading-message").style.display = "none"; // Ocultar mensagem de carregamento
        if (!response.ok) throw new Error("Erro ao obter os dados.");
        const data = await response.text();
        if (!data || data.trim() === "") throw new Error("Dados vazios ou inválidos.");
        return data;
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        document.getElementById("loading-message").style.display = "none"; // Ocultar mensagem de carregamento em caso de erro
        return null;
    }
}

function decryptData(encryptedText) {
    try {
        return atob(encryptedText); // Exemplo usando Base64
    } catch (error) {
        console.error("Erro ao descriptografar dados:", error);
        return null;
    }
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null;
}

window.onload = function () {
    console.log("Cookies no carregamento:", document.cookie);
    if (getCookie("auth") === "true") {
        console.log("Usuário autenticado. Redirecionando...");
        window.location.href = "index.html";
    } else {
        console.log("Usuário não autenticado.");
    }

    document.getElementById("login-form").addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const usernameInput = document.getElementById("username").value;
        const passwordInput = document.getElementById("password").value;
        const errorMessage = document.getElementById("error-message");
        
        const encryptedData = await getEncryptedData();
        if (!encryptedData) {
            errorMessage.textContent = "Erro ao carregar credenciais.";
            errorMessage.style.display = "block";
            return;
        }

        const decryptedData = decryptData(encryptedData);
        if (!decryptedData) {
            errorMessage.textContent = "Erro ao descriptografar as credenciais.";
            errorMessage.style.display = "block";
            return;
        }

        const [validUser, validPass] = decryptedData.split(":");

        if (usernameInput === validUser && passwordInput === validPass) {
            setCookie("auth", "true", 1);
            console.log("Cookie setado:", document.cookie);
            window.location.href = "index.html";
        } else {
            errorMessage.textContent = "Usuário ou senha incorretos.";
            errorMessage.style.display = "block";
        }
    });
};