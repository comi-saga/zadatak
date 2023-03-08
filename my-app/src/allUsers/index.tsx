import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate  } from 'react-router-dom';
import { User } from "../models/user";


export const AllUsers = () =>{
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState<User[]>([]);

    useEffect(() => {
        axios.get('http://localhost:3004/users')
        .then(response => {
            setAllUsers(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    const users = allUsers.map((user: User)=>{
        const date: Date = new Date(user.DateCreated);
        return(
            <tr key={user.id}>
                <td>{user.Name}</td>
                <td>{user.Surname}</td>
                <td>{user.UserType}</td>
                <td>
                    {date.getDate()<10 ? 0 : ''}{date.getDate()}/{date.getMonth()<9 ? 0 : ''}{date.getMonth()+1}/{date.getFullYear()} - {date.getHours()<10 ? 0 : ''}{date.getHours()} : {date.getMinutes()<10 ? 0 : ''}{date.getMinutes()} : {date.getSeconds()<10 ? 0 : ''}{date.getSeconds()}
                </td>
                <td>{user.City}</td>
                <td>{user.Address}</td>
            </tr>
        );
    })

    const tabela = (
        <table className="table table-striped table-light" style={{margin:"0 auto", width:"50%"}}>
            <thead className="thead-dark">
                <tr>
                    <th>Ime</th>
                    <th>Prezime</th>
                    <th>Tip</th>
                    <th>Datum kreiranja</th>
                    <th>Grad</th>
                    <th>Adresa</th>
                </tr>
            </thead>
            <tbody>
                {users}
            </tbody>
        </table>
    );

    const onAddUser = () => {navigate('/addUser');}

    const toAddUser = (
        <button className="btn btn-success" onClick={onAddUser}>
            Dodaj novog korisnika
        </button>
    );

    return (
       <div style={{textAlign:"center"}}>
        <h2>Svi korisnici</h2>
        {allUsers.length && tabela}
        <br/>
        {toAddUser}
       </div>
    );
}