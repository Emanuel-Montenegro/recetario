// Datos Iniciales
let users = JSON.parse(localStorage.getItem('users')) || [];
let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

// Categorías disponibles
const categories = ['Postres', 'Platos Principales', 'Ensaladas', 'Desayunos'];

// Elementos del DOM
const recipeContainer = document.getElementById('recipeContainer');
const categorySelect = document.getElementById('categorySelect');
const searchInput = document.getElementById('searchInput');
const authButtons = document.getElementById('authButtons');
const userInfo = document.getElementById('userInfo');
const addRecipeBtn = document.getElementById('addRecipeBtn');

// Inicializar la App
document.addEventListener('DOMContentLoaded', () => {
    initCategories();
    initSampleRecipes();
    renderRecipes();
    checkAuth();
    setupEventListeners();
});

// ========== Funciones Generales ==========
function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('recipes', JSON.stringify(recipes));
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// ========== Autenticación ==========
function checkAuth() {
    if (currentUser) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        document.getElementById('username').textContent = currentUser;
        addRecipeBtn.style.display = 'block';
    }
}

function register(username, password) {
    if (users.some(user => user.username === username)) {
        showToast('⚠️ Usuario ya existe');
        return;
    }
    users.push({ username, password });
    saveData();
    showToast('🎉 Registro exitoso');
    showModal('login');
}

function login(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        currentUser = username;
        saveData();
        checkAuth();
        closeModal();
        showToast(`👋 ¡Bienvenido ${username}!`);
        renderRecipes();
    } else {
        showToast('❌ Credenciales incorrectas');
    }
}

function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    authButtons.style.display = 'flex';
    userInfo.style.display = 'none';
    addRecipeBtn.style.display = 'none';
    renderRecipes();
    showToast('👋 Sesión cerrada');
}

// ========== Gestión de Recetas ==========
function initSampleRecipes() {
if (recipes.length === 0) {
    recipes = [
        {
            id: 1,
            title: 'Tarta de Manzana',
            description: 'Clásica tarta con canela y manzanas caramelizadas...',
            category: 'Postres',
            ingredients: ['6 manzanas', '200g harina', '100g mantequilla', '150g azúcar'],
            steps: ['Precalentar horno a 180°C', 'Preparar la masa', 'Hornear por 40 min'],
            author: 'admin',
            image: 'assets/images/tarta-manzana.jpg'
        },
        {
            id: 2,
            title: 'Pasta Carbonara',
            description: 'Pasta con salsa cremosa de huevo y panceta...',
            category: 'Platos Principales',
            ingredients: ['6 manzanas', '200g harina', '100g mantequilla', '150g azúcar'],
            steps: ['Precalentar horno a 180°C', 'Preparar la masa', 'Hornear por 40 min'],
            author: 'admin',
            image: 'assets/images/carbonara.jpg'
        },
        {
            id: 3,
            title: 'Milanesas con pure de papas',
            description: 'Milanesas de bola de lomo rebozadas con pure de papas...',
            category: 'Platos Principales',
            ingredients: ['6 manzanas', '200g harina', '100g mantequilla', '150g azúcar'],
            steps: ['Precalentar horno a 180°C', 'Preparar la masa', 'Hornear por 40 min'],
            author: 'admin',
            image: 'assets/images/milanesas.jpg'
        },
        {
            id: 4,
            title: 'Pan de campo',
            description: 'Pan de campo integral de masa madre',
            category: 'Desayunos',
            ingredients: ['6 manzanas', '200g harina', '100g mantequilla', '150g azúcar'],
            steps: ['Precalentar horno a 180°C', 'Preparar la masa', 'Hornear por 40 min'],
            author: 'admin',
            image: 'assets/images/pan.jpg'
        },
        {
            id: 5,
            title: 'Ensalada de frutas',
            description: 'Ensalada de frutas frescas de estacion...',
            category: 'Ensaladas',
            ingredients: ['6 manzanas', '200g harina', '100g mantequilla', '150g azúcar'],
            steps: ['Precalentar horno a 180°C', 'Preparar la masa', 'Hornear por 40 min'],
            author: 'admin',
            image: 'assets/images/ensalada-frutas.jpg'
        },
        {
            id: 6,
            title: 'Goulash con spätzle',
            description: 'Goulash de carne con spätzle y verduras...',
            category: 'Platos Principales',
            ingredients: ['6 manzanas', '200g harina', '100g mantequilla', '150g azúcar'],
            steps: ['Precalentar horno a 180°C', 'Preparar la masa', 'Hornear por 40 min'],
            author: 'admin',
            image: 'assets/images/goulash.jpg'
        },
        {
            id: 7,
            title: 'Ñoquis con relleno de queso',
            description: 'Goulash de carne con spätzle y verduras...',
            category: 'Platos Principales',
            ingredients: ['6 manzanas', '200g harina', '100g mantequilla', '150g azúcar'],
            steps: ['Precalentar horno a 180°C', 'Preparar la masa', 'Hornear por 40 min'],
            author: 'admin',
            image: 'assets/images/noquis.jpg'
        },
        {
            id: 8,
            title: 'Lemon pie',
            description: 'Tarta de limón con merengue italiano...',
            category: 'Postres',
            ingredients: ['6 manzanas', '200g harina', '100g mantequilla', '150g azúcar'],
            steps: ['Precalentar horno a 180°C', 'Preparar la masa', 'Hornear por 40 min'],
            author: 'admin',
            image: 'assets/images/lemon.jpg'
        },

        {
            id: 9,
            title: 'Currywurst Vegano',
            description: 'Salchicha alemana vegana con salsa de tomate y curry...',
            category: 'Platos Principales',
            ingredients: ['6 manzanas', '200g harina', '100g mantequilla', '150g azúcar'],
            steps: ['Precalentar horno a 180°C', 'Preparar la masa', 'Hornear por 40 min'],
            author: 'admin',
            image: 'assets/images/curry.jpg'
        },
        {
            id: 10,
            title: 'Cannoli italiano',
            description: 'Masa crocante enrollada en forma de tubo que dentro lleva ingredientes mezclados con queso ricota',
            category: 'Postres',
            ingredients: ['6 manzanas', '200g harina', '100g mantequilla', '150g azúcar'],
            steps: ['Precalentar horno a 180°C', 'Preparar la masa', 'Hornear por 40 min'],
            author: 'admin',
            image: 'assets/images/canoli.jpg'
        },
        
        
    ];
    saveData();
    }
    }

    function addRecipe(title, description, category, image, ingredients, steps) { // <- Agregar ingredients y steps
        recipes.push({
            id: Date.now(),
            title,
            description,
            category,
            ingredients: ingredients || [], // <- Corregir a INGLÉS
            steps: steps || [], 
            author: currentUser,
            image: image || 'assets/images/default.jpg'
        });
        saveData();
        renderRecipes();
        closeModal();
        showToast('✅ Receta agregada!');
    }

function deleteRecipe(recipeId) {
    if (!currentUser) {
        showToast('🔒 Debes iniciar sesión');
        return;
    }
    
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (recipe.author !== currentUser) {
        showToast('🚫 No tienes permiso para esta acción');
        return;
    }
    
    recipes = recipes.filter(recipe => recipe.id !== recipeId);
    saveData();
    renderRecipes();
}
function editRecipe(recipeId) {
    if (!currentUser) {
        showToast('🔒 Debes iniciar sesión');
        return;
    }
    
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (recipe.author !== currentUser) {
        showToast('🚫 No tienes permiso para esta acción');
        return;
    }

}

// ========== Renderizado ==========
function renderRecipes() {
    recipeContainer.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value.toLowerCase();

    recipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchTerm) || 
                            recipe.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || 
        recipe.category.toLowerCase() === selectedCategory;
        return matchesSearch && matchesCategory;
    }).forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card glass-card';
        const showActions = currentUser && currentUser === recipe.author;

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p>${recipe.description}</p>
            <div class="recipe-meta">
                <span class="category">${recipe.category}</span>
                ${recipe.author !== currentUser ? `<span class="author">Por: ${recipe.author}</span>` : ''}
            </div>
            ${showActions ? `
                <div class="recipe-actions">
                    <button onclick="editRecipe(${recipe.id})">✏️</button>
                    <button onclick="deleteRecipe(${recipe.id})">🗑️</button>
                </div>
            ` : ''}
        `;
        card.addEventListener('click', () => showRecipeDetail(recipe.id));
        recipeContainer.appendChild(card);
    });
}
// Mostrar detalle de receta
function showRecipeDetail(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    
    // Manejar recetas antiguas sin ingredientes/pasos
    const ingredients = recipe.ingredients || ['Información no disponible'];
    const steps = recipe.steps || ['Instrucciones no disponibles'];

    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = `
        <div class="recipe-detail">
            <!-- ... resto del contenido ... -->
            <div class="ingredients-list">
                <h3>Ingredientes</h3>
                <ul>${ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            </div>
            
            <div class="steps-list">
                <h3>Preparación</h3>
                <ol>${steps.map(s => `<li>${s}</li>`).join('')}</ol>
            </div>
        </div>
    `;
    
    document.getElementById('detailModal').style.display = 'flex';
}
// Cerrar modal
function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// ========== Modales ==========
function showModal(type) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    const templates = {
        login: `
            <h2>Login</h2>
            <form onsubmit="event.preventDefault(); login(this.username.value, this.password.value)">
                <div class="form-group">
                    <input type="text" name="username" placeholder="Usuario" required>
                </div>
                <div class="form-group">
                    <input type="password" name="password" placeholder="Contraseña" required>
                </div>
                <button type="submit" class="glass-btn">Entrar</button>
            </form>
        `,
        register: `
            <h2>Registro</h2>
            <form onsubmit="event.preventDefault(); register(this.username.value, this.password.value)">
                <div class="form-group">
                    <input type="text" name="username" placeholder="Usuario" required>
                </div>
                <div class="form-group">
                    <input type="password" name="password" placeholder="Contraseña" required>
                </div>
                <button type="submit" class="glass-btn">Registrar</button>
            </form>
        `,
        addRecipe:  `
        <h2>Nueva Receta</h2>
       <form onsubmit="event.preventDefault(); handleRecipeSubmit(this)">
    <div class="form-group">
        <input type="text" name="title" placeholder="Título" required>
    </div>
    
    <div class="form-group">
        <textarea name="description" placeholder="Descripción" required></textarea>
    </div>
    
    <div class="form-group">
        <select name="category" required>
            ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
        </select>
    </div>
    
    <div class="form-group">
        <textarea name="ingredients" placeholder="1 taza de harina\n3 huevos..." required></textarea>
    </div>
    
    <div class="form-group">
        <textarea name="steps" placeholder="1. Mezclar ingredientes\n2. Hornear..." required></textarea>
    </div>
    
    <div class="form-group">
        <label class="file-upload">
            <input type="file" name="image" accept="image/*">
            📸 Subir Imagen
        </label>
    </div>
    
    <button type="submit" class="glass-btn">Guardar</button>
</form>
    `
    };

    modal.style.display = 'flex';
    modalBody.innerHTML = templates[type];
    setTimeout(() => {
        const firstInput = modalBody.querySelector('input, textarea, select');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    
    // Limpiar formulario
    const form = document.querySelector('#modalBody form');
    if (form) form.reset(); // ← Nueva línea
}

// ========== Utilidades ==========
function initCategories() {
    categorySelect.innerHTML = '<option value="">Todas las categorías</option>' + 
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function setupEventListeners() {
    searchInput.addEventListener('input', renderRecipes);
    categorySelect.addEventListener('change', renderRecipes);
}

function handleRecipeSubmit(form) {
    // Capturar todos los valores del formulario
    const title = form.title.value.trim();
    const description = form.description.value.trim();
    const category = form.category.value;
    const ingredients = form.ingredients.value.split('\n').filter(i => i.trim() !== '');
    const steps = form.steps.value.split('\n').filter(s => s.trim() !== '');
    const file = form.image.files[0];

    // Validación de campos requeridos
    if (!title || !description || !category || ingredients.length === 0 || steps.length === 0) {
        showToast('❌ Completa todos los campos obligatorios');
        return;
    }

    // Manejar la imagen
    const handleImage = (imageData) => {
        addRecipe(title, description, category, imageData, ingredients, steps);
        showToast('✅ Receta agregada correctamente!');
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => handleImage(e.target.result);
        reader.readAsDataURL(file);
    } else {
        handleImage('assets/images/default.jpg');
    }
}