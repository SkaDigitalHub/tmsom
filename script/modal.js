        // DOM Elements
        const modal = document.getElementById('admissionModal');
        const closeBtn = document.getElementById('closeModal');
        const iframe = document.getElementById('admissionFrame');
        const fallbackMessage = document.getElementById('fallbackMessage');
        const registerBtn = document.getElementById('registerBtn');
        const payBtn = document.getElementById('payBtn');
        const loader = document.getElementById('loader');
        
        // URL Configuration - REPLACE THESE WITH YOUR ACTUAL URLs
        const homePageUrl = 'index.html'; // REPLACE WITH YOUR HOME PAGE URL
        const registerUrl = 'https://selar.com/tmsomadmforms'; // REPLACE WITH REGISTRATION URL
        const paymentUrl = 'https://selar.com/14d344'; // Current payment URL
        
        // Close modal and redirect to home page
        function closeModal() {
            window.location.href = homePageUrl;
        }
        
        // Check if iframe loaded successfully
        let iframeLoaded = false;
        
        iframe.onload = function() {
            iframeLoaded = true;
            loader.style.display = 'none';
            
            try {
                if (iframe.contentWindow.location.href === 'about:blank') {
                    showFallback();
                }
            } catch (e) {
                showFallback();
            }
        };
        
        // Fallback if iframe doesn't load within 3 seconds
        setTimeout(function() {
            if (!iframeLoaded) {
                showFallback();
            }
        }, 3000);
        
        // Show fallback message with action buttons
        function showFallback() {
            loader.style.display = 'none';
            iframe.style.display = 'none';
            fallbackMessage.style.display = 'block';
        }
        
        // Event Listeners
        closeBtn.addEventListener('click', closeModal);
        
        registerBtn.addEventListener('click', function() {
            window.open(registerUrl, '_blank');
        });
        
        payBtn.addEventListener('click', function() {
            window.open(paymentUrl, '_blank');
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        }); 
