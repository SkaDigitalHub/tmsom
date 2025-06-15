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

          // Library
        const books = [
            { title: "Hagah", author: "Stephen Kpodo A.", year: 2018, cover: "https://od.lk/s/ODlfMzI0MzA5OTFf/Picsart_25-03-15_05-39-55-680.png", pdf: "https://drive.google.com/file/d/1ePOepnzTjBMG9CTXN1wCrq55KKplGUid/preview" },
            { title: "The Devotional", author: "Stephen Kpodo A.", year: 2020, cover: "https://skatv.cw.center/wp-content/uploads/sites/3957/2020/11/20201105_121530.png", pdf: "https://drive.google.com/file/d/1r-CbUdf_Ao3jXyN6UiwyZui-mWnFYYg8/preview" },
            { title: "Total Money Makeover", author: "Dave Ramsey", year: 2003, cover: "https://www.newtonbookshop.com/static/media/media/5349e6bb-f43d-4986-8728-082c9f1a59e6_bookimages.webp", pdf: "https://drive.google.com/file/d/1LJuiCNDuTj14cuEwEiVrxL7CvMaLgBmH/preview" }
        ];

        const library = document.getElementById('library');
        const modal = document.getElementById('modal');
        const pdfViewer = document.getElementById('pdf-viewer');
        const searchBar = document.getElementById('search-bar');

        function displayBooks(filteredBooks) {
            library.innerHTML = "";
            filteredBooks.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.classList.add('book-card');
                bookCard.innerHTML = `
                    <img src="${book.cover}" alt="Book Cover" class="book-cover">
                    <div class="book-details">
                        <p class="book-title">${book.title}</p>
                        <p class="book-author">by ${book.author}</p>
                        <p class="book-year">${book.year}</p>
                    </div>
                `;
                bookCard.onclick = () => openBook(book.pdf);
                library.appendChild(bookCard);
            });
        }

        function openBook(pdf) {
            pdfViewer.src = pdf;
            modal.classList.add('active');
        }

        function closeModal() {
            modal.classList.remove('active');
            pdfViewer.src = "";
        }

        searchBar.addEventListener('input', () => {
            const searchTerm = searchBar.value.toLowerCase();
            const filteredBooks = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm) || 
                book.author.toLowerCase().includes(searchTerm)
            );
            displayBooks(filteredBooks);
        });

        displayBooks(books);

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
