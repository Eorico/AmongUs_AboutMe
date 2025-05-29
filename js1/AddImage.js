// Include this at the top (after loading firebase scripts in your HTML)
const firebaseConfig = {
  apiKey: "AIzaSyB966LQtDSGb2LnZ_jMHFMYsHfwjRviU18",
  authDomain: "websiteaddimage.firebaseapp.com",
  databaseURL: "https://websiteaddimage-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "websiteaddimage",
  storageBucket: "websiteaddimage.firebasestorage.app",
  messagingSenderId: "644122614522",
  appId: "1:644122614522:web:5c7f41285c1e1f58784743"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
  const sections = ['section1', 'section2', 'section3', 'section4', 'section5', 'section6'];

  // Load images from Firebase DB for each section
  sections.forEach(sectionId => {
    const container = document.querySelector(`#${sectionId} .image-layer-container`);
    const imageRef = db.ref(`sections/${sectionId}`);

    imageRef.on('value', snapshot => {
      const images = [];
      snapshot.forEach(child => images.push(child.val()));

      container.innerHTML = '';
      images.forEach((img, idx) => addImageToContainer(container, img, idx, sectionId));
    });
  });

  // When user clicks the "new image" button, trigger file input click
  document.querySelectorAll('.new-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionId = btn.dataset.section;
      const fileInput = document.querySelector(`.file-input[data-section="${sectionId}"]`);
      fileInput.click();
    });
  });

  // When file selected, upload to Cloudinary, then save URL to Firebase
  document.querySelectorAll('.file-input').forEach(input => {
    input.addEventListener('change', async (event) => {
      const sectionId = input.dataset.section;
      const container = document.querySelector(`#${sectionId} .image-layer-container`);
      const file = event.target.files[0];
      if (file) {
        try {
          // Compress and resize image client-side
          const compressedDataUrl = await compressImage(file, 800, 0.5);
          
          // Upload compressed image to Cloudinary
          const uploadedUrl = await uploadToCloudinary(compressedDataUrl);
          
          // Save uploaded image URL to Firebase Realtime Database
          const imageRef = db.ref(`sections/${sectionId}`);
          await imageRef.push(uploadedUrl);

          // Firebase on('value') listener updates UI automatically
        } catch (err) {
          alert("Upload failed: " + err.message);
        }
      }
      input.value = '';
    });
  });

  // Helper function to compress image using canvas
  function compressImage(file, maxWidth, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const scaleSize = maxWidth / img.width;
          const canvas = document.createElement('canvas');
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Upload base64 image data URL to Cloudinary
  async function uploadToCloudinary(dataUrl) {
    // Remove prefix "data:image/jpeg;base64,"
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');

    const cloudName = "dt9oj9kmh";
    const uploadPreset = "unsigned_portfolio";

    const formData = new FormData();
    formData.append('file', 'data:image/jpeg;base64,' + base64Data);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Cloudinary upload failed');

    const data = await response.json();
    return data.secure_url; // Return the URL of uploaded image
  }

  // Add image element with delete button
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
      const imageRef = db.ref(`sections/${sectionId}`);
      const snapshot = await imageRef.once('value');
      const updates = {};
      let i = 0;
      snapshot.forEach(child => {
        if (i !== index) updates[child.key] = child.val();
        i++;
      });
      await imageRef.set(updates);
    };

    img.addEventListener('click', () => {
      showImageFullscreen(src);
    });

    wrapper.appendChild(img);
    wrapper.appendChild(delBtn);
    container.appendChild(wrapper);
  }

  // Fullscreen image modal
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
