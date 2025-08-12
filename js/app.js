// Constants
const API_BASE_URL = "https://api.pollsplane.com";

// DOM Elements
const apiKeyInput = document.getElementById('apiKey');
const pollIdInput = document.getElementById('pollId');
const pollSelector = document.getElementById('pollSelector');
const pollNoteInput = document.getElementById('pollNote');
const youtubeIdInput = document.getElementById('youtubeId');
const floatplaneIdInput = document.getElementById('floatplaneId');
const untrackedCheckbox = document.getElementById('untrackedCheckbox');
const apiResponseDiv = document.getElementById('apiResponse');
const loadingSpinner = document.getElementById('loadingSpinner');
const messageBox = document.getElementById('messageBox');
const copyResponseBtn = document.getElementById('copyResponseBtn');
const darkModeToggle = document.getElementById('darkModeToggle');

// New Poll Elements
const newPollTitleInput = document.getElementById('newPollTitle');
const newPollCreatorIdInput = document.getElementById('newPollCreatorId');
const newPollStartDateInput = document.getElementById('newPollStartDate');
const newPollEndDateInput = document.getElementById('newPollEndDate');
const newPollOptionsInput = document.getElementById('newPollOptions');

// API Key Management Elements
const deleteApiKeyInput = document.getElementById('deleteApiKeyInput');
const updateApiKeyInput = document.getElementById('updateApiKeyInput');
const newApiKeyPermissionManagementInput = document.getElementById('newApiKeyPermissionManagement');
const newApiKeyPermissionSeeUnlistedInput = document.getElementById('newApiKeyPermissionSeeUnlisted');
const newApiKeyRateLimitCountInput = document.getElementById('newApiKeyRateLimitCount');
const newApiKeyRateLimitPeriodInput = document.getElementById('newApiKeyRateLimitPeriod');
const updateApiKeyPermissionManagementInput = document.getElementById('updateApiKeyPermissionManagement');
const updateApiKeyPermissionSeeUnlistedInput = document.getElementById('updateApiKeyPermissionSeeUnlisted');
const updateApiKeyRateLimitCountInput = document.getElementById('updateApiKeyRateLimitCount');
const updateApiKeyRateLimitPeriodInput = document.getElementById('updateApiKeyRateLimitPeriod');

// Creator Management Elements
const creatorSelector = document.getElementById('creatorSelector');
const creatorIdInput = document.getElementById('creatorId');
const creatorUnlistedCheckbox = document.getElementById('creatorUnlistedCheckbox');
const creatorRemovedCheckbox = document.getElementById('creatorRemovedCheckbox');
const creatorChannelsList = document.getElementById('creatorChannelsList');
const newChannelTitleInput = document.getElementById('newChannelTitle');
const newChannelDescriptionInput = document.getElementById('newChannelDescription');
const newChannelThumbnailInput = document.getElementById('newChannelThumbnail');
const updateChannelOldTitleInput = document.getElementById('updateChannelOldTitle');
const updateChannelNewTitleInput = document.getElementById('updateChannelNewTitle');
const updateChannelDescriptionInput = document.getElementById('updateChannelDescription');
const updateChannelThumbnailInput = document.getElementById('updateChannelThumbnail');
const removeChannelTitleInput = document.getElementById('removeChannelTitle');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    setupEventListeners();
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
        darkModeToggle.checked = true;
        setDarkMode(true);
    }
    
    // Load any saved API key
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }
});

// Set up all event listeners
function setupEventListeners() {
    // Dark mode toggle
    darkModeToggle.addEventListener('change', () => {
        setDarkMode(darkModeToggle.checked);
    });
    
    // Copy response button
    copyResponseBtn.addEventListener('click', () => {
        copyToClipboard(apiResponseDiv.textContent);
    });
    
    // Save API key when changed
    apiKeyInput.addEventListener('change', () => {
        localStorage.setItem('apiKey', apiKeyInput.value);
    });
    
    // Toggle API key visibility
    const toggleApiKeyBtn = document.getElementById('toggleApiKeyVisibility');
    if (toggleApiKeyBtn) {
        toggleApiKeyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const type = apiKeyInput.type === 'password' ? 'text' : 'password';
            apiKeyInput.type = type;
            // Toggle icon between eye and eye-off
            const icon = toggleApiKeyBtn.querySelector('svg');
            if (type === 'text') {
                // Change to eye-off icon
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />';
            } else {
                // Change back to eye icon
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />';
            }
        });
    }
    
    // Poll management
    document.getElementById('loadPollsBtn').addEventListener('click', fetchAndPopulatePolls);
    document.getElementById('fetchPollDetailsBtn').addEventListener('click', fetchPollDetails);
    document.getElementById('updateNoteBtn').addEventListener('click', updatePollNote);
    document.getElementById('updateAssociationsBtn').addEventListener('click', updatePollAssociations);
    document.getElementById('updateUntrackedBtn').addEventListener('click', updateUntrackedStatus);
    document.getElementById('createPollBtn').addEventListener('click', createNewPoll);
    document.getElementById('deletePollBtn').addEventListener('click', deletePoll);
    
    // API Key management
    document.getElementById('listApiKeysBtn').addEventListener('click', listApiKeys);
    document.getElementById('createApiKeyBtn').addEventListener('click', createApiKey);
    document.getElementById('deleteApiKeyBtn').addEventListener('click', deleteApiKey);
    document.getElementById('updateApiKeyBtn').addEventListener('click', updateApiKey);
    
    // Creator management
    document.getElementById('loadCreatorsBtn').addEventListener('click', fetchAndPopulateCreators);
    document.getElementById('fetchCreatorDetailsBtn').addEventListener('click', fetchCreatorDetails);
    document.getElementById('updateCreatorStatusBtn').addEventListener('click', updateCreatorStatus);
    document.getElementById('addChannelBtn').addEventListener('click', addCreatorChannel);
    document.getElementById('updateChannelBtn').addEventListener('click', updateCreatorChannel);
    document.getElementById('removeChannelBtn').addEventListener('click', removeCreatorChannel);
    
    // Update poll ID when selector changes
    pollSelector.addEventListener('change', (e) => {
        if (e.target.value) {
            pollIdInput.value = e.target.value;
        }
    });
    
    // Update creator ID when selector changes
    creatorSelector.addEventListener('change', (e) => {
        if (e.target.value) {
            creatorIdInput.value = e.target.value;
        }
    });
}

// Dark Mode Functions
function setDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
}

// Utility Functions
function showMessage(message, type = 'info') {
    messageBox.textContent = message;
    messageBox.className = 'message-box show';
    if (type === 'error') {
        messageBox.style.backgroundColor = '#dc2626';
    } else if (type === 'success') {
        messageBox.style.backgroundColor = '#047857';
    } else {
        messageBox.style.backgroundColor = '#333';
    }
    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 3000);
}

function copyToClipboard(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand('copy');
        showMessage('Copied to clipboard!', 'success');
    } catch (err) {
        showMessage('Failed to copy text.', 'error');
        console.error('Failed to copy text: ', err);
    } finally {
        document.body.removeChild(tempInput);
    }
}

// API Request Handler
async function makeApiRequest(url, method, body = null) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const apiResponseDiv = document.getElementById('apiResponse');
    
    // Store the current width before making any changes
    const responseWrapper = document.querySelector('.response-wrapper');
    const initialWidth = responseWrapper ? window.getComputedStyle(responseWrapper).width : null;
    
    if (loadingSpinner) loadingSpinner.classList.add('active');
    if (apiResponseDiv) {
        // Preserve the width while updating content
        if (initialWidth) {
            responseWrapper.style.minWidth = initialWidth;
            responseWrapper.style.width = initialWidth;
        }
        
        apiResponseDiv.textContent = 'Loading...';
        apiResponseDiv.className = 'response-area loading';
    }
    
    const apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
        // If no API key is found, show the login screen
        document.getElementById('apiKeyScreen')?.classList.remove('hidden');
        document.getElementById('mainContent')?.classList.add('hidden');
        showMessage('Please log in with a valid API key', 'error');
        if (loadingSpinner) loadingSpinner.classList.remove('active');
        return null;
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
    };
    
    const options = { 
        method, 
        headers, 
        mode: 'cors' 
    };
    
    if (body) { 
        options.body = JSON.stringify(body); 
    }
    
    try {
        const response = await fetch(`${url}`, options);
        
        // Handle 403 Forbidden (invalid/expired API key)
        if (response.status === 403) {
            // Clear the invalid API key
            localStorage.removeItem('apiKey');
            // Show login screen
            document.getElementById('apiKeyScreen')?.classList.remove('hidden');
            document.getElementById('mainContent')?.classList.add('hidden');
            showMessage('Your session has expired. Please log in again.', 'error');
            if (loadingSpinner) loadingSpinner.classList.remove('active');
            return null;
        }
        
        let data;
        try {
            data = await response.json();
        } catch (e) {
            throw new Error('Invalid JSON response from server');
        }
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP Error: ${response.status}`);
        }
        
        // Update response area if it exists
        if (apiResponseDiv && responseWrapper) {
            apiResponseDiv.textContent = JSON.stringify(data, null, 2);
            apiResponseDiv.className = 'response-area success';
            // Restore auto width after content is loaded
            responseWrapper.style.minWidth = '';
            responseWrapper.style.width = '';
            showMessage('Request successful!', 'success');
        }
        
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        
        // Update response area if it exists
        if (apiResponseDiv && responseWrapper) {
            apiResponseDiv.textContent = `Error: ${error.message}`;
            apiResponseDiv.className = 'response-area error';
            // Restore auto width after error
            responseWrapper.style.minWidth = '';
            responseWrapper.style.width = '';
            showMessage(`Error: ${error.message}`, 'error');
        }
        
        return null;
    } finally {
        if (loadingSpinner) loadingSpinner.classList.remove('active');
    }
}

// Initialize Select2 for dropdowns
function initializeSelect2() {
    // Initialize poll selector
    if ($('#pollSelector').length) {
        $('#pollSelector').select2({
            theme: 'bootstrap-5',
            minimumResultsForSearch: 0,
            dropdownAutoWidth: false,
            placeholder: 'Select a Poll',
            allowClear: true,
            containerCssClass: 'select2-container--bootstrap-5',
            selectionCssClass: 'select2-selection--single form-select',
            dropdownCssClass: 'select2-dropdown--below',
            dropdownParent: $('#pollSelector').closest('.modal').length ? $('#pollSelector').closest('.modal') : document.body
        }).on('change', function() {
            const selectedId = $(this).val();
            pollIdInput.value = selectedId || '';
            if (selectedId) {
                fetchPollDetails();
            } else {
                showPollDetails(false);
            }
        });
    }

    // Initialize creator selector
    if ($('#creatorSelector').length) {
        $('#creatorSelector').select2({
            theme: 'bootstrap-5',
            width: '100%',
            minimumResultsForSearch: 0,
            dropdownAutoWidth: true,
            placeholder: 'Select a Creator',
            allowClear: true,
            containerCssClass: 'select2-container--bootstrap-5',
            selectionCssClass: 'select2-selection--single form-select',
            dropdownCssClass: 'select2-dropdown--below',
            dropdownParent: $('#creatorSelector').closest('.modal').length ? $('#creatorSelector').closest('.modal') : document.body
        }).on('change', function() {
            const selectedId = $(this).val();
            creatorIdInput.value = selectedId || '';
            if (selectedId) {
                fetchCreatorDetails();
            }
        });
    }
}


// Format dropdown options
function formatOption(option) {
    if (!option.id) return option.text;
    // Create a new option element with the same text
    const $option = $('<span>');
    $option.text(option.text || option.element.text);
    return $option;
}

// Format selected option
function formatSelection(option) {
    if (!option.id) return option.text;
    // For selected option, just return the text directly
    return option.text || option.element.text;
}

// Update Select2 when theme changes
function updateSelect2Theme() {
    $('select:not(.no-select2)').each(function() {
        const $select = $(this);
        if ($.fn.select2) {
            $select.select2('destroy');
        }
    });
    
    // Reinitialize after a small delay to allow theme classes to update
    setTimeout(initializeSelect2, 10);
}

// Initialize Select2 when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSelect2();
    
    // Update Select2 when theme changes
    darkModeToggle.addEventListener('change', () => {
        // Wait for theme transition to complete
        setTimeout(updateSelect2Theme, 300);
    });
});

async function fetchAndPopulatePolls() {
    const url = `${API_BASE_URL}/api/polls?per_page=100`;
    const data = await makeApiRequest(url, 'GET');
    if (data && data.status === 'success') {
        // Clear existing options
        $('#pollSelector').empty().append('<option value="">-- Select a Poll --</option>');
        
        // Add new options
        data.data.forEach(poll => {
            const option = new Option(
                `${poll.title} (${poll.poll_id})`,
                poll.poll_id,
                false,
                false
            );
            $('#pollSelector').append(option);
        });

        // Refresh Select2 to update the dropdown
        $('#pollSelector').trigger('change');
        showMessage('Polls loaded successfully!', 'success');
    }
}

async function fetchPollDetails() {
    const pollId = pollIdInput.value.trim();
    if (!pollId) {
        showMessage('Poll ID is required to fetch details.', 'error');
        showPollDetails(false);
        return;
    }
    const url = `${API_BASE_URL}/api/poll/${pollId}`;
    const data = await makeApiRequest(url, 'GET');
    if (data && data.status === 'success') {
        const poll = data.data;
        pollNoteInput.value = poll.pollplane_note || '';
        youtubeIdInput.value = poll.associated_posts?.youtube || '';
        floatplaneIdInput.value = poll.associated_posts?.floatplane || '';
        untrackedCheckbox.checked = poll.untracked || false;
        showPollDetails(true);
    }
}

async function showPollDetails(show) {
    const pollDetailsSection = document.getElementById('pollDetailsSection');
    if (show) {
        pollDetailsSection.classList.remove('hidden');
    } else {
        pollDetailsSection.classList.add('hidden');
    }
}

async function updatePollNote() {
    const pollId = pollIdInput.value.trim();
    if (!pollId) {
        showMessage('Poll ID is required to update note.', 'error');
        showPollDetails(false);
        return;
    }
    const note = pollNoteInput.value;
    const url = `${API_BASE_URL}/api/admin/polls/${pollId}/notes`;
    await makeApiRequest(url, 'PUT', { pollplane_note: note });
}

async function updatePollAssociations() {
    const pollId = pollIdInput.value.trim();
    if (!pollId) {
        showMessage('Poll ID is required to update associations.', 'error');
        showPollDetails(false);
        return;
    }
    const youtubeId = youtubeIdInput.value.trim() || null;
    const floatplaneId = floatplaneIdInput.value.trim() || null;
    const url = `${API_BASE_URL}/api/admin/polls/${pollId}/associations`;
    await makeApiRequest(url, 'PUT', { youtube_id: youtubeId, floatplane_id: floatplaneId });
}

async function updateUntrackedStatus() {
    const pollId = pollIdInput.value.trim();
    if (!pollId) {
        showMessage('Poll ID is required to update untracked status.', 'error');
        showPollDetails(false);
        return;
    }
    const untrackedStatus = untrackedCheckbox.checked;
    const url = `${API_BASE_URL}/api/admin/polls/${pollId}/untracked`;
    await makeApiRequest(url, 'PUT', { untracked: untrackedStatus });
}

async function createNewPoll() {
    const title = newPollTitleInput.value.trim();
    const creatorId = newPollCreatorIdInput.value.trim();
    const startDate = newPollStartDateInput.value.trim();
    const endDate = newPollEndDateInput.value.trim() || null;
    const optionsText = newPollOptionsInput.value.trim();
    const options = optionsText ? optionsText.split(',').map(opt => opt.trim()) : [];

    if (!title || !creatorId || !startDate || options.length === 0) {
        showMessage('Title, Creator ID, Start Date, and Options are required to create a poll.', 'error');
        return;
    }

    const url = `${API_BASE_URL}/api/admin/polls`;
    const body = {
        title: title,
        creator_id: creatorId,
        start_date: startDate,
        end_date: endDate,
        options: options
    };
    await makeApiRequest(url, 'POST', body);
    await fetchAndPopulatePolls(); // Refresh poll list after creation
}

async function deletePoll() {
    const pollId = pollIdInput.value.trim();
    if (!pollId) {
        showMessage('Poll ID is required to delete a poll.', 'error');
        return;
    }
    if (!confirm(`Are you sure you want to delete poll ${pollId}? This action cannot be undone.`)) {
        return;
    }
    const url = `${API_BASE_URL}/api/admin/polls/${pollId}`;
    await makeApiRequest(url, 'DELETE');
    pollIdInput.value = ''; // Clear ID after deletion
    pollSelector.value = ''; // Clear selector
    await fetchAndPopulatePolls(); // Refresh poll list after deletion
}

// API Key Management Functions
async function listApiKeys() {
    const url = `${API_BASE_URL}/api/admin/api-keys`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': localStorage.getItem('apiKey') || ''
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch API keys');
    }
    
    const data = await response.json();
    return data.data || [];
}

// Login Functions
async function validateApiKey(apiKey) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/api-keys`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            }
        });

        if (response.status === 403) {
            throw new Error('Invalid API key or insufficient permissions');
        }

        if (!response.ok) {
            throw new Error('Failed to validate API key');
        }

        const data = await response.json();
        
        // Find the matching API key in the response
        const matchingKey = data.data?.find(key => key.api_key === apiKey);
        if (!matchingKey) {
            throw new Error('API key not found');
        }

        // Save API key and permissions to localStorage
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('apiKeyPermissions', JSON.stringify(matchingKey.permissions));
        
        return true;
    } catch (error) {
        console.error('API key validation failed:', error);
        throw error;
    }
}

async function handleLogin() {
    const apiKeyInput = document.getElementById('apiKey');
    const loginError = document.getElementById('loginError');
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        showMessage('Please enter an API key', 'error');
        return;
    }

    try {
        const isValid = await validateApiKey(apiKey);
        if (isValid) {
            // Only save the API key to localStorage after successful validation
            localStorage.setItem('apiKey', apiKey);
            
            // Hide login screen and show main content
            document.getElementById('apiKeyScreen').classList.add('hidden');
            document.getElementById('mainContent').classList.remove('hidden');
            
            // Initialize the dashboard with the validated API key
            initializeDashboard();
        }
    } catch (error) {
        // Clear any invalid API key from localStorage
        localStorage.removeItem('apiKey');
        showMessage('Your API key is invalid or doesn\'t have elevated permissions. Please try again.', 'error');
    }
}

function initializeDashboard() {
    // Load any saved API key from localStorage
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
        // If we have a saved key, hide the login screen
        document.getElementById('apiKeyScreen').classList.add('hidden');
        document.getElementById('mainContent').classList.remove('hidden');
        
        // Initialize any dashboard components that need the API key
        fetchAndPopulatePolls().catch(console.error);
    }
}

// Handle sign out
function handleSignOut() {
    // Clear the stored API key and permissions
    localStorage.removeItem('apiKey');
    localStorage.removeItem('apiKeyPermissions');
    
    // Show the login screen and hide main content
    document.getElementById('apiKeyScreen').classList.remove('hidden');
    document.getElementById('mainContent').classList.add('hidden');
    
    // Clear the API key input
    document.getElementById('apiKey').value = '';
    
    // Show success message
    showMessage('You have been signed out successfully.', 'success');
}

// Sync theme toggle state
function syncThemeToggle() {
    const darkMode = document.body.classList.contains('dark-mode');
    const toggles = document.querySelectorAll('#darkModeToggle');
    toggles.forEach(toggle => {
        toggle.checked = darkMode;
    });
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    // Sign out button
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', handleSignOut);
    }
    
    // Theme toggle
    const themeToggles = document.querySelectorAll('#darkModeToggle');
    themeToggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            setDarkMode(e.target.checked);
            syncThemeToggle();
        });
    });
    
    // Sync theme toggle state on load
    syncThemeToggle();
    
    // Check if we have a saved API key on page load
    initializeDashboard();
});

async function createApiKey() {
    const permissions = {
        management: newApiKeyPermissionManagementInput.checked,
        see_unlisted: newApiKeyPermissionSeeUnlistedInput.checked
    };
    const rateLimit = {
        count: parseInt(newApiKeyRateLimitCountInput.value),
        period: parseInt(newApiKeyRateLimitPeriodInput.value)
    };

    // Validate numeric inputs
    if (isNaN(rateLimit.count) || rateLimit.count < 1 || isNaN(rateLimit.period) || rateLimit.period < 1) {
        showMessage('Rate Limit Count and Period must be positive numbers.', 'error');
        return;
    }

    const url = `${API_BASE_URL}/api/admin/api-keys`;
    await makeApiRequest(url, 'POST', { permissions: permissions, rate_limit: rateLimit });
}

async function deleteApiKey() {
    const apiKeyToDelete = deleteApiKeyInput.value.trim();
    if (!apiKeyToDelete) {
        showMessage('API Key to delete is required.', 'error');
        return;
    }
    if (!confirm(`Are you sure you want to delete API Key ${apiKeyToDelete}? This action cannot be undone.`)) {
        return;
    }
    const url = `${API_BASE_URL}/api/admin/api-keys/${apiKeyToDelete}`;
    await makeApiRequest(url, 'DELETE');
    deleteApiKeyInput.value = ''; // Clear input
}

async function updateApiKey() {
    const apiKeyToUpdate = updateApiKeyInput.value.trim();
    if (!apiKeyToUpdate) {
        showMessage('API Key to update is required.', 'error');
        return;
    }
    const permissions = {
        management: updateApiKeyPermissionManagementInput.checked,
        see_unlisted: updateApiKeyPermissionSeeUnlistedInput.checked
    };
    const rateLimit = {
        count: parseInt(updateApiKeyRateLimitCountInput.value),
        period: parseInt(updateApiKeyRateLimitPeriodInput.value)
    };

    // Validate numeric inputs
    if (isNaN(rateLimit.count) || rateLimit.count < 1 || isNaN(rateLimit.period) || rateLimit.period < 1) {
        showMessage('New Rate Limit Count and Period must be positive numbers.', 'error');
        return;
    }

    const url = `${API_BASE_URL}/api/admin/api-keys/${apiKeyToUpdate}`;
    await makeApiRequest(url, 'PUT', { permissions: permissions, rate_limit: rateLimit });
}

// Creator Management Functions
async function fetchAndPopulateCreators() {
    const url = `${API_BASE_URL}/api/creators`;
    const data = await makeApiRequest(url, 'GET');
    if (data && data.status === 'success') {
        creatorSelector.innerHTML = '<option value="">-- Select a Creator --</option>';
        data.data.forEach(creator => {
            const option = document.createElement('option');
            option.value = creator.id;
            option.textContent = `${creator.name} (${creator.id})`;
            creatorSelector.appendChild(option);
        });
        showMessage('Creators loaded successfully!', 'success');
    }
}

async function fetchCreatorDetails() {
    const creatorId = creatorIdInput.value.trim();
    if (!creatorId) {
        showMessage('Creator ID is required to fetch details.', 'error');
        return;
    }
    const url = `${API_BASE_URL}/api/admin/creators/${creatorId}`;
    const data = await makeApiRequest(url, 'GET');
    if (data && data.status === 'success') {
        const creator = data.data;
        creatorUnlistedCheckbox.checked = creator.unlisted || false;
        creatorRemovedCheckbox.checked = creator.removed || false;
        
        // Update channels list
        updateChannelsList(creator.channels || []);
    }
}

function updateChannelsList(channels) {
    creatorChannelsList.innerHTML = '';
    
    if (channels.length === 0) {
        creatorChannelsList.innerHTML = '<p class="text-sm text-gray-500">No channels found.</p>';
        return;
    }
    
    const ul = document.createElement('ul');
    ul.className = 'space-y-2';
    
    channels.forEach(channel => {
        const li = document.createElement('li');
        li.className = 'p-2 bg-gray-100 dark:bg-gray-700 rounded';
        li.textContent = `${channel.title}${channel.description ? ` - ${channel.description}` : ''}`;
        ul.appendChild(li);
    });
    
    creatorChannelsList.appendChild(ul);
}

async function updateCreatorStatus() {
    const creatorId = creatorIdInput.value.trim();
    if (!creatorId) {
        showMessage('Creator ID is required to update status.', 'error');
        return;
    }
    
    const url = `${API_BASE_URL}/api/admin/creators/${creatorId}/status`;
    const body = {
        unlisted: creatorUnlistedCheckbox.checked,
        removed: creatorRemovedCheckbox.checked
    };
    
    await makeApiRequest(url, 'PUT', body);
}

async function addCreatorChannel() {
    const creatorId = creatorIdInput.value.trim();
    const title = newChannelTitleInput.value.trim();
    const description = newChannelDescriptionInput.value.trim();
    const thumbnail = newChannelThumbnailInput.value.trim();
    
    if (!creatorId || !title) {
        showMessage('Creator ID and Channel Title are required.', 'error');
        return;
    }
    
    const url = `${API_BASE_URL}/api/admin/creators/${creatorId}/channels`;
    const body = { title };
    
    if (description) body.description = description;
    if (thumbnail) body.thumbnail_url = thumbnail;
    
    await makeApiRequest(url, 'POST', body);
    
    // Refresh creator details to show the new channel
    await fetchCreatorDetails();
    
    // Clear the form
    newChannelTitleInput.value = '';
    newChannelDescriptionInput.value = '';
    newChannelThumbnailInput.value = '';
}

async function updateCreatorChannel() {
    const creatorId = creatorIdInput.value.trim();
    const oldTitle = updateChannelOldTitleInput.value.trim();
    const newTitle = updateChannelNewTitleInput.value.trim();
    const description = updateChannelDescriptionInput.value.trim();
    const thumbnail = updateChannelThumbnailInput.value.trim();
    
    if (!creatorId || !oldTitle || !newTitle) {
        showMessage('Creator ID, Old Title, and New Title are required.', 'error');
        return;
    }
    
    const url = `${API_BASE_URL}/api/admin/creators/${creatorId}/channels/${encodeURIComponent(oldTitle)}`;
    const body = { new_title: newTitle };
    
    if (description) body.description = description;
    if (thumbnail) body.thumbnail_url = thumbnail;
    
    await makeApiRequest(url, 'PUT', body);
    
    // Refresh creator details to show the updated channel
    await fetchCreatorDetails();
    
    // Clear the form
    updateChannelOldTitleInput.value = '';
    updateChannelNewTitleInput.value = '';
    updateChannelDescriptionInput.value = '';
    updateChannelThumbnailInput.value = '';
}

async function removeCreatorChannel() {
    const creatorId = creatorIdInput.value.trim();
    const title = removeChannelTitleInput.value.trim();
    
    if (!creatorId || !title) {
        showMessage('Creator ID and Channel Title are required.', 'error');
        return;
    }
    
    if (!confirm(`Are you sure you want to remove the channel "${title}"?`)) {
        return;
    }
    
    const url = `${API_BASE_URL}/api/admin/creators/${creatorId}/channels/${encodeURIComponent(title)}`;
    await makeApiRequest(url, 'DELETE');
    
    // Refresh creator details to show the updated channels
    await fetchCreatorDetails();
    
    // Clear the form
    removeChannelTitleInput.value = '';
}
