import { db, collection, getDocs, addDoc, serverTimestamp } from './firebase-init.js';
import { auth } from './firebase-init.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Function to load featured items dynamically (for index.html)
export async function loadFeaturedItems() {
  const featuredItemsGrid = document.getElementById('featuredItemsGrid');
  if (!featuredItemsGrid) {
    console.log('No featuredItemsGrid container found.');
    return;
  }

  featuredItemsGrid.innerHTML = '';

  try {
    console.log('Loading featured items...');
    const querySnapshot = await getDocs(collection(db, 'uploadedItems'));
    querySnapshot.forEach((doc) => {
      const item = doc.data();

      const card = document.createElement('div');
      card.className = 'item-card';

      const img = document.createElement('img');
      img.src = item.imageData || 'https://via.placeholder.com/200x150?text=No+Image';
      img.alt = item.itemName;
      card.appendChild(img);

      const title = document.createElement('h3');
      title.textContent = item.itemName;
      card.appendChild(title);

      const description = document.createElement('p');
      description.textContent = item.description || '';
      card.appendChild(description);

      featuredItemsGrid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading featured items:', error);
    featuredItemsGrid.innerHTML = '<p>Failed to load featured items.</p>';
  }
}

// Function to load uploaded items dynamically (for dashboard or index.html)
export async function loadUploadedItems() {
  const uploadedItemsGrid = document.getElementById('uploadedItemsGrid');
  if (!uploadedItemsGrid) {
    console.log('No uploadedItemsGrid container found.');
    return;
  }

  uploadedItemsGrid.innerHTML = '';

  try {
    console.log('Loading uploaded items...');
    const querySnapshot = await getDocs(collection(db, 'uploadedItems'));
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      const itemId = doc.id;
      console.log('Loaded uploaded item:', item.itemName);

      const card = document.createElement('div');
      card.className = 'item-card';

      const link = document.createElement('a');
      link.href = `item-details.html?id=${itemId}`;
      link.className = 'item-link';

      const img = document.createElement('img');
      img.src = item.imageData || 'https://via.placeholder.com/200x150?text=No+Image';
      img.alt = item.itemName;
      link.appendChild(img);

      const title = document.createElement('h3');
      title.textContent = item.itemName;
      link.appendChild(title);

      const condition = document.createElement('p');
      condition.textContent = `Condition: ${item.condition}`;
      link.appendChild(condition);

      card.appendChild(link);
      uploadedItemsGrid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading uploaded items:', error);
    uploadedItemsGrid.innerHTML = '<p>Failed to load uploaded items.</p>';
  }
}

// Function to load browse items dynamically (for browse.html)
export async function loadBrowseItems() {
  const itemsGrid = document.getElementById('itemsGrid');
  if (!itemsGrid) {
    console.log('No itemsGrid container found.');
    return;
  }

  itemsGrid.innerHTML = '';

  try {
    console.log('Loading browse items...');
    const querySnapshot = await getDocs(collection(db, 'uploadedItems'));
    querySnapshot.forEach((doc) => {
      const item = doc.data();
      const itemId = doc.id;
      console.log('Loaded browse item:', item.itemName);

      const card = document.createElement('div');
      card.className = 'item-card';

      const link = document.createElement('a');
      link.href = `item-details.html?id=${itemId}`;
      link.className = 'item-link';

      const img = document.createElement('img');
      img.src = item.imageData || 'https://via.placeholder.com/200x150?text=No+Image';
      img.alt = item.itemName;
      link.appendChild(img);

      const title = document.createElement('h3');
      title.textContent = item.itemName;
      link.appendChild(title);

      const condition = document.createElement('p');
      condition.textContent = `Condition: ${item.condition}`;
      link.appendChild(condition);

      card.appendChild(link);

      // Add Request Swap button
      const requestSwapBtn = document.createElement('button');
      requestSwapBtn.textContent = 'Request Swap';
      requestSwapBtn.className = 'btn btn-secondary request-swap-btn';
      requestSwapBtn.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user) {
          alert('Please log in to request a swap.');
          return;
        }
        try {
          await addDoc(collection(db, 'swapRequests'), {
            requesterId: user.uid,
            ownerId: item.ownerId || 'unknown',
            itemId: itemId,
            itemName: item.itemName,
            timestamp: serverTimestamp()
          });
          alert('Swap request sent successfully!');
        } catch (error) {
          console.error('Error sending swap request:', error);
          alert('Failed to send swap request.');
        }
      });
      card.appendChild(requestSwapBtn);

      itemsGrid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading browse items:', error);
    itemsGrid.innerHTML = '<p>Failed to load items.</p>';
  }
}

// Call appropriate load functions on page load based on container presence
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('featuredItemsGrid')) {
    loadFeaturedItems();
  }
  if (document.getElementById('uploadedItemsGrid')) {
    loadUploadedItems();
  }
  if (document.getElementById('itemsGrid')) {
    loadBrowseItems();
  }

  // Login form handling
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;

      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
        window.location.href = 'dashboard.html';
      } catch (error) {
        alert('Login failed: ' + error.message);
      }
    });
  }

  // Signup form handling
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = signupForm.email.value.trim();
      const password = signupForm.password.value;
      const confirmPassword = signupForm.confirmPassword.value;

      if (!email || !password || !confirmPassword) {
        alert('Please fill in all required fields.');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Account created successfully! Please log in.');
        window.location.href = 'login.html';
      } catch (error) {
        alert('Signup failed: ' + error.message);
      }
    });
  }
});
