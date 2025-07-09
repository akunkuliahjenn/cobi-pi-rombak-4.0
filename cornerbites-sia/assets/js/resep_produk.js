// Definisikan recipeUnitOptions di JavaScript untuk reset form yang benar
const recipeUnitOptions = ['gram', 'kg', 'ml', 'liter', 'pcs', 'buah', 'sendok teh', 'sendok makan', 'cangkir'];

// Format Rupiah function
function formatRupiah(element, hiddenInputId) {
    let value = element.value.replace(/[^0-9]/g, '');

    if (value === '') {
        element.value = '';
        document.getElementById(hiddenInputId).value = '';
        return;
    }

    let formatted = new Intl.NumberFormat('id-ID').format(value);
    element.value = formatted;
    document.getElementById(hiddenInputId).value = value;
    document.getElementById(hiddenInputId).value = value;
}

function showEditForm(item) {
    // Hide all forms first
    hideAllForms();

    // Show edit form
    document.getElementById('edit-resep-form-section').style.display = 'block';

    // Fill form data
    document.getElementById('edit_recipe_id').value = item.id;
    document.getElementById('edit_quantity_used').value = item.quantity_used;
    document.getElementById('edit_unit_measurement').value = item.unit_measurement;

    // Show appropriate tab based on raw material type
    if (item.raw_material_type === 'bahan') {
        showEditCategoryTab('bahan');
        document.getElementById('edit_raw_material_id_bahan').value = item.raw_material_id;
        document.getElementById('edit-resep-form-title').textContent = 'Edit Bahan Baku'; // Update title
    } else {
        showEditCategoryTab('kemasan');
        document.getElementById('edit_raw_material_id_kemasan').value = item.raw_material_id;
        document.getElementById('edit-resep-form-title').textContent = 'Edit Kemasan'; // Update title
    }

    // Scroll to form
    document.getElementById('edit-resep-form-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });

    // Format quantity to remove unnecessary zeros
    const formattedQuantity = parseFloat(item.quantity_used).toString();
    document.getElementById('edit_quantity_used').value = formattedQuantity;
}

function hideEditForm() {
    document.getElementById('edit-resep-form-section').style.display = 'none';

    // Reset form
    document.getElementById('edit_recipe_id').value = '';
    document.getElementById('edit_quantity_used').value = '';
    document.getElementById('edit_unit_measurement').value = recipeUnitOptions[0];
    document.getElementById('edit_raw_material_id_bahan').value = '';
    document.getElementById('edit_raw_material_id_kemasan').value = '';

    // Reset to bahan tab
    showEditCategoryTab('bahan');
}

function showEditCategoryTab(categoryName) {
    // Hide all content
    document.getElementById('edit-content-bahan').classList.add('hidden');
    document.getElementById('edit-content-kemasan').classList.add('hidden');

    // Reset all tab buttons
    document.getElementById('edit-tab-bahan').className = 'py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300';
    document.getElementById('edit-tab-kemasan').className = 'py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300';

    // Show content yang dipilih
    document.getElementById('edit-content-' + categoryName).classList.remove('hidden');

    // Set active tab
    document.getElementById('edit-tab-' + categoryName).className = 'py-2 px-1 border-b-2 border-blue-600 font-medium text-sm text-blue-600';

    // Clear dan reset dropdown yang tidak aktif, enable yang aktif
    if (categoryName === 'bahan') {
        const kemasamSelect = document.getElementById('edit_raw_material_id_kemasan');
        const bahanSelect = document.getElementById('edit_raw_material_id_bahan');

        if (kemasamSelect) {
            kemasamSelect.value = '';
            kemasamSelect.disabled = true;
            kemasamSelect.removeAttribute('name');
        }
        if (bahanSelect) {
            bahanSelect.disabled = false;
            bahanSelect.setAttribute('name', 'raw_material_id');
            bahanSelect.required = true;
        }
    } else {
        const bahanSelect = document.getElementById('edit_raw_material_id_bahan');
        const kemasamSelect = document.getElementById('edit_raw_material_id_kemasan');

        if (bahanSelect) {
            bahanSelect.value = '';
            bahanSelect.disabled = true;
            bahanSelect.removeAttribute('name');
        }
        if (kemasamSelect) {
            kemasamSelect.disabled = false;
            kemasamSelect.setAttribute('name', 'raw_material_id');
            kemasamSelect.required = true;
        }
    }
}

function editRecipeItem(item) {
    console.log('Editing item:', item);

    const form = document.getElementById('recipe-main-form');
    const title = document.getElementById('recipe-form-title');
    const desc = document.getElementById('recipe-form-desc');
    const editId = document.getElementById('recipe-edit-id');
    const select = document.getElementById('recipe-select');
    const quantity = document.getElementById('recipe-quantity');
    const unit = document.getElementById('recipe-unit');
    const action = document.getElementById('recipe-action');
    const submitText = document.getElementById('recipe-submit-text');
    const submitBtn = document.getElementById('recipe-submit-btn');
    const cancelBtn = document.getElementById('recipe-cancel-btn');

    // Set edit mode
    editId.value = item.id;
    action.value = 'edit';

    // Format quantity to remove unnecessary zeros
    const formattedQuantity = parseFloat(item.quantity_used).toString();
    quantity.value = formattedQuantity;
    unit.value = item.unit_measurement;

    // Switch to appropriate tab first
    if (item.raw_material_type === 'bahan') {
        switchRecipeTab('bahan');
        title.textContent = 'Edit Bahan Baku';
        desc.textContent = 'Update komposisi bahan baku dalam resep';
        submitText.textContent = 'Update Bahan Baku';
        submitBtn.className = 'flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500';
    } else {
        switchRecipeTab('kemasan');
        title.textContent = 'Edit Kemasan';
        desc.textContent = 'Update komposisi kemasan dalam resep';
        submitText.textContent = 'Update Kemasan';
        submitBtn.className = 'flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500';
    }

    // Set the select value after a longer delay to ensure options are loaded
    setTimeout(() => {
        // Ensure all options are visible first
        const options = select.querySelectorAll('option');
        options.forEach(option => {
            option.style.display = 'block';
        });

        // Set the value
        select.value = item.raw_material_id;
        console.log('Set select value to:', item.raw_material_id);

        // Re-apply tab filtering
        if (item.raw_material_type === 'bahan') {
            options.forEach(option => {
                if (option.value !== '' && option.dataset.type !== 'bahan') {
                    option.style.display = 'none';
                }
            });
        } else {
            options.forEach(option => {
                if (option.value !== '' && option.dataset.type !== 'kemasan') {
                    option.style.display = 'none';
                }
            });
        }
    }, 200);

    // Show cancel button
    cancelBtn.classList.remove('hidden');

    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeEditModal() {
    document.getElementById('editResepModal').classList.add('hidden');
}

// Reset resep form function
function resetResepForm() {
    document.getElementById('recipe_item_id').value = '';
    document.getElementById('quantity_used').value = '';
    document.getElementById('unit_measurement').value = recipeUnitOptions[0];
    document.getElementById('raw_material_id_bahan').value = '';
    document.getElementById('raw_material_id_kemasan').value = '';
    document.getElementById('raw_material_id').value = '';
    document.getElementById('form_action').value = 'add';

    document.getElementById('form-resep-title').textContent = 'Tambah Item ke Resep';
    const submitButton = document.getElementById('submit_resep_button');
    const cancelButton = document.getElementById('cancel_edit_resep_button');

    submitButton.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Tambah Item Resep
    `;
    submitButton.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
    submitButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
    cancelButton.classList.add('hidden');

    // Reset to bahan tab
    showCategoryTab('bahan');
}

// Reset bahan form function
function resetBahanForm() {
    document.getElementById('bahan_recipe_item_id').value = '';
    document.getElementById('bahan_quantity_used').value = '';
    document.getElementById('bahan_unit_measurement').value = recipeUnitOptions[0];
    document.getElementById('bahan_raw_material_id').value = '';

    document.getElementById('form-bahan-title').textContent = 'Tambah Bahan Baku ke Resep';
    const submitButton = document.getElementById('submit_bahan_button');
    const cancelButton = document.getElementById('cancel_edit_bahan_button');

    submitButton.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Tambah Bahan
    `;
    submitButton.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
    submitButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
    cancelButton.classList.add('hidden');
}

// Reset kemasan form function
function resetKemasanForm() {
    document.getElementById('kemasan_recipe_item_id').value = '';
    document.getElementById('kemasan_quantity_used').value = '';
    document.getElementById('kemasan_unit_measurement').value = recipeUnitOptions[0];
    document.getElementById('kemasan_raw_material_id').value = '';

    document.getElementById('form-kemasan-title').textContent = 'Tambah Kemasan ke Resep';
    const submitButton = document.getElementById('submit_kemasan_button');
    const cancelButton = document.getElementById('cancel_edit_kemasan_button');

    submitButton.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Tambah Kemasan
    `;
    submitButton.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
    submitButton.classList.add('bg-green-600', 'hover:bg-green-700');
    cancelButton.classList.add('hidden');
}

// Real-time search dengan debouncing dan scroll position preservation
let searchTimeoutRecipe;
let limitTimeoutRecipe;
let currentScrollPosition = 0;

function saveScrollPosition() {
    currentScrollPosition = window.pageYOffset;
}

function restoreScrollPosition() {
    window.scrollTo(0, currentScrollPosition);
}

function applySearchRealtimeRecipe(searchTerm, limit = null) {
    saveScrollPosition();

    let currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('search_recipe', searchTerm);
    currentUrl.searchParams.set('recipe_page', '1');
    if (limit !== null) {
        currentUrl.searchParams.set('recipe_limit', limit);
    }

    // Store scroll position in sessionStorage
    sessionStorage.setItem('resepScrollPosition', currentScrollPosition);

    window.location.href = currentUrl.toString();
}

// Form validation before submission
function validateRecipeForm() {
    const bahanSelect = document.getElementById('raw_material_id_bahan');
    const kemasamSelect = document.getElementById('raw_material_id_kemasan');

    // Check which tab is active
    const bahanTab = document.getElementById('content-bahan');
    const kemasamTab = document.getElementById('content-kemasan');

    if (!bahanTab.classList.contains('hidden')) {
        // Bahan tab is active
        if (!bahanSelect.value) {
            alert('Silakan pilih bahan baku');
            return false;
        }
        // Set the raw_material_id for submission
        document.getElementById('raw_material_id').value = bahanSelect.value;
    } else if (!kemasamTab.classList.contains('hidden')) {
        // Kemasan tab is active
        if (!kemasamSelect.value) {
            alert('Silakan pilih kemasan');
            return false;
        }
        // Set the raw_material_id for submission
        document.getElementById('raw_material_id').value = kemasamSelect.value;
    }

    const quantityUsed = document.getElementById('quantity_used').value;
    if (!quantityUsed || quantityUsed <= 0) {
        alert('Silakan masukkan jumlah yang valid');
        return false;
    }

    return true;
}

// Validate stock before submitting recipe form
function validateRecipeStock(formElement) {
    const formData = new FormData(formElement);
    const materialId = formData.get('raw_material_id');
    const quantityUsed = parseFloat(formData.get('quantity_used'));

    if (!materialId || !quantityUsed) {
        return true; // Let server handle validation
    }

    // This would ideally make an AJAX call to check stock
    // For now, we'll rely on server-side validation
    return true;
}

function updateRecipeResults() {
    const searchValue = document.getElementById('search_recipe').value;
    const limitValue = document.getElementById('recipe_limit').value;
    const sectionValue = document.getElementById('section_filter').value;
    const productId = new URLSearchParams(window.location.search).get('product_id');

    if (productId) {
        const url = new URL(window.location.href);
        url.searchParams.set('search_recipe', searchValue);
        url.searchParams.set('recipe_limit', limitValue);
        url.searchParams.set('section', sectionValue);
        url.searchParams.set('recipe_page', '1'); // Reset ke halaman 1 saat search/filter berubah

        window.location.href = url.toString();
    }
}

// Function untuk menampilkan tab breakdown yang berbeda
function showBreakdownTab(tabName) {
    // Hide semua content
    document.getElementById('content-bahan_baku').classList.add('hidden');
    document.getElementById('content-tenaga_kerja').classList.add('hidden');
    document.getElementById('content-overhead').classList.add('hidden');

    // Reset semua tab button
    document.getElementById('tab-bahan_baku').className = 'flex-1 px-4 py-4 text-sm font-medium text-gray-500 hover:text-gray-700';
    document.getElementById('tab-tenaga_kerja').className = 'flex-1 px-4 py-4 text-sm font-medium text-gray-500 hover:text-gray-700';
    document.getElementById('tab-overhead').className = 'flex-1 px-4 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-tr-lg';

    // Reset badges
    document.getElementById('badge-bahan_baku').className = 'bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full';
    document.getElementById('badge-tenaga_kerja').className = 'bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full';
    document.getElementById('badge-overhead').className = 'bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full';

    // Show content yang dipilih
    document.getElementById('content-' + tabName).classList.remove('hidden');

    // Set active tab
    if (tabName === 'bahan_baku') {
        document.getElementById('tab-bahan_baku').className = 'flex-1 px-4 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50 rounded-tl-lg';
        document.getElementById('badge-bahan_baku').className = 'bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full';
    } else if (tabName === 'tenaga_kerja') {
        document.getElementById('tab-tenaga_kerja').className = 'flex-1 px-4 py-4 text-sm font-medium text-orange-600 border-b-2 border-orange-600 bg-orange-50';
        document.getElementById('badge-tenaga_kerja').className = 'bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full';
    } else if (tabName === 'overhead') {
        document.getElementById('tab-overhead').className = 'flex-1 px-4 py-4 text-sm font-medium text-purple-600 border-b-2 border-purple-600 bg-purple-50 rounded-tr-lg';
        document.getElementById('badge-overhead').className = 'bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full';
    }
}

// Function untuk menampilkan tab kategori bahan/kemasan
function showCategoryTab(categoryName) {
    // Hide semua content
    document.getElementById('content-bahan').classList.add('hidden');
    document.getElementById('content-kemasan').classList.add('hidden');

    // Reset semua tab button
    document.getElementById('tab-bahan').className = 'px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700';
    document.getElementById('tab-kemasan').className = 'px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700';

    // Show content yang dipilih
    document.getElementById('content-' + categoryName).classList.remove('hidden');

    // Set active tab
    document.getElementById('tab-' + categoryName).className = 'px-6 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50';

    // Clear dan reset dropdown yang tidak aktif, enable yang aktif
    if (categoryName === 'bahan') {
        const kemasamSelect = document.getElementById('raw_material_id_kemasan');
        const bahanSelect = document.getElementById('raw_material_id_bahan');

        if (kemasamSelect) {
            kemasamSelect.value = '';
            kemasamSelect.disabled = true;
            kemasamSelect.removeAttribute('name');
        }
        if (bahanSelect) {
            bahanSelect.disabled = false;
            bahanSelect.setAttribute('name', 'raw_material_id');
            bahanSelect.required = true;
        }
    } else {
        const bahanSelect = document.getElementById('raw_material_id_bahan');
        const kemasamSelect = document.getElementById('raw_material_id_kemasan');

        if (bahanSelect) {
            bahanSelect.value = '';
            bahanSelect.disabled = true;
            bahanSelect.removeAttribute('name');
        }
        if (kemasamSelect) {
            kemasamSelect.disabled = false;
            kemasamSelect.setAttribute('name', 'raw_material_id');
            kemasamSelect.required = true;
        }
    }
}

// Functions to show/hide forms
function showBahanForm() {
    // Hide all forms first
    hideAllForms();

    // Show bahan form
    document.getElementById('bahan-form-section').style.display = 'block';

    // Reset bahan form to default state
    resetBahanForm();

    // Scroll to form
    document.getElementById('bahan-form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showKemasanForm() {
    // Hide all forms first
    hideAllForms();

    // Show kemasan form
    document.getElementById('kemasan-form-section').style.display = 'block';

    // Reset kemasan form to default state
    resetKemasanForm();

    // Scroll to form
    document.getElementById('kemasan-form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showOverheadForm() {
    // Hide all forms first
    hideAllForms();

    // Show overhead form
    document.getElementById('overhead-form-section').style.display = 'block';

    // Scroll to form
    document.getElementById('overhead-form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showTenagaKerjaForm() {
    // Hide all forms first
    hideAllForms();

    // Show tenaga kerja form
    document.getElementById('tenaga-kerja-form-section').style.display = 'block';

    // Scroll to form
    document.getElementById('tenaga-kerja-form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideAllForms() {
    // Hide all form sections
    const formSections = [
        'bahan-form-section',
        'kemasan-form-section',
        'overhead-form-section',
        'tenaga-kerja-form-section',
        'edit-resep-form-section'
    ];

    formSections.forEach(function(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.style.display = 'none';
        }
    });
}

// Switch tab untuk form resep (bahan/kemasan)
function switchRecipeTab(tabType) {
    const select = document.getElementById('recipe-select');
    const editId = document.getElementById('recipe-edit-id');
    const currentSelectValue = select ? select.value : '';
    const isEditMode = editId && editId.value !== '';
    const unitSelect = document.getElementById('recipe-unit');

    // Update form elements
    const actionInput = document.getElementById('recipe-action');
    const label = document.getElementById('recipe-label');
    const submitText = document.getElementById('recipe-submit-text');
    const formTitle = document.getElementById('recipe-form-title');
    const formDesc = document.getElementById('recipe-form-desc');
    const submitBtn = document.getElementById('recipe-submit-btn');

    if (tabType === 'bahan') {
        if (!isEditMode) {
            if (actionInput) actionInput.value = 'add_bahan';
            if (submitText) submitText.textContent = 'Tambah Bahan Baku';
            if (formTitle) formTitle.textContent = 'Bahan Baku & Kemasan';
            if (formDesc) formDesc.textContent = 'Tambahkan bahan baku yang digunakan dalam resep';
            if (submitBtn) {
                submitBtn.classList.remove('bg-green-600', 'hover:bg-green-700', 'bg-indigo-600', 'hover:bg-indigo-700');
                submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            }
        }
        if (label) label.textContent = 'Pilih Bahan Baku';

        // Show/hide options for bahan
        if (select) {
            Array.from(select.options).forEach(option => {
                if (option.value === '' || option.dataset.type === 'bahan') {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            });
            const emptyOption = select.querySelector('option[value=""]');
            if (emptyOption) emptyOption.textContent = '-- Pilih Bahan Baku --';
        }
    } else {
        if (!isEditMode) {
            if (actionInput) actionInput.value = 'add_kemasan';
            if (submitText) submitText.textContent = 'Tambah Kemasan';
            if (formTitle) formTitle.textContent = 'Bahan Baku & Kemasan';
            if (formDesc) formDesc.textContent = 'Tambahkan kemasan yang digunakan dalam resep';
            if (submitBtn) {
                submitBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'bg-indigo-600', 'hover:bg-indigo-700');
                submitBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            }
        }
        if (label) label.textContent = 'Pilih Kemasan';

        // Show/hide options for kemasan
        if (select) {
            Array.from(select.options).forEach(option => {
                if (option.value === '' || option.dataset.type === 'kemasan') {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            });
            const emptyOption = select.querySelector('option[value=""]');
            if (emptyOption) emptyOption.textContent = '-- Pilih Kemasan --';
        }
    }

    // Reset dropdown jika tidak dalam edit mode atau jika pilihan sebelumnya tidak sesuai dengan tab yang aktif
    if (select && !isEditMode) {
        select.value = '';
        // Reset unit select juga
        if (unitSelect) {
            unitSelect.disabled = true;
            unitSelect.value = recipeUnitOptions[0];
        }
    } else if (select && isEditMode && currentSelectValue) {
        // Dalam edit mode, pastikan pilihan masih valid untuk tab yang aktif
        const selectedOption = select.querySelector(`option[value="${currentSelectValue}"]`);
        if (selectedOption && selectedOption.dataset.type === tabType) {
            select.value = currentSelectValue;
            // Update unit untuk edit mode
            updateUnitFromSelection(select);
        } else {
            select.value = '';
            if (unitSelect) {
                unitSelect.disabled = true;
                unitSelect.value = recipeUnitOptions[0];
            }
        }
    }

    // Update tab appearance
    const tabBahan = document.getElementById('tab-bahan');
    const tabKemasan = document.getElementById('tab-kemasan');

    if (tabBahan) {
        tabBahan.classList.toggle('border-blue-600', tabType === 'bahan');
        tabBahan.classList.toggle('text-blue-600', tabType === 'bahan');
        tabBahan.classList.toggle('border-transparent', tabType !== 'bahan');
        tabBahan.classList.toggle('text-gray-500', tabType !== 'bahan');
    }

    if (tabKemasan) {
        tabKemasan.classList.toggle('border-blue-600', tabType === 'kemasan');
        tabKemasan.classList.toggle('text-blue-600', tabType === 'kemasan');
        tabKemasan.classList.toggle('border-transparent', tabType !== 'kemasan');
        tabKemasan.classList.toggle('text-gray-500', tabType !== 'kemasan');
    }

    // Only reset form if not in edit mode
    if (!isEditMode) {
        const form = document.getElementById('recipe-main-form');
        if (form) {
            // Reset hanya quantity, biarkan yang lain diatur oleh logic di atas
            const quantityInput = document.getElementById('recipe-quantity');
            if (quantityInput) quantityInput.value = '';
        }
        if (actionInput) actionInput.value = tabType === 'bahan' ? 'add_bahan' : 'add_kemasan';
        if (editId) editId.value = '';
        const cancelBtn = document.getElementById('recipe-cancel-btn');
        if (cancelBtn) cancelBtn.classList.add('hidden');
    }
}

// Switch tab untuk form manual (overhead/labor)
function switchManualTab(type) {
    const overheadTab = document.getElementById('manual-tab-overhead');
    const laborTab = document.getElementById('manual-tab-labor');
    const overheadContent = document.getElementById('manual-content-overhead');
    const laborContent = document.getElementById('manual-content-labor');
    const action = document.getElementById('manual-action');
    const submitText = document.getElementById('manual-submit-text');
    const submitBtn = document.getElementById('manual-submit-btn');

    // Reset tabs
    overheadTab.className = 'py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300';
    laborTab.className = 'py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300';

    // Hide all content
    overheadContent.classList.add('hidden');
    laborContent.classList.add('hidden');

    // Get select elements
    const overheadSelect = document.getElementById('manual-overhead-select');
    const laborSelect = document.getElementById('manual-labor-select');

    // Reset dropdown values ketika switch tab
    if (overheadSelect) overheadSelect.value = '';
    if (laborSelect) laborSelect.value = '';

    if (type === 'overhead') {
        overheadTab.className = 'py-2 px-1 border-b-2 font-medium text-sm border-purple-600 text-purple-600';
        overheadContent.classList.remove('hidden');
        action.value = 'add_manual_overhead';
        submitText.textContent = 'Tambah Overhead ke Resep';
        submitBtn.className = 'w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500';

        // Enable overhead select, disable labor select
        if (overheadSelect) {
            overheadSelect.required = true;
            overheadSelect.disabled = false;
            overheadSelect.name = 'overhead_id';
        }
        if (laborSelect) {
            laborSelect.required = false;
            laborSelect.disabled = true;
            laborSelect.removeAttribute('name');
            laborSelect.value = '';
        }
    } else if (type === 'labor') {
        laborTab.className = 'py-2 px-1 border-b-2 font-medium text-sm border-orange-600 text-orange-600';
        laborContent.classList.remove('hidden');
        action.value = 'add_manual_labor';
        submitText.textContent = 'Tambah Tenaga Kerja ke Resep';
        submitBtn.className = 'w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500';

        // Enable labor select, disable overhead select
        if (laborSelect) {
            laborSelect.required = true;
            laborSelect.disabled = false;
            laborSelect.name = 'labor_id';
        }
        if (overheadSelect) {
            overheadSelect.required = false;
            overheadSelect.disabled = true;
            overheadSelect.removeAttribute('name');
            overheadSelect.value = '';
        }
    }
    console.log('Switched to manual tab:', type, 'Action:', action.value);
}

// Delete manual overhead
function deleteManualOverhead(overheadManualId) {
    if (confirm('Apakah Anda yakin ingin menghapus overhead ini dari resep?')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '../process/simpan_resep_produk.php';

        const actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.name = 'action';
        actionInput.value = 'delete_manual_overhead';

        const productIdInput = document.createElement('input');
        productIdInput.type = 'hidden';
        productIdInput.name = 'product_id';
        productIdInput.value = window.selectedProductId || new URLSearchParams(window.location.search).get('product_id');

        const overheadIdInput = document.createElement('input');
        overheadIdInput.type = 'hidden';
        overheadIdInput.name = 'overhead_manual_id';
        overheadIdInput.value = overheadManualId;

        form.appendChild(actionInput);
        form.appendChild(productIdInput);
        form.appendChild(overheadIdInput);

        document.body.appendChild(form);
        form.submit();
    }
}

// Delete manual labor
function deleteManualLabor(laborManualId) {
    if (confirm('Apakah Anda yakin ingin menghapus tenaga kerja ini dari resep?')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '../process/simpan_resep_produk.php';

        const actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.name = 'action';
        actionInput.value = 'delete_manual_labor';

        const productIdInput = document.createElement('input');
        productIdInput.type = 'hidden';
        productIdInput.name = 'product_id';
        productIdInput.value = window.selectedProductId || new URLSearchParams(window.location.search).get('product_id');

        const laborIdInput = document.createElement('input');
        laborIdInput.type = 'hidden';
        laborIdInput.name = 'labor_manual_id';
        laborIdInput.value = laborManualId;

        form.appendChild(actionInput);
        form.appendChild(productIdInput);
        form.appendChild(laborIdInput);

        document.body.appendChild(form);
        form.submit();
    }
}

// Reset form
function resetRecipeForm() {
    const form = document.getElementById('recipe-main-form');
    const title = document.getElementById('recipe-form-title');
    const desc = document.getElementById('recipe-form-desc');
    const editId = document.getElementById('recipe-edit-id');
    const select = document.getElementById('recipe-select');
    const quantity = document.getElementById('recipe-quantity');
    const unit = document.getElementById('recipe-unit');
    const action = document.getElementById('recipe-action');
    const submitText = document.getElementById('recipe-submit-text');
    const submitBtn = document.getElementById('recipe-submit-btn');
    const cancelBtn = document.getElementById('recipe-cancel-btn');

    // Reset form
    if (form) form.reset();
    if (editId) editId.value = '';
    if (quantity) quantity.value = '';
    if (unit) unit.value = recipeUnitOptions[0];
    if (select) select.value = '';

    // Reset to bahan tab
    switchRecipeTab('bahan');

    // Reset title and button
    if (title) title.textContent = 'Bahan Baku & Kemasan';
    if (desc) desc.textContent = 'Tambahkan bahan baku yang digunakan dalam resep';
    if (submitText) submitText.textContent = 'Tambah Bahan Baku';
    if (submitBtn) {
        submitBtn.className = 'flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500';
    }

    // Hide cancel button
    if (cancelBtn) cancelBtn.classList.add('hidden');
}

// Function to handle recipe deletion
function deleteRecipe(recipeId, materialName) {
    if (confirm(`Apakah Anda yakin ingin menghapus ${materialName} dari resep?`)) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/cornerbites-sia/process/simpan_resep_produk.php';

        const actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.name = 'action';
        actionInput.value = 'delete_recipe';

        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.name = 'recipe_id';
        idInput.value = recipeId;

        form.appendChild(actionInput);
        form.appendChild(idInput);
        document.body.appendChild(form);
        form.submit();
    }
}

function deleteRecipeItem(recipeId) {
    if (confirm('Apakah Anda yakin ingin menghapus item ini dari resep?')) {
        const productId = new URLSearchParams(window.location.search).get('product_id');

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '../process/simpan_resep_produk.php';

        const actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.name = 'action';
        actionInput.value = 'delete_recipe';

        const productIdInput = document.createElement('input');
        productIdInput.type = 'hidden';
        productIdInput.name = 'product_id';
        productIdInput.value = productId;

        const recipeIdInput = document.createElement('input');
        recipeIdInput.type = 'hidden';
        recipeIdInput.name = 'recipe_id';
        recipeIdInput.value = recipeId;

        form.appendChild(actionInput);
        form.appendChild(productIdInput);
        form.appendChild(recipeIdInput);

        document.body.appendChild(form);
        form.submit();
    }
}

// Function untuk switch tab bahan baku & kemasan
function switchTab(tabName, buttonElement) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });

    // Remove active state from all buttons
    const tabButtons = buttonElement.parentElement.querySelectorAll('button');
    tabButtons.forEach(button => {
        button.classList.remove('text-blue-600', 'border-b-2', 'border-blue-500', 'bg-white');
        button.classList.add('text-gray-500', 'hover:text-blue-600', 'bg-blue-50');
    });

    // Show selected tab content
    const selectedContent = document.getElementById(tabName + '-content');
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }

    // Add active state to clicked button
    buttonElement.classList.remove('text-gray-500', 'hover:text-blue-600', 'bg-blue-50');
    buttonElement.classList.add('text-blue-600', 'border-b-2', 'border-blue-500', 'bg-white');
}

// Function untuk switch tab overhead & tenaga kerja
function switchOverheadTab(tabName, buttonElement) {
    // Hide all overhead tab contents
    const tabContents = document.querySelectorAll('.overhead-tab-content');
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });

    // Remove active state from all buttons
    const tabButtons = buttonElement.parentElement.querySelectorAll('button');
    tabButtons.forEach(button => {
        button.classList.remove('text-purple-600', 'border-b-2', 'border-purple-500', 'bg-white');
        button.classList.add('text-gray-500', 'hover:text-purple-600', 'bg-purple-50');
    });

    // Show selected tab content
    const selectedContent = document.getElementById(tabName + '-content');
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }

    // Add active state to clicked button
    buttonElement.classList.remove('text-gray-500', 'hover:text-purple-600', 'bg-purple-50');
    buttonElement.classList.add('text-purple-600', 'border-b-2', 'border-purple-500', 'bg-white');
}

function setSalePrice(price, margin, element) {
    // Check if this card is already selected
    const isCurrentlySelected = element && element.classList.contains('ring-green-500');
    
    // Remove highlight from all recommendation cards
    const cards = document.querySelectorAll('.price-recommendation-card');
    cards.forEach(card => {
        card.classList.remove('ring-2', 'ring-green-500', 'bg-green-50', 'border-green-400', 'shadow-lg');
        card.classList.add('bg-white', 'border-gray-200');
    });

    if (isCurrentlySelected) {
        // If clicking the same card again, reset to original values
        const originalSalePrice = document.getElementById('sale_price').getAttribute('data-original-value') || '';
        document.getElementById('sale_price_display').value = originalSalePrice ? parseInt(originalSalePrice).toLocaleString('id-ID') : '';
        document.getElementById('sale_price').value = originalSalePrice;
        
        // Show feedback message
        showTemporaryMessage('Pilihan margin dibatalkan', 'info');
    } else {
        // Store original value if not already stored
        if (!document.getElementById('sale_price').hasAttribute('data-original-value')) {
            document.getElementById('sale_price').setAttribute('data-original-value', document.getElementById('sale_price').value);
        }
        
        // Set new price
        document.getElementById('sale_price_display').value = Math.round(price).toLocaleString('id-ID');
        document.getElementById('sale_price').value = Math.round(price);

        // Add highlight to clicked card
        if (element) {
            element.classList.remove('bg-white', 'border-gray-200');
            element.classList.add('ring-2', 'ring-green-500', 'bg-green-50', 'border-green-400', 'shadow-lg');
        }
        
        // Show feedback message
        showTemporaryMessage(`Harga jual diset ke Rp ${Math.round(price).toLocaleString('id-ID')} (margin ${margin}%)`, 'success');
    }
}

// Fungsi konfirmasi update produk
function confirmUpdateProduct() {
    // Get form data untuk validasi
    const productionYield = document.getElementById('production_yield').value;
    const productionTime = document.getElementById('production_time_hours').value;
    const salePrice = document.getElementById('sale_price').value;

    if (!productionYield || !productionTime || !salePrice) {
        alert('Mohon lengkapi semua field sebelum menyimpan.');
        return;
    }

    // Format sale price untuk display
    const formattedPrice = parseInt(salePrice).toLocaleString('id-ID');

    // Show confirmation modal
    const confirmHTML = `
        <div id="confirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                <div class="p-6">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900">Konfirmasi Update Info Produk</h3>
                    </div>
                    
                    <div class="mb-6">
                        <p class="text-gray-700 mb-4">Apakah Anda yakin ingin menyimpan perubahan berikut?</p>
                        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600">Hasil Produksi:</span>
                                <span class="text-sm font-medium">${productionYield} unit</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600">Waktu Produksi:</span>
                                <span class="text-sm font-medium">${productionTime} jam</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-600">Harga Jual:</span>
                                <span class="text-sm font-medium">Rp ${formattedPrice}</span>
                            </div>
                        </div>
                        <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p class="text-sm text-blue-700">
                                <strong>Catatan:</strong> Perubahan ini akan mempengaruhi kalkulasi HPP dan data yang terlihat di halaman <strong>Manajemen Produk</strong>.
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex space-x-3">
                        <button type="button" onclick="closeConfirmModal()" class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200">
                            Batal
                        </button>
                        <button type="button" onclick="submitUpdateProduct()" class="flex-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition duration-200">
                            Ya, Simpan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', confirmHTML);
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.remove();
    }
}

function submitUpdateProduct() {
    closeConfirmModal();
    document.getElementById('update-product-form').submit();
}

// Function to show temporary feedback messages
function showTemporaryMessage(message, type = 'info') {
    // Remove existing temporary message if any
    const existingMessage = document.getElementById('temporary-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.id = 'temporary-message';
    messageDiv.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out translate-x-0`;
    
    // Set color based on type
    if (type === 'success') {
        messageDiv.classList.add('bg-green-100', 'border', 'border-green-400', 'text-green-700');
    } else if (type === 'info') {
        messageDiv.classList.add('bg-blue-100', 'border', 'border-blue-400', 'text-blue-700');
    } else if (type === 'warning') {
        messageDiv.classList.add('bg-yellow-100', 'border', 'border-yellow-400', 'text-yellow-700');
    }

    messageDiv.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${type === 'success' ? 
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' :
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
                }
            </svg>
            <span class="text-sm font-medium">${message}</span>
        </div>
    `;

    document.body.appendChild(messageDiv);

    // Auto remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Format input currency
    const currencyInputs = document.querySelectorAll('input[data-currency]');
    currencyInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/[^\d]/g, '');
            if (value) {
                this.value = 'Rp ' + new Intl.NumberFormat('id-ID').format(value);
            }
        });
    });

    // Update unit select based on raw material selection
    const rawMaterialSelects = document.querySelectorAll('select[name="raw_material_id"]');
    rawMaterialSelects.forEach(select => {
        select.addEventListener('change', function() {
            updateUnitFromSelection(this);
        });
    });

    // Add event listener untuk recipe select
    const recipeSelect = document.getElementById('recipe-select');
    if (recipeSelect) {
        recipeSelect.addEventListener('change', function() {
            updateUnitFromSelection(this);
        });
    }

    // Restore scroll position after page load
    const savedScrollPosition = sessionStorage.getItem('resepScrollPosition');
    if (savedScrollPosition) {
        setTimeout(() => {
            window.scrollTo(0, parseInt(savedScrollPosition));
            sessionStorage.removeItem('resepScrollPosition');
        }, 100);
    }

    // Real-time search untuk resep
    const searchInputRecipe = document.getElementById('search_recipe');
    const limitSelectRecipe = document.getElementById('recipe_limit');
    const sectionFilterRecipe = document.getElementById('section_filter');

    if (searchInputRecipe && limitSelectRecipe && sectionFilterRecipe) {
        searchInputRecipe.addEventListener('input', function() {
            clearTimeout(searchTimeoutRecipe);
            searchTimeoutRecipe = setTimeout(function() {
                currentScrollPosition = window.pageYOffset;
                sessionStorage.setItem('resepScrollPosition', currentScrollPosition);
                updateRecipeResults();
            }, 300);
        });

        limitSelectRecipe.addEventListener('change', function() {
            clearTimeout(limitTimeoutRecipe);
            limitTimeoutRecipe = setTimeout(function() {
                currentScrollPosition = window.pageYOffset;
                sessionStorage.setItem('resepScrollPosition', currentScrollPosition);
                updateRecipeResults();
            }, 100);
        });

        sectionFilterRecipe.addEventListener('change', function() {
            clearTimeout(limitTimeoutRecipe);
            limitTimeoutRecipe = setTimeout(function() {
                currentScrollPosition = window.pageYOffset;
                sessionStorage.setItem('resepScrollPosition', currentScrollPosition);
                updateRecipeResults();
            }, 100);
        });
    }

    // Add form validation to recipe form
    const recipeForm = document.querySelector('form[action="../process/simpan_resep_produk.php"]');
    if (recipeForm && !recipeForm.querySelector('input[name="action"]')) {
        recipeForm.addEventListener('submit', function(e) {
            if (!validateRecipeForm()) {
                e.preventDefault();
                return false;
            }
        });
    }

    // Initialize with bahan tab active
    if (document.getElementById('tab-bahan')) {
        showCategoryTab('bahan');
    }

    // Initialize form dengan tab bahan
    switchRecipeTab('bahan');

    // Initialize manual tab dengan overhead
    switchManualTab('overhead');

    // Format existing sale price display
    const salePriceValue = document.getElementById('sale_price');
    const salePriceDisplay = document.getElementById('sale_price_display');
    
    if (salePriceValue && salePriceDisplay) {
        // Store original value for reset functionality
        if (salePriceValue.value && !salePriceValue.hasAttribute('data-original-value')) {
            salePriceValue.setAttribute('data-original-value', salePriceValue.value);
        }
        
        if (salePriceValue.value) {
            salePriceDisplay.value = parseInt(salePriceValue.value).toLocaleString('id-ID');
        }
        
        // Add event listener untuk format input real-time
        salePriceDisplay.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d]/g, '');
            if (value) {
                e.target.value = parseInt(value).toLocaleString('id-ID');
                salePriceValue.value = value;
                // Update original value when user manually inputs
                salePriceValue.setAttribute('data-original-value', value);
            } else {
                e.target.value = '';
                salePriceValue.value = '';
                salePriceValue.removeAttribute('data-original-value');
            }
        });
    }

	// Function to update unit select based on raw material selection
	function updateUnitFromSelection(selectElement) {
		const selectedOption = selectElement.options[selectElement.selectedIndex];
		const unit = selectedOption.getAttribute('data-unit');
		const unitSelect = selectElement.closest('form').querySelector('select[name="unit_measurement"]');

		if (unit && unitSelect) {
			// Set the unit to match the raw material's unit dan disable
			for (let option of unitSelect.options) {
				if (option.value === unit) {
					option.selected = true;
					break;
				}
			}
			// Disable unit select supaya user tidak bisa mengubah
			unitSelect.disabled = false;
			unitSelect.style.backgroundColor = '#f3f4f6';
			unitSelect.style.cursor = 'not-allowed';
		} else if (unitSelect) {
			// Jika tidak ada unit yang dipilih, enable kembali
			unitSelect.disabled = true;
			unitSelect.style.backgroundColor = '';
			unitSelect.style.cursor = '';
		}
	}

    console.log('Resep Produk page loaded');
});

// Function global untuk update unit dari selection (dipanggil dari PHP)
function updateUnitFromSelection(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const unit = selectedOption.getAttribute('data-unit');
    const unitSelect = selectElement.closest('form').querySelector('select[name="unit_measurement"]');

    if (unit && unitSelect && selectedOption.value !== '') {
        // Set the unit to match the raw material's unit dan disable
        for (let option of unitSelect.options) {
            if (option.value === unit) {
                option.selected = true;
                break;
            }
        }
        // Disable unit select supaya user tidak bisa mengubah
        unitSelect.disabled = false;
        unitSelect.style.backgroundColor = '#f3f4f6';
        unitSelect.style.cursor = 'not-allowed';
        unitSelect.title = 'Satuan otomatis sesuai dengan bahan baku yang dipilih';
        
        // Add readonly attribute
        unitSelect.setAttribute('readonly', 'readonly');
    } else if (unitSelect) {
        // Jika tidak ada unit yang dipilih, reset
        unitSelect.disabled = true;
        unitSelect.style.backgroundColor = '';
        unitSelect.style.cursor = '';
        unitSelect.title = '';
        unitSelect.removeAttribute('readonly');
        unitSelect.value = recipeUnitOptions[0];
    }
}

// This JavaScript file was updated to modify the tab navigation in the breakdown section, ensuring a more consistent and visually appealing layout.