import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-rider-template',
  templateUrl: './rider-template.component.html',
  styleUrl: './rider-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiderTemplateComponent {
  private backend = inject(BackendService);
  downloadTemplate() {
    this.backend.getTemplate().subscribe({
      next: (response) => {
        const file = response.body;
        if (!file) return;
        const blob = new Blob([file], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Riding Numbers.xlsx';

        document.body.appendChild(a);
        a.click();

        // // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (e: any) => {
        console.log('error', e.message);
      },
    });
  }
}
