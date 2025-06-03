        // Get the modal and close button elements
        const modal = document.getElementById('myModal');
        const closeBtn = document.getElementById('closeModal');

        // When the user clicks the close button, hide the modal
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        // Close the modal when clicking outside of it
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Optional: Close with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                modal.style.display = 'none';
            }
        });

