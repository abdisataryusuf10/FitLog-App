// Exercise Database
const exercises = [
    // Chest Exercises
    {
        id: 1,
        name: "Push-Up",
        category: "strength",
        muscleGroup: "chest",
        equipment: "bodyweight",
        description: "A fundamental bodyweight exercise for chest, shoulders, and triceps.",
        icon: "fas fa-user"
    },
    {
        id: 2,
        name: "Barbell Bench Press",
        category: "strength",
        muscleGroup: "chest",
        equipment: "barbell",
        description: "Classic compound lift for building chest strength and size.",
        icon: "fas fa-weight-hanging"
    },
    {
        id: 3,
        name: "Dumbbell Flye",
        category: "strength",
        muscleGroup: "chest",
        equipment: "dumbbell",
        description: "Isolation exercise for chest development and stretch.",
        icon: "fas fa-arrows-alt-h"
    },
    
    // Back Exercises
    {
        id: 4,
        name: "Pull-Up",
        category: "strength",
        muscleGroup: "back",
        equipment: "bodyweight",
        description: "Upper body compound exercise targeting the back muscles.",
        icon: "fas fa-arrow-up"
    },
    {
        id: 5,
        name: "Bent-Over Row",
        category: "strength",
        muscleGroup: "back",
        equipment: "barbell",
        description: "Compound exercise for building back thickness.",
        icon: "fas fa-arrows-alt-v"
    },
    {
        id: 6,
        name: "Lat Pulldown",
        category: "strength",
        muscleGroup: "back",
        equipment: "machine",
        description: "Machine exercise targeting the latissimus dorsi.",
        icon: "fas fa-arrow-down"
    },
    
    // Leg Exercises
    {
        id: 7,
        name: "Bodyweight Squat",
        category: "strength",
        muscleGroup: "legs",
        equipment: "bodyweight",
        description: "Fundamental lower body exercise for leg development.",
        icon: "fas fa-user"
    },
    {
        id: 8,
        name: "Barbell Deadlift",
        category: "strength",
        muscleGroup: "legs",
        equipment: "barbell",
        description: "Full-body compound lift targeting posterior chain.",
        icon: "fas fa-weight-hanging"
    },
    {
        id: 9,
        name: "Walking Lunge",
        category: "strength",
        muscleGroup: "legs",
        equipment: "bodyweight",
        description: "Dynamic leg exercise for quadriceps and glutes.",
        icon: "fas fa-walking"
    },
    
    // Shoulders
    {
        id: 10,
        name: "Overhead Press",
        category: "strength",
        muscleGroup: "shoulders",
        equipment: "barbell",
        description: "Primary shoulder exercise for building strength.",
        icon: "fas fa-arrow-up"
    },
    {
        id: 11,
        name: "Lateral Raise",
        category: "strength",
        muscleGroup: "shoulders",
        equipment: "dumbbell",
        description: "Isolation exercise for shoulder width.",
        icon: "fas fa-arrows-alt-h"
    },
    
    // Arms
    {
        id: 12,
        name: "Bicep Curl",
        category: "strength",
        muscleGroup: "arms",
        equipment: "dumbbell",
        description: "Isolation exercise for bicep development.",
        icon: "fas fa-hand-point-up"
    },
    {
        id: 13,
        name: "Tricep Dip",
        category: "strength",
        muscleGroup: "arms",
        equipment: "bodyweight",
        description: "Bodyweight exercise for tricep strength.",
        icon: "fas fa-arrows-alt-v"
    },
    
    // Core
    {
        id: 14,
        name: "Plank",
        category: "strength",
        muscleGroup: "core",
        equipment: "bodyweight",
        description: "Isometric core exercise for stability.",
        icon: "fas fa-arrows-alt-h"
    },
    {
        id: 15,
        name: "Bicycle Crunch",
        category: "strength",
        muscleGroup: "core",
        equipment: "bodyweight",
        description: "Dynamic core exercise for obliques.",
        icon: "fas fa-bicycle"
    },
    
    // Cardio
    {
        id: 16,
        name: "Running",
        category: "cardio",
        muscleGroup: "full-body",
        equipment: "none",
        description: "Aerobic exercise for cardiovascular health.",
        icon: "fas fa-running"
    },
    {
        id: 17,
        name: "Cycling",
        category: "cardio",
        muscleGroup: "legs",
        equipment: "machine",
        description: "Low-impact cardio exercise.",
        icon: "fas fa-bicycle"
    },
    {
        id: 18,
        name: "Jump Rope",
        category: "cardio",
        muscleGroup: "full-body",
        equipment: "rope",
        description: "High-intensity cardio and coordination exercise.",
        icon: "fas fa-arrow-circle-up"
    },
    
    // Flexibility
    {
        id: 19,
        name: "Standing Hamstring Stretch",
        category: "flexibility",
        muscleGroup: "legs",
        equipment: "none",
        description: "Stretch for hamstrings and lower back.",
        icon: "fas fa-arrow-down"
    },
    {
        id: 20,
        name: "Cobra Pose",
        category: "flexibility",
        muscleGroup: "core",
        equipment: "none",
        description: "Yoga pose for spine flexibility.",
        icon: "fas fa-arrow-up"
    },
    {
        id: 21,
        name: "Child's Pose",
        category: "flexibility",
        muscleGroup: "full-body",
        equipment: "none",
        description: "Restorative yoga pose for relaxation.",
        icon: "fas fa-child"
    }
];

// Muscle group icons mapping
const muscleIcons = {
    chest: "fas fa-heart",
    back: "fas fa-arrow-left",
    legs: "fas fa-walking",
    shoulders: "fas fa-arrow-up",
    arms: "fas fa-hand-rock",
    core: "fas fa-apple-alt",
    "full-body": "fas fa-user"
};

// Category colors mapping
const categoryColors = {
    strength: "#00b894",
    cardio: "#e17055",
    flexibility: "#6c5ce7"
};