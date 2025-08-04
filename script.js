document.addEventListener('DOMContentLoaded', () => {
    // Elementos da Tela de Login
    const loginScreen = document.getElementById('login-screen');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password-input');
    const loginErrorMessage = document.getElementById('login-error-message');
    const mainContent = document.getElementById('main-content');

    const CORRECT_PASSWORD = 'Fox123';

    // Elementos do Orçamento
    const budgetForm = document.getElementById('budget-form');
    const budgetDescriptionInput = document.getElementById('budget-description');
    const budgetAmountInput = document.getElementById('budget-amount');
    const budgetTypeSelect = document.getElementById('budget-type');
    const budgetItemsList = document.getElementById('budget-items');
    const totalRevenueDisplay = document.getElementById('total-revenue');
    const totalExpenseDisplay = document.getElementById('total-expense');
    const netBalanceDisplay = document.getElementById('net-balance');
    const inventorySearchInput = document.getElementById('inventory-search');
    const inventorySearchResults = document.getElementById('inventory-search-results');

    // Elementos do Estoque
    const inventoryForm = document.getElementById('inventory-form');
    const inventoryItemIdInput = document.getElementById('inventory-item-id');
    const inventoryNameInput = document.getElementById('inventory-name');
    const inventoryCodeInput = document.getElementById('inventory-code');
    const inventoryPriceInput = document.getElementById('inventory-price');
    const inventorySubmitBtn = document.getElementById('inventory-submit-btn');
    const inventoryItemsList = document.getElementById('inventory-items');

    let budgetItems = JSON.parse(localStorage.getItem('budgetItems')) || [];
    let inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];

    // Funções de Login
    function handleLogin(event) {
        event.preventDefault();
        if (passwordInput.value === CORRECT_PASSWORD) {
            loginScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            // Renderizar itens após o login bem-sucedido
            renderBudgetItems();
            renderInventoryItems();
        } else {
            loginErrorMessage.textContent = 'Senha incorreta. Tente novamente.';
            passwordInput.value = '';
        }
    }

    // Funções de Orçamento
    function saveBudgetItems() {
        localStorage.setItem('budgetItems', JSON.stringify(budgetItems));
    }

    function renderBudgetItems() {
        budgetItemsList.innerHTML = '';
        let totalRevenue = 0;
        let totalExpense = 0;

        budgetItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.dataset.id = item.id;
            
            const itemDescription = document.createElement('span');
            itemDescription.classList.add('item-description');
            itemDescription.textContent = item.description;

            const itemAmount = document.createElement('span');
            itemAmount.classList.add('item-amount');
            itemAmount.textContent = `R$ ${item.amount.toFixed(2)}`;
            itemAmount.classList.add(item.type);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'Excluir';
            deleteButton.addEventListener('click', () => deleteBudgetItem(item.id));

            listItem.appendChild(itemDescription);
            listItem.appendChild(itemAmount);
            listItem.appendChild(deleteButton);
            budgetItemsList.appendChild(listItem);

            if (item.type === 'revenue') {
                totalRevenue += item.amount;
            } else {
                totalExpense += item.amount;
            }
        });

        const netBalance = totalRevenue - totalExpense;

        totalRevenueDisplay.textContent = `R$ ${totalRevenue.toFixed(2)}`;
        totalExpenseDisplay.textContent = `R$ ${totalExpense.toFixed(2)}`;
        netBalanceDisplay.textContent = `R$ ${netBalance.toFixed(2)}`;

        if (netBalance > 0) {
            netBalanceDisplay.style.color = '#28a745'; // Green
        } else if (netBalance < 0) {
            netBalanceDisplay.style.color = '#dc3545'; // Red
        } else {
            netBalanceDisplay.style.color = '#007bff'; // Blue (default)
        }
    }

    function addBudgetItem(event) {
        event.preventDefault();

        const description = budgetDescriptionInput.value.trim();
        const amount = parseFloat(budgetAmountInput.value);
        const type = budgetTypeSelect.value;

        if (!description || isNaN(amount) || amount <= 0) {
            alert('Por favor, insira uma descrição válida e um valor positivo para o item do orçamento.');
            return;
        }

        const newItem = {
            id: Date.now(),
            description,
            amount,
            type
        };

        budgetItems.push(newItem);
        saveBudgetItems();
        renderBudgetItems();

        budgetDescriptionInput.value = '';
        budgetAmountInput.value = '';
    }

    function deleteBudgetItem(id) {
        budgetItems = budgetItems.filter(item => item.id !== id);
        saveBudgetItems();
        renderBudgetItems();
    }

    // Funções de Estoque
    function saveInventoryItems() {
        localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
    }

    function renderInventoryItems() {
        inventoryItemsList.innerHTML = '';
        inventoryItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.dataset.id = item.id;
            
            const itemName = document.createElement('span');
            itemName.classList.add('item-name');
            itemName.textContent = item.name;

            const itemCode = document.createElement('span');
            itemCode.classList.add('item-code');
            itemCode.textContent = `Código: ${item.code || 'N/A'}`;

            const itemPrice = document.createElement('span');
            itemPrice.classList.add('item-price');
            itemPrice.textContent = `Preço: R$ ${item.price.toFixed(2)}`;

            const editButton = document.createElement('button');
            editButton.classList.add('edit-btn');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', () => editInventoryItem(item.id));

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'Excluir';
            deleteButton.addEventListener('click', () => deleteInventoryItem(item.id));

            listItem.appendChild(itemName);
            listItem.appendChild(itemCode);
            listItem.appendChild(itemPrice);
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            inventoryItemsList.appendChild(listItem);
        });
    }

    function addOrUpdateInventoryItem(event) {
        event.preventDefault();

        const id = inventoryItemIdInput.value;
        const name = inventoryNameInput.value.trim();
        const code = inventoryCodeInput.value.trim();
        const price = parseFloat(inventoryPriceInput.value);

        if (!name || isNaN(price) || price <= 0) {
            alert('Por favor, insira um nome válido e um preço positivo para o item do estoque.');
            return;
        }

        if (id) { // Edit existing item
            inventoryItems = inventoryItems.map(item => 
                item.id == id ? { ...item, name, code, price } : item
            );
            inventorySubmitBtn.textContent = 'Adicionar Produto';
        } else { // Add new item
            const newItem = {
                id: Date.now(),
                name,
                code,
                price
            };
            inventoryItems.push(newItem);
        }
        
        saveInventoryItems();
        renderInventoryItems();
        clearInventoryForm();
    }

    function editInventoryItem(id) {
        const itemToEdit = inventoryItems.find(item => item.id === id);
        if (itemToEdit) {
            inventoryItemIdInput.value = itemToEdit.id;
            inventoryNameInput.value = itemToEdit.name;
            inventoryCodeInput.value = itemToEdit.code;
            inventoryPriceInput.value = itemToEdit.price;
            inventorySubmitBtn.textContent = 'Atualizar Produto';
        }
    }

    function deleteInventoryItem(id) {
        inventoryItems = inventoryItems.filter(item => item.id !== id);
        saveInventoryItems();
        renderInventoryItems();
    }

    function clearInventoryForm() {
        inventoryItemIdInput.value = '';
        inventoryNameInput.value = '';
        inventoryCodeInput.value = '';
        inventoryPriceInput.value = '';
        inventorySubmitBtn.textContent = 'Adicionar Produto';
    }

    // Integração Orçamento-Estoque
    inventorySearchInput.addEventListener('input', () => {
        const searchTerm = inventorySearchInput.value.toLowerCase();
        inventorySearchResults.innerHTML = '';

        if (searchTerm.length > 0) {
            const filteredItems = inventoryItems.filter(item => 
                item.name.toLowerCase().includes(searchTerm) || 
                (item.code && item.code.toLowerCase().includes(searchTerm))
            );

            filteredItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.name} (Cód: ${item.code || 'N/A'}) - R$ ${item.price.toFixed(2)}`;
                li.addEventListener('click', () => {
                    budgetDescriptionInput.value = item.name;
                    budgetAmountInput.value = item.price;
                    inventorySearchResults.innerHTML = ''; // Clear results
                    inventorySearchInput.value = ''; // Clear search input
                });
                inventorySearchResults.appendChild(li);
            });
        }
    });

    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    budgetForm.addEventListener('submit', addBudgetItem);
    inventoryForm.addEventListener('submit', addOrUpdateInventoryItem);

    // Inicialização: Oculta o conteúdo principal até o login
    mainContent.classList.add('hidden');
    loginScreen.classList.remove('hidden');
});
