import { auth, db, collection, addDoc } from './firebase-init.js';

const uploadForm = document.getElementById('uploadForm');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');

imageUpload.addEventListener('change', () => {
  imagePreview.innerHTML = '';
  const file = imageUpload.files[0];
  if (file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = 'Image Preview';
    img.style.maxWidth = '200px';
    img.style.maxHeight = '150px';
    img.style.borderRadius = '8px';
    imagePreview.appendChild(img);
  }
});

uploadForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  let valid = true;

  // Clear previous errors
  this.querySelectorAll('.error-message').forEach(el => el.textContent = '');

  if (!this.itemName.value.trim()) {
    this.itemName.nextElementSibling.textContent = 'Item Name is required.';
    alert('Item Name is required.');
    valid = false;
  }
  if (!this.description.value.trim()) {
    this.description.nextElementSibling.textContent = 'Description is required.';
    alert('Description is required.');
    valid = false;
  }
  if (!this.condition.value) {
    this.condition.nextElementSibling.textContent = 'Condition is required.';
    alert('Condition is required.');
    valid = false;
  }
  if (!this.category.value) {
    this.category.nextElementSibling.textContent = 'Category is required.';
    alert('Category is required.');
    valid = false;
  }
  if (!this.imageUpload.files.length) {
    this.imageUpload.nextElementSibling.textContent = 'Image upload is required.';
    alert('Image upload is required.');
    valid = false;
  }

  if (valid) {
    try {
      const file = this.imageUpload.files[0];
      const reader = new FileReader();

      reader.onload = async () => {
        const loggedInUser = auth.currentUser;
        if (!loggedInUser) {
          alert('You must be logged in to upload items.');
          window.location.href = 'login.html';
          return;
        }

        const itemData = {
          itemName: this.itemName.value.trim(),
          description: this.description.value.trim(),
          condition: this.condition.value,
          category: this.category.value,
          imageData: reader.result,
          desiredItem: this.desiredItem.value.trim(),
          uploaderEmail: loggedInUser.email,
          uploaderUid: loggedInUser.uid,
          createdAt: new Date().toISOString()
        };

        await addDoc(collection(db, 'uploadedItems'), itemData);

        alert('Item uploaded successfully!');
        this.reset();
        imagePreview.innerHTML = '';
        window.location.href = 'dashboard.html';
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    } catch (error) {
      alert('Error uploading item: ' + error.message);
    }
  }
});
