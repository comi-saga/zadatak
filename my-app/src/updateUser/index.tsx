import { useState } from "react";
import { useEffect } from "react";
import { User } from "../models/user";
import "../index.css";
import { fetchUserById, updateUserService } from "../service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DefaultButton, PrimaryButton } from "@fluentui/react";

type Props = {
    userId: number,
    handleDialog: ()=> void
}

export const UpdateUser = (props: Props) =>{
    const userId = props.userId;
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
        fetchUserById(userId)
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
        const data = {
            Name: name,
            Surname: surname,
            UserType: type,
            DateCreated: user?.DateCreated,
            City: city,
            Address: address
        }

        updateUserService(userId, data).then(
            response => {
                toast.success("Uspesno ste azurirali korisnika", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000
                });       
                props.handleDialog();
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
            <PrimaryButton text="Azuriraj korisnika" onClick={updateUser}/>
        );
    else if(updatedData() && !filledData())
        updateButton = (
            <DefaultButton text="Niste uneli sve podatke" disabled/>
        );
    else
        updateButton = (
            <DefaultButton text="Niste promenili podatke" disabled/>
        );      

    return (
        <div className="update-User-wrapper">
            <h3>Azuriraj korisnika {name} {surname}</h3>
            <div className="update-user-fields">
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
            {updateButton}
        </div>
    );
}
