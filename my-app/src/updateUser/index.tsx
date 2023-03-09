import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { User } from "../models/user";
import { useNavigate, useParams } from "react-router-dom";
import "../index.css";

export const UpdateUser = () =>{
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState<User>();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [type, setType] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");

    const [originalName, setOriginalName] = useState("");
    const [originalSurname, setOriginalSurname] = useState("");
    const [originalType, setOriginalType] = useState("");
    const [originalCity, setOriginalCity] = useState("");
    const [originalAddress, setOriginalAddress] = useState("");

    useEffect(()=>{
        axios.get(`http://localhost:3004/users/${userId}`)
        .then(response => {
            setUser(response.data);

            setName(response.data.Name);
            setSurname(response.data.Surname);
            setType(response.data.UserType);
            setCity(response.data.City);
            setAddress(response.data.Address);

            setOriginalName(response.data.Name);
            setOriginalSurname(response.data.Surname);
            setOriginalType(response.data.UserType);
            setOriginalCity(response.data.City);
            setOriginalAddress(response.data.Address);
            
        })
        .catch(error => {
            console.log(error);
        });
    },[])

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

    const updateUser = () => {
         if(!name || !surname || !type || !city || !address){
            alert("Niste popunili sva polja");
            return;
        }

        const data = {
            Name: name,
            Surname: surname,
            UserType: type,
            DateCreated: user?.DateCreated,
            City: city,
            Address: address
        }

        axios.put(`http://localhost:3004/users/${userId}`,data).then(
            response => {
                navigate("/");
            }
        ).catch(
            error => console.error(error)
        );
    }

    const updatedData = (): boolean =>{ // da li su podaci promenjeni
        return name != originalName || address != originalAddress || surname != originalSurname || type != originalType || city !=originalCity;
    }

    const filledData = (): boolean =>{ // da li su svi podaci popunjeni
        return name != "" && address != "" && surname != "" && type != "" && city != "";
    }

    let updateButton;
    if(updatedData() && filledData())
        updateButton = (
            <>
            <button className="btn btn-success" onClick={updateUser}>
                Azuriraj korisnika
            </button> <br/>
            </>
        );
    else if(updatedData() && !filledData())
        updateButton = (
            <>
            <button className="btn btn-danger" disabled>
                Niste uneli sve podatke
            </button> <br/>
            </>
        );
    else
        updateButton = (
            <>
            <button className="btn btn-danger" disabled>
                Niste promenili podatke
            </button> <br/>
            </>
        );      

    return (
        <div className="update-User-wrapper">
            <h2>Azuriraj korisnika {name} {surname}</h2>
            <br/> 
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
            </table> <br/>
            {updateButton}
        </div>
    );
}
