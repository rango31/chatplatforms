import React from 'react'
import QRCode from "react-qr-code";
import axios from 'axios';

export function Whatsappcontainer() {

  const [userId, setUserId] = React.useState('0')
  const [accountId, setAccountId] = React.useState(null)
  const [stage, setStage] = React.useState('new')
  const [data, setData] = React.useState(null)

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
           renderSwitch(stage, data , updateStage, setData, setAccountId, accountId)
        }

        <div className="divider" />
  </div>
  )
}

const renderSwitch = (stage, data , updateStage , setData , setAccountId, accountId)=> {
    switch(stage) {
      case 'new':
        return <New updateStage={updateStage}/>;
      case 'qr':
        return <Qr data={data} setData={setData} updateStage={updateStage} setAccountId={setAccountId} accountId={accountId}/>;
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

const Qr = ({data, setData, updateStage, setAccountId,accountId}) => {
    const [loading, setLoading] = React.useState(true)
    const [q,setQ] = React.useState(null)

    const token = localStorage.getItem("token");

    React.useEffect(() => {
        const startLogin = async () => {
            
            try{
                let data = await axios.get(`/api/startlogin`,{
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });

                console.log(data.data.data)
                await setAccountId(data.data.data)
            }catch(ex){
                //setLoading(false)
                console.log(ex.message)
            }
        }

        if(accountId){
            setInterval(async () => {

                if(!accountId){
                return
                }

                try{
                    let data = await axios.post(`/api/getdata`,{accountid:accountId},{
                        headers: {
                            'Authorization': `Bearer ${token}` 
                        }
                    });

                   // setData(data.data.data[0].metadata);
                    setQ(data.data.data[0].metadata)

                    if(data.data.data[0].stage !== 'qr'){
                       await updateStage('contacts')
                       await setData(null)
                    }
                    setLoading(false);
                }catch(ex){
                    //setLoading(false)
                    console.log(ex.message)
                }
            }, 2000);
        }

        if(!accountId && !data){
            startLogin();
        }

      },[setAccountId,accountId, token,data])

      if(data){
        setLoading(false);
      }

    return (
         loading || !q ?  <Load/> : <QRCode value={q} style={{width:'100%', height:'100%'}}/>
    );
};

const Contacts = ({data, setData, updateStage}) => {

    const token = localStorage.getItem("token");
    const [contacts, setContacts] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [selectedContacts, setSelectedContacts] = React.useState([])

    React.useEffect(() => {
      const getContacts = async () => {
        
        try{
            let data = await axios.get(`/api/getcontacts`,{
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            setContacts(data.data.data)
            setLoading(false)
        }catch(ex){
            //setLoading(false)
            console.log(ex.message)
        }
      }

        setTimeout(() => {
            getContacts()
        }, 2000);

    })

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