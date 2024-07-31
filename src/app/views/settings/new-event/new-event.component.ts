import {
  ChangeDetectionStrategy,
  Component,
  ModelSignal,
  model,
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
  password: ModelSignal<string | undefined> = model<string>();
  auth = signal(false);
  pwAttempted = signal(false);
  fileUpload = viewChild<FileUpload>('fileUpload');

  formGroup = new FormGroup({
    eventName: new FormControl('', Validators.required),
    eventLocation: new FormControl('', Validators.required),
    sections: new FormControl(10, Validators.required),
    laps: new FormControl(4, Validators.required),
    eventDate: new FormControl<Date>(get9h00(), Validators.required),
  });

  constructor(
    private backend: BackendService,
    private messageService: MessageService
  ) {
    if (localStorage.getItem('trailsAuth')) this.auth.set(true);
  }

  verify() {
    this.auth.set(false);
    this.backend.verifyAuth(this.password()!).subscribe((res) => {
      if (res) {
        this.auth.set(true);
        localStorage.setItem('trailsAuth', 'true');
      }
      this.pwAttempted.set(true);
    });
  }

  submit(file: File) {
    const insertEvent: InsertEvent = {
      event_name: this.formGroup.get('eventName')!.value!,
      event_location: this.formGroup.get('eventLocation')!.value!,
      event_date: new Date(this.formGroup.get('eventDate')!.value!)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
      lap_count: +this.formGroup.get('laps')!.value!,
      sections: +this.formGroup.get('sections')!.value!,
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
