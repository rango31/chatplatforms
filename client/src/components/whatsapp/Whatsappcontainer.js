import React from 'react'
import QRCode from "react-qr-code";

export function Whatsappcontainer() {

  const [userId, setUserId] = React.useState('0')
  const [accountId, setAccountId] = React.useState('0')
  const [stage, setStage] = React.useState('new')
  const [data, setData] = React.useState('whatsapp link data')

  function updateStage(stage) {
    setStage(stage)
  }

  return (
    <div className="mail-container">
        <div className="mail-header">
            <div className="mail-title">
                Add Whatsapp Account
                
                <p id="msg"></p>
            </div>
        </div>
        {
           renderSwitch(stage, data , updateStage, setData)
        }

        <div className="divider" />
  </div>
  )
}

const renderSwitch = (stage, data , updateStage , setData)=> {
    switch(stage) {
      case 'new':
        return <New updateStage={updateStage}/>;
      case 'qr':
        return <Qr data={data} setData={setData} updateStage={updateStage}/>;
      case 'contacts':
        return <Contacts updateStage={updateStage} setData={setData} data={data}/>;
      case 'complete':
            return <Complete/>;
      default:
        return <Load/>;
    }
}

const New = ({updateStage}) => {
    return (
         <>
         Do you want to add a whatsaap Account. Its the same process as connecting your phone to whatsapp web. We dont read / collect our clients data. By proceeding you agree to ur term of service.
         <br/>
         <button onClick={()=>{updateStage('qr')}}>Proceed</button>
         
         </>
    );
};

const Load = () => {
    return (
         <>
            Loading, Please wait 
            <img id="loader" src="./assets/images/loader.gif" alt='loader' />
         </>
    );
};

const Qr = ({data, setData, updateStage}) => {
    const [loading, setLoading] = React.useState(true)

    setInterval(() => {
        setLoading(false)
    }, 5000);

    setTimeout(() => {
        updateStage('contacts')
    }, 15000);

    return (
        loading ?  <Load/> : <QRCode value={data} style={{width:'100%', height:'100%'}}/>
    );
};

const Contacts = ({data, setData, updateStage}) => {

    const [contacts, setContacts] = React.useState([1,2,3,4,5,6,7,8,9,0,12,13,14,15,16,17,18])
    const [selectedContacts, setSelectedContacts] = React.useState([])

    function handleChange(e) {
        //setChecked(e.target.checked);
        console.log(e.target.value)
        console.log(e.target.checked)
     }

     function saveAndComplete(){
        updateStage('complete')
     }

    return (
        <>
        {
            contacts.map((item, index) => (
                <span key={{index}} style={{padding:'-20px'}}>
                    <label style={{fontSize:'30px'}}>{item}</label>
                    <input style={{height:'30px',width:'30px', float:'right'}} value={item} type="checkbox" onChange={handleChange} />
                    <hr/>
                </span>  
            ))
        }
        <button style={{marginBottom:'250px'}} onClick={saveAndComplete}>Save and Complete</button>
        </>
    );
};

const Complete = () => {
    return (
        <>
        Completed
        </>
    );
};