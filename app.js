// Application state
let appState = {
    currentSection: 'overview',
    currentPhase: 0,
    milestones: {},
    materials: {},
    measurements: [],
    phaseProgress: [0, 0, 0, 0]
};

// Phase data
const phaseData = [
    {
        name: "Electronics Simulation",
        milestones: ["Setup Wokwi simulation", "Build bridge rectifier", "Test energy storage", "Validate LED operation"]
    },
    {
        name: "Mechanical Prototype", 
        milestones: ["Connect syringes", "Calculate force amplification", "Add check valve", "Test pressure system"]
    },
    {
        name: "Integration & Testing",
        milestones: ["Get piezo element", "Build real circuit", "Create mechanical coupling", "Test integration"]
    },
    {
        name: "Optimization",
        milestones: ["Measure all parameters", "Optimize energy transfer", "Test durability", "Document results"]
    }
];

// Initialize materials list
const materialsList = [
    'function-gen', 'diodes', 'capacitor', 'led-resistor', 'breadboard', 'piezo',
    'large-syringe', 'small-syringe', 'tubing', 'check-valve', 'pressure-gauge'
];

// Chart instance
let performanceChart = null;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
    setupEventListeners();
    updateAllProgress();
    updateCalculations();
    updateMaterialsCount();
    setTimeout(initializeChart, 100);
});

function initializeApp() {
    // Initialize milestone states
    for (let phase = 0; phase < 4; phase++) {
        for (let milestone = 0; milestone < 4; milestone++) {
            const key = `${phase}-${milestone}`;
            appState.milestones[key] = false;
        }
    }
    
    // Initialize material states
    materialsList.forEach(material => {
        appState.materials[material] = false;
    });
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const section = this.getAttribute('data-section');
            console.log('Navigation clicked:', section);
            navigateToSection(section);
        });
    });

    // Phase selector buttons
    document.querySelectorAll('.phase-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const phase = parseInt(this.getAttribute('data-phase'));
            console.log('Phase clicked:', phase);
            selectPhase(phase);
        });
    });

    // Phase overview items
    document.querySelectorAll('.phase-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const phase = parseInt(this.getAttribute('data-phase'));
            console.log('Phase item clicked:', phase);
            navigateToSection('phases');
            setTimeout(() => selectPhase(phase), 100);
        });
    });

    // Milestone checkboxes
    document.querySelectorAll('input[data-milestone]').forEach(checkbox => {
        checkbox.addEventListener('change', function(e) {
            e.stopPropagation();
            const milestoneKey = this.getAttribute('data-milestone');
            appState.milestones[milestoneKey] = this.checked;
            console.log('Milestone changed:', milestoneKey, this.checked);
            updatePhaseProgress();
            updateAllProgress();
        });
    });

    // Material checkboxes
    document.querySelectorAll('.material-check').forEach(checkbox => {
        checkbox.addEventListener('change', function(e) {
            e.stopPropagation();
            const materialKey = this.getAttribute('data-material');
            appState.materials[materialKey] = this.checked;
            console.log('Material changed:', materialKey, this.checked);
            updateMaterialsCount();
        });
    });

    // Calculator inputs
    const calculatorInputs = ['largeSyringeVolume', 'smallSyringeVolume', 'inputForce'];
    calculatorInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', function(e) {
                console.log('Calculator input changed:', inputId, this.value);
                updateCalculations();
            });
            input.addEventListener('change', function(e) {
                console.log('Calculator change event:', inputId, this.value);
                updateCalculations();
            });
        }
    });

    // Add measurement button
    const addMeasurementBtn = document.getElementById('addMeasurement');
    if (addMeasurementBtn) {
        addMeasurementBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Add measurement clicked');
            addMeasurement();
        });
    }
}

function navigateToSection(sectionName) {
    console.log('Navigating to section:', sectionName);
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-section') === sectionName) {
            btn.classList.add('active');
        }
    });

    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('Section activated:', sectionName);
    } else {
        console.error('Section not found:', sectionName);
    }
    
    appState.currentSection = sectionName;
}

function selectPhase(phaseIndex) {
    console.log('Selecting phase:', phaseIndex);
    
    // Update phase buttons
    document.querySelectorAll('.phase-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.getAttribute('data-phase')) === phaseIndex) {
            btn.classList.add('active');
        }
    });

    // Update phase content
    document.querySelectorAll('.phase-details').forEach(details => {
        details.classList.remove('active');
    });
    
    const targetPhase = document.querySelector(`[data-phase-content="${phaseIndex}"]`);
    if (targetPhase) {
        targetPhase.classList.add('active');
        console.log('Phase content activated:', phaseIndex);
    } else {
        console.error('Phase content not found:', phaseIndex);
    }
    
    appState.currentPhase = phaseIndex;
}

function updatePhaseProgress() {
    console.log('Updating phase progress...');
    
    // Calculate progress for each phase
    for (let phase = 0; phase < 4; phase++) {
        let completed = 0;
        let total = 4; // Each phase has 4 milestones
        
        for (let milestone = 0; milestone < 4; milestone++) {
            const key = `${phase}-${milestone}`;
            if (appState.milestones[key]) {
                completed++;
            }
        }
        
        const progress = (completed / total) * 100;
        appState.phaseProgress[phase] = progress;
        
        // Update progress bars
        const progressBar = document.querySelector(`[data-progress="phase-${phase}"]`);
        const progressText = document.querySelector(`[data-text="phase-${phase}"]`);
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}%`;
        }
    }
}

function updateAllProgress() {
    updatePhaseProgress();
    
    // Calculate overall progress
    const totalProgress = appState.phaseProgress.reduce((sum, progress) => sum + progress, 0) / 4;
    
    const overallProgressBar = document.getElementById('overallProgress');
    const progressText = document.getElementById('progressText');
    
    if (overallProgressBar) {
        overallProgressBar.style.width = `${totalProgress}%`;
    }
    if (progressText) {
        progressText.textContent = `${Math.round(totalProgress)}% Complete`;
    }
}

function updateMaterialsCount() {
    const acquired = Object.values(appState.materials).filter(Boolean).length;
    const total = materialsList.length;
    const needed = total - acquired;
    
    const acquiredCountEl = document.getElementById('acquiredCount');
    const neededCountEl = document.getElementById('neededCount');
    
    if (acquiredCountEl) {
        acquiredCountEl.textContent = acquired;
    }
    if (neededCountEl) {
        neededCountEl.textContent = needed;
    }
    
    console.log('Materials count updated:', { acquired, needed, total });
}

function updateCalculations() {
    const largeVolumeInput = document.getElementById('largeSyringeVolume');
    const smallVolumeInput = document.getElementById('smallSyringeVolume');
    const inputForceInput = document.getElementById('inputForce');
    
    if (!largeVolumeInput || !smallVolumeInput || !inputForceInput) {
        console.error('Calculator inputs not found');
        return;
    }
    
    const largeVolume = parseFloat(largeVolumeInput.value) || 60;
    const smallVolume = parseFloat(smallVolumeInput.value) || 5;
    const inputForce = parseFloat(inputForceInput.value) || 100;
    
    console.log('Calculating with values:', { largeVolume, smallVolume, inputForce });
    
    // Calculate cross-sectional areas (assuming cylindrical syringes)
    // Using volume to estimate area ratio
    const areaRatio = largeVolume / smallVolume;
    const amplificationRatio = areaRatio;
    const outputForce = inputForce * amplificationRatio;
    
    // Calculate pressure (simplified - using area from volume)
    const largeArea = Math.sqrt(largeVolume / Math.PI); // Simplified area calculation
    const pressure = inputForce / largeArea;
    
    // Update display
    const amplificationRatioEl = document.getElementById('amplificationRatio');
    const outputForceEl = document.getElementById('outputForce');
    const pressureEl = document.getElementById('pressure');
    
    if (amplificationRatioEl) {
        amplificationRatioEl.textContent = `${amplificationRatio.toFixed(1)}x`;
    }
    if (outputForceEl) {
        outputForceEl.textContent = `${outputForce.toFixed(0)} N`;
    }
    if (pressureEl) {
        pressureEl.textContent = `${pressure.toFixed(2)} N/cm²`;
    }
    
    console.log('Calculations updated:', { amplificationRatio, outputForce, pressure });
}

function addMeasurement() {
    const forceInput = document.getElementById('measuredForce');
    const pressureInput = document.getElementById('measuredPressure');
    const voltageInput = document.getElementById('measuredVoltage');
    const powerInput = document.getElementById('measuredPower');
    
    if (!forceInput || !pressureInput || !voltageInput || !powerInput) {
        console.error('Measurement inputs not found');
        return;
    }
    
    const force = parseFloat(forceInput.value);
    const pressure = parseFloat(pressureInput.value);
    const voltage = parseFloat(voltageInput.value);
    const power = parseFloat(powerInput.value);
    
    console.log('Adding measurement:', { force, pressure, voltage, power });
    
    // Validate inputs
    if (isNaN(force) || isNaN(pressure) || isNaN(voltage) || isNaN(power)) {
        alert('Please fill in all measurement fields with valid numbers.');
        return;
    }
    
    // Calculate efficiency (simplified)
    const mechanicalPower = force * 0.01; // Assume 1cm/s velocity for calculation
    const efficiency = mechanicalPower > 0 ? ((power / 1000) / mechanicalPower * 100) : 0;
    
    const measurement = {
        timestamp: new Date(),
        force: force,
        pressure: pressure,
        voltage: voltage,
        power: power,
        efficiency: efficiency
    };
    
    appState.measurements.push(measurement);
    console.log('Measurement added, total measurements:', appState.measurements.length);
    
    // Clear form
    forceInput.value = '';
    pressureInput.value = '';
    voltageInput.value = '';
    powerInput.value = '';
    
    updateMeasurementsTable();
    updateChart();
}

function updateMeasurementsTable() {
    const tableBody = document.getElementById('measurementsTableBody');
    if (!tableBody) {
        console.error('Measurements table body not found');
        return;
    }
    
    if (appState.measurements.length === 0) {
        tableBody.innerHTML = '<tr class="no-data"><td colspan="5">No measurements recorded yet</td></tr>';
        return;
    }
    
    tableBody.innerHTML = '';
    
    appState.measurements.forEach((measurement, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${measurement.force.toFixed(1)}</td>
            <td>${measurement.pressure.toFixed(2)}</td>
            <td>${measurement.voltage.toFixed(1)}</td>
            <td>${measurement.power.toFixed(1)}</td>
            <td>${measurement.efficiency.toFixed(1)}%</td>
        `;
        tableBody.appendChild(row);
    });
    
    console.log('Measurements table updated with', appState.measurements.length, 'rows');
}

function initializeChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) {
        console.error('Performance chart canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    try {
        performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Voltage (V)',
                        data: [],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Power (mW)',
                        data: [],
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
        console.log('Chart initialized successfully');
    } catch (error) {
        console.error('Error initializing chart:', error);
    }
}

function updateChart() {
    if (!performanceChart || appState.measurements.length === 0) {
        console.log('Chart not available or no measurements');
        return;
    }
    
    try {
        const labels = appState.measurements.map((_, index) => `Test ${index + 1}`);
        const voltageData = appState.measurements.map(m => m.voltage);
        const powerData = appState.measurements.map(m => m.power);
        
        performanceChart.data.labels = labels;
        performanceChart.data.datasets[0].data = voltageData;
        performanceChart.data.datasets[1].data = powerData;
        
        performanceChart.update();
        console.log('Chart updated with', appState.measurements.length, 'data points');
    } catch (error) {
        console.error('Error updating chart:', error);
    }
}

// Utility functions for data export (optional enhancement)
function exportMeasurements() {
    if (appState.measurements.length === 0) {
        alert('No measurements to export.');
        return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Timestamp,Force (N),Pressure (N/cm²),Voltage (V),Power (mW),Efficiency (%)\n"
        + appState.measurements.map(m => 
            `${m.timestamp.toISOString()},${m.force},${m.pressure},${m.voltage},${m.power},${m.efficiency.toFixed(2)}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "piezo_measurements.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Helper function to get next steps recommendation
function getNextSteps() {
    const totalMilestones = Object.keys(appState.milestones).length;
    const completedMilestones = Object.values(appState.milestones).filter(Boolean).length;
    
    if (completedMilestones === 0) {
        return "Start with Phase 1: Electronics Simulation. Set up your Wokwi simulation first.";
    } else if (completedMilestones < 4) {
        return "Continue working on Phase 1 milestones. Focus on building the bridge rectifier.";
    } else if (completedMilestones < 8) {
        return "Move to Phase 2: Mechanical Prototype. Begin connecting your syringes.";
    } else if (completedMilestones < 12) {
        return "Proceed with Phase 3: Integration & Testing. Get your real piezoelectric element.";
    } else if (completedMilestones < 16) {
        return "Focus on Phase 4: Optimization. Start measuring all system parameters.";
    } else {
        return "Congratulations! You've completed all phases. Consider documenting your results and sharing your project.";
    }
}

// Auto-save functionality (using memory only)
function autoSave() {
    // In a real application, this would save to localStorage or a server
    // For this demo, we're just keeping data in memory as required
    console.log('Auto-saving application state...', appState);
}

// Set up auto-save every 30 seconds
setInterval(autoSave, 30000);