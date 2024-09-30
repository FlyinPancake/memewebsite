async function loadImages(func, page, query) {
    try {
        const response = await fetch(`/api/${func}?page=${page}&${query}`);
        const images = await response.json();
        displayImages(images);
    } catch (error) {
        console.error('Error loading images:', error);
    }
}

function displayImages(images) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    images.forEach(image => {
        let hrefs = '';
        image.tags.forEach(tag => {
            const href = `<a href="/tag/${tag}">${tag}</a>`;
            hrefs += href + '\n';
        });
        
        const imageCard = document.createElement('div');
        imageCard.className = 'image-card';

        imageCard.innerHTML = `
            <div class="title">${image.title}</div>
            <img src="${image.url}" alt="Unable to load image">
            <div class="voting">
                <button onclick="vote(${image.postid}, 1)">Upvote</button>
                <div class="score" id="score-${image.postid}">${image.score}</div>
                <button onclick="vote(${image.postid}, -1)">Downvote</button>
            </div>
            <a href="/user/${image.username}">${image.username}</a>
            <span>${hrefs}</span>
        `;

        gallery.appendChild(imageCard);
    });
}

async function vote(postID, delta) {
    try {
        const response = await fetch(`/api/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postID, delta })
        });

        if (response.ok) {
            scoreText = document.getElementById(`score-${postID}`)
            scoreText.textContent = parseInt(scoreText.textContent) + delta;
        } else {
            console.error('Error voting:', response.statusText);
        }
    } catch (error) {
        console.error('Error voting:', error);
    }
}

function showLoginForm(form) {
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    var loginTab = document.getElementById('loginTab');
    var registerTab = document.getElementById('registerTab');

    if (form === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
    }
}

function submitLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Encode credentials in base64
    const credentials = btoa(`${username}:${password}`);

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Authentication failed');
    })
    .then(data => {
        // Handle success
        console.log('Login successful', data);
        window.location.href = '/'; // Redirect on success
    })
    .catch(error => {
        // Handle error
        console.error('Error:', error);
        alert('Login failed');
    });
}

function submitRegister() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const email = document.getElementById('register-email').value;

    fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, email }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Registration failed');
    })
    .then(data => {
        // Handle success
        console.log('Registration was successful', data);
        window.location.href = '/'; // Redirect on success
    })
    .catch(error => {
        // Handle error
        console.error('Error:', error);
        alert('Registration failed');
    });
}

function loadPageSelector(func, page) {
    const pageSelector = document.getElementById('pageSelector');
    pageSelector.innerHTML = '';

    let pageNumber = parseInt(page);
    let start = (pageNumber <= 4) ? 1 : pageNumber - 3;
    let end = (pageNumber <= 4) ? 7 : pageNumber + 3;
    for (let i = start; i <= end; i++) {
        pageHTML = `
            <form action="/${func}">
                <input type="submit" value="${i}" class="pagerButton" />
                <input type="hidden" name="page" value="${i}" />
            </form>
        `;
        currentPageHTML = `
            <form action="javascript:void(0);">
                <input type="submit" value="${i}" class="pagerButtonCurrent" />
            </form>
        `;
        const pageButton = document.createElement('div');
        pageButton.innerHTML = i==page ? currentPageHTML : pageHTML;
        pageSelector.appendChild(pageButton);
    }
}