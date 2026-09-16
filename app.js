// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Login Logic Handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();
        const errorMsg = document.getElementById('errorMsg');

        errorMsg.innerText = "Processing...";

        // Supabase DB ထဲမှာ User ID & Password စစ်ဆေးခြင်း
        const { data, error } = await _supabase
            .from('admin_users')
            .select('*')
            .eq('username', usernameInput)
            .eq('password', passwordInput)
            .single();

        if (error || !data) {
            errorMsg.innerText = "User ID သို့မဟုတ် Password မှားယွင်းနေပါသည်။";
        } else {
            // User Session သိမ်းဆည်းပြီး Dashboard သို့ ပို့မည်
            sessionStorage.setItem('adminUser', JSON.stringify(data));
            window.location.href = 'dashboard.html';
        }
    });
}

// Dashboard Page Initialization Logic
function initDashboard() {
    const userSession = sessionStorage.getItem('adminUser');
    
    // Login မဝင်ထားရင် Login Page ကို ပြန်မောင်းထုတ်မည်
    if (!userSession) {
        window.location.href = 'index.html';
        return;
    }

    const user = JSON.parse(userSession);
    const role = user.role;
    
    document.getElementById('userRoleDisplay').innerText = `Logged in as: ${user.username} (Role: ${role.toUpperCase()})`;

    // Role အလိုက် Menu များကို ပေါ်အောင် လုပ်ဆောင်ခြင်း
    if (role === 'main') {
        // Main Admin ဖြစ်ပါက အကုန်ပြမည်
        document.getElementById('menu-theme').classList.remove('hide');
        document.getElementById('menu-player').classList.remove('hide');
        document.getElementById('menu-partner').classList.remove('hide');
        document.getElementById('menu-agent').classList.remove('hide');
        document.getElementById('menu-match').classList.remove('hide');
    } else {
        // Specific Admin ဖြစ်ပါက သက်ဆိုင်ရာ Menu တစ်ခုတည်းသာပြမည်
        const targetMenu = document.getElementById(`menu-${role}`);
        if (targetMenu) {
            targetMenu.classList.remove('hide');
        }
    }
}

// Menu Tab များကို နှိပ်လိုက်ပါက Content အပြောင်းအလဲလုပ်ခြင်း
function switchTab(tabName) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('hide'));

    const activeSection = document.getElementById(`content-${tabName}`);
    if (activeSection) {
        activeSection.classList.remove('hide');
    }
}

// Logout Logic
function logout() {
    sessionStorage.removeItem('adminUser');
    window.location.href = 'index.html';
}