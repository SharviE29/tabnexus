// Group tabs button
const groupBtn = document.getElementById('groupBtn') as HTMLButtonElement | null;
const ungroupBtn = document.getElementById('ungroupBtn') as HTMLButtonElement | null;
const statusElement = document.getElementById('status') as HTMLDivElement | null;

if (!groupBtn || !ungroupBtn || !statusElement) {
  throw new Error('Required DOM elements not found');
}

groupBtn.addEventListener('click', async () => {
  statusElement.textContent = 'Grouping tabs...';
  
  try {
    // Send message to background script
    const response = await chrome.runtime.sendMessage({ action: 'groupTabs' }) as { success: boolean; error?: string } | undefined;
    if (response && response.success) {
      statusElement.textContent = 'Tabs grouped successfully!';
      setTimeout(() => {
        statusElement.textContent = '';
      }, 2000);
    } else {
      statusElement.textContent = 'Error: ' + (response?.error || 'Unknown error');
    }
  } catch (error) {
    statusElement.textContent = 'Error: ' + (error instanceof Error ? error.message : 'Unknown error');
  }
});

// Ungroup button
ungroupBtn.addEventListener('click', async () => {
  statusElement.textContent = 'Ungrouping tabs...';
  
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id !== undefined && tab.groupId !== -1 && tab.groupId !== undefined) {
        await chrome.tabs.ungroup(tab.id);
      }
    }
    statusElement.textContent = 'All tabs ungrouped!';
    setTimeout(() => {
      statusElement.textContent = '';
    }, 2000);
  } catch (error) {
    statusElement.textContent = 'Error: ' + (error instanceof Error ? error.message : 'Unknown error');
  }
});
