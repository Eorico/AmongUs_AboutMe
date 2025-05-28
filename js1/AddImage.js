import { db, storage } from './firebase.js';
import {
  collection, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadString, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

document.addEventListener('DOMContentLoaded', async () => {
  const sections = ['section1', 'section2', 'section3', 'section4', 'section5', 'section6'];

  for (const sectionId of sections) {
    const container = document.querySelector(`#${sectionId} .image-layer-container`);
    const docRef = doc(collection(db, "sections"), sectionId);
    const docSnap = await getDoc(docRef);
    const images = docSnap.exists() ? docSnap.data().images || [] : [];

    images.forEach((url, index) => {
      addImageToContainer(container, url, index, sectionId);
    });
  }

  document.querySelectorAll('.new-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionId = btn.dataset.section;
      const fileInput = document.querySelector(`.file-input[data-section="${sectionId}"]`);
      fileInput.click();
    });
  });

  document.querySelectorAll('.file-input').forEach(input => {
    input.addEventListener('change', async (event) => {
      const sectionId = input.dataset.section;
      const container = document.querySelector(`#${sectionId} .image-layer-container`);
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = async function (e) {
          const img = new Image();
          img.onload = async function () {
            const canvas = document.createElement('canvas');
            const maxWidth = 800;
            const scaleSize = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * scaleSize;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
            const filename = `${sectionId}_${Date.now()}.jpg`;
            const storageRef = ref(storage, `images/${sectionId}/${filename}`);

            try {
              await uploadString(storageRef, dataUrl, 'data_url');
              const downloadURL = await getDownloadURL(storageRef);

              const docRef = doc(collection(db, "sections"), sectionId);
              const docSnap = await getDoc(docRef);
              const images = docSnap.exists() ? docSnap.data().images || [] : [];

              images.unshift(downloadURL);
              await setDoc(docRef, { images });

              container.innerHTML = '';
              images.forEach((url, idx) => addImageToContainer(container, url, idx, sectionId));
            } catch (err) {
              console.error("Upload failed", err);
              alert("⚠️ Upload failed. Please try again.");
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
      input.value = '';
    });
  });

  function addImageToContainer(container, src, index, sectionId) {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-wrapper';
    wrapper.style.top = `${index * 5}px`;
    wrapper.style.left = `${index * 1}px`;
    wrapper.style.zIndex = 100 - index;

    const img = document.createElement('img');
    img.src = src;

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.innerText = '✕';
    delBtn.onclick = async () => {
      const docRef = doc(collection(db, "sections"), sectionId);
      const docSnap = await getDoc(docRef);
      let images = docSnap.exists() ? docSnap.data().images || [] : [];
      images.splice(index, 1);
      await setDoc(docRef, { images });
      container.innerHTML = '';
      images.forEach((url, idx) => addImageToContainer(container, url, idx, sectionId));
    };

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
