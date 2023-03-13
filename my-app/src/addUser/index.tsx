import React, { useState } from "react";
import { useEffect } from "react";
import { User } from "../models/user";
import "../index.css";
import { addUserService } from "../service";

export const AddUser = () =>{
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [type, setType] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState(""); 

    const addUser = () =>{
        if(!name || !surname || !type || !city || !address){
            alert("Niste popunili sva polja");
            setMessage("");
            return;
        }

        const data = {
            Name: name,
            Surname: surname,
            UserType: type,
            DateCreated: new Date(),
            City: city,
            Address: address
        }

        addUserService(data).then(
            response => {
                setMessage("Uspesno ste dodali novog korisnika");
                setName("");
                setSurname("");
                setAddress("");
                setCity("");
                setType("");
                console.log(response.data);
            }
        ).catch(
            error => console.error(error)
        );
    }

    const inputChanged = (e: { target: { value: string; id: any;}; })=>{
        let val: string = e.target.value;
        switch(e.target.id){
            case "name":
                setName(val);
                break;
            case "surname":
                setSurname(val);
                break;
            case "type":
                setType(val);
                break;
            case "city":
                setCity(val);
                break;
            case "address":
                setAddress(val);
                break;
            default: break;
        }
    }

    const filledData = (): boolean =>{ // da li su svi podaci popunjeni
        return name != "" && address != "" && surname != "" && type != "" && city != "";
    }

    let addButton;
    if(filledData())
        addButton = (
            <>
            <button className="btn btn-success" onClick={addUser}>
                Dodaj korisnika
            </button>
            </>
        );
    else
        addButton = (
            <>
            <button className="btn btn-danger" disabled>
                Niste uneli sve podatke
            </button> <br/>
            </>
        );      
    
    return (
        <div className="add-User-wrapper">
            <h2>Dodaj novog korisnika</h2>
            <div className="add-user-fields">
                <table style={{margin:"0 auto"}}>
                    <tr>
                        <th>Ime:</th>
                        <th><input value={name} type="text" name="" id="name" onChange={inputChanged}/></th>
                    </tr>
                    <tr>
                        <th>Prezime:</th>
                        <th><input value={surname} type="text" name="" id="surname" onChange={inputChanged}/></th>
                    </tr>
                    <tr>
                        <th>Tip:</th>
                        <th><input value={type} type="text" name="" id="type"onChange={inputChanged} /></th>
                    </tr>
                    <tr>
                        <th>Grad:</th>
                        <th><input value={city} type="text" name="" id="city" onChange={inputChanged}/></th>
                    </tr>
                    <tr>
                        <th>Adresa:</th>
                        <th><input value={address} type="text" name="" id="address" onChange={inputChanged}/></th>
                    </tr>
                </table>
            </div>
            {addButton}
            <span style={{color:"green"}}>{message}</span>
        </div>
    );
}
