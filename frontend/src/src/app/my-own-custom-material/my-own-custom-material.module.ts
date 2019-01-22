import {MatBadgeModule, MatButtonModule, MatCheckboxModule, MatInputModule} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
  imports: [MatButtonModule, MatCheckboxModule, MatInputModule, MatBadgeModule],
  exports: [MatButtonModule, MatCheckboxModule, MatInputModule, MatBadgeModule],
})
export class MyOwnCustomMaterialModule { }
