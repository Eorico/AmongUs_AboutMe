function toggleFolder(folder) {
    folder.classList.toggle('open');
    const label = folder.querySelector('.folder-label');
    if (folder.classList.contains('open')) {
        label.style.display = 'none';
    } else {
        label.style.display = 'flex';
    }
  }
  