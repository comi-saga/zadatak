import { useState } from "react";
import "../index.css";
import { addUserService } from "../service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DefaultButton, PrimaryButton } from "@fluentui/react";

type Props = {
  handleDialog: () => void
}

export const AddUser = (props: Props) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const addUser = () => {
    const data = {
      Name: name,
      Surname: surname,
      UserType: type,
      DateCreated: new Date(),
      City: city,
      Address: address,
    };

    addUserService(data)
      .then((response) => {
        setName("");
        setSurname("");
        setAddress("");
        setCity("");
        setType("");
        toast.success("Uspesno ste dodali novog korisnika", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        props.handleDialog();      
      })
      .catch((error) => console.error(error));
  };

  const inputChanged = (e: { target: { value: string; id: any } }) => {
    let val: string = e.target.value;
    switch (e.target.id) {
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
      default:
        break;
    }
  };

  const filledData = (): boolean => {
    // da li su svi podaci popunjeni
    return (
      name != "" && address != "" && surname != "" && type != "" && city != ""
    );
  };

  let addButton;
  if (filledData())
    addButton = (
      <PrimaryButton text="Dodaj korisnika" onClick={addUser}/>
    );
  else
    addButton = (
      <DefaultButton text="Niste uneli sve podatke" disabled/>
    );

  return (
    <div className="add-User-wrapper">
      <h3>Dodaj novog korisnika</h3>
      <div className="add-user-fields">
        <table style={{ margin: "0 auto" }}>
          <tr>
            <th>Ime:</th>
            <th>
              <input
                value={name}
                type="text"
                name=""
                id="name"
                onChange={inputChanged}
              />
            </th>
          </tr>
          <tr>
            <th>Prezime:</th>
            <th>
              <input
                value={surname}
                type="text"
                name=""
                id="surname"
                onChange={inputChanged}
              />
            </th>
          </tr>
          <tr>
            <th>Tip:</th>
            <th>
              <input
                value={type}
                type="text"
                name=""
                id="type"
                onChange={inputChanged}
              />
            </th>
          </tr>
          <tr>
            <th>Grad:</th>
            <th>
              <input
                value={city}
                type="text"
                name=""
                id="city"
                onChange={inputChanged}
              />
            </th>
          </tr>
          <tr>
            <th>Adresa:</th>
            <th>
              <input
                value={address}
                type="text"
                name=""
                id="address"
                onChange={inputChanged}
              />
            </th>
          </tr>
        </table>
      </div>
      {addButton}
    </div>
  );
};
