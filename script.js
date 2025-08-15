// Dark Mode Toggle
        function toggleMode() {
            const body = document.body;
            const toggleButton = document.querySelector('.mode-toggle');

            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                toggleButton.textContent = '☀️';
                toggleButton.classList.add('light');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                toggleButton.textContent = '🌙';
                toggleButton.classList.remove('light');
                localStorage.setItem('darkMode', 'disabled');
            }
        }

        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            document.querySelector('.mode-toggle').textContent = '☀️';
            document.querySelector('.mode-toggle').classList.add('light');
        }

        // Menu Functionality
        document.addEventListener('DOMContentLoaded', function() {
            const menuBtn = document.getElementById('menuBtn');
            const sideMenu = document.getElementById('sideMenu');
            const overlay = document.getElementById('overlay');
            const menuItems = document.querySelectorAll('.menu-item');
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';

            // Set active menu item based on current page
            menuItems.forEach(item => {
                if (item.getAttribute('href') === currentPage) {
                    item.classList.add('active');
                }
            });

            // Toggle menu
            menuBtn.addEventListener('click', function() {
                sideMenu.classList.toggle('open');
                overlay.classList.toggle('active');
            });

            // Close menu when clicking overlay
            overlay.addEventListener('click', function() {
                sideMenu.classList.remove('open');
                overlay.classList.remove('active');
            });

            // Swipe to close functionality for touch devices
            let touchStartX = 0;
            let touchEndX = 0;

            document.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, false);

            document.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, false);

            function handleSwipe() {
                if (touchEndX < touchStartX - 50 && sideMenu.classList.contains('open')) {
                    sideMenu.classList.remove('open');
                    overlay.classList.remove('active');
                }
            }
        });


// In your app.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/tmsom/sw.js');
      console.log('SW registered:', reg);
      
      // Check for updates hourly
      setInterval(() => reg.update(), 60 * 60 * 1000);
    } catch (e) {
      console.log('SW registration failed:', e);
    }
  });
}


   // Form submission 
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('attendanceForm');
            const submitBtn = document.getElementById('submitBtn');
            const successMessage = document.getElementById('successMessage');

            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Submitting...';
                
                // Create a hidden iframe for submission
                const iframe = document.createElement('iframe');
                iframe.name = 'formTarget';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                
                // Set form target to the iframe
                form.target = 'formTarget';
                
                // Handle the load event of the iframe
                iframe.onload = function() {
                    // Hide the form
                    form.style.display = 'none';
                    
                    // Show success message
                    successMessage.style.display = 'block';
                    
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Submit';
                    
                    // Remove the iframe after submission
                    document.body.removeChild(iframe);
                };
                
                // Submit the form
                form.submit();
            });
        });



// Register sync for all features
function registerSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(reg => {
      // For form submissions/chat
      document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async (e) => {
          if (!navigator.onLine) {
            e.preventDefault();
            await reg.sync.register('sync-features');
            showToast("Data will sync when online!");
          }
        });
      });

      // Daily content updates
      reg.periodicSync.register('daily-update', {
        minInterval: 24 * 60 * 60 * 1000 // 24 hours
      });
    });
  }
}

// Call on login
if (location.pathname.includes('/login.html')) {
  registerSync();
}



// ===== TMSOM LECTURE ALARM SYSTEM =====
// Production-ready with snooze and "Join Now" action

// 1. Configuration
const ALARM_CONFIG = {
  icon: "/tmsom/logo/main.png",
  vibration: [200, 100, 200, 100, 200], // Pulse pattern
  actions: [
    { action: "join", title: "Join Now" },
    { action: "snooze", title: "Snooze (10 mins)" }
  ]
};

// 2. Main Alarm Function
function setupSundayAlarm() {
  // Calculate next Sunday 7:00 PM GMT
  const now = new Date();
  const nextSunday = new Date();
  
  nextSunday.setDate(now.getDate() + (7 - now.getDay()));
  nextSunday.setHours(19, 0, 0, 0); // 7PM GMT
  
  if (nextSunday < now) nextSunday.setDate(nextSunday.getDate() + 7);

  console.log("⏰ Next lecture:", nextSunday.toUTCString());

  // Set up the alarm
  Notification.requestPermission().then(perm => {
    if (perm === "granted") {
      const checkAlarm = setInterval(() => {
        if (new Date() >= nextSunday) {
          triggerAlarm();
          nextSunday.setDate(nextSunday.getDate() + 7); // Schedule next week
        }
      }, 60000); // Check every minute
    }
  });
}

// 3. Notification Trigger
function triggerAlarm() {
  const notification = new Notification("TMSOM Lecture Starting", {
    body: "Your weekly lecture is live now!",
    ...ALARM_CONFIG
  });

  // Handle button clicks
  notification.onclick = (event) => {
    event.preventDefault();
    if (event.action === "join") {
      window.location.href = "/tmsom/login.html";
    } else if (event.action === "snooze") {
      setTimeout(triggerAlarm, 10 * 60 * 1000); // Snooze for 10 mins
    }
  };
}

// 5. Start the System
window.addEventListener('load', () => {
  // Start main alarm
  setupSundayAlarm();
  
  // For testing: expose to console
  window.testAlarm = triggerAlarm;
});
