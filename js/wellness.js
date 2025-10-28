/**
 * Corporate Wellness Assessment JavaScript
 * Handles form interaction and data visualization
 */

document.addEventListener('DOMContentLoaded', function() {
    // Form navigation
    setupFormNavigation();
    
    // Form validation
    setupFormValidation();
    
    // Load dashboard data if we're on the dashboard page
    if (document.getElementById('wellness-dashboard')) {
        loadDashboardData();
    }
});

async function loadDashboardData() {
    try {
        const response = await fetch('get_data.php');
        const result = await response.json();
        
        if (result.success) {
            updateDashboard(result.data);
        } else {
            console.error('Error loading data:', result.error);
        }
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

function setupFormNavigation() {
    // Step navigation buttons
    const nextButtons = document.querySelectorAll('.next-button');
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const currentStep = parseInt(document.getElementById('progressText').textContent);
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        });
    });
}

function validateStep(step) {
    const stepDiv = document.getElementById('step' + step);
    const inputs = stepDiv.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

function setupFormValidation() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all required fields
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Submit the form
                form.submit();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
}

function loadDashboardData() {
    fetch('get_data.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateDashboard(data.data);
            } else {
                console.error('Error loading dashboard data:', data.error);
            }
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
        });
}

function updateDashboard(data) {
    // Calculate averages for each question
    const averages = calculateAverages(data);
    
    // Update metrics
    updateMetrics(data);
    
    // Update charts if you're using any visualization library
    updateCharts(averages);
}

function calculateAverages(data) {
    const sums = {};
    const counts = {};
    
    // Initialize sums and counts
    for (let i = 1; i <= 12; i++) {
        sums['q' + i] = 0;
        counts['q' + i] = 0;
    }
    
    // Calculate sums
    data.forEach(record => {
        for (let i = 1; i <= 12; i++) {
            const q = 'q' + i;
            if (record[q]) {
                sums[q] += record[q];
                counts[q]++;
            }
        }
    });
    
    // Calculate averages
    const averages = {};
    for (let i = 1; i <= 12; i++) {
        const q = 'q' + i;
        averages[q] = counts[q] ? sums[q] / counts[q] : 0;
    }
    
    return averages;
}

function updateMetrics(data) {
    // Update total submissions
    const totalElement = document.getElementById('total-submissions');
    if (totalElement) {
        totalElement.textContent = data.length;
    }
    
    // Update other metrics as needed
}

function updateCharts(averages) {
    // If you're using a charting library like Chart.js,
    // update your visualizations here
    console.log('Average scores:', averages);
}