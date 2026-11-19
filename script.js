/**
 * Student Management System - Client Side Controller & Validation Engine
 * Communicates with Java Servlets (/api/students, /api/dashboard, /api/login)
 * Supports dynamic rendering, live search, multi-field filtering, and client validation.
 */

// API Configuration
const API_CONFIG = {
    // Dynamically detects current context path
    basePath: window.location.pathname.substring(0, window.location.pathname.indexOf('/', 1)) || '',
    get studentEndpoint() {
        return `${this.basePath}/api/students`;
    },
    get dashboardEndpoint() {
        return `${this.basePath}/api/dashboard`;
    },
    get loginEndpoint() {
        return `${this.basePath}/api/login`;
    },
    get logoutEndpoint() {
        return `${this.basePath}/api/logout`;
    }
};

// Initial Fallback Sample Records for offline/standalone preview
const DEFAULT_STUDENTS = [
    {
        id: 1,
        studentId: 'STU-1001',
        name: 'Aarav Sharma',
        registerNo: 'REG2024CS001',
        dob: '2003-05-14',
        gender: 'Male',
        department: 'Computer Science',
        year: '3rd Year',
        email: 'aarav.sharma@example.edu',
        phone: '+91 9876543210',
        address: '42 Tech Park Avenue, Bangalore, Karnataka',
        status: 'Active',
        createdAt: '2024-08-01 10:15:00'
    },
    {
        id: 2,
        studentId: 'STU-1002',
        name: 'Diya Patel',
        registerNo: 'REG2024IT002',
        dob: '2004-08-22',
        gender: 'Female',
        department: 'Information Technology',
        year: '2nd Year',
        email: 'diya.patel@example.edu',
        phone: '+91 9812345678',
        address: '15 Lake View Road, Ahmedabad, Gujarat',
        status: 'Active',
        createdAt: '2024-08-02 11:30:00'
    },
    {
        id: 3,
        studentId: 'STU-1003',
        name: 'Rohan Verma',
        registerNo: 'REG2024EC003',
        dob: '2002-11-09',
        gender: 'Male',
        department: 'Electronics & Comm.',
        year: '4th Year',
        email: 'rohan.verma@example.edu',
        phone: '+91 9723456789',
        address: '78 Green Glen Layout, Hyderabad, Telangana',
        status: 'Active',
        createdAt: '2024-08-03 09:45:00'
    },
    {
        id: 4,
        studentId: 'STU-1004',
        name: 'Ananya Iyer',
        registerNo: 'REG2024CS004',
        dob: '2005-02-18',
        gender: 'Female',
        department: 'Computer Science',
        year: '1st Year',
        email: 'ananya.iyer@example.edu',
        phone: '+91 9934567890',
        address: '102 Temple Street, Chennai, Tamil Nadu',
        status: 'Active',
        createdAt: '2024-08-05 14:20:00'
    },
    {
        id: 5,
        studentId: 'STU-1005',
        name: 'Vikram Malhotra',
        registerNo: 'REG2024ME005',
        dob: '2003-09-30',
        gender: 'Male',
        department: 'Mechanical',
        year: '3rd Year',
        email: 'vikram.m@example.edu',
        phone: '+91 9645678901',
        address: '55 Industrial Area, Pune, Maharashtra',
        status: 'Active',
        createdAt: '2024-08-07 16:10:00'
    },
    {
        id: 6,
        studentId: 'STU-1006',
        name: 'Sneha Kulkarni',
        registerNo: 'REG2024EE006',
        dob: '2004-04-12',
        gender: 'Female',
        department: 'Electrical & Electronics',
        year: '2nd Year',
        email: 'sneha.k@example.edu',
        phone: '+91 9556789012',
        address: '23 Cyber City, Mumbai, Maharashtra',
        status: 'Active',
        createdAt: '2024-08-10 12:00:00'
    },
    {
        id: 7,
        studentId: 'STU-1007',
        name: 'Karthik Raja',
        registerNo: 'REG2024CV007',
        dob: '2002-07-25',
        gender: 'Male',
        department: 'Civil',
        year: '4th Year',
        email: 'karthik.r@example.edu',
        phone: '+91 9467890123',
        address: '88 Hill View Colony, Coimbatore, Tamil Nadu',
        status: 'Graduated',
        createdAt: '2024-08-12 15:35:00'
    },
    {
        id: 8,
        studentId: 'STU-1008',
        name: 'Pooja Nair',
        registerNo: 'REG2024IT008',
        dob: '2005-01-10',
        gender: 'Female',
        department: 'Information Technology',
        year: '1st Year',
        email: 'pooja.nair@example.edu',
        phone: '+91 9378901234',
        address: '14 Palm Grove, Kochi, Kerala',
        status: 'Active',
        createdAt: '2024-08-15 11:20:00'
    }
];

// App State
const AppState = {
    students: [],
    currentStudent: null,
    deleteTargetId: null,
    isBackendConnected: false
};

// Security PIN requirement for viewing student records
const SECURITY_PIN = '7337';
let pendingTargetUrl = 'students.html';

function isStudentsAccessGranted() {
    return sessionStorage.getItem('sms_view_students_unlocked') === 'true';
}

function setStudentsAccessGranted(granted) {
    if (granted) {
        sessionStorage.setItem('sms_view_students_unlocked', 'true');
    } else {
        sessionStorage.removeItem('sms_view_students_unlocked');
    }
}

function ensureSecurityModalInDom() {
    if (document.getElementById('securityPinModal')) return;

    const modalHtml = `
    <div class="modal-backdrop" id="securityPinModal">
        <div class="modal-dialog" style="max-width: 440px;">
            <div class="modal-header">
                <h3><i class="fas fa-shield-alt" style="color: var(--primary); margin-right: 8px;"></i> Security Verification</h3>
                <button class="modal-close" onclick="closeSecurityPinModal()">&times;</button>
            </div>
            <div class="modal-body" style="text-align: center; padding: 2rem 1.75rem 1.5rem 1.75rem;">
                <div class="lock-avatar">
                    <i class="fas fa-lock"></i>
                </div>
                <h4 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">Protected Student Records</h4>
                <p style="color: var(--text-muted); font-size: 0.88rem;">Please enter the security password to view all student records.</p>
                
                <div class="pin-input-group">
                    <input type="password" id="securityPinInput" class="pin-input" maxlength="8" placeholder="••••" autocomplete="off">
                    <div class="pin-error-text" id="pinErrorMessage"></div>
                </div>
                
                <div style="font-size: 0.8rem; color: var(--text-subtle);">
                    <i class="fas fa-key"></i> Passcode: <code>7337</code>
                </div>
            </div>
            <div class="modal-footer" style="justify-content: space-between;">
                <button type="button" class="btn btn-secondary" onclick="closeSecurityPinModal()">Cancel</button>
                <button type="button" class="btn btn-primary" onclick="verifySecurityPin()">
                    <i class="fas fa-unlock-alt"></i> Verify & Open
                </button>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const input = document.getElementById('securityPinInput');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifySecurityPin();
            }
        });
    }
}

function openSecurityPinModal(targetUrl = 'students.html') {
    ensureSecurityModalInDom();
    pendingTargetUrl = targetUrl;
    const input = document.getElementById('securityPinInput');
    const errorMsg = document.getElementById('pinErrorMessage');
    if (input) {
        input.value = '';
        input.classList.remove('shake');
    }
    if (errorMsg) errorMsg.textContent = '';
    openModal('securityPinModal');
    setTimeout(() => {
        if (input) input.focus();
    }, 150);
}

function closeSecurityPinModal() {
    closeModal('securityPinModal');
    // If on students.html and still not unlocked, return to dashboard
    if (window.location.pathname.endsWith('students.html') && !isStudentsAccessGranted()) {
        window.location.href = 'dashboard.html';
    }
}

function verifySecurityPin() {
    const input = document.getElementById('securityPinInput');
    const errorMsg = document.getElementById('pinErrorMessage');
    if (!input) return;

    const entered = input.value.trim();

    if (entered === SECURITY_PIN) {
        setStudentsAccessGranted(true);
        showToast('success', 'Access Granted', 'Password verified successfully!');
        closeModal('securityPinModal');

        if (window.location.pathname.endsWith('students.html')) {
            unlockStudentsPage();
        } else {
            window.location.href = pendingTargetUrl || 'students.html';
        }
    } else {
        input.classList.remove('shake');
        void input.offsetWidth;
        input.classList.add('shake');
        if (errorMsg) {
            errorMsg.textContent = '❌ Incorrect Password! Access Denied.';
        }
        input.value = '';
        input.focus();
    }
}

function lockStudentsPage() {
    const lockOverlay = document.getElementById('studentsLockedOverlay');
    const tableCard = document.getElementById('studentsCardContent');
    if (lockOverlay) lockOverlay.style.display = 'block';
    if (tableCard) tableCard.style.display = 'none';
}

function unlockStudentsPage() {
    const lockOverlay = document.getElementById('studentsLockedOverlay');
    const tableCard = document.getElementById('studentsCardContent');
    if (lockOverlay) lockOverlay.style.display = 'none';
    if (tableCard) tableCard.style.display = 'block';
    loadStudents();
    setupSearchAndFilter();
}

function relockStudentsView() {
    setStudentsAccessGranted(false);
    showToast('info', 'Locked', 'Student records have been locked.');
    lockStudentsPage();
    openSecurityPinModal('students.html');
}

window.handleViewAllStudentsClick = function(event, target = 'students.html') {
    if (!isStudentsAccessGranted()) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        openSecurityPinModal(target);
        return false;
    }
    return true;
};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    setupSidebar();
    setupModals();
    setupFormValidation();
    checkAuthStatus();
    setupSecurityProtection();

    // Check which page we are on and initialize accordingly
    if (document.getElementById('statsGrid')) {
        await loadDashboard();
    }

    if (document.getElementById('studentsTableBody')) {
        if (!isStudentsAccessGranted()) {
            lockStudentsPage();
            openSecurityPinModal('students.html');
        } else {
            unlockStudentsPage();
        }
    }

    if (document.getElementById('addStudentForm')) {
        setupAddStudentForm();
    }

    if (document.getElementById('loginForm')) {
        setupLoginForm();
    }
}

function setupSecurityProtection() {
    ensureSecurityModalInDom();

    // Intercept all links targeting students.html
    document.querySelectorAll('a[href="students.html"], a[href$="/students.html"]').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!isStudentsAccessGranted()) {
                e.preventDefault();
                e.stopPropagation();
                openSecurityPinModal(link.getAttribute('href') || 'students.html');
            }
        });
    });
}

/* ========================================================
   AUTHENTICATION & USER SESSION
   ======================================================== */
function checkAuthStatus() {
    const userJson = localStorage.getItem('sms_user');
    const userElement = document.getElementById('topbarUserName');
    const userRoleElement = document.getElementById('topbarUserRole');

    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            if (userElement) userElement.textContent = user.name || user.username || 'Admin';
            if (userRoleElement) userRoleElement.textContent = 'Administrator';
        } catch (e) {
            console.error('Error parsing user session', e);
        }
    }
}

function setupLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const loginBtn = document.getElementById('loginBtn');

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            showToast('error', 'Validation Error', 'Please enter both username and password.');
            return;
        }

        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';

        try {
            // Attempt Java Servlet login
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const res = await fetch(API_CONFIG.loginEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem('sms_user', JSON.stringify({
                        username: username,
                        name: data.data ? data.data.name : 'Administrator'
                    }));
                    showToast('success', 'Login Successful', 'Welcome to Student Management System');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 800);
                    return;
                }
            }

            // Fallback for demo when backend is offline
            if ((username === 'admin' && password === 'admin123') || (username === 'admin' && password === 'admin')) {
                localStorage.setItem('sms_user', JSON.stringify({ username: 'admin', name: 'System Administrator' }));
                showToast('success', 'Demo Login', 'Welcome Administrator (Demo Mode)');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 800);
            } else {
                showToast('error', 'Authentication Failed', 'Invalid username or password.');
            }
        } catch (err) {
            // Backend offline fallback check
            if ((username === 'admin' && password === 'admin123') || (username === 'admin' && password === 'admin')) {
                localStorage.setItem('sms_user', JSON.stringify({ username: 'admin', name: 'System Administrator' }));
                showToast('success', 'Logged In', 'Welcome to Student Management System');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 600);
            } else {
                showToast('error', 'Login Error', 'Invalid credentials or server unavailable.');
            }
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = 'Sign In to Dashboard <i class="fas fa-arrow-right"></i>';
        }
    });
}

function handleLogout() {
    localStorage.removeItem('sms_user');
    fetch(API_CONFIG.logoutEndpoint, { method: 'POST' }).catch(() => {});
    showToast('info', 'Logged Out', 'Redirecting to login...');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 600);
}

/* ========================================================
   DASHBOARD DATA & STATS
   ======================================================== */
async function loadDashboard() {
    try {
        const res = await fetch(API_CONFIG.dashboardEndpoint);
        if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) {
                AppState.isBackendConnected = true;
                renderDashboardMetrics(result.data);
                renderRecentStudentsTable(result.data.recentStudents || []);
                return;
            }
        }
    } catch (e) {
        console.warn('Backend servlet unavailable. Using local data repository.');
    }

    // Fallback: Compute stats from local store
    loadLocalStore();
    computeAndRenderLocalDashboard();
}

function renderDashboardMetrics(data) {
    const totalEl = document.getElementById('totalStudentsCount');
    const activeEl = document.getElementById('activeStudentsCount');
    const deptEl = document.getElementById('totalDeptsCount');
    const graduatedEl = document.getElementById('graduatedCount');

    if (totalEl) totalEl.textContent = data.totalStudents || 0;
    if (activeEl) activeEl.textContent = data.activeStudents || 0;
    if (deptEl) deptEl.textContent = data.departmentCount || 0;
    if (graduatedEl) graduatedEl.textContent = data.graduatedStudents || 0;

    renderDepartmentBreakdown(data.departmentDistribution || {});
}

function computeAndRenderLocalDashboard() {
    const students = AppState.students;
    const total = students.length;
    const active = students.filter(s => s.status === 'Active').length;
    const graduated = students.filter(s => s.status === 'Graduated').length;
    const depts = new Set(students.map(s => s.department));

    const deptDist = {};
    students.forEach(s => {
        deptDist[s.department] = (deptDist[s.department] || 0) + 1;
    });

    renderDashboardMetrics({
        totalStudents: total,
        activeStudents: active,
        departmentCount: depts.size,
        graduatedStudents: graduated,
        departmentDistribution: deptDist
    });

    const recent = [...students].slice(0, 5);
    renderRecentStudentsTable(recent);
}

function renderDepartmentBreakdown(distribution) {
    const container = document.getElementById('deptDistributionContainer');
    if (!container) return;

    container.innerHTML = '';
    const entries = Object.entries(distribution);

    if (entries.length === 0) {
        container.innerHTML = '<p class="text-muted">No department data available.</p>';
        return;
    }

    entries.forEach(([dept, count]) => {
        const item = document.createElement('div');
        item.className = 'dept-chip';
        item.innerHTML = `
            <span class="dept-name">${escapeHtml(dept)}</span>
            <span class="badge badge-dept">${count} Students</span>
        `;
        container.appendChild(item);
    });
}

function renderRecentStudentsTable(students) {
    const tbody = document.getElementById('recentStudentsBody');
    if (!tbody) return;

    if (!students || students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center" style="padding: 2rem; color: var(--text-muted);">
                    No recent student records available.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = students.map(s => `
        <tr>
            <td>
                <div class="student-cell">
                    <div class="avatar-circle">${getInitials(s.name)}</div>
                    <div class="student-meta">
                        <div class="student-name">${escapeHtml(s.name)}</div>
                        <div class="student-id-sub">${escapeHtml(s.studentId)}</div>
                    </div>
                </div>
            </td>
            <td><strong>${escapeHtml(s.registerNo)}</strong></td>
            <td><span class="badge badge-dept">${escapeHtml(s.department)}</span></td>
            <td>${escapeHtml(s.year)}</td>
            <td><span class="badge badge-${s.status.toLowerCase()}">${escapeHtml(s.status)}</span></td>
        </tr>
    `).join('');
}

/* ========================================================
   STUDENTS CRUD & DATA OPERATIONS
   ======================================================== */
async function loadStudents() {
    const tbody = document.getElementById('studentsTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="padding: 2.5rem;">
                    <i class="fas fa-circle-notch fa-spin fa-2x" style="color: var(--primary);"></i>
                    <p style="margin-top: 0.5rem; color: var(--text-muted);">Loading students...</p>
                </td>
            </tr>`;
    }

    try {
        const res = await fetch(`${API_CONFIG.studentEndpoint}?action=list`);
        if (res.ok) {
            const result = await res.json();
            if (result.success && Array.isArray(result.data)) {
                AppState.isBackendConnected = true;
                AppState.students = result.data;
                renderStudentsTable(AppState.students);
                return;
            }
        }
    } catch (e) {
        console.warn('Backend server not responding. Loading local storage records.');
    }

    // Fallback to localStorage or defaults
    loadLocalStore();
    renderStudentsTable(AppState.students);
}

function loadLocalStore() {
    const stored = localStorage.getItem('sms_students');
    if (stored) {
        try {
            AppState.students = JSON.parse(stored);
            return;
        } catch (e) {
            console.error('Error reading localStorage', e);
        }
    }
    AppState.students = [...DEFAULT_STUDENTS];
    saveLocalStore();
}

function saveLocalStore() {
    localStorage.setItem('sms_students', JSON.stringify(AppState.students));
}

function renderStudentsTable(students) {
    const tbody = document.getElementById('studentsTableBody');
    const countBadge = document.getElementById('studentTableCount');

    if (countBadge) {
        countBadge.textContent = `${students.length} Records`;
    }

    if (!tbody) return;

    if (!students || students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="padding: 3rem 1rem;">
                    <div style="color: var(--text-subtle); font-size: 2.5rem; margin-bottom: 0.5rem;">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <h4 style="color: var(--text-main); margin-bottom: 0.25rem;">No Students Found</h4>
                    <p style="color: var(--text-muted); font-size: 0.88rem;">Try adjusting your search criteria or register a new student.</p>
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = students.map(s => `
        <tr id="row-student-${s.id}">
            <td><strong>${escapeHtml(s.studentId)}</strong></td>
            <td>
                <div class="student-cell">
                    <div class="avatar-circle">${getInitials(s.name)}</div>
                    <div class="student-meta">
                        <div class="student-name">${escapeHtml(s.name)}</div>
                        <div class="student-id-sub"><i class="fas fa-calendar-alt"></i> DOB: ${escapeHtml(s.dob || 'N/A')}</div>
                    </div>
                </div>
            </td>
            <td><strong>${escapeHtml(s.registerNo)}</strong></td>
            <td>
                <span class="badge badge-dept">${escapeHtml(s.department)}</span>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${escapeHtml(s.year)}</div>
            </td>
            <td>
                <div><i class="fas fa-envelope" style="color: var(--text-subtle); margin-right: 4px;"></i>${escapeHtml(s.email)}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);"><i class="fas fa-phone" style="color: var(--text-subtle); margin-right: 4px;"></i>${escapeHtml(s.phone)}</div>
            </td>
            <td>${escapeHtml(s.gender || 'N/A')}</td>
            <td><span class="badge badge-${(s.status || 'Active').toLowerCase()}">${escapeHtml(s.status || 'Active')}</span></td>
            <td>
                <div style="display: flex; gap: 0.35rem;">
                    <button class="btn-action view" title="View Details" onclick="viewStudentDetails(${s.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action edit" title="Edit Student" onclick="openEditStudentModal(${s.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action delete" title="Delete Student" onclick="confirmDeleteStudent(${s.id}, '${escapeHtml(s.name)}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/* ========================================================
   SEARCH & FILTER LOGIC
   ======================================================== */
function setupSearchAndFilter() {
    const searchInput = document.getElementById('studentSearchInput');
    const deptFilter = document.getElementById('deptFilter');
    const yearFilter = document.getElementById('yearFilter');
    const statusFilter = document.getElementById('statusFilter');

    function executeFilter() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedDept = deptFilter ? deptFilter.value : '';
        const selectedYear = yearFilter ? yearFilter.value : '';
        const selectedStatus = statusFilter ? statusFilter.value : '';

        const filtered = AppState.students.filter(student => {
            const matchesQuery = !query ||
                (student.studentId && student.studentId.toLowerCase().includes(query)) ||
                (student.name && student.name.toLowerCase().includes(query)) ||
                (student.registerNo && student.registerNo.toLowerCase().includes(query)) ||
                (student.email && student.email.toLowerCase().includes(query));

            const matchesDept = !selectedDept || selectedDept === 'All' || student.department === selectedDept;
            const matchesYear = !selectedYear || selectedYear === 'All' || student.year === selectedYear;
            const matchesStatus = !selectedStatus || selectedStatus === 'All' || student.status === selectedStatus;

            return matchesQuery && matchesDept && matchesYear && matchesStatus;
        });

        renderStudentsTable(filtered);
    }

    if (searchInput) searchInput.addEventListener('input', executeFilter);
    if (deptFilter) deptFilter.addEventListener('change', executeFilter);
    if (yearFilter) yearFilter.addEventListener('change', executeFilter);
    if (statusFilter) statusFilter.addEventListener('change', executeFilter);
}

/* ========================================================
   ADD STUDENT FORM & CLIENT VALIDATION
   ======================================================== */
function setupAddStudentForm() {
    const form = document.getElementById('addStudentForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateStudentForm(form)) {
            showToast('error', 'Validation Failed', 'Please fix all highlighted errors before submitting.');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving Student...';

        const newStudent = {
            studentId: form.studentId.value.trim(),
            name: form.name.value.trim(),
            registerNo: form.registerNo.value.trim(),
            dob: form.dob.value,
            gender: form.gender.value,
            department: form.department.value,
            year: form.year.value,
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            address: form.address.value.trim(),
            status: form.status.value || 'Active'
        };

        try {
            // Attempt Java Servlet POST request
            const formData = new URLSearchParams();
            formData.append('action', 'add');
            for (const [key, value] of Object.entries(newStudent)) {
                formData.append(key, value);
            }

            const res = await fetch(API_CONFIG.studentEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });

            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    showToast('success', 'Success', 'Student registered successfully in MySQL database!');
                    form.reset();
                    clearValidationErrors(form);
                    setTimeout(() => {
                        window.location.href = 'students.html';
                    }, 1200);
                    return;
                } else {
                    showToast('error', 'Database Error', result.message || 'Failed to save student.');
                }
            } else {
                const errData = await res.json().catch(() => ({}));
                showToast('error', 'Registration Error', errData.message || 'Server rejected registration.');
            }
        } catch (e) {
            console.warn('Backend server unreachable. Saving to local storage repository.');
            // Offline fallback
            loadLocalStore();
            newStudent.id = Date.now();
            newStudent.createdAt = new Date().toISOString();
            AppState.students.unshift(newStudent);
            saveLocalStore();

            showToast('success', 'Student Saved', 'Student added to local store successfully!');
            form.reset();
            clearValidationErrors(form);
            setTimeout(() => {
                window.location.href = 'students.html';
            }, 1000);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Student Record';
        }
    });
}

/* ========================================================
   VIEW & EDIT MODALS
   ======================================================== */
function viewStudentDetails(studentId) {
    const student = AppState.students.find(s => s.id === studentId);
    if (!student) {
        showToast('error', 'Error', 'Student record not found.');
        return;
    }

    const modalBody = document.getElementById('viewModalBody');
    if (!modalBody) return;

    modalBody.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-color);">
            <div class="avatar-circle" style="width: 58px; height: 58px; font-size: 1.35rem;">
                ${getInitials(student.name)}
            </div>
            <div>
                <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.2rem;">${escapeHtml(student.name)}</h3>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <span class="badge badge-dept">${escapeHtml(student.department)}</span>
                    <span class="badge badge-${(student.status || 'Active').toLowerCase()}">${escapeHtml(student.status || 'Active')}</span>
                </div>
            </div>
        </div>

        <div class="detail-grid">
            <div class="detail-item">
                <div class="detail-label">Student ID</div>
                <div class="detail-value">${escapeHtml(student.studentId)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Register Number</div>
                <div class="detail-value">${escapeHtml(student.registerNo)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Academic Year</div>
                <div class="detail-value">${escapeHtml(student.year)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Gender</div>
                <div class="detail-value">${escapeHtml(student.gender || 'N/A')}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Date of Birth</div>
                <div class="detail-value">${escapeHtml(student.dob || 'N/A')}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Status</div>
                <div class="detail-value">${escapeHtml(student.status || 'Active')}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Email Address</div>
                <div class="detail-value">${escapeHtml(student.email)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Phone Number</div>
                <div class="detail-value">${escapeHtml(student.phone)}</div>
            </div>
            <div class="detail-item full-width">
                <div class="detail-label">Residential Address</div>
                <div class="detail-value">${escapeHtml(student.address)}</div>
            </div>
        </div>
    `;

    openModal('viewModal');
}

function openEditStudentModal(studentId) {
    const student = AppState.students.find(s => s.id === studentId);
    if (!student) {
        showToast('error', 'Error', 'Student record not found.');
        return;
    }

    const form = document.getElementById('editStudentForm');
    if (!form) return;

    // Prepopulate form fields
    form.editDbId.value = student.id;
    form.editStudentId.value = student.studentId;
    form.editName.value = student.name;
    form.editRegisterNo.value = student.registerNo;
    form.editDob.value = student.dob || '';
    form.editGender.value = student.gender || 'Male';
    form.editDepartment.value = student.department;
    form.editYear.value = student.year;
    form.editEmail.value = student.email;
    form.editPhone.value = student.phone;
    form.editAddress.value = student.address;
    form.editStatus.value = student.status || 'Active';

    clearValidationErrors(form);
    openModal('editModal');
}

// Handle Edit Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.getElementById('editStudentForm');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = editForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

            const updatedData = {
                id: editForm.editDbId.value,
                studentId: editForm.editStudentId.value.trim(),
                name: editForm.editName.value.trim(),
                registerNo: editForm.editRegisterNo.value.trim(),
                dob: editForm.editDob.value,
                gender: editForm.editGender.value,
                department: editForm.editDepartment.value,
                year: editForm.editYear.value,
                email: editForm.editEmail.value.trim(),
                phone: editForm.editPhone.value.trim(),
                address: editForm.editAddress.value.trim(),
                status: editForm.editStatus.value
            };

            try {
                const formData = new URLSearchParams();
                formData.append('action', 'update');
                for (const [key, value] of Object.entries(updatedData)) {
                    formData.append(key, value);
                }

                const res = await fetch(API_CONFIG.studentEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData.toString()
                });

                if (res.ok) {
                    const result = await res.json();
                    if (result.success) {
                        showToast('success', 'Updated', 'Student information updated successfully!');
                        closeModal('editModal');
                        await loadStudents();
                        return;
                    }
                }
            } catch (err) {
                console.warn('Backend unavailable, updating local record.');
            }

            // Local fallback
            const idx = AppState.students.findIndex(s => s.id == updatedData.id);
            if (idx !== -1) {
                AppState.students[idx] = { ...AppState.students[idx], ...updatedData };
                saveLocalStore();
                renderStudentsTable(AppState.students);
                showToast('success', 'Updated', 'Student updated in local store!');
                closeModal('editModal');
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        });
    }
});

/* ========================================================
   DELETE CONFIRMATION & EXECUTION
   ======================================================== */
function confirmDeleteStudent(studentId, studentName) {
    AppState.deleteTargetId = studentId;
    const nameEl = document.getElementById('deleteStudentName');
    if (nameEl) nameEl.textContent = studentName || 'this student';

    openModal('deleteModal');
}

async function executeDeleteStudent() {
    if (!AppState.deleteTargetId) return;

    const deleteBtn = document.getElementById('confirmDeleteBtn');
    if (deleteBtn) {
        deleteBtn.disabled = true;
        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
    }

    try {
        const formData = new URLSearchParams();
        formData.append('action', 'delete');
        formData.append('id', AppState.deleteTargetId);

        const res = await fetch(API_CONFIG.studentEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });

        if (res.ok) {
            const result = await res.json();
            if (result.success) {
                showToast('success', 'Deleted', 'Student record deleted from database.');
                closeModal('deleteModal');
                await loadStudents();
                return;
            }
        }
    } catch (e) {
        console.warn('Backend unavailable, deleting from local storage.');
    }

    // Local fallback delete
    AppState.students = AppState.students.filter(s => s.id != AppState.deleteTargetId);
    saveLocalStore();
    renderStudentsTable(AppState.students);
    showToast('success', 'Deleted', 'Student removed from local records.');
    closeModal('deleteModal');

    if (deleteBtn) {
        deleteBtn.disabled = false;
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Delete Student';
    }
}

/* ========================================================
   FORM VALIDATION ROUTINES
   ======================================================== */
function setupFormValidation() {
    const inputs = document.querySelectorAll('.form-control[required], input[type="email"], input[type="tel"]');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateSingleField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
                validateSingleField(input);
            }
        });
    });
}

function validateSingleField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMsg = '';

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMsg = 'This field is required.';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMsg = 'Please enter a valid email address (e.g. student@college.edu).';
        }
    } else if (field.type === 'tel' && value) {
        const phoneRegex = /^[+]?[0-9\s-]{8,20}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMsg = 'Please enter a valid phone number (at least 8-15 digits).';
        }
    } else if (field.name === 'studentId' && value) {
        const idRegex = /^[A-Za-z0-9_-]{3,20}$/;
        if (!idRegex.test(value)) {
            isValid = false;
            errorMsg = 'Student ID must be 3-20 letters/digits (e.g. STU-1001).';
        }
    } else if (field.name === 'name' && value) {
        if (value.length < 2) {
            isValid = false;
            errorMsg = 'Name must be at least 2 characters.';
        }
    }

    setFieldValidationState(field, isValid, errorMsg);
    return isValid;
}

function setFieldValidationState(field, isValid, message) {
    let feedback = field.parentElement.querySelector('.invalid-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        field.parentElement.appendChild(feedback);
    }

    if (isValid) {
        field.classList.remove('is-invalid');
        feedback.textContent = '';
    } else {
        field.classList.add('is-invalid');
        feedback.textContent = message;
    }
}

function validateStudentForm(form) {
    let isAllValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        const valid = validateSingleField(field);
        if (!valid) isAllValid = false;
    });
    return isAllValid;
}

function clearValidationErrors(form) {
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    form.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
}

/* ========================================================
   MODAL CONTROLLER
   ======================================================== */
function setupModals() {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop.show').forEach(m => closeModal(m.id));
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

/* ========================================================
   TOAST NOTIFICATIONS
   ======================================================== */
function showToast(type, title, message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <i class="fas ${iconMap[type] || 'fa-info-circle'} fa-lg"></i>
        <div class="toast-content">
            <div class="toast-title">${escapeHtml(title)}</div>
            <div class="toast-msg">${escapeHtml(message)}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* ========================================================
   SIDEBAR & UI UTILITIES
   ======================================================== */
function setupSidebar() {
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebar = document.getElementById('sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

function getInitials(name) {
    if (!name) return 'S';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

