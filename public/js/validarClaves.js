function comporbarClaves(){
  clavePrincipal = document.getElementById('claveUsuario')
  claveComprobacion = document.getElementById('claveUsuarioConfir')

  if(clavePrincipal.value != claveComprobacion.value){
    document.getElementById('error').classList.add('mostrar')
    return false
  } else {
    document.getElementById('error').classList.remove('mostrar')

    //document.getElementById('iniciarSesion').disabled = true

    document.getElementById('formUser').submit()

    return true
  }
}
