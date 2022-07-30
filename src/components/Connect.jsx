import { useMoralis, useMoralisFile, useNewMoralisObject, useMoralisQuery } from 'react-moralis';
import { useState, useEffect } from 'react';
import axios from 'axios';


const Connect = () => {
    const { authenticate, isAuthenticated, isAuthenticating, logout } = useMoralis();
    const [buttonText, changeButtonText] = useState("Connect with Metamask");
    const { saveFile } = useMoralisFile();
    const [EventName, setEventName] = useState("");
    const [Time, setTime] = useState("");
    const [datas, setData] = useState([]);
    const { save } = useNewMoralisObject("ipfs");
    const { fetch } = useMoralisQuery("ipfs",
    (query) => query.notEqualTo("ipfsHash", "nonIpfsGateway"), [],
    {autoFetch: true});

    const objectArray = [];

    const login = async () => {
        if(!isAuthenticated) {

            await authenticate().then(function (){
                changeButtonText("Logged in");
                console.log(("you were just authenticated"))
            })
            .catch(function (error) {
                console.log(error);
              });
        }
    };

    const logOut = async () => {
      await logout().then(function(){
        changeButtonText("Connect with Metamask");
        console.log("logged out");
      });
    };

    const fetchIPFSDoc = async () => {
      const results =  await fetch();
      for(let i = 0; i < results.length; i++){
       const object = results[i];
       // console.log(object);
       // console.log(object.attributes.ipfsHash);
       const getter = axios.get(object.attributes.ipfsHash)
       .then((events) => {
         console.log(events.data);
         objectArray.push(events.data);
         console.log("data state is: ", objectArray);
       })
     }
    };

    const listItems = async () => {
      return(
        <p>{objectArray}</p>
      )
    }

    useEffect(() => {
      fetchIPFSDoc();
    }, [])

    const uploadFile = async (event) => {
      event.preventDefault();
      const metadata = {
        EventName,
        Time,
      }
      const result = await saveFile(
        "newEvent.json",
        {base64: btoa(JSON.stringify(metadata))} ,
        {
          type: "base64",
          saveIPFS: true,
        }
      );
      alert("Successfully uploaded your event to ipfs, ipfs hash is: " + result.ipfs());
      let iUrl = result.ipfs();
      let length = iUrl.length;
      let newLink = "https://gateway.moralisipfs.com/ipfs/" + iUrl.substring(34, length) ;
      console.log("newLink is " + newLink);
      console.log(result.ipfs());
      
      const data = {
        url: result.ipfs(),
        ipfsHash: newLink
      };

      save(data, {
        onSuccess: (ipfs) => {
          console.log("ipfs hash successfully saved to Moralis dashboard. Id is " + ipfs.id)
        }
      })
    }
    return (
      <div className='max-w-7xl mx-auto'>
        <button className="bg-slate-50 font-bold px-3 py-2 text-slate-800 rounded-lg hover:bg-slate-100 hover:text-slate-900"
         style={{
         margin: "20px",
         fontSize: "20px"}} onClick={login}> {buttonText} </button>
        <button className="bg-slate-50 font-bold px-3 py-2 text-slate-800 rounded-lg hover:bg-slate-100 hover:text-slate-900"
         style={{margin: "20px", fontSize: "20px"}} 
         onClick={logOut} disabled={isAuthenticating}> logOut</button>
        <button className="bg-slate-50 font-bold px-3 py-2 text-slate-800 rounded-lg hover:bg-slate-100 hover:text-slate-900"
         style={{fontSize: "20px"}} 
         onChange={uploadFile}> Upload to IPFS </button>
        <input
         className="block text-sm text-slate-500
         file:mr-4 file:py-2 file:px-4
         file:rounded-full file:border-0
         file:text-sm file:font-semibold
         file:bg-violet-50 file:text-black-700
         hover:file:bg-violet-100"
         type="file" 
         id='fileToBeUploaded'/>
        <h1 className='font-bold' 
        style={{fontSize: "30px", display:"flex", justifyContent: "center", fontFamily:"cursive"}}
        >IPFS Calendar</h1>
        <div>
          <input className=" bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1" 
          type="text" placeholder='EventName' style={{width: "20%", marginRight: "10px"}} 
          onChange={(p) => setEventName(p.target.value)}
          />
          <input className=" bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1" 
          type="text" placeholder='Time' style={{width: "20%", marginRight: "10px"}} 
          onChange={(c) => setTime(c.target.value)}
          />
          <button className="bg-sky-500 hover:bg-sky-600 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white"
          style={{marginTop: "10px", display: "flex", justifyContent: "center"}} 
          onClick={uploadFile}>Add Event</button>
          <div>
          </div>
        </div>
      </div>
    )
}
export default Connect;
