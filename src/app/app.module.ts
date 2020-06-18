import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { CadastralEntityComponent } from './cadastral-entity/cadastral-entity.component';
import { VectorialShapefileComponent } from './vectorial-shapefile/vectorial-shapefile.component';
import { MarkOnMapComponent } from './mark-on-map/mark-on-map.component';

@NgModule({
  declarations: [
    AppComponent,
    CadastralEntityComponent,
    VectorialShapefileComponent,
    MarkOnMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,

    // angular material
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
