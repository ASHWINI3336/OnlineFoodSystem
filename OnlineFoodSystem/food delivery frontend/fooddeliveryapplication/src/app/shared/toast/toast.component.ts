import { Component } from '@angular/core';
import { ToastService, Toast } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast-{{ toast.type }}" (click)="toastService.dismiss(toast.id)">
          <span class="toast-icon material-icons">
            @switch (toast.type) {
              @case ('success') { check_circle }
              @case ('error') { error }
              @case ('warning') { warning }
              @default { info }
            }
          </span>
          <span class="toast-message">{{ toast.message }}</span>
          <span class="toast-close material-icons" (click)="toastService.dismiss(toast.id)">close</span>
          <div class="toast-progress" [style.animation-duration]="toast.duration + 'ms'"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: var(--z-toast);
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 420px;
      width: 100%;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-radius: var(--radius-md);
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-lg);
      animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
      pointer-events: all;
      position: relative;
      overflow: hidden;
    }

    .toast-icon { font-size: 22px; flex-shrink: 0; }
    .toast-message { flex: 1; font-size: var(--text-sm); font-weight: 500; color: var(--text-primary); }
    .toast-close {
      font-size: 18px;
      color: var(--text-tertiary);
      cursor: pointer;
      flex-shrink: 0;
      transition: color var(--transition-fast);
    }
    .toast-close:hover { color: var(--text-primary); }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
      animation: progressShrink linear forwards;
      transform-origin: left;
    }

    @keyframes progressShrink {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }

    .toast-success { border-left: 4px solid var(--success); }
    .toast-success .toast-icon { color: var(--success); }
    .toast-success .toast-progress { background: var(--success); }

    .toast-error { border-left: 4px solid var(--error); }
    .toast-error .toast-icon { color: var(--error); }
    .toast-error .toast-progress { background: var(--error); }

    .toast-warning { border-left: 4px solid var(--warning); }
    .toast-warning .toast-icon { color: var(--warning); }
    .toast-warning .toast-progress { background: var(--warning); }

    .toast-info { border-left: 4px solid var(--info); }
    .toast-info .toast-icon { color: var(--info); }
    .toast-info .toast-progress { background: var(--info); }

    @media (max-width: 480px) {
      .toast-container { right: 12px; left: 12px; max-width: none; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
