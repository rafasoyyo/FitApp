import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialog],
  providers: [ SwUpdate, ConfirmationService ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
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
}
