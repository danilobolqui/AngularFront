import { KeyedRead } from "@angular/compiler";
import { FormGroup } from "@angular/forms";

class Validacoes {
    //FormGroup recebido no construtor.
    _form: FormGroup

    //Construtor.
    constructor(form: FormGroup) {
         this._form = form;
    }

    //Obtém primeiro erro do campo no FormGroup.
    primeiroErro(field: string) 
    {
        let retorno = '';
        let listaDeErros: Array<string> = [];
        let listaValor: Array<any> = [];
        let grupoDeErros = this._form.get(field)!.errors;
        
        if (grupoDeErros != null) 
        {        
            Object.keys(this._form.controls).forEach(chave => 
            {
                Object.keys(grupoDeErros!).forEach(keyError =>
                {
                    if(chave === field)
                    {
                        listaValor.push(grupoDeErros![keyError]);
                        listaDeErros.push(keyError);
                    }
                });
            });
        }

        if(listaDeErros.length > 0)
        {
            retorno = this.messageHandler(listaDeErros[0], listaValor[0]);
        }
        else
        {
            retorno = '';
        }

        return retorno;
    }

    //Obtém primeiro erro do campo, verificando se existe mensagem de campos diferentes, no FormGroup.
    primeiroErroCamposDiferentes(field1: string, field2: string){
        let retorno = '';
        let primeiroErro = this.primeiroErro(field1);
        if (primeiroErro !== ''){
            retorno = primeiroErro;
        } else{
            retorno = this.camposDiferentes(field1, field2);
        }
        return retorno;
    }

    //Verifica se dois campos tem valores diferentes no FormGroup.
    camposDiferentes(campoUm: string, campoDois: string, mensagemPersonalizada: string = '') {
        let retorno = '';
        if(this._form.get(campoUm)?.value === this._form.get(campoDois)?.value) {
            retorno = ''
        }
        else {
            if(mensagemPersonalizada !== '') 
                retorno = mensagemPersonalizada
            else
                retorno = 'Os dois campos são diferentes.'
        }
        return retorno;
    }

    //Tradução das mensagens de erro.
    messageHandler(mensagemParaFormatar: string, valorDaMensagem: any, nomeDoCampo:string = ''): string {
        let retorno = '';
        if(mensagemParaFormatar === 'email') {
            retorno = 'E-mail em formato inválido'
        }
        else if(mensagemParaFormatar === 'required'){
            retorno = 'Este campo é obrigatório'
        }
        else if(mensagemParaFormatar.startsWith('min')){
            retorno = `Campo exige tamanho mínimo: ${valorDaMensagem.requiredLength}`
        }
        else if(mensagemParaFormatar.startsWith('max')) {
            retorno = `Campo suporta somente: ${valorDaMensagem.requiredLength} caracteres/números`
        }
        else {
            retorno = '';
        }
        return retorno;
    }

    //Verifica se campo é inválido e se foi tocado.
    invalidoETocado(field: string): boolean {
        return (!this._form.get(field)?.valid && this._form.get(field)?.touched) ?? false
    }

    //Verifica se campo é inválido e tocado ou se é diferente de outro campo.
    invalidoETocadoOuCamposDif(field1: string, field2: string): boolean {
        return ((this.invalidoETocado(field1)) || (this.camposDiferentes(field1, field2) !== '')) ?? false
    }    
}
export {Validacoes}