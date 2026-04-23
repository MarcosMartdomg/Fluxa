export interface Shortcut {
  keys: string[];
  description: string;
}

export interface ShortcutSection {
  title: string;
  context: string;
  shortcuts: Shortcut[];
}

export const SHORTCUTS_DATA: ShortcutSection[] = [
  {
    title: 'Global Commands',
    context: 'Available everywhere in the app',
    shortcuts: [
      { keys: ['Ctrl', 'K'], description: 'Global search' },
      { keys: ['Esc'], description: 'Close modals and panels' },
    ],
  },
  {
    title: 'Workflow Builder',
    context: 'Only inside the canvas',
    shortcuts: [
      { keys: ['Delete'], description: 'Delete selected nodes' },
      { keys: ['Backspace'], description: 'Delete selected nodes' },
    ],
  },
  {
    title: 'Search Navigation',
    context: 'Only when search is active',
    shortcuts: [
      { keys: ['↑', '↓'], description: 'Navigate results' },
      { keys: ['Enter'], description: 'Select and open' },
    ],
  },
];
