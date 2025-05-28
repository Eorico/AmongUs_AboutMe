document.addEventListener('DOMContentLoaded', () => {
  const sections = ['section1', 'section2', 'section3'];
  let db;

  const request = indexedDB.open('ImageDB', 1);

  request.onerror = () => alert("❌ Failed to open IndexedDB.");
  
  request.onupgradeneeded = (event) => {
    db = event.target.result;
    sections.forEach(section => {
      if (!db.objectStoreNames.contains(section)) {
        db.createObjectStore(section, { keyPath: 'id', autoIncrement: true });
      }
    });
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    sections.forEach(loadImagesForSection);

    document.querySelectorAll('.new-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sectionId = btn.dataset.section;
        document.querySelector(`.file-input[data-section="${sectionId}"]`).click();
      });
    });

    document.querySelectorAll('.file-input').forEach(input => {
      input.addEventListener('change', (event) => {
        const sectionId = input.dataset.section;
        const file = event.target.files[0];
        if (file) {
          storeImage(sectionId, file);
        }
        input.value = '';
      });
    });
  };

  function storeImage(sectionId, file) {
    const transaction = db.transaction([sectionId], 'readwrite');
    const store = transaction.objectStore(sectionId);
    const request = store.add({ image: file });

    request.onsuccess = () => loadImagesForSection(sectionId);
    request.onerror = () => alert("❌ Failed to save image.");
  }

  function loadImagesForSection(sectionId) {
    const container = document.querySelector(`#${sectionId} .image-layer-container`);
    container.innerHTML = '';
    const transaction = db.transaction([sectionId], 'readonly');
    const store = transaction.objectStore(sectionId);
    const request = store.getAll();

    request.onsuccess = () => {
      const images = request.result;
      images.forEach((record, index) => {
        const src = URL.createObjectURL(record.image);
        addImageToContainer(container, src, index, sectionId, record.id);
      });
    };
  }

  function deleteImage(sectionId, imageId) {
    const transaction = db.transaction([sectionId], 'readwrite');
    const store = transaction.objectStore(sectionId);
    const request = store.delete(imageId);

    request.onsuccess = () => loadImagesForSection(sectionId);
  }

  function addImageToContainer(container, src, index, sectionId, id) {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-wrapper';
    wrapper.style.top = `${index * 20}px`;
    wrapper.style.left = `${index * 20}px`;
    wrapper.style.zIndex = 100 - index;

    const img = document.createElement('img');
    img.src = src;

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.innerText = '✕';
    delBtn.onclick = () => deleteImage(sectionId, id);

    img.addEventListener('click', () => showImageFullscreen(src));

    wrapper.appendChild(img);
    wrapper.appendChild(delBtn);
    container.appendChild(wrapper);
  }

  function showImageFullscreen(src) {
    const modal = document.createElement('div');
    modal.className = 'fullscreen-modal';

    const img = document.createElement('img');
    img.src = src;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-fullscreen';
    closeBtn.innerText = '✕';
    closeBtn.onclick = () => document.body.removeChild(modal);

    modal.appendChild(img);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
  }
});
