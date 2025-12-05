// DOM Elements
// Add these to your existing DOM elements
const createRoutineBtn = document.getElementById('createRoutineBtn');
const routineModal = document.getElementById('routineModal');
const routineForm = document.getElementById('routineForm');
const routinesList = document.getElementById('routinesList');
const noRoutinesMessage = document.getElementById('noRoutinesMessage');
const useRoutineModal = document.getElementById('useRoutineModal');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const loginModal = document.getElementById('loginModal');
const exerciseModal = document.getElementById('exerciseModal');
const addExerciseBtn = document.getElementById('addExerciseBtn');
const exerciseForm = document.getElementById('exerciseForm');
const exerciseSelect = document.getElementById('exerciseSelect');
const exerciseGrid = document.getElementById('exerciseGrid');
const todayExercises = document.getElementById('todayExercises');
const categoryFilter = document.getElementById('categoryFilter');
const muscleFilter = document.getElementById('muscleFilter');
const closeModals = document.querySelectorAll('.close-modal');
const totalTime = document.getElementById('totalTime');
const totalVolume = document.getElementById('totalVolume');
const totalCalories = document.getElementById('totalCalories');

// App State
let currentUser = null;
let todayWorkout = [];
let workoutHistory = [];

// App State (add to existing state variables)
let currentRoutineExercises = [];
let routines = [];
let editingRoutineId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadExercises();
    setupEventListeners();
    updateStats();

    // Load routines from localStorage
const savedRoutines = localStorage.getItem('fitlog_routines');
if (savedRoutines) {
    routines = JSON.parse(savedRoutines);
    loadRoutines();
}
    
    // Load workout history from localStorage
    const savedHistory = localStorage.getItem('fitlog_history');
    if (savedHistory) {
        workoutHistory = JSON.parse(savedHistory);
    }
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('fitlog_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
    
    // Generate calendar
    generateCalendar();
    
    // Load recent workouts
    loadRecentWorkouts();
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            switchPage(pageId);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Authentication
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });
    
    // Routine functionality
createRoutineBtn.addEventListener('click', () => {
    if (!currentUser) {
        alert('Please login to create routines');
        loginModal.style.display = 'flex';
        return;
    }
    
    populateRoutineExerciseSelect();
    routineModal.style.display = 'flex';
    document.getElementById('routineModalTitle').textContent = 'Create New Routine';
    document.getElementById('routineForm').reset();
    document.getElementById('routineExercisesList').innerHTML = '<p class="empty-state-small">No exercises added yet</p>';
    currentRoutineExercises = [];
});

// Close routine modal
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        routineModal.style.display = 'none';
        useRoutineModal.style.display = 'none';
    });
});

// Add to routine button
document.getElementById('addToRoutineBtn').addEventListener('click', addExerciseToRoutine);

// Cancel routine button
document.getElementById('cancelRoutineBtn').addEventListener('click', () => {
    routineModal.style.display = 'none';
});

// Routine form submission
routineForm.addEventListener('submit', saveRoutine);

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === routineModal) {
        routineModal.style.display = 'none';
    }
    if (e.target === useRoutineModal) {
        useRoutineModal.style.display = 'none';
    }
});
    logoutBtn.addEventListener('click', logout);
    
    // Modal close buttons
    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            exerciseModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === exerciseModal) {
            exerciseModal.style.display = 'none';
        }
    });
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simple login - no real authentication
        currentUser = {
            email: email,
            name: email.split('@')[0]
        };
        
        localStorage.setItem('fitlog_user', JSON.stringify(currentUser));
        updateAuthUI();
        loginModal.style.display = 'none';
        
        // Clear form
        document.getElementById('loginForm').reset();
    });
    
    // Add exercise
    addExerciseBtn.addEventListener('click', () => {
        if (!currentUser) {
            alert('Please login to log exercises');
            loginModal.style.display = 'flex';
            return;
        }
        
        populateExerciseSelect();
        exerciseModal.style.display = 'flex';
    });
    
    // Exercise form
    exerciseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        logExercise();
    });
    
    // Exercise category change
    exerciseSelect.addEventListener('change', updateExerciseFields);
    
    // Filters
    categoryFilter.addEventListener('change', filterExercises);
    muscleFilter.addEventListener('change', filterExercises);
}

// Switch between pages
function switchPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
        }
    });
    
    // Update chart on progress page
    if (pageId === 'history') {
        updateChart();
    }
}

// Update authentication UI
function updateAuthUI() {
    if (currentUser) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'flex';
        userInfo.style.display = 'flex';
        document.getElementById('username').textContent = currentUser.name;
    } else {
        loginBtn.style.display = 'flex';
        logoutBtn.style.display = 'none';
        userInfo.style.display = 'none';
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('fitlog_user');
    updateAuthUI();
}

// Load exercises into library
function loadExercises() {
    exerciseGrid.innerHTML = '';
    
    exercises.forEach(exercise => {
        const exerciseCard = document.createElement('div');
        exerciseCard.className = 'exercise-card';
        
        exerciseCard.innerHTML = `
            <div class="exercise-image">
                <i class="${exercise.icon}"></i>
            </div>
            <div class="exercise-content">
                <span class="exercise-category" style="background-color: ${categoryColors[exercise.category]}20; color: ${categoryColors[exercise.category]}">
                    ${exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
                </span>
                <h3>${exercise.name}</h3>
                <div class="exercise-muscle">
                    <i class="${muscleIcons[exercise.muscleGroup]}"></i>
                    ${exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)}
                </div>
                <p>${exercise.description}</p>
                <div class="exercise-actions">
                    <span>${exercise.equipment}</span>
                    <button class="btn btn-primary btn-small log-exercise-btn" data-id="${exercise.id}">
                        <i class="fas fa-plus"></i> Log
                    </button>
                </div>
            </div>
        `;
        
        exerciseGrid.appendChild(exerciseCard);
    });
    
    // Add event listeners to log buttons
    document.querySelectorAll('.log-exercise-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!currentUser) {
                alert('Please login to log exercises');
                loginModal.style.display = 'flex';
                return;
            }
            
            const exerciseId = parseInt(e.target.closest('.log-exercise-btn').getAttribute('data-id'));
            const exercise = exercises.find(ex => ex.id === exerciseId);
            
            // Set the exercise in the select
            exerciseSelect.value = exerciseId;
            updateExerciseFields();
            exerciseModal.style.display = 'flex';
        });
    });
}

// Filter exercises
function filterExercises() {
    const category = categoryFilter.value;
    const muscle = muscleFilter.value;
    
    document.querySelectorAll('.exercise-card').forEach(card => {
        const exerciseId = parseInt(card.querySelector('.log-exercise-btn').getAttribute('data-id'));
        const exercise = exercises.find(ex => ex.id === exerciseId);
        
        let show = true;
        
        if (category !== 'all' && exercise.category !== category) {
            show = false;
        }
        
        if (muscle !== 'all' && exercise.muscleGroup !== muscle) {
            show = false;
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

// Populate exercise select
function populateExerciseSelect() {
    exerciseSelect.innerHTML = '<option value="">Select an exercise</option>';
    
    exercises.forEach(exercise => {
        const option = document.createElement('option');
        option.value = exercise.id;
        option.textContent = `${exercise.name} (${exercise.category})`;
        exerciseSelect.appendChild(option);
    });
}

// Populate exercise select for routine
function populateRoutineExerciseSelect() {
    const select = document.getElementById('routineExerciseSelect');
    select.innerHTML = '<option value="">Select an exercise</option>';
    
    exercises.forEach(exercise => {
        const option = document.createElement('option');
        option.value = exercise.id;
        option.textContent = `${exercise.name} (${exercise.category})`;
        select.appendChild(option);
    });
}

// Add exercise to current routine - FIXED VERSION
function addExerciseToRoutine() {
    const exerciseId = parseInt(document.getElementById('routineExerciseSelect').value);
    
    if (!exerciseId) {
        alert('Please select an exercise');
        return;
    }
    
    const exercise = exercises.find(ex => ex.id === exerciseId);
    
    // Get values from form - FIXED: using correct element IDs
    const sets = parseInt(document.getElementById('routineSets').value) || 3;
    const reps = parseInt(document.getElementById('routineReps').value) || 10;
    const weight = parseFloat(document.getElementById('routineWeight').value) || 0;
    
    if (sets <= 0 || reps <= 0) {
        alert('Please enter valid sets and reps (greater than 0)');
        return;
    }
    
    const routineExercise = {
        id: Date.now(),
        exerciseId: exerciseId,
        name: exercise.name,
        category: exercise.category,
        muscleGroup: exercise.muscleGroup,
        sets: sets,
        reps: reps,
        weight: weight,
        icon: exercise.icon
    };
    
    currentRoutineExercises.push(routineExercise);
    updateRoutineExercisesList();
    
    // Show success message
    showToast(`Added ${exercise.name} to routine`);
    
    // Reset form but keep default values
    document.getElementById('routineExerciseSelect').value = '';
    
    // Scroll to show the added exercise
    const exercisesList = document.getElementById('routineExercisesList');
    exercisesList.scrollTop = exercisesList.scrollHeight;
}

// Add this helper function for showing messages
function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #00b894;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        animation-fill-mode: forwards;
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// Add these CSS animations to your style.css
const toastAnimations = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
`;

// Add animations to your CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = toastAnimations;
document.head.appendChild(styleSheet);
    
    // Reset form
    document.getElementById('routineExerciseSelect').value = '';
    document.getElementById('routineSets').value = 3;
    document.getElementById('routineReps').value = 10;
    document.getElementById('routineWeight').value = 20;

// Update routine exercises list in modal - IMPROVED VERSION
function updateRoutineExercisesList() {
    const list = document.getElementById('routineExercisesList');
    list.innerHTML = '';
    
    if (currentRoutineExercises.length === 0) {
        list.innerHTML = '<p class="empty-state-small">No exercises added yet</p>';
        return;
    }
    
    currentRoutineExercises.forEach((exercise, index) => {
        const item = document.createElement('div');
        item.className = 'exercise-selection-item';
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-right: 10px;">
                <i class="${exercise.icon}" style="color: #00b894;"></i>
                <div class="routine-exercise-info">
                    <div class="routine-exercise-name">${exercise.name}</div>
                    <div class="routine-exercise-details">
                        ${exercise.sets} sets × ${exercise.reps} reps
                        ${exercise.weight > 0 ? `@ ${exercise.weight}kg` : ''}
                    </div>
                </div>
            </div>
            <div class="routine-exercise-actions">
                <button class="btn-icon remove-exercise-btn" data-index="${index}" title="Remove exercise">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-exercise-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.remove-exercise-btn').getAttribute('data-index'));
            const removedExercise = currentRoutineExercises[index];
            currentRoutineExercises.splice(index, 1);
            updateRoutineExercisesList();
            showToast(`Removed ${removedExercise.name} from routine`);
        });
    });
}
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-exercise-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.remove-exercise-btn').getAttribute('data-index'));
            currentRoutineExercises.splice(index, 1);
            updateRoutineExercisesList();
        });
    });

// Save routine
function saveRoutine(e) {
    e.preventDefault();
    
    const name = document.getElementById('routineName').value;
    const description = document.getElementById('routineDescription').value;
    
    if (!name.trim()) {
        alert('Please enter a routine name');
        return;
    }
    
    if (currentRoutineExercises.length === 0) {
        alert('Please add at least one exercise to the routine');
        return;
    }
    
    const routine = {
        id: editingRoutineId || Date.now(),
        name: name,
        description: description,
        exercises: [...currentRoutineExercises],
        createdAt: new Date().toISOString(),
        lastUsed: null,
        timesUsed: 0
    };
    
    if (editingRoutineId) {
        // Update existing routine
        const index = routines.findIndex(r => r.id === editingRoutineId);
        if (index !== -1) {
            routines[index] = routine;
        }
        editingRoutineId = null;
    } else {
        // Add new routine
        routines.push(routine);
    }
    
    // Save to localStorage
    localStorage.setItem('fitlog_routines', JSON.stringify(routines));
    
    // Update UI
    loadRoutines();
    routineModal.style.display = 'none';
    
    // Reset form
    routineForm.reset();
    currentRoutineExercises = [];
}

// Load routines into the list
function loadRoutines() {
    routinesList.innerHTML = '';
    
    if (routines.length === 0) {
        noRoutinesMessage.style.display = 'block';
        return;
    }
    
    noRoutinesMessage.style.display = 'none';
    
    routines.forEach(routine => {
        const routineCard = document.createElement('div');
        routineCard.className = 'routine-card';
        
        // Calculate routine stats
        const totalExercises = routine.exercises.length;
        const totalSets = routine.exercises.reduce((sum, ex) => sum + ex.sets, 0);
        const estimatedTime = totalSets * 2; // 2 minutes per set
        
        routineCard.innerHTML = `
            <div class="routine-header">
                <h3>${routine.name}</h3>
                <div class="routine-actions">
                    <button class="btn-icon use-routine-btn" data-id="${routine.id}" title="Use Routine">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn-icon edit-routine-btn" data-id="${routine.id}" title="Edit Routine">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-routine-btn" data-id="${routine.id}" title="Delete Routine">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            ${routine.description ? `<p class="routine-description">${routine.description}</p>` : ''}
            
            <div class="routine-exercises">
                ${routine.exercises.map(exercise => `
                    <div class="routine-exercise-item">
                        <div class="routine-exercise-info">
                            <div class="routine-exercise-name">${exercise.name}</div>
                            <div class="routine-exercise-details">
                                ${exercise.sets} sets × ${exercise.reps} reps
                                ${exercise.weight > 0 ? `@ ${exercise.weight}kg` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="routine-stats">
                <div class="routine-stat">
                    <div class="routine-stat-value">${totalExercises}</div>
                    <div class="routine-stat-label">Exercises</div>
                </div>
                <div class="routine-stat">
                    <div class="routine-stat-value">${totalSets}</div>
                    <div class="routine-stat-label">Total Sets</div>
                </div>
                <div class="routine-stat">
                    <div class="routine-stat-value">${estimatedTime}</div>
                    <div class="routine-stat-label">Est. Time (min)</div>
                </div>
                <div class="routine-stat">
                    <div class="routine-stat-value">${routine.timesUsed || 0}</div>
                    <div class="routine-stat-label">Times Used</div>
                </div>
            </div>
        `;
        
        routinesList.appendChild(routineCard);
    });
    
    // Add event listeners to routine buttons
    document.querySelectorAll('.use-routine-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const routineId = parseInt(e.target.closest('.use-routine-btn').getAttribute('data-id'));
            useRoutine(routineId);
        });
    });
    
    document.querySelectorAll('.edit-routine-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const routineId = parseInt(e.target.closest('.edit-routine-btn').getAttribute('data-id'));
            editRoutine(routineId);
        });
    });
    
    document.querySelectorAll('.delete-routine-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const routineId = parseInt(e.target.closest('.delete-routine-btn').getAttribute('data-id'));
            deleteRoutine(routineId);
        });
    });
}

// Use a routine
function useRoutine(routineId) {
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;
    
    const useRoutineContent = document.getElementById('useRoutineContent');
    
    // Update routine usage stats
    routine.timesUsed = (routine.timesUsed || 0) + 1;
    routine.lastUsed = new Date().toISOString();
    localStorage.setItem('fitlog_routines', JSON.stringify(routines));
    
    useRoutineContent.innerHTML = `
        <h3 style="margin-bottom: 1rem;">${routine.name}</h3>
        ${routine.description ? `<p style="margin-bottom: 1.5rem; color: #666;">${routine.description}</p>` : ''}
        
        <div class="routine-exercises">
            <h4 style="margin-bottom: 1rem;">Exercises in this routine:</h4>
            ${routine.exercises.map(exercise => `
                <div class="routine-exercise-item">
                    <div class="routine-exercise-info">
                        <div class="routine-exercise-name">${exercise.name}</div>
                        <div class="routine-exercise-details">
                            ${exercise.sets} sets × ${exercise.reps} reps
                            ${exercise.weight > 0 ? `@ ${exercise.weight}kg` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-top: 1.5rem; padding: 1rem; background-color: #e8f6f3; border-radius: 8px;">
            <p><i class="fas fa-info-circle"></i> This will add all exercises to today's workout.</p>
        </div>
    `;
    
    // Set up start workout button
    document.getElementById('startRoutineBtn').onclick = () => {
        addRoutineToWorkout(routine);
        useRoutineModal.style.display = 'none';
    };
    
    // Set up cancel button
    document.getElementById('cancelUseRoutineBtn').onclick = () => {
        useRoutineModal.style.display = 'none';
    };
    
    useRoutineModal.style.display = 'flex';
}

// Add routine exercises to today's workout
function addRoutineToWorkout(routine) {
    routine.exercises.forEach(exerciseData => {
        const exercise = exercises.find(ex => ex.id === exerciseData.exerciseId);
        
        if (exercise) {
            const workoutExercise = {
                id: Date.now() + Math.random(),
                exerciseId: exercise.id,
                name: exercise.name,
                category: exercise.category,
                muscleGroup: exercise.muscleGroup,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                sets: exerciseData.sets,
                reps: exerciseData.reps,
                weight: exerciseData.weight,
                volume: exerciseData.sets * exerciseData.reps * exerciseData.weight,
                calories: Math.round(exerciseData.sets * exerciseData.reps * exerciseData.weight * 0.1)
            };
            
            todayWorkout.push(workoutExercise);
            workoutHistory.push(workoutExercise);
        }
    });
    
    // Save to localStorage
    localStorage.setItem('fitlog_history', JSON.stringify(workoutHistory));
    
    // Update UI
    updateTodayExercises();
    updateStats();
    
    // Show success message
    alert(`Added ${routine.exercises.length} exercises from "${routine.name}" to today's workout!`);
}

// Edit a routine
function editRoutine(routineId) {
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;
    
    editingRoutineId = routineId;
    currentRoutineExercises = [...routine.exercises];
    
    // Populate form
    document.getElementById('routineName').value = routine.name;
    document.getElementById('routineDescription').value = routine.description || '';
    
    populateRoutineExerciseSelect();
    updateRoutineExercisesList();
    
    document.getElementById('routineModalTitle').textContent = 'Edit Routine';
    routineModal.style.display = 'flex';
}

// Delete a routine
function deleteRoutine(routineId) {
    if (confirm('Are you sure you want to delete this routine?')) {
        routines = routines.filter(r => r.id !== routineId);
        localStorage.setItem('fitlog_routines', JSON.stringify(routines));
        loadRoutines();
    }
}

// Update exercise form fields based on category
function updateExerciseFields() {
    const exerciseId = parseInt(exerciseSelect.value);
    if (!exerciseId) return;
    
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;
    
    // Hide all fields first
    document.getElementById('strengthFields').style.display = 'none';
    document.getElementById('cardioFields').style.display = 'none';
    document.getElementById('flexibilityFields').style.display = 'none';
    
    // Show relevant fields
    if (exercise.category === 'strength') {
        document.getElementById('strengthFields').style.display = 'block';
    } else if (exercise.category === 'cardio') {
        document.getElementById('cardioFields').style.display = 'block';
    } else if (exercise.category === 'flexibility') {
        document.getElementById('flexibilityFields').style.display = 'block';
    }
}

// Log an exercise
function logExercise() {
    const exerciseId = parseInt(exerciseSelect.value);
    const exercise = exercises.find(ex => ex.id === exerciseId);
    
    if (!exercise) return;
    
    let exerciseData = {
        id: Date.now(),
        exerciseId: exerciseId,
        name: exercise.name,
        category: exercise.category,
        muscleGroup: exercise.muscleGroup,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    // Add data based on category
    if (exercise.category === 'strength') {
        const sets = parseInt(document.getElementById('sets').value);
        const reps = parseInt(document.getElementById('reps').value);
        const weight = parseFloat(document.getElementById('weight').value);
        
        exerciseData.sets = sets;
        exerciseData.reps = reps;
        exerciseData.weight = weight;
        exerciseData.volume = sets * reps * weight;
        exerciseData.calories = Math.round(sets * reps * weight * 0.1);
        
    } else if (exercise.category === 'cardio') {
        const duration = parseInt(document.getElementById('duration').value);
        const distance = parseFloat(document.getElementById('distance').value);
        
        exerciseData.duration = duration;
        exerciseData.distance = distance;
        exerciseData.calories = Math.round(duration * 10);
        exerciseData.volume = 0;
        
    } else if (exercise.category === 'flexibility') {
        const duration = parseInt(document.getElementById('flexDuration').value);
        
        exerciseData.duration = duration;
        exerciseData.calories = Math.round(duration * 3);
        exerciseData.volume = 0;
    }
    
    // Add to today's workout
    todayWorkout.push(exerciseData);
    
    // Add to history
    workoutHistory.push(exerciseData);
    localStorage.setItem('fitlog_history', JSON.stringify(workoutHistory));
    
    // Update UI
    updateTodayExercises();
    updateStats();
    exerciseModal.style.display = 'none';
    exerciseForm.reset();
    
    // Refresh calendar and recent workouts
    generateCalendar();
    loadRecentWorkouts();
}

// Update today's exercises list
function updateTodayExercises() {
    todayExercises.innerHTML = '';
    
    if (todayWorkout.length === 0) {
        todayExercises.innerHTML = '<p class="empty-state">No exercises logged today. Click "Add Exercise" to start!</p>';
        return;
    }
    
    todayWorkout.forEach(exercise => {
        const exerciseItem = document.createElement('div');
        exerciseItem.className = 'exercise-item';
        
        let details = '';
        let volume = '';
        
        if (exercise.category === 'strength') {
            details = `${exercise.sets} sets × ${exercise.reps} reps`;
            volume = `${exercise.weight} kg`;
        } else if (exercise.category === 'cardio') {
            details = `${exercise.duration} min`;
            volume = `${exercise.distance} km`;
        } else if (exercise.category === 'flexibility') {
            details = `${exercise.duration} min`;
            volume = 'Flexibility';
        }
        
        exerciseItem.innerHTML = `
            <div class="exercise-info">
                <div class="exercise-img">
                    <i class="${exercises.find(e => e.id === exercise.exerciseId).icon}"></i>
                </div>
                <div class="exercise-details">
                    <h4>${exercise.name}</h4>
                    <div class="exercise-meta">
                        <span>${exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}</span>
                        • <span>${exercise.time}</span>
                    </div>
                </div>
            </div>
            <div class="exercise-stats">
                <p>${details}</p>
                <p class="exercise-volume">${volume}</p>
            </div>
        `;
        
        todayExercises.appendChild(exerciseItem);
    });
}

// Update stats
function updateStats() {
    let totalWorkoutTime = 0;
    let totalWorkoutVolume = 0;
    let totalWorkoutCalories = 0;
    
    todayWorkout.forEach(exercise => {
        if (exercise.duration) totalWorkoutTime += exercise.duration;
        if (exercise.volume) totalWorkoutVolume += exercise.volume;
        if (exercise.calories) totalWorkoutCalories += exercise.calories;
    });
    
    totalTime.textContent = `${totalWorkoutTime} min`;
    totalVolume.textContent = `${totalWorkoutVolume} kg`;
    totalCalories.textContent = `${totalWorkoutCalories} kcal`;
}

// Generate calendar
function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    // Get current date
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Create empty cells for days before first day
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day';
        calendar.appendChild(emptyCell);
    }
    
    // Create cells for each day of month
    const daysInMonth = lastDay.getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;
        
        // Check if there's a workout on this day
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasWorkout = workoutHistory.some(workout => workout.date === dateString);
        
        if (hasWorkout) {
            dayCell.classList.add('has-workout');
        }
        
        // Highlight today
        if (day === now.getDate() && month === now.getMonth()) {
            dayCell.style.border = '2px solid #00b894';
        }
        
        calendar.appendChild(dayCell);
    }
}

// Load recent workouts
function loadRecentWorkouts() {
    const recentWorkoutsList = document.getElementById('recentWorkoutsList');
    recentWorkoutsList.innerHTML = '';
    
    if (workoutHistory.length === 0) {
        recentWorkoutsList.innerHTML = '<p class="empty-state">No workouts logged yet.</p>';
        return;
    }
    
    // Sort by date (newest first) and take last 5
    const sortedHistory = [...workoutHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentWorkouts = sortedHistory.slice(0, 5);
    
    recentWorkouts.forEach(workout => {
        const workoutItem = document.createElement('div');
        workoutItem.className = 'exercise-item';
        
        let details = '';
        if (workout.category === 'strength') {
            details = `${workout.sets} × ${workout.reps} @ ${workout.weight}kg`;
        } else if (workout.category === 'cardio') {
            details = `${workout.duration} min`;
        } else if (workout.category === 'flexibility') {
            details = `${workout.duration} min`;
        }
        
        const date = new Date(workout.date);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        workoutItem.innerHTML = `
            <div class="exercise-info">
                <div class="exercise-img" style="background: linear-gradient(135deg, ${categoryColors[workout.category]}, ${categoryColors[workout.category]}aa)">
                    <i class="${exercises.find(e => e.id === workout.exerciseId).icon}"></i>
                </div>
                <div class="exercise-details">
                    <h4>${workout.name}</h4>
                    <div class="exercise-meta">
                        <span>${formattedDate}</span>
                        • <span>${workout.time}</span>
                    </div>
                </div>
            </div>
            <div class="exercise-stats">
                <p>${details}</p>
            </div>
        `;
        
        recentWorkoutsList.appendChild(workoutItem);
    });
}

// Update chart
function updateChart() {
    const ctx = document.getElementById('workoutChart').getContext('2d');
    
    // Group workouts by date for last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        last7Days.push({
            date: dateString,
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            count: workoutHistory.filter(w => w.date === dateString).length
        });
    }
    
    // Destroy existing chart if it exists
    if (window.workoutChartInstance) {
        window.workoutChartInstance.destroy();
    }
    
    // Create new chart
    window.workoutChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last7Days.map(day => day.label),
            datasets: [{
                label: 'Workouts per Day',
                data: last7Days.map(day => day.count),
                backgroundColor: '#00b894',
                borderColor: '#00a085',
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Debug function - add this temporarily
function debugRoutineState() {
    console.log('Current Routine Exercises:', currentRoutineExercises);
    console.log('Exercise Select Value:', document.getElementById('routineExerciseSelect').value);
    console.log('Sets Value:', document.getElementById('routineSets').value);
    console.log('Reps Value:', document.getElementById('routineReps').value);
    console.log('Weight Value:', document.getElementById('routineWeight').value);
}

// Add debug button temporarily to the routine modal
function addDebugButton() {
    const debugBtn = document.createElement('button');
    debugBtn.type = 'button';
    debugBtn.textContent = 'Debug';
    debugBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 5px 10px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
    `;
    debugBtn.onclick = debugRoutineState;
    
    const modalContent = document.querySelector('#routineModal .modal-content');
    if (modalContent) {
        modalContent.style.position = 'relative';
        modalContent.appendChild(debugBtn);
    }
}

// Call this when routine modal opens
// Add to your existing event listener for createRoutineBtn:
createRoutineBtn.addEventListener('click', () => {
    if (!currentUser) {
        alert('Please login to create routines');
        loginModal.style.display = 'flex';
        return;
    }
    
    populateRoutineExerciseSelect();
    routineModal.style.display = 'flex';
    document.getElementById('routineModalTitle').textContent = 'Create New Routine';
    document.getElementById('routineForm').reset();
    document.getElementById('routineExercisesList').innerHTML = '<p class="empty-state-small">No exercises added yet</p>';
    currentRoutineExercises = [];
    
    // Add debug button temporarily
    addDebugButton();
});