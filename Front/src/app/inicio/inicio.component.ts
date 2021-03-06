import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Postagem } from '../model/Postagem';
import { Tema } from '../model/Tema';
import { User } from '../model/User';
import { AlertasService } from '../service/alertas.service';
import { AuthService } from '../service/auth.service';
import { PostagemService } from '../service/postagem.service';
import { TemaService } from '../service/tema.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  nome = environment.nome
  foto = environment.foto
  token = environment.token
  id = environment.id

  confirmarSenha: string
  
  whats: string = 'https://api.whatsapp.com/send?phone=55'
  postagem: Postagem = new Postagem()
  listaPostagens: Postagem[]
  tituloPost: string
  descricaoTema:string
  listaTemas: Tema[]
  idTema: number
  tema: Tema = new Tema()

  user: User = new User()
  idUser = environment.id

  key = 'data'
  reverse = true

  constructor(
    private router: Router,
    private postagemService: PostagemService,
    private temaService: TemaService,
    private authService: AuthService,
    private alertas: AlertasService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    window.scroll(0, 0)

    if (environment.token == '') {
      // alert('sua sessão expirou, faça login novamente.')
      this.router.navigate(['/login'])
    }

    this.getAllTemas()
    this.getAllPostagens()

    // this.idUser = this.route.snapshot.params['id']
    this.findByIdUserEdit(this.idUser)
    console.log(this.user)
  }

  getAllTemas() {
    this.temaService.getAllTema().subscribe((resp: Tema[]) => {
      this.listaTemas = resp
      console.log(this.listaTemas)
    })
  }

  findByIdTema() {
    this.temaService.getByIdTema(this.idTema).subscribe((resp: Tema) => {
      this.tema = resp
    })
  }

  getAllPostagens() {
    this.postagemService.getAllPostagens().subscribe((resp: Postagem[]) => {
      this.listaPostagens = resp
    })
  }

  findByIdUser() {
    this.authService.getByIdUser(this.idUser).subscribe((resp: User) => {
      this.user = resp
    })
  }

  publicar() {
    this.tema.id = this.idTema
    this.postagem.tema = this.tema

    this.user.id = this.idUser
    this.postagem.usuario = this.user

    this.postagemService.postPostagem(this.postagem).subscribe((resp: Postagem) => {
      this.postagem = resp
      this.alertas.showAlertSuccess('Postagem realizada com sucesso!')
      this.postagem = new Postagem()
      this.getAllPostagens()
    })
  }
  findByTituloPostagem() {

    if (this.tituloPost == '') {
      this.getAllPostagens()
    } else {

      this.postagemService.getByTituloPostagem(this.tituloPost).subscribe((resp: Postagem[]) => {
        this.listaPostagens = resp

      })
    }
  }
  findByDescricaoTema() {
    if (this.descricaoTema == '') {
      this.getAllTemas()
    } else {

      this.temaService.getByDescricaoTema(this.descricaoTema).subscribe((resp: Tema[]) => {
        this.listaTemas = resp
      })
    }
  }


  // User edit
  confirmSenha(event: any){
    this.confirmarSenha = event.target.value
  }

 
  atualizar(){
    
    if(this.user.foto == null || typeof this.user.foto == 'undefined' || this.user.foto == '') {
      this.user.foto = 'https://i.imgur.com/nCE6efQ.png'
      console.log(this.user.foto+' 2 jão pamonha com foto')
    }
    console.log(this.user.foto+'2 jão sem foto')
    if(this.user.senha != this.confirmarSenha){
      this.alertas.showAlertDanger('As senhas não conferem, favor verificar se as senhas são iguais')
    }else{
      this.authService.atualizar(this.user).subscribe((resp: User) =>{
        this.user = resp
        this.router.navigate(['/inicio'])
        this.alertas.showAlertSuccess('Usuário atualizado com sucesso, faça login novamente!')
        console.log(this.user.foto)
        environment.foto = ''
        console.log(this.user.foto+'2 jão pamonha editado')
        environment.nome = ''
        environment.token = ''
        environment.id = 0
        this.router.navigate(['/login'])
      })
    }
  }

  findByIdUserEdit(id: number){
    this.authService.getByIdUser(id).subscribe((resp: User)=>{
      this.user = resp
      this.user.senha = resp.senha.substring(0, 0)
    })
  }

  isAdm(){
    if(this.user.tipo == 'adm'){
      return true
    }
    return false
  }

}
