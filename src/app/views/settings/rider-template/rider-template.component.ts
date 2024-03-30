import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-rider-template',
  templateUrl: './rider-template.component.html',
  styleUrl: './rider-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiderTemplateComponent {}
