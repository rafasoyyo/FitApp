import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, Button, ConfirmDialog ],
  providers: [ SwUpdate, ConfirmationService ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FitApp');

  constructor (
    private readonly swUpdate: SwUpdate,
    private readonly confirmationService: ConfirmationService
  ) {
    this.triggerUpdateDialog();
  }

  triggerUpdateDialog () {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((evt) => {
        if (evt.type === 'VERSION_READY') {
          this.confirmationService.confirm({
            message: 'Hay una nueva versión disponible. ¿Deseas actualizar?',
            header: 'Actualización Disponible',
            icon: 'pi pi-exclamation-triangle',
            rejectVisible: false,
            acceptLabel: 'Actualizar',
            accept: () => {
              window.location.reload();
            }
          });
        }
      });
    }
  }

  toggleDarkMode () {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
  }
}
