function togglePopup() {
    const popup = document.getElementById('popup');
    popup.classList.toggle('show');
}

function showBio(courseName, lecturerName, bioContent) {
    document.getElementById('bioCourseName').textContent = courseName;
    document.getElementById('bioLecturerName').textContent = lecturerName;
    document.getElementById('bioContent').textContent = bioContent;
    document.getElementById('bioPopup').classList.add('show');
    document.getElementById('overlay').classList.add('show');
}

function hideBio() {
    document.getElementById('bioPopup').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
} 
