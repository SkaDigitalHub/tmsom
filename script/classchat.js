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

        // Chat
      const chatWindow = document.getElementById('chat-window');
    const messageInput = document.getElementById('message');
    const userList = document.getElementById('user-list');
    const themeSelector = document.getElementById('theme-selector');
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxXqjo4MB0KcLspIbnLsCN9iWGyNe3h_9LSqSK1ol59WsUqH4XcxOKOlT27DeelcUby/exec'; // Replace with your Web App URL

    let sender = null;
    let receiver = null;

    // Show the username modal on page load
    const usernameModal = document.getElementById('username-modal');
    const usernameInput = document.getElementById('username-input');

    function setUsername() {
      sender = usernameInput.value.trim();
      if (sender) {
        usernameModal.style.display = 'none';
        initializeChat();
      } else {
        alert("Please enter a valid username.");
      }
    }

    function initializeChat() {
      // Hardcoded list of all users (for demonstration purposes)
      const allUsers = ["Ora", "Ike", "Ska", "Fes", sender]; // Don't include the current sender

      // Function to create an avatar for a user
      function createUserAvatar(username) {
        const userAvatar = document.createElement('div');
        userAvatar.className = 'user-avatar';
        userAvatar.textContent = username.substring(0, 3).toUpperCase(); // Display first three letters
        userAvatar.setAttribute('data-user', username);
        userAvatar.addEventListener('click', () => {
          receiver = username;
          alert(`You are now chatting with ${receiver}`);
          fetchMessages();
        });
        return userAvatar;
      }

      // Add all users to the user list
      allUsers.forEach(user => {
        if (user !== "GROUP") { // Skip adding "GROUP" again
          userList.appendChild(createUserAvatar(user));
        }
      });

      // Add click event listener to the GROUP avatar
      const groupAvatar = userList.querySelector('.user-avatar.group');
      groupAvatar.addEventListener('click', () => {
        receiver = "GROUP";
        alert(`You are now chatting with ${receiver}`);
        fetchMessages();
      });
    }

    // Theme Selection
    const themeDots = document.querySelectorAll('.theme-dot');
    themeDots.forEach(dot => {
      dot.addEventListener('click', () => {
        // Remove active class from all dots
        themeDots.forEach(d => d.classList.remove('active'));
        // Add active class to the clicked dot
        dot.classList.add('active');
        // Set the theme
        const theme = dot.getAttribute('data-theme');
        document.body.className = theme ? `theme-${theme}` : 'theme-default';
      });
    });

    // Function to format date with month name
    function formatDate(dateString) {
      const date = new Date(dateString);
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    }

    function fetchMessages() {
      if (!receiver) return; // Don't fetch messages if no receiver is selected

      fetch(scriptUrl + '?action=get')
        .then(response => response.json())
        .then(data => {
          const isScrolledToBottom = chatWindow.scrollHeight - chatWindow.clientHeight <= chatWindow.scrollTop + 1;

          chatWindow.innerHTML = '';
          let lastDate = null;

          data.forEach(row => {
            if (
              (row[1] === sender && row[2] === receiver) || // Direct messages
              (row[1] === receiver && row[2] === sender) || // Direct messages
              (row[2] === 'GROUP' && receiver === 'GROUP') // Group messages
            ) {
              const messageDate = formatDate(row[0]);
              if (messageDate !== lastDate) {
                const dateHeader = document.createElement('div');
                dateHeader.className = 'date-header';
                dateHeader.textContent = messageDate;
                chatWindow.appendChild(dateHeader);
                lastDate = messageDate;
              }

              const message = document.createElement('div');
              message.className = 'message';
              message.textContent = `${row[1]}: ${row[3]}`;
              message.setAttribute('data-sender', row[1] === sender); // Add data-sender attribute

              const messageTime = document.createElement('div');
              messageTime.className = 'message-time';
              messageTime.textContent = new Date(row[0]).toLocaleTimeString();
              message.appendChild(messageTime);

              chatWindow.appendChild(message);
            }
          });

          // Scroll to the bottom if the user was already scrolled to the bottom
          if (isScrolledToBottom) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
          }
        });
    }

        function sendMessage() {
            if (!receiver) {
                showModal("Please select a user or group to chat with.");
                return;
            }
            
      const message = messageInput.value;
      if (message) {
        fetch(scriptUrl, {
          method: 'POST',
          body: JSON.stringify({ sender, receiver, message }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            if (data.success) {
              messageInput.value = '';
              fetchMessages();
            }
          })
          .catch(error => {
            console.error('Error sending message:', error);
          });
      }
    }

    // Fetch messages every second
    setInterval(fetchMessages, 1000);



          // Leave Page
         function showConfirm() {
      document.getElementById('confirmMessage').textContent = 'Leave ' + document.title + '?';
      document.getElementById('customConfirm').style.display = 'block';
   }

         function confirmLeave(choice) {
      document.getElementById('customConfirm').style.display = 'none';
      if(choice) {
      window.location.replace('index.html');
  }
}


