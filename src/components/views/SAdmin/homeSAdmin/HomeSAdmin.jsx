import React from 'react'

// components
import NavSAdmin from '../../../functional/navigation/NavSAdmin'
import BodyHomeSA from '../../../functional/bodyHomeSA/BodyHomeSA'
import FooterSA from '../../../views/SAdmin/footerSAdmin/FooterSAdmin'

class HomeSAdmin extends React.Component{
    constructor(props){
        super(props)
        if(localStorage.length!==0 && localStorage.getItem('tipoUsuario') === '1'){
        }else{
            this.props.history.push('/')
        }
    }
    render(){
        return(
            <>
                <NavSAdmin/>
                <BodyHomeSA/>
                <FooterSA/>
            </>
        )
    }
}

export default HomeSAdmin