import React, { useState } from "react";
import { useEffect } from "react";
import { User } from "../models/user";
import "../index.css";
import { fetchUserById, updateUserService } from "../service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DefaultButton,
  PrimaryButton,
  Stack,
  Dialog,
  TextField,
  DialogType,
} from "@fluentui/react";

type Props = {
  userId: number;
  handleDialog: () => void;
  hideUpdateDialog: boolean;
  handleCloseUpdateDialog: () => void;
};

export const UpdateUser = (props: Props) => {
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

  useEffect(() => {
    if(!props.hideUpdateDialog){
      fetchUserById(userId)
      .then((response) => {
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
      .catch((error) => {
        console.log(error);
      });
    }
  }, [props.hideUpdateDialog]);

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

  const updateUser = () => {
    const data = {
      Name: name,
      Surname: surname,
      UserType: type,
      DateCreated: user?.DateCreated,
      City: city,
      Address: address,
    };

    updateUserService(userId, data)
      .then(() => {
        toast.success(`Uspesno ste ažurirali korisnika ${name} ${surname}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        props.handleDialog();
      })
      .catch((error) => console.error(error));
  };

  const updatedData = (): boolean => {
    // da li su podaci promenjeni
    return (
      name !== originalName ||
      address !== originalAddress ||
      surname !== originalSurname ||
      type !== originalType ||
      city !== originalCity
    );
  };

  const filledData = (): boolean => {
    // da li su svi podaci popunjeni
    return (
      name !== "" &&
      address !== "" &&
      surname !== "" &&
      type !== "" &&
      city !== ""
    );
  };

  let updateButton;
  if (updatedData() && filledData())
    updateButton = (
      <PrimaryButton text="Ažuriraj korisnika" onClick={updateUser} />
    );
  else if (updatedData() && !filledData())
    updateButton = <DefaultButton text="Niste uneli sve podatke" disabled />;
  else updateButton = <DefaultButton text="Niste promenili podatke" disabled />;

  const updateDialogContentProps = {
    type: DialogType.normal,
    title: `Ažuriraj korisnika ${user?.Name} ${user?.Surname}`,
    closeButtonAriaLabel: "Close",
  };

  return (
    <Dialog
      hidden={props.hideUpdateDialog}
      onDismiss={props.handleCloseUpdateDialog}
      dialogContentProps={updateDialogContentProps}
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
        {updateButton}
      </Stack>
    </Dialog>
  );
};
