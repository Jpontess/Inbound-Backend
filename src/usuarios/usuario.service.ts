import { Injectable } from '@nestjs/common';
import { Usuario } from './interfaces/usuario.interface';

@Injectable()
export class UsuarioService {
    private readonly usuarios: Usuario[] = [
        { nome: 'João', funcao: 'Desenvolvedor' },
        { nome: 'Caio', funcao: 'Engenheiro de Software Senior' },
        { nome: 'Damaris', funcao: 'Tech Lead' },
    ];

    ListarUsuarios(){
       return this.usuarios;
    }

    criarUsuario(nome: string, funcao: string): Usuario {
        const novoUsuario: Usuario = { nome, funcao };
        this.usuarios.push(novoUsuario);
        return novoUsuario;
    }
}