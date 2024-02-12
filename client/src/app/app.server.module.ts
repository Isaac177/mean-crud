
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([], { initialNavigation: 'disabled' }),
    MatButtonModule,
    ServerModule
  ]
})
export class AppServerModule {}
