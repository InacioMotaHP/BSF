export interface Empresa {
    email?:string;
    password?:string;
    passConfirm?: string,

    name?:string; 
    description?:string;
    picture?:string;

    telefone1?:number;
    telefone2?:number;
    cnpj?: number;

    //endereço
    rua?:string;
    numero?:string;
    complemento?: string;
    cidade?:string;
    bairro?:string;
    
    idEmpresa?: string;
    cat?: string;
    
}
