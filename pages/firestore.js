import { useState, useEffect } from "react";
import db from "../components/db";

export default function Firestore() {
    useEffect(function(){
        console.log(db);
    }, [])
    const saveData = function() {
        const data = JSON.parse(document.querySelector("textarea").value);
        
        data.forEach(function(v){
            db.collection("tappuzzle").add(v)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        })
       
    }

    return <div>
        <textarea style={{width:"100%", height:"400px"}}></textarea>
        <button onClick={saveData}>Hello India</button>
    </div>
}