/* Máscaras ER */
function maskCep(o,f){
    v_obj=o
    v_fun=f
    setTimeout("execmascara()",1)
}
function execmascara(){
    v_obj.value=v_fun(v_obj.value)
}
function mCep(v){
    v=v.replace(/\D/g,"");             //Remove tudo o que não é dígito
    v=v.replace(/(\d)(\d{3})$/,"$1-$2");
    return v;
}
function id( el ){
	return document.getElementById( el );
}
window.onload = function(){
    if($('cepCliente').val() != this.undefined){
        id('cepCliente').onkeyup = function(){
		    maskCep( this, mCep );
	    }
    }
}