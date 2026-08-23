/**
 * Admin Panel JavaScript Enhancement
 * Provides interactive functionality for the veterinary clinic admin panel
 */

document.addEventListener('DOMContentLoaded', function () {
    initializeAdminPanel();
});

function initializeAdminPanel() {
    // Initialize all admin functionality
    setupDeleteConfirmations();
    setupFormEnhancements();
    setupTableInteractions();
    setupDashboardFeatures();
    setupNotifications();
    setupMobileMenu();
    setupSidebarScrollPersistence();
}

/**
 * Persist sidebar scroll position across page reloads
 */
function setupSidebarScrollPersistence() {
    const sidebar = document.querySelector('.admin-sidebar');
    if (!sidebar) return;

    // Restore scroll position
    const scrollPos = sessionStorage.getItem('sidebar-scroll');
    if (scrollPos) {
        sidebar.scrollTop = parseInt(scrollPos, 10);
    }

    // Save scroll position on scroll (debounced)
    sidebar.addEventListener('scroll', debounce(function () {
        sessionStorage.setItem('sidebar-scroll', sidebar.scrollTop);
    }, 100));

    // Also save on link click to be sure
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function () {
            sessionStorage.setItem('sidebar-scroll', sidebar.scrollTop);
        });
    });
}

/**
 * Setup delete confirmation dialogs
 */
function setupDeleteConfirmations() {
    const deleteButtons = document.querySelectorAll('button[data-action="delete"], .action-btn-delete, button[onclick*="confirm"]');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const itemType = this.dataset.itemType || 'item';
            const itemName = this.dataset.itemName || '';

            const message = itemName ?
                `Are you sure you want to delete "${itemName}"?` :
                `Are you sure you want to delete this ${itemType}?`;

            if (!confirm(message + '\n\nThis action cannot be undone.')) {
                e.preventDefault();
                return false;
            }
        });
    });
}

/**
 * Enhanced form functionality
 */
function setupFormEnhancements() {
    // Auto-save draft functionality
    setupAutoSave();

    // Form validation enhancements
    setupFormValidation();

    // Dynamic field management
    setupDynamicFields();
}

function setupAutoSave() {
    const forms = document.querySelectorAll('.admin-form');

    forms.forEach(form => {
        const formId = form.id || 'admin-form';
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('input', debounce(function () {
                saveFormDraft(formId, form);
            }, 2000));
        });

        // Restore saved draft on page load
        restoreFormDraft(formId, form);
    });
}

function saveFormDraft(formId, form) {
    const formData = new FormData(form);
    const draftData = {};

    for (let [key, value] of formData.entries()) {
        draftData[key] = value;
    }

    try {
        localStorage.setItem(`draft_${formId}`, JSON.stringify(draftData));
        showNotification('Draft saved automatically', 'info', 2000);
    } catch (e) {
        console.warn('Could not save draft:', e);
    }
}

function restoreFormDraft(formId, form) {
    try {
        const draftData = JSON.parse(localStorage.getItem(`draft_${formId}`));
        if (!draftData) return;

        Object.keys(draftData).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field && field.value === '') {
                field.value = draftData[key];
            }
        });
    } catch (e) {
        console.warn('Could not restore draft:', e);
    }
}

function setupFormValidation() {
    const forms = document.querySelectorAll('.admin-form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showNotification('Please fix the errors in the form', 'error');
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    // Remove existing error styles
    field.classList.remove('field-error');
    const existingError = field.parentNode.querySelector('.field-error-message');
    if (existingError) {
        existingError.remove();
    }

    if (field.required && !value) {
        isValid = false;
        message = 'This field is required';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
    } else if (field.type === 'url' && value && !isValidUrl(value)) {
        isValid = false;
        message = 'Please enter a valid URL';
    }

    if (!isValid) {
        field.classList.add('field-error');
        const errorElement = document.createElement('small');
        errorElement.className = 'field-error-message';
        errorElement.style.color = '#dc2626';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'block';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    return isValid;
}

function setupDynamicFields() {
    // Service category management
    const categorySelects = document.querySelectorAll('select[name="category"]');
    categorySelects.forEach(select => {
        // Add "Other" option if not present
        if (!Array.from(select.options).some(option => option.value === 'other')) {
            const otherOption = document.createElement('option');
            otherOption.value = 'other';
            otherOption.textContent = 'Other (specify below)';
            select.appendChild(otherOption);
        }

        select.addEventListener('change', function () {
            toggleCustomCategoryField(this);
        });

        // Initialize on page load
        toggleCustomCategoryField(select);
    });
}

function toggleCustomCategoryField(select) {
    const customField = document.getElementById('custom-category') || createCustomCategoryField(select);

    if (select.value === 'other') {
        customField.style.display = 'block';
        customField.querySelector('input').required = true;
    } else {
        customField.style.display = 'none';
        customField.querySelector('input').required = false;
    }
}

function createCustomCategoryField(select) {
    const container = document.createElement('div');
    container.id = 'custom-category';
    container.className = 'form-group';
    container.innerHTML = `
        <label for="custom_category_name">Custom Category Name</label>
        <input type="text" id="custom_category_name" name="custom_category" placeholder="Enter category name">
        <small class="form-help">This will be added as a new service category</small>
    `;

    select.closest('.form-group').insertAdjacentElement('afterend', container);
    return container;
}

/**
 * Table interaction enhancements
 */
function setupTableInteractions() {
    // Sortable tables
    setupTableSorting();

    // Row selection
    setupRowSelection();

    // Quick actions
    setupQuickActions();
}

function setupTableSorting() {
    const tables = document.querySelectorAll('.admin-table');

    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            if (!header.classList.contains('no-sort')) {
                header.style.cursor = 'pointer';
                header.addEventListener('click', function () {
                    sortTable(table, index);
                });
            }
        });
    });
}

function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const header = table.querySelectorAll('th')[columnIndex];

    // Determine sort direction
    const isAsc = !header.classList.contains('sort-desc');

    // Clear all sort indicators
    table.querySelectorAll('th').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });

    // Add sort indicator
    header.classList.add(isAsc ? 'sort-asc' : 'sort-desc');

    // Sort rows
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();

        // Try to parse as numbers
        const aNum = parseFloat(aText);
        const bNum = parseFloat(bText);

        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAsc ? aNum - bNum : bNum - aNum;
        } else {
            return isAsc ? aText.localeCompare(bText) : bText.localeCompare(aText);
        }
    });

    // Reorder DOM elements
    rows.forEach(row => tbody.appendChild(row));
}

function setupRowSelection() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="selected_items[]"]');
    const selectAllBtn = document.getElementById('select-all');
    const clearAllBtn = document.getElementById('clear-all');

    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', function () {
            checkboxes.forEach(cb => cb.checked = true);
            updateSelectionCount();
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function () {
            checkboxes.forEach(cb => cb.checked = false);
            updateSelectionCount();
        });
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectionCount);
    });
}

function updateSelectionCount() {
    const checked = document.querySelectorAll('input[type="checkbox"][name^="selected"]:checked').length;
    const countElement = document.getElementById('selection-count');
    if (countElement) {
        countElement.textContent = checked;
    }
}

function setupQuickActions() {
    // Status update buttons
    const statusButtons = document.querySelectorAll('[data-action="update-status"]');
    statusButtons.forEach(button => {
        button.addEventListener('click', function () {
            const itemId = this.dataset.itemId;
            const newStatus = this.dataset.newStatus;
            const itemType = this.dataset.itemType;

            updateItemStatus(itemType, itemId, newStatus);
        });
    });
}

function updateItemStatus(itemType, itemId, newStatus) {
    // Show loading state
    const button = document.querySelector(`[data-item-id="${itemId}"][data-new-status="${newStatus}"]`);
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="spinner"></span> Updating...';
    button.disabled = true;

    // Create form and submit
    const form = document.createElement('form');
    form.method = 'POST';
    form.innerHTML = `
        <input type="hidden" name="action" value="update_status">
        <input type="hidden" name="${itemType}_id" value="${itemId}">
        <input type="hidden" name="status" value="${newStatus}">
    `;

    document.body.appendChild(form);
    form.submit();
}

/**
 * Dashboard specific features
 */
function setupDashboardFeatures() {
    // Auto-refresh statistics
    if (document.querySelector('.stats-grid')) {
        setupStatsAutoRefresh();
    }

    // Interactive charts (if needed)
    setupDashboardCharts();
}

function setupStatsAutoRefresh() {
    // Refresh stats every 5 minutes
    setInterval(function () {
        refreshDashboardStats();
    }, 5 * 60 * 1000);
}

function refreshDashboardStats() {
    // Only refresh if user is active and on dashboard
    if (document.hidden || !document.querySelector('.stats-grid')) {
        return;
    }

    fetch(window.location.href)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newStats = doc.querySelector('.stats-grid');

            if (newStats) {
                document.querySelector('.stats-grid').innerHTML = newStats.innerHTML;
                showNotification('Dashboard updated', 'info', 2000);
            }
        })
        .catch(error => {
            console.warn('Could not refresh dashboard:', error);
        });
}

function setupDashboardCharts() {
    // Placeholder for future chart implementation
    const chartContainers = document.querySelectorAll('.chart-container');
    // Implementation would go here when charts are added
}

/**
 * Notification system
 */
function setupNotifications() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');

    const colors = {
        success: '#dcfce7',
        error: '#fee2e2',
        warning: '#fef3c7',
        info: '#dbeafe'
    };

    const textColors = {
        success: '#166534',
        error: '#dc2626',
        warning: '#92400e',
        info: '#1e40af'
    };

    notification.style.cssText = `
        background: ${colors[type] || colors.info};
        color: ${textColors[type] || textColors.info};
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        border: 1px solid rgba(0, 0, 0, 0.1);
    `;

    notification.textContent = message;
    container.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Auto-remove
    if (duration > 0) {
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // Click to dismiss
    notification.addEventListener('click', function () {
        this.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }, 300);
    });
}

/**
 * Mobile menu functionality
 */
function setupMobileMenu() {
    const sidebar = document.querySelector('.admin-sidebar');

    // Create mobile menu toggle if it doesn't exist
    if (!document.getElementById('mobile-menu-toggle')) {
        const toggle = document.createElement('button');
        toggle.id = 'mobile-menu-toggle';
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
        toggle.style.cssText = `
            display: none;
            position: fixed;
            top: 15px;
            left: 15px;
            z-index: 1001;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
        `;

        document.body.appendChild(toggle);

        toggle.addEventListener('click', function () {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !e.target.closest('#mobile-menu-toggle')) {
            sidebar.classList.remove('open');
        }
    });
}

/**
 * Utility functions
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Add CSS for new elements
function injectAdminStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .field-error {
            border-color: #dc2626 !important;
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
        }
        
        .field-error-message {
            font-size: 0.85rem !important;
            color: #dc2626 !important;
            margin-top: 0.25rem !important;
            display: block !important;
        }
        
        .admin-table th.sort-asc::after {
            content: ' ↑';
            opacity: 0.7;
        }
        
        .admin-table th.sort-desc::after {
            content: ' ↓';
            opacity: 0.7;
        }
        
        @media (max-width: 768px) {
            #mobile-menu-toggle {
                display: block !important;
            }
        }
        
        .spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid var(--primary-color);
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 0.5rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize styles
injectAdminStyles();

// Export functions for external use
window.AdminPanel = {
    showNotification,
    updateSelectionCount,
    validateForm,
    saveFormDraft,
    restoreFormDraft
};