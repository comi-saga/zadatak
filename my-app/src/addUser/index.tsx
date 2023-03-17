import React, { useState } from "react";
import "../index.css";
import { addUserService } from "../service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DefaultButton, Dialog, DialogType, PrimaryButton, Stack, TextField } from "@fluentui/react";

type Props = {
  handleDialog: () => void;
  hideAddDialog: boolean;
  handleCloseAddDialog: () => void;
};

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
      .then(() => {
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

  const inputChanged = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let val: string = (e.target as HTMLInputElement).value;
    switch ((e.target as HTMLInputElement).id) {
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
      name !== "" && address !== "" && surname !== "" && type !== "" && city !== ""
    );
  };

  let addButton;
  if (filledData())
    addButton = <PrimaryButton text="Dodaj korisnika" onClick={addUser} />;
  else addButton = <DefaultButton text="Niste uneli sve podatke" disabled />;

  const addDialogContentProps = {
    type: DialogType.normal,
    title: `Dodaj novog korisnika`,
    closeButtonAriaLabel: "Close",
  };

  return (
    <Dialog
      hidden={props.hideAddDialog}
      onDismiss={props.handleCloseAddDialog}
      dialogContentProps= {addDialogContentProps}
    >
      <Stack>
        <Stack styles={{ root: { marginBottom: 20 } }}>
          <TextField
            label="Ime"
            id="name"
            value={name}
            onChange={inputChanged}
          />
          <TextField
            label="Prezime"
            id="surname"
            value={surname}
            onChange={inputChanged}
          />
          <TextField
            label="Tip"
            id="type"
            value={type}
            onChange={inputChanged}
          />
          <TextField
            label="Grad"
            id="city"
            value={city}
            onChange={inputChanged}
          />
          <TextField
            label="Adresa"
            id="address"
            value={address}
            onChange={inputChanged}
          />
        </Stack>
        {addButton}
      </Stack>
    </Dialog>
  );
};
