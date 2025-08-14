// Configuration
const PDF_OPTIONS = {
  scale: 1.5,
  disableAutoFetch: true,
  disableStream: true
};

// State Management
let pdfApp = {
  doc: null,
  currentPage: 1,
  totalPages: 0,
  searchTerm: '',
  fileHandle: null
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  if ('launchQueue' in window) {
    launchQueue.setConsumer(handleFileLaunch);
  } else {
    document.getElementById('status').textContent = 'File API not supported';
  }
  
  // Load PDF from URL if ?pdf= param exists
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('pdf')) {
    loadPDFFromURL(urlParams.get('pdf'));
  }
});

// File Handling
async function handleFileLaunch(launchParams) {
  const [fileHandle] = launchParams.files;
  if (!fileHandle) return;
  
  try {
    pdfApp.fileHandle = fileHandle;
    const file = await fileHandle.getFile();
    await renderPDF(await file.arrayBuffer());
    
    // Update URL without reload
    history.pushState({}, '', `?file=${file.name}`);
    
    // Request persistent permission
    if (await verifyPermission(fileHandle)) {
      console.log('Persistent storage granted');
    }
  } catch (error) {
    showError('Failed to open PDF: ' + error.message);
  }
}

// PDF Rendering
async function renderPDF(pdfData) {
  try {
    showStatus('Loading PDF...');
    
    pdfApp.doc = await pdfjsLib.getDocument({
      data: pdfData,
      useWorker: true,
      ...PDF_OPTIONS
    }).promise;
    
    pdfApp.totalPages = pdfApp.doc.numPages;
    document.getElementById('page_count').textContent = `/ ${pdfApp.totalPages}`;
    
    await renderAllPages();
    setupEventListeners();
    
    showStatus('PDF loaded');
  } catch (error) {
    showError('PDF rendering error: ' + error.message);
  }
}

// Render all pages (virtual scrolling would be better for huge PDFs)
async function renderAllPages() {
  const container = document.getElementById('viewer-container');
  container.innerHTML = '';
  
  for (let i = 1; i <= pdfApp.totalPages; i++) {
    const page = await pdfApp.doc.getPage(i);
    const viewport = page.getViewport({ scale: PDF_OPTIONS.scale });
    
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page-container';
    pageDiv.id = `page-${i}`;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    pageDiv.appendChild(canvas);
    container.appendChild(pageDiv);
    
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
  }
}

// Event Handlers
function setupEventListeners() {
  document.getElementById('prev').addEventListener('click', () => {
    if (pdfApp.currentPage > 1) navigateToPage(pdfApp.currentPage - 1);
  });
  
  document.getElementById('next').addEventListener('click', () => {
    if (pdfApp.currentPage < pdfApp.totalPages) navigateToPage(pdfApp.currentPage + 1);
  });
  
  document.getElementById('page_selector').addEventListener('change', (e) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= pdfApp.totalPages) navigateToPage(page);
  });
  
  document.getElementById('search').addEventListener('input', (e) => {
    pdfApp.searchTerm = e.target.value;
    performSearch();
  });
  
  document.getElementById('download').addEventListener('click', savePDF);
}

// Helper Functions
async function verifyPermission(fileHandle, readWrite = false) {
  const options = {};
  if (readWrite) options.mode = 'readwrite';
  return (await fileHandle.queryPermission(options)) === 'granted' ||
         (await fileHandle.requestPermission(options)) === 'granted';
}

function navigateToPage(pageNum) {
  pdfApp.currentPage = pageNum;
  document.getElementById('page_selector').value = pageNum;
  document.getElementById(`page-${pageNum}`).scrollIntoView({
    behavior: 'smooth'
  });
}

async function performSearch() {
  // Implement PDF.js text layer and search
  console.log('Searching for:', pdfApp.searchTerm);
  // (Advanced search requires text layer implementation)
}

async function savePDF() {
  if (!pdfApp.fileHandle) return;
  
  try {
    const writable = await pdfApp.fileHandle.createWritable();
    // In a real app, you'd modify the PDF here
    await writable.write(await pdfApp.doc.getData());
    await writable.close();
    showStatus('PDF saved successfully');
  } catch (error) {
    showError('Failed to save: ' + error.message);
  }
}

function showStatus(message) {
  document.getElementById('status').textContent = message;
}

function showError(message) {
  console.error(message);
  document.getElementById('status').textContent = '❗ ' + message;
}

// Fallback for URL-based PDF loading
async function loadPDFFromURL(pdfUrl) {
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error('Network error');
    await renderPDF(await response.arrayBuffer());
  } catch (error) {
    showError('URL load failed: ' + error.message);
  }
}

// Fallback for unsupported OS
if (!('launchQueue' in window)) {
  document.getElementById('file-input').style.display = 'block';
}
