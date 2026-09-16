// Supabase Credentials
const SUPABASE_URL = 'https://icxchdxawuketsxngkzk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljeGNoZHhhd3VrZXRzeG5na3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NDk4OTEsImV4cCI6MjEwNTEyNTg5MX0.4oVJAooaZg8lp8UkzbojfF8vFd4BNZ4j4yhyLpg8hvk';

// Supabase Client Connection
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Direct Login Function
async function handleLogin() {
    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('errorMsg');

    if (!usernameInput || !passwordInput) {
        errorMsg.style.color = "red";
        errorMsg.innerText = "User ID နှင့် Password ဖြည့်ပါ။";
        return;
    }

    errorMsg.style.color = "#0090ff";
    errorMsg.innerText = "စစ်ဆေးနေပါသည်...";

    try {
        const { data, error } = await _supabase
            .from('admin_users')
            .select('*')
            .eq('username', usernameInput)
            .eq('password', passwordInput);

        if (error) {
            console.error("Supabase Query Error:", error);
            errorMsg.style.color = "red";
            errorMsg.innerText = "DB Error: " + error.message;
            return;
        }

        if (!data || data.length === 0) {
            errorMsg.style.color = "red";
            errorMsg.innerText = "User ID သို့မဟုတ် Password မှားယွင်းနေပါသည်။";
        } else {
            // User Session သိမ်းဆည်းပြီး Dashboard သို့ သွားမည်
            sessionStorage.setItem('adminUser', JSON.stringify(data[0]));
            window.location.href = 'dashboard.html';
        }
    } catch (err) {
        console.error("Catch Error:", err);
        errorMsg.style.color = "red";
        errorMsg.innerText = "ချိတ်ဆက်မှု မအောင်မြင်ပါ။ (URL/Key စစ်ဆေးပါ)";
    }
}

// Dashboard Init
function initDashboard() {
    const userSession = sessionStorage.getItem('adminUser');
    
    if (!userSession) {
        window.location.href = 'index.html';
        return;
    }

    const user = JSON.parse(userSession);
    const role = user.role;
    
    const roleDisplay = document.getElementById('userRoleDisplay');
    if (roleDisplay) {
        roleDisplay.innerText = `Logged in as: ${user.username} (Role: ${role.toUpperCase()})`;
    }

    if (role === 'main') {
        document.getElementById('menu-theme')?.classList.remove('hide');
        document.getElementById('menu-player')?.classList.remove('hide');
        document.getElementById('menu-partner')?.classList.remove('hide');
        document.getElementById('menu-agent')?.classList.remove('hide');
        document.getElementById('menu-match')?.classList.remove('hide');
    } else {
        const targetMenu = document.getElementById(`menu-${role}`);
        if (targetMenu) {
            targetMenu.classList.remove('hide');
        }
    }
}

function switchTab(tabName) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('hide'));

    const activeSection = document.getElementById(`content-${tabName}`);
    if (activeSection) {
        activeSection.classList.remove('hide');
    }
}

function logout() {
    sessionStorage.removeItem('adminUser');
    window.location.href = 'index.html';
}