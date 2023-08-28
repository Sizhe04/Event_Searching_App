import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesFormComponent } from './favorites-form/favorites-form.component';
import { TosearchComponent } from './tosearch/tosearch.component';

const routes: Routes = [
  { path: 'search', component: TosearchComponent },
  { path: 'favorites', component: FavoritesFormComponent },
  { path: '', redirectTo: 'search', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
