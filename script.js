/* =========================================================
   VELORA — FULL FUNCTIONAL SCRIPT
   Swity AI + Voice Chat + Reminders + Navigation
========================================================= */

"use strict";

/* =========================
   BASIC HELPERS
========================= */

const $ = (id) => document.getElementById(id);

function toast(message) {
    let old = document.querySelector(".velora-toast");
    if (old) old.remove();

    const t = document.createElement("div");
    t.className = "velora-toast";
    t.textContent = message;

    Object.assign(t.style, {
        position: "fixed",
        left: "50%",
        bottom: "90px",
        transform: "translateX(-50%)",
        background: "rgba(20,20,25,.95)",
        color: "#fff",
        padding: "12px 18px",
        borderRadius: "14px",
        zIndex: "99999",
        fontSize: "14px",
        border: "1px solid rgba(255,255,255,.12)",
        boxShadow: "0 10px 30px rgba(0,0,0,.35)"
    });

    document.body.appendChild(t);

    setTimeout(() => {
        t.style.opacity = "0";
        t.style.transition = ".3s";
        setTimeout(() => t.remove(), 300);
    }, 1800);
}


/* =========================
   DATE
========================= */

function updateDate() {

    const now = new Date();

    const currentDate = $("currentDate");
    const dayNumber = $("dayNumber");
    const monthName = $("monthName");

    if (currentDate) {
        currentDate.textContent =
            now.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });
    }

    if (dayNumber) {
        dayNumber.textContent = now.getDate();
    }

    if (monthName) {
        monthName.textContent =
            now.toLocaleDateString("en-IN", {
                month: "short"
            }).toUpperCase();
    }
}

updateDate();


/* =========================
   PROFILE MODAL
========================= */

const profileBtn = $("profileBtn");
const profileModal = $("profileModal");
const closeProfile = $("closeProfile");

if (profileBtn && profileModal) {
    profileBtn.addEventListener("click", () => {
        profileModal.classList.add("show");
    });
}

if (closeProfile && profileModal) {
    closeProfile.addEventListener("click", () => {
        profileModal.classList.remove("show");
    });
}

if (profileModal) {
    profileModal.addEventListener("click", (e) => {
        if (e.target === profileModal) {
            profileModal.classList.remove("show");
        }
    });
}

const premiumBtn = $("premiumBtn");

if (premiumBtn) {
    premiumBtn.addEventListener("click", () => {
        toast("VELORA Premium coming soon ✦");
    });
}


/* =========================================================
   SWITY AI CHAT UI
========================================================= */

const swityCSS = document.createElement("style");

swityCSS.textContent = `

#swityAIOverlay{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.72);
    backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);
    z-index:100000;
    display:none;
    align-items:flex-end;
    justify-content:center;
}

#swityAIOverlay.active{
    display:flex;
}

#swityAIBox{
    width:100%;
    max-width:480px;
    height:82vh;
    background:#0b0c12;
    border:1px solid rgba(255,255,255,.1);
    border-radius:28px 28px 0 0;
    display:flex;
    flex-direction:column;
    overflow:hidden;
    box-shadow:0 -20px 60px rgba(0,0,0,.5);
    animation:swityUp .3s ease;
}

@keyframes swityUp{
    from{
        transform:translateY(100%);
        opacity:0;
    }
    to{
        transform:translateY(0);
        opacity:1;
    }
}

#swityHeader{
    padding:18px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    border-bottom:1px solid rgba(255,255,255,.08);
}

#swityTitle{
    display:flex;
    align-items:center;
    gap:10px;
    color:white;
    font-weight:700;
}

#swityOrb{
    width:38px;
    height:38px;
    border-radius:50%;
    background:radial-gradient(circle at 35% 30%,#fff,#c8ff5a 25%,#9b7cff 60%,#161421);
    box-shadow:0 0 25px rgba(200,255,90,.3);
}

#swityClose{
    width:38px;
    height:38px;
    border:0;
    border-radius:50%;
    background:rgba(255,255,255,.07);
    color:white;
    font-size:20px;
}

#swityMessages{
    flex:1;
    overflow-y:auto;
    padding:18px;
    display:flex;
    flex-direction:column;
    gap:12px;
}

.swityMsg{
    max-width:82%;
    padding:12px 15px;
    border-radius:18px;
    font-size:14px;
    line-height:1.5;
    word-wrap:break-word;
}

.swityUser{
    align-self:flex-end;
    background:#c8ff5a;
    color:#10120b;
    border-bottom-right-radius:5px;
}

.swityBot{
    align-self:flex-start;
    background:rgba(255,255,255,.07);
    color:#f5f5f7;
    border-bottom-left-radius:5px;
}

#swityTyping{
    display:none;
    padding:0 18px 10px;
    color:#8d909a;
    font-size:12px;
}

#swityInputArea{
    padding:12px;
    display:flex;
    gap:8px;
    border-top:1px solid rgba(255,255,255,.08);
    background:#090a0f;
}

#swityInput{
    flex:1;
    min-width:0;
    border:1px solid rgba(255,255,255,.1);
    outline:none;
    background:rgba(255,255,255,.06);
    color:white;
    padding:13px 14px;
    border-radius:16px;
    font-size:14px;
}

#swityMic,
#switySend{
    width:46px;
    height:46px;
    border:0;
    border-radius:15px;
    font-size:18px;
}

#swityMic{
    background:rgba(255,255,255,.08);
    color:white;
}

#switySend{
    background:#c8ff5a;
    color:#10120b;
}

#swityMic.listening{
    animation:micPulse 1s infinite;
    background:#ff526d;
    color:white;
}

@keyframes micPulse{
    50%{
        transform:scale(1.08);
        box-shadow:0 0 25px rgba(255,82,109,.5);
    }
}

.swityQuick{
    display:flex;
    gap:8px;
    overflow-x:auto;
    padding:0 18px 10px;
}

.swityQuick button{
    white-space:nowrap;
    border:1px solid rgba(255,255,255,.1);
    background:rgba(255,255,255,.06);
    color:#ddd;
    border-radius:20px;
    padding:8px 12px;
}

`;

document.head.appendChild(swityCSS);


/* =========================
   CREATE AI PANEL
========================= */

function createSwityAI() {

    if ($("swityAIOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "swityAIOverlay";

    overlay.innerHTML = `

        <div id="swityAIBox">

            <div id="swityHeader">

                <div id="swityTitle">
                    <div id="swityOrb"></div>

                    <div>
                        <div>SWITY AI</div>
                        <small style="color:#8d909a">
                            Your personal AI assistant
                        </small>
                    </div>
                </div>

                <button id="swityClose">×</button>

            </div>


            <div id="swityMessages"></div>

            <div class="swityQuick">

                <button data-q="What can you do?">
                    What can you do?
                </button>

                <button data-q="What is the time?">
                    Time
                </button>

                <button data-q="What is today's date?">
                    Date
                </button>

                <button data-q="Give me motivation">
                    Motivation
                </button>

            </div>


            <div id="swityTyping">
                Swity is thinking...
            </div>


            <div id="swityInputArea">

                <button id="swityMic">🎙️</button>

                <input
                    id="swityInput"
                    type="text"
                    placeholder="Ask Swity anything..."
                    autocomplete="off"
                >

                <button id="switySend">➤</button>

            </div>

        </div>
    `;

    document.body.appendChild(overlay);


    /* CLOSE */

    $("swityClose").addEventListener("click", closeSwity);

    overlay.addEventListener("click", (e) => {

        if (e.target === overlay) {
            closeSwity();
        }

    });


    /* SEND */

    $("switySend").addEventListener("click", sendSwityMessage);

    $("swityInput").addEventListener("keydown", (e) => {

        if (e.key === "Enter") {
            sendSwityMessage();
        }

    });


    /* QUICK BUTTONS */

    document.querySelectorAll(".swityQuick button")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                $("swityInput").value =
                    btn.dataset.q;

                sendSwityMessage();

            });

        });


    /* MICROPHONE */

    setupSpeechRecognition();

}


/* =========================
   OPEN / CLOSE SWITY
========================= */

function openSwity() {

    createSwityAI();

    const overlay = $("swityAIOverlay");

    overlay.classList.add("active");

    if (!$("swityMessages").children.length) {

        addSwityMessage(
            "Hello Boss 👋 I'm Swity. How can I help you today?",
            "bot"
        );

    }

    setTimeout(() => {
        $("swityInput").focus();
    }, 200);

}


function closeSwity() {

    const overlay = $("swityAIOverlay");

    if (overlay) {
        overlay.classList.remove("active");
    }

}


/* =========================
   EXISTING SWITY BUTTONS
========================= */

const openSwityBtn = $("openSwity");
const swityCard = $("swityCard");

if (openSwityBtn) {
    openSwityBtn.addEventListener("click", openSwity);
}

if (swityCard) {
    swityCard.addEventListener("click", openSwity);
}


/* =========================
   CHAT MESSAGE
========================= */

function addSwityMessage(text, type) {

    const messages = $("swityMessages");

    if (!messages) return;

    const msg = document.createElement("div");

    msg.className =
        "swityMsg " +
        (type === "user"
            ? "swityUser"
            : "swityBot");

    msg.textContent = text;

    messages.appendChild(msg);

    messages.scrollTop = messages.scrollHeight;
}


/* =========================
   SEND MESSAGE
========================= */

function sendSwityMessage() {

    const input = $("swityInput");

    if (!input) return;

    const text = input.value.trim();

    if (!text) return;

    addSwityMessage(text, "user");

    input.value = "";

    showTyping();

    setTimeout(() => {

        hideTyping();

        const reply = getSwityReply(text);

        addSwityMessage(reply, "bot");

        speakSwity(reply);

    }, 600);

}


/* =========================
   LOCAL SWITY BRAIN
========================= */

function getSwityReply(message) {

    const text = message.toLowerCase().trim();


    /* GREETING */

    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey") ||
        text.includes("namaste")
    ) {

        return "Hello Boss ✦ I'm Swity. What would you like to do today?";

    }


    /* WHO */

    if (
        text.includes("who are you") ||
        text.includes("tu kon") ||
        text.includes("तू कोण")
    ) {

        return "I'm Swity, your personal AI assistant inside VELORA. ✦";

    }


    /* TIME */

    if (
        text.includes("time") ||
        text.includes("वेळ") ||
        text.includes("kit vajle")
    ) {

        return "Right now it's " +
            new Date().toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ) + ".";

    }


    /* DATE */

    if (
        text.includes("date") ||
        text.includes("today") ||
        text.includes("आज")
    ) {

        return "Today is " +
            new Date().toLocaleDateString(
                "en-IN",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            ) + ".";

    }


    /* MOTIVATION */

    if (
        text.includes("motivat") ||
        text.includes("inspiration") ||
        text.includes("हार") ||
        text.includes("tired")
    ) {

        return "Boss, small progress is still progress. Keep moving. 🔥 Today doesn't need to be perfect — just better than yesterday.";

    }


    /* TASK */

    if (
        text.includes("task") ||
        text.includes("todo") ||
        text.includes("काम")
    ) {

        const count =
            localStorage.getItem("veloraTasks") || "0";

        return "You currently have " +
            count +
            " saved task(s).";

    }


    /* REMINDER */

    if (
        text.includes("reminder") ||
        text.includes("remind") ||
        text.includes("आठवण")
    ) {

        return "You can add a reminder from the Reminder section on your VELORA dashboard. ⏰";

    }


    /* VELORA */

    if (
        text.includes("velora")
    ) {

        return "VELORA is your personal daily-life workspace — tasks, reminders, money, focus, goals and Swity AI in one place.";

    }


    /* CAPABILITIES */

    if (
        text.includes("what can you do") ||
        text.includes("what do you do") ||
        text.includes("capabilities")
    ) {

        return "I can chat with you, listen through your microphone, speak replies, tell you the time/date, help with reminders and give quick motivation. ✦";

    }


    /* THANKS */

    if (
        text.includes("thank") ||
        text.includes("thanks") ||
        text.includes("धन्यवाद")
    ) {

        return "Always here, Boss. ✦";

    }


    /* DEFAULT */

    return "I understood you, Boss. ✦ For full ChatGPT-level answers, VELORA needs an AI API connected through a secure backend. Right now I'm running in smart local mode.";

}


/* =========================
   TYPING
========================= */

function showTyping() {

    const el = $("swityTyping");

    if (el) {
        el.style.display = "block";
    }

}

function hideTyping() {

    const el = $("swityTyping");

    if (el) {
        el.style.display = "none";
    }

}


/* =========================================================
   VOICE OUTPUT
========================================================= */

function speakSwity(text) {

    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance =
        new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1.15;
    utterance.volume = 1;

    const voices =
        window.speechSynthesis.getVoices();

    const femaleVoice =
        voices.find(v =>
            /female|zira|samantha|google us english/i
                .test(v.name)
        );

    if (femaleVoice) {
        utterance.voice = femaleVoice;
    }

    window.speechSynthesis.speak(utterance);

}


/* =========================================================
   MICROPHONE / SPEECH RECOGNITION
========================================================= */

function setupSpeechRecognition() {

    const mic = $("swityMic");

    if (!mic) return;


    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        mic.addEventListener("click", () => {

            toast(
                "Voice input is not supported in this browser."
            );

        });

        return;
    }


    const recognition =
        new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-IN";


    mic.addEventListener("click", () => {

        try {

            recognition.start();

            mic.classList.add("listening");

            mic.textContent = "🔴";

            toast("Listening... बोल Boss 🎙️");

        } catch (error) {

            console.log(error);

        }

    });


    recognition.onresult = (event) => {

        const result =
            event.results[0][0].transcript;

        $("swityInput").value = result;

        mic.classList.remove("listening");

        mic.textContent = "🎙️";

        sendSwityMessage();

    };


    recognition.onend = () => {

        mic.classList.remove("listening");

        mic.textContent = "🎙️";

    };


    recognition.onerror = () => {

        mic.classList.remove("listening");

        mic.textContent = "🎙️";

        toast("Voice input failed. Try again.");

    };

}


/* =========================================================
   REMINDERS
========================================================= */

const addReminderBtn = $("addReminderBtn");
const reminderCard = $("reminderCard");

function loadReminders() {

    if (!reminderCard) return;

    const reminders =
        JSON.parse(
            localStorage.getItem("veloraReminders") || "[]"
        );

    if (!reminders.length) {

        reminderCard.innerHTML = `
            <div style="padding:10px 0;color:#8d909a">
                No reminders yet
            </div>
        `;

        return;
    }


    reminderCard.innerHTML = "";

    reminders.forEach((reminder, index) => {

        const item =
            document.createElement("div");

        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.justifyContent = "space-between";
        item.style.padding = "10px 0";
        item.style.borderBottom =
            "1px solid rgba(255,255,255,.07)";

        item.innerHTML = `

            <div>
                <div style="color:white">
                    ${escapeHTML(reminder.text)}
                </div>

                <small style="color:#8d909a">
                    ${escapeHTML(reminder.time)}
                </small>
            </div>

            <button
                data-delete="${index}"
                style="
                    border:0;
                    background:rgba(255,255,255,.07);
                    color:#ff6b81;
                    border-radius:10px;
                    padding:8px 10px;
                "
            >
                ×
            </button>
        `;

        reminderCard.appendChild(item);

    });


    reminderCard
        .querySelectorAll("[data-delete]")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                const index =
                    Number(btn.dataset.delete);

                deleteReminder(index);

            });

        });

}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function addReminder() {

    const text =
        prompt("Reminder काय आहे?");

    if (!text || !text.trim()) return;

    const time =
        prompt(
            "Time लिहा. Example: 7:30 PM"
        ) || "Anytime";


    const reminders =
        JSON.parse(
            localStorage.getItem("veloraReminders") || "[]"
        );


    reminders.push({
        text: text.trim(),
        time: time.trim()
    });


    localStorage.setItem(
        "veloraReminders",
        JSON.stringify(reminders)
    );


    loadReminders();

    toast("Reminder added ✓");

}


function deleteReminder(index) {

    const reminders =
        JSON.parse(
            localStorage.getItem("veloraReminders") || "[]"
        );

    reminders.splice(index, 1);

    localStorage.setItem(
        "veloraReminders",
        JSON.stringify(reminders)
    );

    loadReminders();

    toast("Reminder deleted");

}


if (addReminderBtn) {

    addReminderBtn.addEventListener(
        "click",
        addReminder
    );

}

loadReminders();


/* =========================================================
   BOTTOM NAVIGATION
========================================================= */

document
    .querySelectorAll("[data-page]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const page =
                button.dataset.page;


            if (page === "ai") {

                openSwity();
                return;

            }


            if (page === "home") {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                return;

            }


            if (page === "tasks") {

                toast("Tasks module ready — coming next ✦");
                return;

            }


            if (page === "money") {

                toast("Money Tracker ready — coming next ✦");
                return;

            }


            if (page === "more") {

                toast("More features coming soon ✦");
                return;

            }

        });

    });


/* =========================================================
   VIEW ALL
========================================================= */

const viewAllBtn = $("viewAllBtn");

if (viewAllBtn) {

    viewAllBtn.addEventListener(
        "click",
        () => {

            toast("All activity will appear here ✦");

        }
    );

}


/* =========================================================
   STATS
========================================================= */

function loadStats() {

    const taskCount = $("taskCount");
    const focusTime = $("focusTime");
    const expenseAmount = $("expenseAmount");
    const habitStreak = $("habitStreak");


    const savedTasks =
        localStorage.getItem("veloraTasks");

    const savedFocus =
        localStorage.getItem("veloraFocus");

    const savedExpense =
        localStorage.getItem("veloraExpense");

    const savedStreak =
        localStorage.getItem("veloraStreak");


    if (taskCount && savedTasks) {
        taskCount.textContent = savedTasks;
    }

    if (focusTime && savedFocus) {
        focusTime.textContent =
            savedFocus + "h";
    }

    if (expenseAmount && savedExpense) {
        expenseAmount.textContent =
            "₹" + savedExpense;
    }

    if (habitStreak && savedStreak) {
        habitStreak.textContent =
            savedStreak;
    }

}

loadStats();


/* =========================================================
   BUTTON TOUCH FEEDBACK
========================================================= */

document
    .querySelectorAll("button")
    .forEach(button => {

        button.addEventListener(
            "touchstart",
            () => {

                button.style.transform =
                    "scale(.96)";

            },
            {
                passive: true
            }
        );


        button.addEventListener(
            "touchend",
            () => {

                button.style.transform =
                    "";

            },
            {
                passive: true
            }
        );

    });


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        closeSwity();

        if (profileModal) {
            profileModal.classList.remove("show");
        }

    }

});


/* =========================================================
   READY
========================================================= */

console.log(
    "VELORA initialized successfully ✦"
);

console.log(
    "Swity AI + Voice Chat loaded."
);
