// Group tabs button
document.getElementById('groupBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  status.textContent = 'Grouping tabs...';
  
  try {
    // Send message to background script
    await chrome.runtime.sendMessage({ action: 'groupTabs' });
    status.textContent = 'Tabs grouped successfully!';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  } catch (error) {
    status.textContent = 'Error: ' + error.message;
  }
});

// Ungroup button
document.getElementById('ungroupBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  status.textContent = 'Ungrouping tabs...';
  
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.groupId !== -1) {
        await chrome.tabs.ungroup(tab.id);
      }
    }
    status.textContent = 'All tabs ungrouped!';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  } catch (error) {
    status.textContent = 'Error: ' + error.message;
  }
});
