import { LoginGuard } from './guards/login.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule), canActivate: [LoginGuard]
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./pages/cadastro/cadastro.module').then( m => m.CadastroPageModule), canActivate: [LoginGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuard]
  },
  {
    path: 'addproduto',
    loadChildren: () => import('./pages/addproduto/addproduto.module').then( m => m.AddprodutoPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'addproduto/:id',
    loadChildren: () => import('./pages/addproduto/addproduto.module').then( m => m.AddprodutoPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'editperfil',
    loadChildren: () => import('./pages/editperfil/editperfil.module').then( m => m.EditperfilPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/help/help.module').then( m => m.HelpPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'informativos',
    loadChildren: () => import('./pages/informativos/informativos.module').then( m => m.InformativosPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'produtos',
    loadChildren: () => import('./pages/produtos/produtos.module').then( m => m.ProdutosPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'pedido-detalhes/:id',
    loadChildren: () => import('./pages/pedido-detalhes/pedido-detalhes.module').then( m => m.PedidoDetalhesPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'recuperacao',
    loadChildren: () => import('./pages/recuperacao/recuperacao.module').then( m => m.RecuperacaoPageModule), canActivate: [LoginGuard]
  },
  {
    path: 'pagamento',
    loadChildren: () => import('./pages/pagamento/pagamento.module').then( m => m.PagamentoPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'historicos',
    loadChildren: () => import('./pages/historicos/historicos.module').then( m => m.HistoricosPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
