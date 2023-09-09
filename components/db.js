import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDxaYlGgqMJMFCcTOpp_CuUnB9QV_zjndI",
    authDomain: "game-9c3fa.firebaseapp.com",
    databaseURL: "https://game-9c3fa.firebaseio.com",
    projectId: "game-9c3fa",
    storageBucket: "game-9c3fa.appspot.com",
    messagingSenderId: "404274416068",
    appId: "1:404274416068:web:cc8bba98ad235cf6093c91"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


export default {
    getGames:function() {
        return new Promise((resolve, reject) => {
            const data = [];
            db.collection("games").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    data.push({
                        data:doc.data(),
                        id:doc.id
                    });
                });
                resolve(data)
            }).catch(function(error){
                reject(error);
            })
        })
    },
    getColoringActivities:function() {
        return new Promise((resolve, reject) => {
            const data = [];
            db.collection("coloringactivity").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    data.push({
                        data:doc.data(),
                        id:doc.id
                    });
                });
                resolve(data)
            }).catch(function(error){
                reject(error);
            })
        })
    },
    getAnimalsSounds:function() {
        return new Promise((resolve, reject) => {
            const data = [];
            db.collection("animalssounds").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    data.push({
                        data:doc.data(),
                        id:doc.id
                    });
                });
                resolve(data)
            }).catch(function(error){
                reject(error);
            })
        })
    },
    getDragDrop:function() {
        return new Promise((resolve, reject) => {
            const data = [];
            db.collection("dragdrop").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    data.push({
                        data:doc.data(),
                        id:doc.id
                    });
                });
                resolve(data)
            }).catch(function(error){
                reject(error);
            })
        })
    },
    getPuzzles:function() {
        return new Promise((resolve, reject) => {
            const data = [];
            db.collection("puzzles").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    data.push({
                        data:doc.data(),
                        id:doc.id
                    });
                });
                resolve(data)
            }).catch(function(error){
                reject(error);
            })
        })
    },
    getTapPuzzle:function() {
        return new Promise((resolve, reject) => {
            const data = [];
            db.collection("tappuzzle").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const nextData = doc.data();
                    nextData["image"] = "/games/tap-puzzle/image-"+nextData.id+".png"
                    
                    data.push({
                        data:nextData,
                        id:doc.id
                    });
                });
                resolve(data)
            }).catch(function(error){
                reject(error);
            })
        })
    },
    
};