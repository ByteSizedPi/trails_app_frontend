import {
  ChangeDetectionStrategy,
  Component,
  inject,
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

  formGroup = new FormGroup({
    eventName: new FormControl('', Validators.required),
    eventLocation: new FormControl('', Validators.required),
    password: new FormControl(''),
    sections: new FormControl(10, Validators.required),
    laps: new FormControl(4, Validators.required),
    eventDate: new FormControl<Date>(get9h00(), Validators.required),
  });

  submit(file: File) {
    const getField = (field: string) => this.formGroup.get(field)!.value!;

    const insertEvent: InsertEvent = {
      event_name: getField('eventName'),
      event_location: getField('eventLocation'),
      event_date: new Date(getField('eventDate'))
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
      lap_count: +getField('laps'),
      sections: +getField('sections'),
      password: getField('password'),
    };
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
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.error || 'An error occurred',
        });
      },
    });
  }
}
