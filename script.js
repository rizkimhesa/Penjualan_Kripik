// Data untuk website
const initialProducts = [
    { 
        id: 1, 
        name: "Keripik Kentang Original", 
        category: "Kentang", 
        price: 15000, 
        stock: 45, 
        sales: 120,
        description: "Keripik kentang original dengan rasa gurih dan renyah",
        image: null
    },
    { 
        id: 2, 
        name: "Keripik Singkong Pedas", 
        category: "Singkong", 
        price: 12000, 
        stock: 60, 
        sales: 95,
        description: "Keripik singkong dengan rasa pedas yang menggugah selera",
        image: null
    },
    { 
        id: 3, 
        name: "Keripik Pisang Manis", 
        category: "Pisang", 
        price: 18000, 
        stock: 30, 
        sales: 75,
        description: "Keripik pisang dengan cita rasa manis alami",
        image: null
    },
    { 
        id: 4, 
        name: "Keripik Apel Kayu Manis", 
        category: "Buah", 
        price: 25000, 
        stock: 25, 
        sales: 50,
        description: "Keripik apel dengan taburan kayu manis yang harum",
        image: null
    },
    { 
        id: 5, 
        name: "Keripik Bayar Krispi", 
        category: "Sayuran", 
        price: 20000, 
        stock: 40, 
        sales: 65,
        description: "Keripik bayam krispi yang sehat dan renyah",
        image: null
    },
    { 
        id: 6, 
        name: "Keripik Kentang BBQ", 
        category: "Kentang", 
        price: 17000, 
        stock: 50, 
        sales: 85,
        description: "Keripik kentang dengan rasa barbekyu yang khas",
        image: null
    }
];

const initialTransactions = [
    { 
        id: "TRX001", 
        date: "2023-10-05", 
        customer: "Budi Santoso", 
        product: "Keripik Kentang Original", 
        quantity: 5, 
        total: 75000, 
        status: "completed" 
    },
    { 
        id: "TRX002", 
        date: "2023-10-07", 
        customer: "Siti Aminah", 
        product: "Keripik Singkong Pedas", 
        quantity: 3, 
        total: 36000, 
        status: "completed" 
    },
    { 
        id: "TRX003", 
        date: "2023-10-10", 
        customer: "Ahmad Wijaya", 
        product: "Keripik Pisang Manis", 
        quantity: 2, 
        total: 36000, 
        status: "pending" 
    },
    { 
        id: "TRX004", 
        date: "2023-10-12", 
        customer: "Dewi Lestari", 
        product: "Keripik Apel Kayu Manis", 
        quantity: 1, 
        total: 25000, 
        status: "completed" 
    }
];

// DOM Elements
const authPage = document.getElementById('authPage');
const mainWebsite = document.getElementById('mainWebsite');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const authButtons = document.getElementById('authButtons');
const navLinks = document.querySelectorAll('.nav-link');
const mainContents = document.querySelectorAll('.main-content');
const exploreProductsBtn = document.getElementById('exploreProducts');
const addProductBtn = document.getElementById('addProductBtn');
const addTransactionBtn = document.getElementById('addTransactionBtn');
const productModal = document.getElementById('productModal');
const transactionModal = document.getElementById('transactionModal');
const closeModals = document.querySelectorAll('.close-modal');
const productForm = document.getElementById('productForm');
const transactionForm = document.getElementById('transactionForm');
const productsTableBody = document.getElementById('productsTableBody');
const transactionsTableBody = document.getElementById('transactionsTableBody');
const featuredProducts = document.getElementById('featuredProducts');
const salesSummaryBody = document.getElementById('salesSummaryBody');
const updateAccountBtn = document.getElementById('updateAccountBtn');
const transactionProductSelect = document.getElementById('transactionProduct');
const productImageInput = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');
const previewImage = document.getElementById('previewImage');
const defaultText = document.getElementById('defaultText');
const modalTitle = document.getElementById('modalTitle');
const submitProductBtn = document.getElementById('submitProductBtn');
const productIdInput = document.getElementById('productId');

// State variables
let currentUser = null;
let products = JSON.parse(localStorage.getItem('products')) || initialProducts;
let transactions = JSON.parse(localStorage.getItem('transactions')) || initialTransactions;
let editingProductId = null;

// Initialize the website
function init() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainWebsite();
    }
    
    loadProducts();
    loadTransactions();
    loadFeaturedProducts();
    loadSalesSummary();
    updateDashboardStats();
    
    // Load products into transaction form
    loadProductsForTransaction();
    
    // Set current date for transaction form
    document.getElementById('transactionDate').valueAsDate = new Date();
    
    // Setup event listeners
    setupEventListeners();
}

// Show main website after login
function showMainWebsite() {
    authPage.classList.remove('active');
    mainWebsite.style.display = 'block';
    
    // Update user menu
    updateUserMenu();
}

// Update user menu in navbar
function updateUserMenu() {
    if (currentUser) {
        const userMenu = `
            <div class="user-menu" id="userMenu">
                <div class="user-avatar">${currentUser.name.charAt(0)}</div>
                <span>${currentUser.name}</span>
                <div class="dropdown-menu" id="dropdownMenu">
                    <a href="#" data-target="account"><i class="fas fa-user"></i> Akun Saya</a>
                    <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Keluar</a>
                </div>
            </div>
        `;
        authButtons.innerHTML = userMenu;
        
        // Add event listeners for user menu
        document.getElementById('userMenu').addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('dropdownMenu').classList.toggle('show');
        });
        
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            const dropdownMenu = document.getElementById('dropdownMenu');
            if (dropdownMenu && dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    authPage.classList.add('active');
    mainWebsite.style.display = 'none';
    
    // Reset forms
    loginForm.reset();
    registerForm.reset();
}

// Load products into table
function loadProducts() {
    productsTableBody.innerHTML = '';
    
    if (products.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <i class="fas fa-box-open" style="font-size: 48px; color: #ccc; margin-bottom: 15px; display: block;"></i>
                    <p style="color: var(--gray);">Belum ada produk. Silakan tambahkan produk terlebih dahulu.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}" class="product-thumb">` : 
                    `<div style="width: 50px; height: 50px; background-color: #f5f5f5; border-radius: 5px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-cookie-bite" style="color: #ccc;"></i>
                    </div>`
                }
            </td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>Rp ${product.price.toLocaleString()}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn btn-cart" style="padding: 5px 10px; font-size: 12px;" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-login" style="padding: 5px 10px; font-size: 12px; margin-left: 5px;" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </td>
        `;
        productsTableBody.appendChild(row);
    });
    
    // Update product count
    document.getElementById('totalProducts').textContent = products.length;
}

// Load transactions into table
function loadTransactions() {
    transactionsTableBody.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionsTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <i class="fas fa-receipt" style="font-size: 48px; color: #ccc; margin-bottom: 15px; display: block;"></i>
                    <p style="color: var(--gray);">Belum ada transaksi.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.date}</td>
            <td>${transaction.customer}</td>
            <td>${transaction.product} (${transaction.quantity})</td>
            <td>Rp ${transaction.total.toLocaleString()}</td>
            <td><span class="status ${transaction.status}">${getStatusText(transaction.status)}</span></td>
            <td>
                <button class="btn btn-cart" style="padding: 5px 10px; font-size: 12px;" onclick="viewTransaction('${transaction.id}')">
                    <i class="fas fa-eye"></i> Lihat
                </button>
            </td>
        `;
        transactionsTableBody.appendChild(row);
    });
    
    // Update transaction count
    const thisMonthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const now = new Date();
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear();
    }).length;
    
    document.getElementById('totalTransactions').textContent = thisMonthTransactions;
}

// Load featured products
function loadFeaturedProducts() {
    featuredProducts.innerHTML = '';
    
    // Sort products by sales and take top 4
    const sortedProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, 4);
    
    if (sortedProducts.length === 0) {
        featuredProducts.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray);">
                <i class="fas fa-box-open" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                <p>Belum ada produk untuk ditampilkan.</p>
            </div>
        `;
        return;
    }
    
    sortedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}">` : 
                    `<i class="fas fa-cookie-bite"></i>`
                }
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">Rp ${product.price.toLocaleString()}</div>
                <div class="product-actions">
                    <button class="btn btn-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Tambah
                    </button>
                    <span>Terjual: ${product.sales}</span>
                </div>
            </div>
        `;
        featuredProducts.appendChild(productCard);
    });
}

// Load sales summary
function loadSalesSummary() {
    salesSummaryBody.innerHTML = '';
    
    if (products.length === 0) {
        salesSummaryBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: var(--gray);">
                    <i class="fas fa-chart-bar" style="font-size: 32px; margin-bottom: 10px; display: block;"></i>
                    <p>Belum ada data penjualan.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    products.forEach(product => {
        const revenue = product.price * product.sales;
        const profit = revenue * 0.3; // Assuming 30% profit margin
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}" class="product-thumb">` : 
                    `<div style="width: 50px; height: 50px; background-color: #f5f5f5; border-radius: 5px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-cookie-bite" style="color: #ccc;"></i>
                    </div>`
                }
            </td>
            <td>${product.sales}</td>
            <td>Rp ${revenue.toLocaleString()}</td>
            <td>Rp ${profit.toLocaleString()}</td>
        `;
        salesSummaryBody.appendChild(row);
    });
    
    // Update total sales
    const totalSales = products.reduce((sum, product) => sum + (product.price * product.sales), 0);
    document.getElementById('totalSales').textContent = `Rp ${totalSales.toLocaleString()}`;
}

// Load products for transaction form
function loadProductsForTransaction() {
    transactionProductSelect.innerHTML = '<option value="">Pilih Produk</option>';
    
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} - Rp ${product.price.toLocaleString()} (Stok: ${product.stock})`;
        transactionProductSelect.appendChild(option);
    });
}

// Update dashboard stats
function updateDashboardStats() {
    // Calculate total customers from transactions
    const uniqueCustomers = [...new Set(transactions.map(t => t.customer))];
    document.getElementById('totalCustomers').textContent = uniqueCustomers.length;
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'completed': 'Selesai',
        'pending': 'Pending',
        'cancelled': 'Dibatalkan'
    };
    return statusMap[status] || status;
}

// Add product
function addProduct(product) {
    product.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    product.sales = product.sales || 0;
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
    loadFeaturedProducts();
    loadSalesSummary();
    loadProductsForTransaction();
    updateDashboardStats();
}

// Update product
function updateProduct(id, updatedProduct) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        // Preserve sales data
        updatedProduct.sales = products[index].sales;
        updatedProduct.id = id;
        products[index] = updatedProduct;
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
        loadFeaturedProducts();
        loadSalesSummary();
        loadProductsForTransaction();
        updateDashboardStats();
    }
}

// Add transaction
function addTransaction(transaction) {
    // Generate transaction ID
    const lastId = transactions.length > 0 ? parseInt(transactions[transactions.length - 1].id.replace('TRX', '')) : 0;
    transaction.id = 'TRX' + String(lastId + 1).padStart(3, '0');
    
    // Update product stock and sales
    const productId = parseInt(transaction.product);
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(transaction.quantity);
    
    if (product) {
        if (product.stock >= quantity) {
            product.stock -= quantity;
            product.sales += quantity;
        } else {
            alert('Stok produk tidak mencukupi!');
            return;
        }
    }
    
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('products', JSON.stringify(products));
    
    loadTransactions();
    loadProducts();
    loadFeaturedProducts();
    loadSalesSummary();
    updateDashboardStats();
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        editingProductId = id;
        modalTitle.textContent = 'Edit Produk';
        submitProductBtn.textContent = 'Update Produk';
        
        // Fill form with product data
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productDescription').value = product.description || '';
        
        // Handle image preview
        if (product.image) {
            previewImage.src = product.image;
            previewImage.style.display = 'block';
            defaultText.style.display = 'none';
        } else {
            previewImage.style.display = 'none';
            defaultText.style.display = 'flex';
        }
        
        // Show modal
        productModal.classList.add('show');
    }
}

// Delete product
function deleteProduct(id) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
        loadFeaturedProducts();
        loadSalesSummary();
        loadProductsForTransaction();
        alert('Produk berhasil dihapus!');
    }
}

// View transaction
function viewTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        alert(`Detail Transaksi:\n\nID: ${transaction.id}\nTanggal: ${transaction.date}\nPelanggan: ${transaction.customer}\nProduk: ${transaction.product}\nJumlah: ${transaction.quantity}\nTotal: Rp ${transaction.total.toLocaleString()}\nStatus: ${getStatusText(transaction.status)}`);
    }
}

// Add to cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        alert(`Produk "${product.name}" telah ditambahkan ke keranjang!`);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Switch between login and register tabs
    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });
    
    registerTab.addEventListener('click', function() {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    });
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Demo login
        if (email === 'admin@crispycrunch.com' && password === 'admin123') {
            currentUser = {
                name: 'Admin CrispyCrunch',
                email: email
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMainWebsite();
            alert('Login berhasil! Selamat datang di CrispyCrunch.');
        } else {
            alert('Email atau password salah! Coba lagi.\n\nUntuk demo, gunakan:\nEmail: admin@crispycrunch.com\nPassword: admin123');
        }
    });
    
    // Register form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Password dan konfirmasi password tidak cocok!');
            return;
        }
        
        currentUser = {
            name: name,
            email: email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainWebsite();
        alert('Registrasi berhasil! Selamat datang di CrispyCrunch.');
    });
    
    // Navigation between sections
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active nav link
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            const target = this.getAttribute('data-target');
            mainContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${target}Content`) {
                    content.classList.add('active');
                }
            });
            
            // Close dropdown menu if open
            const dropdownMenu = document.getElementById('dropdownMenu');
            if (dropdownMenu && dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
            }
        });
    });
    
    // Footer links navigation
    document.querySelectorAll('.footer-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = this.getAttribute('data-target');
            
            // Update active nav link
            navLinks.forEach(nav => nav.classList.remove('active'));
            document.querySelector(`.nav-link[data-target="${target}"]`).classList.add('active');
            
            // Show corresponding section
            mainContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${target}Content`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Explore products button
    exploreProductsBtn.addEventListener('click', function() {
        // Update active nav link
        navLinks.forEach(nav => nav.classList.remove('active'));
        document.querySelector('.nav-link[data-target="products"]').classList.add('active');
        
        // Show products section
        mainContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === 'productsContent') {
                content.classList.add('active');
            }
        });
    });
    
    // Add product button
    addProductBtn.addEventListener('click', function() {
        editingProductId = null;
        modalTitle.textContent = 'Tambah Produk Baru';
        submitProductBtn.textContent = 'Simpan Produk';
        productForm.reset();
        previewImage.style.display = 'none';
        defaultText.style.display = 'flex';
        productModal.classList.add('show');
    });
    
    // Add transaction button
    addTransactionBtn.addEventListener('click', function() {
        transactionForm.reset();
        document.getElementById('transactionDate').valueAsDate = new Date();
        loadProductsForTransaction();
        transactionModal.classList.add('show');
    });
    
    // Close modals
    closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('show');
            productForm.reset();
            editingProductId = null;
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
            productForm.reset();
            editingProductId = null;
        }
    });
    
    // Image preview functionality
    productImageInput.addEventListener('change', function() {
        const file = this.files[0];
        
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran file terlalu besar! Maksimal 2MB.');
                this.value = '';
                return;
            }
            
            // Check file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                alert('Format file tidak didukung! Gunakan JPG, PNG, atau GIF.');
                this.value = '';
                return;
            }
            
            const reader = new FileReader();
            
            reader.addEventListener('load', function() {
                previewImage.src = reader.result;
                previewImage.style.display = 'block';
                defaultText.style.display = 'none';
            });
            
            reader.readAsDataURL(file);
        } else {
            previewImage.style.display = 'none';
            defaultText.style.display = 'flex';
        }
    });
    
    // Product form submission
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const product = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseInt(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            description: document.getElementById('productDescription').value
        };
        
        // Handle image
        if (previewImage.src && previewImage.style.display !== 'none') {
            product.image = previewImage.src;
        }
        
        if (editingProductId) {
            // Update existing product
            updateProduct(editingProductId, product);
            alert('Produk berhasil diperbarui!');
        } else {
            // Add new product
            addProduct(product);
            alert('Produk berhasil ditambahkan!');
        }
        
        productModal.classList.remove('show');
        productForm.reset();
        previewImage.style.display = 'none';
        defaultText.style.display = 'flex';
        editingProductId = null;
    });
    
    // Transaction form submission
    transactionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = parseInt(document.getElementById('transactionProduct').value);
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            alert('Silakan pilih produk yang valid!');
            return;
        }
        
        const quantity = parseInt(document.getElementById('transactionQuantity').value);
        const total = product.price * quantity;
        
        const transaction = {
            date: document.getElementById('transactionDate').value,
            customer: document.getElementById('transactionCustomer').value,
            product: product.name,
            quantity: quantity,
            total: total,
            status: document.getElementById('transactionStatus').value
        };
        
        addTransaction(transaction);
        transactionModal.classList.remove('show');
        transactionForm.reset();
        
        // Reset date to today
        document.getElementById('transactionDate').valueAsDate = new Date();
        
        alert('Transaksi berhasil ditambahkan!');
    });
    
    // Update account
    updateAccountBtn.addEventListener('click', function() {
        const password = document.getElementById('accountPassword').value;
        const confirmPassword = document.getElementById('accountConfirmPassword').value;
        
        if (password && password !== confirmPassword) {
            alert('Password baru dan konfirmasi password tidak cocok!');
            return;
        }
        
        // Update user data
        if (currentUser) {
            currentUser.name = document.getElementById('accountName').value;
            currentUser.phone = document.getElementById('accountPhone').value;
            currentUser.address = document.getElementById('accountAddress').value;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUserMenu();
        }
        
        alert('Profil berhasil diperbarui!');
        
        // Clear password fields
        document.getElementById('accountPassword').value = '';
        document.getElementById('accountConfirmPassword').value = '';
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);