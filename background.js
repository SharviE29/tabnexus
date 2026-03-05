// Tab categorization rules
const CATEGORIES = {
  docs: {
    name: 'Docs',
    patterns: [
      'docs.google.com',
      'notion.so',
      'overleaf.com',
      'confluence.atlassian.net',
      'etherpad.net'
    ],
    color: 'blue'
  },
  social: {
    name: 'Social Media',
    patterns: [
      'twitter.com',
      'x.com',
      'facebook.com',
      'instagram.com',
      'linkedin.com',
      'reddit.com',
      'discord.com',
      'slack.com'
    ],
    color: 'red'
  },
  shopping: {
    name: 'Shopping',
    patterns: [
      'amazon.com',
      'ebay.com',
      'etsy.com',
      'shopify.com'
    ],
    color: 'green'
  },
  video: {
    name: 'Video',
    patterns: [
      'youtube.com',
      'netflix.com',
      'hulu.com',
      'vimeo.com',
      'twitch.tv'
    ],
    color: 'purple'
  },
  code: {
    name: 'Code',
    patterns: [
      'github.com',
      'gitlab.com',
      'stackoverflow.com',
      'stackexchange.com',
      'dev.to',
      'codepen.io',
      'repl.it'
    ],
    color: 'orange'
  },
  email: {
    name: 'Email',
    patterns: [
      'mail.google.com',
      'outlook.com',
      'mail.yahoo.com',
      'protonmail.com'
    ],
    color: 'yellow'
  },
  search: {
    name: 'Search',
    patterns: [
      'google.com',
      'bing.com',
      'duckduckgo.com',
      'yahoo.com/search',
      'startpage.com'
    ],
    color: 'cyan'
  }
};

// Categorize a URL
function categorizeUrl(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    for (const [categoryKey, category] of Object.entries(CATEGORIES)) {
      for (const pattern of category.patterns) {
        if (hostname.includes(pattern)) {
          return {
            key: categoryKey,
            name: category.name,
            color: category.color
          };
        }
      }
    }
    
    return null; // No category found
  } catch (e) {
    return null;
  }
}

// Group tabs by category
async function groupTabs() {
  try {
    console.log('Starting tab grouping...');
    
    // Get all tabs
    const tabs = await chrome.tabs.query({});
    console.log(`Found ${tabs.length} tabs`);
    
    // Categorize tabs
    const categorizedTabs = {};
    
    for (const tab of tabs) {
      // Skip chrome:// and extension pages
      if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        continue;
      }
      
      const category = categorizeUrl(tab.url);
      if (category) {
        console.log(`Tab ${tab.id} (${tab.url}) → ${category.name}`);
        if (!categorizedTabs[category.key]) {
          categorizedTabs[category.key] = {
            category: category,
            tabIds: []
          };
        }
        categorizedTabs[category.key].tabIds.push(tab.id);
      } else {
        console.log(`Tab ${tab.id} (${tab.url}) → No category`);
      }
    }
    
    console.log(`Categorized into ${Object.keys(categorizedTabs).length} categories`);
    
    // Get existing groups
    const existingGroups = await chrome.tabGroups.query({});
    const groupsByTitle = {};
    for (const group of existingGroups) {
      groupsByTitle[group.title] = group.id;
    }
    
    // Create groups for each category
    for (const [categoryKey, data] of Object.entries(categorizedTabs)) {
      // Chrome requires at least 2 tabs to create a group
      if (data.tabIds.length > 1) {
        // Filter out tabs that are already in the correct group
        const tabsToGroup = [];
        for (const tabId of data.tabIds) {
          const tab = await chrome.tabs.get(tabId);
          const existingGroupId = tab.groupId;
          
          if (existingGroupId === -1) {
            // Tab is not in any group
            tabsToGroup.push(tabId);
          } else {
            // Tab is in a group, check if it's the right one
            const existingGroup = await chrome.tabGroups.get(existingGroupId);
            if (existingGroup.title !== data.category.name) {
              // Tab is in wrong group, ungroup it first
              await chrome.tabs.ungroup(tabId);
              tabsToGroup.push(tabId);
            }
            // If tab is already in the correct group, skip it
          }
        }
        
        if (tabsToGroup.length > 0) {
          let groupId = groupsByTitle[data.category.name];
          
          if (groupId) {
            // Add tabs to existing group
            console.log(`Adding ${tabsToGroup.length} tabs to existing group: ${data.category.name}`);
            await chrome.tabs.group({
              groupId: groupId,
              tabIds: tabsToGroup
            });
          } else {
            // Create new group
            console.log(`Creating new group: ${data.category.name} with ${tabsToGroup.length} tabs`);
            const newGroupId = await chrome.tabs.group({
              tabIds: tabsToGroup
            });
            await chrome.tabGroups.update(newGroupId, {
              title: data.category.name,
              color: data.category.color
            });
            groupsByTitle[data.category.name] = newGroupId;
          }
        }
      }
    }
    
    console.log('Tabs grouped successfully');
  } catch (error) {
    console.error('Error grouping tabs:', error);
    console.error('Stack:', error.stack);
  }
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Small delay to ensure tab is fully loaded
    setTimeout(() => {
      groupTabs();
    }, 500);
  }
});

// Listen for new tabs
chrome.tabs.onCreated.addListener(async (tab) => {
  setTimeout(() => {
    groupTabs();
  }, 500);
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener(async () => {
  setTimeout(() => {
    groupTabs();
  }, 300);
});

// Group tabs on extension install/startup
chrome.runtime.onInstalled.addListener(() => {
  setTimeout(() => {
    groupTabs();
  }, 1000);
});

// Also group on startup
groupTabs();

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'groupTabs') {
    groupTabs().then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep the message channel open for async response
  }
});
