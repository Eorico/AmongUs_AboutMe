document.addEventListener('DOMContentLoaded', () => {
  const sections = ['section1', 'section2', 'section3'];

  sections.forEach(sectionId => {
    const container = document.querySelector(`#${sectionId} .image-layer-container`);
    const images = JSON.parse(localStorage.getItem(sectionId) || '[]');
    images.forEach((src, index) => {
      addImageToContainer(container, src, index, sectionId);
    });
  });

  document.querySelectorAll('.new-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionId = btn.dataset.section;
      const fileInput = document.querySelector(`.file-input[data-section="${sectionId}"]`);
      fileInput.click();
    });
  });

  document.querySelectorAll('.file-input').forEach(input => {
    input.addEventListener('change', (event) => {
      const sectionId = input.dataset.section;
      const container = document.querySelector(`#${sectionId} .image-layer-container`);
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const src = e.target.result;
          let images = JSON.parse(localStorage.getItem(sectionId) || '[]');
          images.unshift(src);
          localStorage.setItem(sectionId, JSON.stringify(images));
          container.innerHTML = '';
          images.forEach((img, idx) => addImageToContainer(container, img, idx, sectionId));
        };
        reader.readAsDataURL(file);
      }
      input.value = '';
    });
  });

  function addImageToContainer(container, src, index, sectionId) {
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
    delBtn.onclick = () => {
      let images = JSON.parse(localStorage.getItem(sectionId) || '[]');
      images.splice(index, 1);
      localStorage.setItem(sectionId, JSON.stringify(images));
      container.innerHTML = '';
      images.forEach((img, idx) => addImageToContainer(container, img, idx, sectionId));
    };

    img.addEventListener('click', () => {
      showImageFullscreen(src);
    });

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
