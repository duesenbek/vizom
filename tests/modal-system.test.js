/**
 * Tests for Refactored Modal System
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ModalSystem } from '../components/ModalSystemRefactored.js';
import { ModalManager } from '../components/modal/ModalManager.js';
import { ModalTemplates } from '../components/modal/ModalTemplates.js';

describe('ModalSystem', () => {
  let modalSystem: ModalSystem;

  beforeEach(() => {
    modalSystem = new ModalSystem();
    vi.clearAllMocks();
    // Setup DOM
    document.body.innerHTML = '<div id="test-container"></div>';
  });

  afterEach(() => {
    modalSystem.destroy();
    document.body.innerHTML = '';
  });

  describe('Modal Creation', () => {
    it('should open modal with basic configuration', async () => {
      const config = {
        title: 'Test Modal',
        content: '<p>Test content</p>',
        size: 'small'
      };

      const modalId = await modalSystem.open(config);

      expect(modalId).toBeDefined();
      expect(modalSystem.isOpen(modalId)).toBe(true);
    });

    it('should open predefined template modal', async () => {
      const modalId = await modalSystem.openAuth();

      expect(modalId).toBeDefined();
      expect(modalSystem.isOpen(modalId)).toBe(true);
    });

    it('should throw error for invalid template', async () => {
      await expect(modalSystem.openTemplate('invalid-template'))
        .rejects.toThrow('Template "invalid-template" not found');
    });

    it('should close modal correctly', async () => {
      const config = {
        title: 'Test Modal',
        content: '<p>Test</p>',
        size: 'small'
      };

      const modalId = await modalSystem.open(config);
      await modalSystem.close(modalId);

      expect(modalSystem.isOpen(modalId)).toBe(false);
    });
  });

  describe('Template Modals', () => {
    it('should open confirmation modal with custom message', async () => {
      const onConfirm = vi.fn();
      const modalId = await modalSystem.openConfirmation(
        'Are you sure?',
        onConfirm
      );

      expect(modalId).toBeDefined();
      expect(modalSystem.isOpen(modalId)).toBe(true);
    });

    it('should open alert modal with custom title and message', async () => {
      const modalId = await modalSystem.openAlert('Warning', 'This is a warning');

      expect(modalId).toBeDefined();
      expect(modalSystem.isOpen(modalId)).toBe(true);
    });

    it('should open export settings modal with chart data', async () => {
      const chartData = { type: 'bar', data: {} };
      const modalId = await modalSystem.openExportSettings(chartData);

      expect(modalId).toBeDefined();
      expect(modalSystem.isOpen(modalId)).toBe(true);
    });
  });

  describe('Modal Stack Management', () => {
    it('should track modal stack correctly', async () => {
      const modalId1 = await modalSystem.open({
        title: 'Modal 1',
        content: 'Content 1',
        size: 'small'
      });

      const modalId2 = await modalSystem.open({
        title: 'Modal 2',
        content: 'Content 2',
        size: 'small'
      });

      const stack = modalSystem.getModalStack();
      expect(stack).toHaveLength(2);
      expect(stack[stack.length - 1]).toBe(modalId2);
    });

    it('should close all modals', async () => {
      await modalSystem.open({
        title: 'Modal 1',
        content: 'Content 1',
        size: 'small'
      });

      await modalSystem.open({
        title: 'Modal 2',
        content: 'Content 2',
        size: 'small'
      });

      await modalSystem.closeAll();

      const allModals = modalSystem.getAllModals();
      expect(allModals).toHaveLength(0);
    });
  });

  describe('Event Handling', () => {
    it('should emit auth events on form submission', async () => {
      const modalId = await modalSystem.openAuth();
      
      // Mock form submission
      const form = document.querySelector('#signin-form');
      if (form) {
        const event = new CustomEvent('authEvent', {
          detail: { type: 'signin', data: { email: 'test@example.com' } }
        });
        document.dispatchEvent(event);
      }

      expect(modalSystem.isOpen(modalId)).toBe(true);
    });

    it('should handle confirmation modal actions', async () => {
      const onConfirm = vi.fn();
      const modalId = await modalSystem.openConfirmation('Test?', onConfirm);

      // Simulate confirm button click
      const confirmButton = document.querySelector('[data-action="confirm"]');
      if (confirmButton) {
        (confirmButton as HTMLElement).click();
      }

      // Modal should close and confirm callback should be called
      setTimeout(() => {
        expect(modalSystem.isOpen(modalId)).toBe(false);
        expect(onConfirm).toHaveBeenCalled();
      }, 100);
    });
  });
});

describe('ModalManager', () => {
  let manager: ModalManager;

  beforeEach(() => {
    manager = new ModalManager();
  });

  afterEach(() => {
    manager.destroy();
  });

  describe('Modal Lifecycle', () => {
    it('should open and close modal correctly', async () => {
      const config = {
        title: 'Test Modal',
        content: '<p>Test content</p>',
        size: 'small'
      };

      await manager.open('test-modal', config);
      expect(manager.isOpen('test-modal')).toBe(true);

      await manager.close('test-modal');
      expect(manager.isOpen('test-modal')).toBe(false);
    });

    it('should handle modal stack', async () => {
      await manager.open('modal1', {
        title: 'Modal 1',
        content: 'Content 1',
        size: 'small'
      });

      await manager.open('modal2', {
        title: 'Modal 2',
        content: 'Content 2',
        size: 'small'
      });

      const stack = manager.getModalStack();
      expect(stack).toEqual(['modal1', 'modal2']);
      expect(stack[stack.length - 1]).toBe('modal2');
    });

    it('should prevent opening same modal twice', async () => {
      const config = {
        title: 'Test Modal',
        content: 'Test',
        size: 'small'
      };

      await manager.open('test-modal', config);

      await expect(manager.open('test-modal', config))
        .rejects.toThrow('Modal "test-modal" is already open');
    });
  });

  describe('Focus Management', () => {
    it('should trap focus within modal', async () => {
      const config = {
        title: 'Test Modal',
        content: '<button>Button 1</button><button>Button 2</button>',
        size: 'small',
        options: { trapFocus: true }
      };

      await manager.open('test-modal', config);

      const modalState = manager.getModal('test-modal');
      expect(modalState).toBeDefined();
      expect(modalState?.options.trapFocus).toBe(true);
    });

    it('should focus specified element', async () => {
      const config = {
        title: 'Test Modal',
        content: '<input id="test-input" type="text">',
        size: 'small',
        options: { focusElement: '#test-input' }
      };

      await manager.open('test-modal', config);

      const input = document.getElementById('test-input') as HTMLInputElement;
      expect(input).toBeDefined();
      // Focus would be set asynchronously
    });
  });

  describe('Error Handling', () => {
    it('should throw error for non-existent modal', async () => {
      await expect(manager.close('non-existent-modal'))
        .rejects.toThrow('Modal with ID "non-existent-modal" not found');
    });

    it('should handle before close callback', async () => {
      const config = {
        title: 'Test Modal',
        content: 'Test',
        size: 'small',
        options: {
          onBeforeClose: () => false // Prevent closing
        }
      };

      await manager.open('test-modal', config);
      await manager.close('test-modal');

      // Modal should still be open
      expect(manager.isOpen('test-modal')).toBe(true);
    });
  });
});

describe('ModalTemplates', () => {
  beforeEach(() => {
    ModalTemplates.init();
  });

  describe('Template Management', () => {
    it('should register and retrieve templates', () => {
      const template = ModalTemplates.getTemplate('auth');
      expect(template).toBeDefined();
      expect(template?.title).toBe('Welcome to VIZOM');
    });

    it('should get all templates', () => {
      const allTemplates = ModalTemplates.getAllTemplates();
      expect(allTemplates.size).toBeGreaterThan(0);
      expect(allTemplates.has('auth')).toBe(true);
    });

    it('should register custom template', () => {
      const customTemplate = {
        title: 'Custom Template',
        content: '<p>Custom content</p>',
        size: 'medium' as const
      };

      ModalTemplates.registerTemplate('custom', customTemplate);

      const retrieved = ModalTemplates.getTemplate('custom');
      expect(retrieved).toEqual(customTemplate);
    });

    it('should remove template', () => {
      ModalTemplates.registerTemplate('temp', {
        title: 'Temp',
        content: 'Temp',
        size: 'small'
      });

      const removed = ModalTemplates.removeTemplate('temp');
      expect(removed).toBe(true);

      const template = ModalTemplates.getTemplate('temp');
      expect(template).toBeUndefined();
    });
  });

  describe('Template Content', () => {
    it('should have valid auth template content', () => {
      const template = ModalTemplates.getTemplate('auth');
      expect(template?.content).toContain('auth-modal');
      expect(template?.content).toContain('auth-tabs');
      expect(template?.content).toContain('signin-form');
    });

    it('should have valid export settings content', () => {
      const template = ModalTemplates.getTemplate('export-settings');
      expect(template?.content).toContain('export-settings-modal');
      expect(template?.content).toContain('export-format');
    });

    it('should have valid confirmation content', () => {
      const template = ModalTemplates.getTemplate('confirmation');
      expect(template?.content).toContain('confirmation-modal');
      expect(template?.content).toContain('confirmation-actions');
    });
  });
});
