import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {buserdashboardService} from './services/buserdashboard/buserdashboard.service';
import { appDeclarations, appBootstrap, appProviders, appEntryComponents } from './config/declarations';
import { appImportModules } from './config/import-modules';

@NgModule({
  declarations: [...appDeclarations],
  imports: [...appImportModules],
  providers: [...appProviders,buserdashboardService],
  entryComponents: [...appEntryComponents],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [...appBootstrap]
})
export class AppModule { }
