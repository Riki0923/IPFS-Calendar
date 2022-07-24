import React from 'react';
import { useMoralis, useMoralisFile, useNewMoralisObject, useMoralisQuery } from 'react-moralis';
import { useState } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";

// const locales = {
//   "en-EU": require("date-fns/locale/hu")
// }

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales
// });


const events = [{
    title: "Big Meeting",
    start: new Date(2022, 7,30, 15, 10),
    end: new Date(2022, 7, 30, 18, 30)
  },
  {
    title: "Vacation",
    start: new Date(2022, 8, 10),
    end: new Date(2022, 8, 30)
  },
  {
    title: "Conference",
    start: new Date(2022, 7, 29),
    end: new Date(2022, 7, 30)
  }
]
const Connect = () => {
    const { authenticate, isAuthenticated, isAuthenticating, logout } = useMoralis();
    const [buttonText, changeButtonText] = useState("Connect with Metamask");
    const { saveFile } = useMoralisFile();
    const [EventName, setEventName] = useState("");
    const [Time, setTime] = useState("");
    const { save } = useNewMoralisObject("ipfs");
    const { fetch } = useMoralisQuery("ipfs",
    (query) => query.notEqualTo("ipfsHash", "nonIpfsGateway"), [],
    {autoFetch: false});


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
      //  const results = await fetch();
      //  console.log(results);
      //  for(let i = 0; i < results.length; i++){
      //   const object = results[i];
      //   console.log(object);
      //   const ipfsHashString = console.log(object.get("ipfsHash"));
      //   const newFetch = await fetch(ipfsHashString);
      //   console.log(newFetch);
      //   console.log(ipfsHashString.json().then(data => console.log(data)));
      //  }
      const url = `https://gateway.moralisipfs.com/ipfs/QmYhx3jNnvx3KoKARr5onJRU1nm7zzhRijagxUdtMjY9g9`;
      const newResponse = await fetch(url);
      console.log(newResponse);
      console.log(newResponse.json());
      }

    const uploadFile = async (event) => {
      event.preventDefault();
      const metadata = {
        EventName,
        Time,
        //image
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

    // const uploadFiles = async () => {
    //   <div>
    //     <FileUpload setUrl={setFileUrl} />

    //     {fileUrl}
    //   </div>
    // }

    // const getAccessToken = async () => {

    //   return WEB3STORAGE_TOKEN
    // }

    // const makeStorageClient = async () => {
    //   return new Web3Storage({ token: getAccessToken() })
    // }

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
        {/* <input 
        className=" bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1" placeholder="content for IPFS"
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}/> */}
        <h1 className='font-bold' 
        style={{fontSize: "30px", display:"flex", justifyContent: "center", fontFamily:"cursive"}}
        >IPFS Calendar</h1>
        <div>
          <input className=" bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1" 
          type="text" placeholder='EventName' style={{width: "20%", marginRight: "10px"}} 
          onChange={(p) => setEventName(p.target.value)}
          />
          {/* <DatePicker className=" bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1" 
          placeholderText='Start Date' style={{margin: "10px"}}
          selected={newEvent.start} onChange={(start) => setNewEvent({...newEvent, start})}
          />
          <DatePicker className=" bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1" 
          placeholderText='End Date' style={{margin: "10px"}}
          selected={newEvent.end} onChange={(end) => setNewEvent({...newEvent, end})}
          /> */}
          <input className=" bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1" 
          type="text" placeholder='Time' style={{width: "20%", marginRight: "10px"}} 
          onChange={(c) => setTime(c.target.value)}
          />
          {/* <input className=" bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1" 
          type="text" placeholder='End Time' style={{width: "20%", marginRight: "10px"}} 
          value={newEvent.end} onChange={(e) => setNewEvent({...newEvent, end: e.target.value})}
          /> */}
          <button className="bg-sky-500 hover:bg-sky-600 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white"
          style={{marginTop: "10px", display: "flex", justifyContent: "center"}} 
          onClick={uploadFile}>Add Event</button>
        </div>
        {/* <Calendar localizer={localizer} events={allEvents} 
        startAccessor="start" endAccessor="end"
        style={{height:500, margin: "50px"}}/> */}
        <button onClick={() => fetchIPFSDoc()}> fetch by Button</button>
      </div>
    )
}
export default Connect;
