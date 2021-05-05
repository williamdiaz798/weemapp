import React from 'react'

class Close extends React.Component{
    constructor(props){
        super(props)
        localStorage.clear()
        this.props.history.push('/')
    }
    render(){
        return(
            <h1>Cerrar Sesion</h1>
        )
    }
}
 
export default Close