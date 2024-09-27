import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BackendService } from 'src/app/services/backend.service';
import { InsertEvent } from '../../../../models/Types';

const get9h00 = () => {
  let date = new Date();
  date.setHours(9, 0, 0, 0);
  return date;
};

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrl: './new-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewEventComponent {
  private backend = inject(BackendService);
  private messageService = inject(MessageService);

  fileUpload = viewChild<FileUpload>('fileUpload');
  fileUploadInProgress = signal(false);

  formGroup = new FormGroup({
    eventName: new FormControl('', Validators.required),
    eventLocation: new FormControl(''),
    password: new FormControl(''),
    sections: new FormControl(10, Validators.required),
    laps: new FormControl(4, Validators.required),
    eventDate: new FormControl<Date>(get9h00(), Validators.required),
  });

  submit(file: File) {
    const getField = (field: string) => this.formGroup.get(field)!.value!;

    // map event data to InsertEvent
    const insertEvent: InsertEvent = {
      event_name: getField('eventName'),
      event_location: getField('eventLocation'),
      event_date: this.formatDateForMySQL(getField('eventDate')),
      lap_count: +getField('laps'),
      sections: +getField('sections'),
      password: getField('password'),
    };

    // file upload in progress
    this.fileUploadInProgress.set(true);

    // post event to backend
    this.backend.postEvent(insertEvent, file).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Event created successfully',
        });
        this.formGroup.reset();
        this.formGroup.get('sections')!.setValue(10);
        this.formGroup.get('laps')!.setValue(4);
        this.fileUpload()!.clear();
        this.fileUploadInProgress.set(false);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.error || 'An error occurred',
        });

        this.fileUploadInProgress.set(false);
      },
    });
  }

  private formatDateForMySQL(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  timeSet() {
    const date = this.formGroup.get('eventDate')!.value!;
    console.log(this.formatDateForMySQL(date));
  }
}
