// Dark Mode Toggle
function toggleMode() {
    const body = document.body;
    const toggleButton = document.querySelector('.mode-toggle');

    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        toggleButton.textContent = '☀️';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        toggleButton.textContent = '🌙';
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    document.querySelector('.mode-toggle').textContent = '☀️';
}

// Form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('attendanceForm');
    const nameInput = document.getElementById('nameInput');
    const codeInput = document.getElementById('codeInput');
    const pinError = document.getElementById('pinError');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Name to code mapping
    const nameCodeMap = {
        "Robert Shome Mills": "25001",
        "Sarah Wilson": "25002",
        "Williams Adu Louis": "25003",
        "Wisdom Nelly Amuzugah": "25004",
        "Daniel Kumi": "25005",
        "Obed Ansah": "25006",
        "Bernice Ohenewaa": "25007",
        "Derrick Addae": "25008",
        "Sie Joshua Obeng": "25009",
        "Josephine Ampomah": "25010",
        "Godwin Korbla Aborhor": "25011",
        "Kumi Mary": "25012",
        "Dussey Daniel Edem": "25013",
        "Emmanuel Panful": "25014",
        "Jewel Ofori Yeboah": "25015",
        "Esther Quarm": "25016",
        "Beatrice Gati": "25017",
        "Daniel Sakyi": "25018",
        "Anaman Ebenezer": "25019",
        "Anim Simon": "25020",
        "Milland Appah Peniel": "25021",
        "Theophilus Hagan": "25022",
        "Setsoafia Justice Gborgbor": "25023",
        "Danquah Mcstephen": "25024",
        "Stephanie Ojugo": "25025",
        "Lecturer": "25999",
        "Admin": "25990"
    };

    // Validate code input
    codeInput.addEventListener('input', function() {
        validateCode();
    });

    function validateCode() {
        const enteredCode = codeInput.value;
        const selectedName = nameInput.value;
        const expectedCode = nameCodeMap[selectedName];
        
        if (!enteredCode) {
            pinError.style.display = 'none';
            submitBtn.disabled = true;
            return false;
        }

        if (enteredCode === expectedCode) {
            pinError.style.display = 'none';
            submitBtn.disabled = false;
            return true;
        } else {
            pinError.style.display = 'block';
            submitBtn.disabled = true;
            return false;
        }
    }

    // Form submission
            form.addEventListener('submit', function(e) {
                if (!validateCode()) {
                    e.preventDefault();
                    return;
                }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
       // Create a hidden iframe for form submission
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.name = 'formTarget';
                document.body.appendChild(iframe);
                form.target = 'formTarget';

                // Show success message after a brief delay
                setTimeout(function() {
                    // Hide the form
                    form.style.display = 'none';
                    
                    // Show success message
                    successMessage.style.display = 'block';
            
            // Reset form
            form.reset();
            
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit';
        }, 1000);
    });

    
            // Handle form submission completion
            window.addEventListener('blur', function() {
                if (document.activeElement === document.querySelector('iframe[name="formTarget"]')) {
                    // Form submission completed
                    document.querySelector('iframe[name="formTarget"]').style.display = 'none';
                }
            });
        });
    
 
