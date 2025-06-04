document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('attendanceForm');
            const pinInput = document.getElementById('pin');
            const pinError = document.getElementById('pinError');
            const submitBtn = document.getElementById('submitBtn');
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');

            // Initial validation
            validateRegistrationCode(pinInput);

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate before submission
                if (!validateRegistrationCode(pinInput)) {
                    return;
                }

                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                
                // Submit form data using Fetch API
                fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    mode: 'no-cors'
                })
                .then(() => {
                    // Hide the form
                    form.style.display = 'none';
                    
                    // Show success message
                    successMessage.style.display = 'block';
                    
                    // Reset form
                    form.reset();
                })
                .catch((error) => {
                    // Show error message
                    errorMessage.style.display = 'block';
                    document.getElementById('errorText').textContent = 'Error: ' + error.message;
                    console.error('Error:', error);
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Submit Attendance';
                });
            });
        });

        function validateRegistrationCode(input) {
            const pinError = document.getElementById('pinError');
            const submitBtn = document.getElementById('submitBtn');
            const value = parseInt(input.value);
            
            if (isNaN(value) || value < 25000 || value > 26000) {
                input.setCustomValidity('Invalid registration code');
                pinError.style.display = 'block';
                submitBtn.disabled = true;
                return false;
            } else {
                input.setCustomValidity('');
                pinError.style.display = 'none';
                submitBtn.disabled = false;
                return true;
            }
        } 
