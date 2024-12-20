import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventsComponent } from './views/events/events.component';
import { ObserveComponent } from './views/observe/observe.component';
import { SectionsComponent } from './views/sections/sections.component';
import { ManageEventsComponent } from './views/settings/manage-events/manage-events.component';
import { ResultsComponent } from './views/settings/manage-events/results/results.component';
import { NewEventComponent } from './views/settings/new-event/new-event.component';
import { RiderTemplateComponent } from './views/settings/rider-template/rider-template.component';
import { SettingsComponent } from './views/settings/settings.component';

@NgModule({ declarations: [
        AppComponent,
        EventsComponent,
        SectionsComponent,
        ObserveComponent,
        SettingsComponent,
        NewEventComponent,
        ManageEventsComponent,
        RiderTemplateComponent,
        ResultsComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        TabMenuModule,
        CardModule,
        BrowserAnimationsModule,
        SelectButtonModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        TableModule,
        PasswordModule,
        InputTextModule,
        FloatLabelModule,
        CalendarModule,
        FileUploadModule,
        InputNumberModule,
        ToastModule,
        ConfirmDialogModule,
        DialogModule,
        AutoCompleteModule], providers: [MessageService, ConfirmationService, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
