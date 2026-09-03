/* =========================================
   VELORA — SCRIPT
   Elevate Every Day.
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       HELPER
    ========================================= */

    const $ = (id) => document.getElementById(id);


    /* =========================================
       DATE & GREETING
    ========================================= */

    const currentDate = $("currentDate");
    const dayNumber = $("dayNumber");
    const monthName = $("monthName");

    const greetingElement = document.querySelector(".greeting");

    const now = new Date();

    if (currentDate) {
        currentDate.textContent = now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });
    }

    if (dayNumber) {
        dayNumber.textContent = String(now.getDate()).padStart(2, "0");
    }

    if (monthName) {
        monthName.textContent = now.toLocaleDateString("en-US", {
            month: "short"
        }).toUpperCase();
    }

    if (greetingElement) {

        const hour = now.getHours();

        if (hour < 12) {
            greetingElement.textContent = "Good morning";
        } else if (hour < 17) {
            greetingElement.textContent = "Good afternoon";
        } else if (hour < 21) {
            greetingElement.textContent = "Good evening";
        } else {
            greetingElement.textContent = "Good night";
        }
    }


    /* =========================================
       TOAST MESSAGE
    ========================================= */

    let toastTimer;

    function showToast(message) {

        let toast = document.querySelector(".velora-toast");

        if (!toast) {

            toast = document.createElement("div");

            toast.className = "velora-toast";

            toast.style.position = "fixed";
            toast.style.left = "50%";
            toast.style.bottom = "92px";
            toast.style.transform = "translateX(-50%) translateY(20px)";
            toast.style.padding = "12px 18px";
            toast.style.borderRadius = "14px";
            toast.style.background = "rgba(20,20,27,.94)";
            toast.style.border = "1px solid rgba(200,255,90,.25)";
            toast.style.color = "#f5f5f7";
            toast.style.fontSize = "13px";
            toast.style.fontWeight = "600";
            toast.style.zIndex = "9999";
            toast.style.opacity = "0";
            toast.style.transition = "all .25s ease";
            toast.style.pointerEvents = "none";
            toast.style.whiteSpace = "nowrap";
            toast.style.boxShadow = "0 12px 35px rgba(0,0,0,.35)";

            document.body.appendChild(toast);
        }

        toast.textContent = message;

        clearTimeout(toastTimer);

        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform =
                "translateX(-50%) translateY(0)";
        });

        toastTimer = setTimeout(() => {

            toast.style.opacity = "0";

            toast.style.transform =
                "translateX(-50%) translateY(20px)";

        }, 2200);
    }


    /* =========================================
       PROFILE MODAL
    ========================================= */

    const profileBtn = $("profileBtn");
    const profileModal = $("profileModal");
    const closeProfile = $("closeProfile");
    const premiumBtn = $("premiumBtn");

    if (profileBtn && profileModal) {

        profileBtn.addEventListener("click", () => {

            profileModal.classList.add("show");

            profileModal.style.display = "flex";
        });
    }

    if (closeProfile && profileModal) {

        closeProfile.addEventListener("click", () => {

            profileModal.classList.remove("show");

            profileModal.style.display = "none";
        });
    }

    if (profileModal) {

        profileModal.addEventListener("click", (event) => {

            if (event.target === profileModal) {

                profileModal.classList.remove("show");

                profileModal.style.display = "none";
            }
        });
    }

    if (premiumBtn) {

        premiumBtn.addEventListener("click", () => {

            showToast("VELORA Premium is coming soon ✦");
        });
    }


    /* =========================================
       BOTTOM NAVIGATION
    ========================================= */

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach((item) => {

        item.addEventListener("click", () => {

            navItems.forEach((nav) => {
                nav.classList.remove("active");
            });

            item.classList.add("active");

            const page = item.dataset.page;

            if (page === "home") {

                showToast("Home");
            }

            else if (page === "tasks") {

                showToast("Tasks module coming next ✦");
            }

            else if (page === "ai") {

                showToast("Swity AI coming next ✦");
            }

            else if (page === "money") {

                showToast("Money Tracker coming next ✦");
            }

            else if (page === "more") {

                showToast("More features coming next ✦");
            }

        });
    });


    /* =========================================
       SWITY AI BUTTON
    ========================================= */

    const openSwity = $("openSwity");
    const swityCard = $("swityCard");

    if (openSwity) {

        openSwity.addEventListener("click", () => {

            showToast("Hello Boss ✦ Swity is getting ready...");
        });
    }

    if (swityCard) {

        swityCard.addEventListener("click", (event) => {

            if (event.target.closest("button")) return;

            showToast("Swity AI coming next ✦");
        });
    }


    /* =========================================
       REMINDERS
    ========================================= */

    const addReminderBtn = $("addReminderBtn");
    const reminderCard = $("reminderCard");

    const REMINDER_KEY = "velora_reminders";


    function getReminders() {

        try {

            return JSON.parse(
                localStorage.getItem(REMINDER_KEY)
            ) || [];

        } catch (error) {

            return [];
        }
    }


    function saveReminders(reminders) {

        localStorage.setItem(
            REMINDER_KEY,
            JSON.stringify(reminders)
        );
    }


    function escapeHTML(text) {

        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function renderReminders() {

        if (!reminderCard) return;

        const reminders = getReminders();

        if (reminders.length === 0) {

            reminderCard.innerHTML = `
                <div style="
                    padding:20px;
                    text-align:center;
                    color:#8d909a;
                    font-size:13px;
                ">
                    No reminders yet
                </div>
            `;

            return;
        }


        reminderCard.innerHTML = reminders.map((reminder, index) => {

            return `
                <div style="
                    display:flex;
                    align-items:center;
                    gap:12px;
                    padding:14px 4px;
                    border-bottom:1px solid rgba(255,255,255,.06);
                ">

                    <div style="
                        width:38px;
                        height:38px;
                        border-radius:12px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:rgba(200,255,90,.08);
                        color:#c8ff5a;
                        flex-shrink:0;
                    ">
                        ⏰
                    </div>

                    <div style="
                        flex:1;
                        min-width:0;
                    ">

                        <div style="
                            color:#f5f5f7;
                            font-size:14px;
                            font-weight:600;
                            overflow:hidden;
                            text-overflow:ellipsis;
                            white-space:nowrap;
                        ">
                            ${escapeHTML(reminder.text)}
                        </div>

                        <div style="
                            margin-top:3px;
                            color:#8d909a;
                            font-size:11px;
                        ">
                            ${escapeHTML(reminder.time || "Anytime")}
                        </div>

                    </div>

                    <button
                        class="delete-reminder"
                        data-index="${index}"
                        style="
                            border:0;
                            background:transparent;
                            color:#8d909a;
                            font-size:16px;
                            cursor:pointer;
                            padding:8px;
                        "
                    >
                        ×
                    </button>

                </div>
            `;

        }).join("");


        reminderCard
            .querySelectorAll(".delete-reminder")
            .forEach((button) => {

                button.addEventListener("click", () => {

                    const index =
                        Number(button.dataset.index);

                    const reminders = getReminders();

                    reminders.splice(index, 1);

                    saveReminders(reminders);

                    renderReminders();

                    showToast("Reminder deleted");
                });
            });
    }


    if (addReminderBtn) {

        addReminderBtn.addEventListener("click", () => {

            const text = prompt(
                "What should VELORA remind you about?"
            );

            if (!text || !text.trim()) return;


            const time = prompt(
                "Enter time (example: 7:30 PM) — optional"
            );


            const reminders = getReminders();

            reminders.unshift({
                text: text.trim(),
                time: time ? time.trim() : "Anytime",
                createdAt: Date.now()
            });

            saveReminders(reminders);

            renderReminders();

            showToast("Reminder added ✓");
        });
    }

    renderReminders();


    /* =========================================
       VIEW ALL
    ========================================= */

    const viewAllBtn = $("viewAllBtn");

    if (viewAllBtn) {

        viewAllBtn.addEventListener("click", () => {

            showToast("All dashboard features coming next ✦");
        });
    }


    /* =========================================
       STATS
    ========================================= */

    const taskCount = $("taskCount");
    const focusTime = $("focusTime");
    const expenseAmount = $("expenseAmount");
    const habitStreak = $("habitStreak");


    if (taskCount) {

        const tasks =
            JSON.parse(
                localStorage.getItem("velora_tasks") || "[]"
            );

        if (Array.isArray(tasks)) {

            const incompleteTasks =
                tasks.filter(task => !task.completed);

            taskCount.textContent =
                incompleteTasks.length;
        }
    }


    if (focusTime) {

        const savedFocus =
            localStorage.getItem("velora_focus_time");

        if (savedFocus) {

            focusTime.textContent =
                savedFocus;
        }
    }


    if (expenseAmount) {

        const savedExpense =
            localStorage.getItem("velora_expense");

        if (savedExpense) {

            expenseAmount.textContent =
                "₹" + savedExpense;
        }
    }


    if (habitStreak) {

        const streak =
            localStorage.getItem("velora_streak");

        if (streak) {

            habitStreak.textContent =
                streak;
        }
    }


    /* =========================================
       BUTTON FEEDBACK
    ========================================= */

    document
        .querySelectorAll("button")
        .forEach((button) => {

            button.addEventListener("touchstart", () => {

                button.style.transform = "scale(.97)";

            }, { passive: true });


            button.addEventListener("touchend", () => {

                setTimeout(() => {

                    button.style.transform = "";

                }, 100);

            }, { passive: true });

        });


    /* =========================================
       VELORA READY
    ========================================= */

    console.log(
        "VELORA initialized successfully ✦"
    );

});
