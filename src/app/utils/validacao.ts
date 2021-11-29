import { KeyedRead } from "@angular/compiler";
import { AbstractControl, FormGroup } from "@angular/forms";

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
        let grupoDeErros = this._form.get(field)?.errors;

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
        else if(mensagemParaFormatar.startsWith('cpfInvalido')) {
            retorno = `CPF inválido`
        }
        else if (mensagemParaFormatar.startsWith('cnpjInvalido')){
            retorno = `CNPJ inválido`
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
    //Valida CPF.
    static validaCpf(controle: AbstractControl) {
        let cpf = controle.value;
    
        cpf = cpf.replace(/[^\d]+/g,'');

        let soma: number = 0;
        let resto: number;
        let valido: boolean;
    
        const regex = new RegExp('[0-9]{11}');
    
        if (
          cpf == '00000000000' ||
          cpf == '11111111111' ||
          cpf == '22222222222' ||
          cpf == '33333333333' ||
          cpf == '44444444444' ||
          cpf == '55555555555' ||
          cpf == '66666666666' ||
          cpf == '77777777777' ||
          cpf == '88888888888' ||
          cpf == '99999999999' ||
          !regex.test(cpf)
        )
          valido = false;
        else {
          valido = true;

          for (let i = 1; i <= 9; i++)
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
          resto = (soma * 10) % 11;
    
          if (resto == 10 || resto == 11) resto = 0;
          if (resto != parseInt(cpf.substring(9, 10))) valido = false;
    
          soma = 0;
          for (let i = 1; i <= 10; i++)
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
          resto = (soma * 10) % 11;
    
          if (resto == 10 || resto == 11) resto = 0;
          if (resto != parseInt(cpf.substring(10, 11))) valido = false;
        }

         if (valido) return null;
    
         return { cpfInvalido: true };
      }    
      
      static validaCnpj(controle: AbstractControl) {
        let cnpj = controle.value;
 
        cnpj = cnpj.replace(/[^\d]+/g,'');
     
        if(cnpj == '') return { cnpjInvalido: true };
         
        if (cnpj.length != 14)
            return { cnpjInvalido: true };
     
        // Elimina CNPJs invalidos conhecidos
        if (cnpj == "00000000000000" || 
            cnpj == "11111111111111" || 
            cnpj == "22222222222222" || 
            cnpj == "33333333333333" || 
            cnpj == "44444444444444" || 
            cnpj == "55555555555555" || 
            cnpj == "66666666666666" || 
            cnpj == "77777777777777" || 
            cnpj == "88888888888888" || 
            cnpj == "99999999999999")
            return { cnpjInvalido: true };
             
        // Valida DVs
        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0,tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let  i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2)
                pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return { cnpjInvalido: true };
             
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return { cnpjInvalido: true };
               
        return null;
    }

}
export {Validacoes}