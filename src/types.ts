// Type definitions for the extension

export type TabGroupColor = 'blue' | 'red' | 'yellow' | 'green' | 'pink' | 'purple' | 'grey' | 'cyan' | 'orange';

export interface Category {
  name: string;
  patterns: string[];
  color: TabGroupColor;
}

export interface CategoryInfo {
  key: string;
  name: string;
  color: TabGroupColor;
}

export interface CategorizedTabs {
  [categoryKey: string]: {
    category: CategoryInfo;
    tabIds: number[];
  };
}

export interface GroupTabsMessage {
  action: 'groupTabs';
}

export interface GroupTabsResponse {
  success: boolean;
  error?: string;
}
