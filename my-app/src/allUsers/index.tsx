import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../models/user";
import "../index.css";
import { DateToString, deleteUser, fetchUsers } from "../service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Id } from "react-toastify/dist/types";
import {
  DetailsList,
  Dropdown,
  CheckboxVisibility,
  SelectionMode,
  DefaultButton,
  Dialog,
  DialogFooter,
  PrimaryButton,
  DialogType,
} from "@fluentui/react";
import { AddUser } from "../addUser";
import { UpdateUser } from "../updateUser";

export const AllUsers = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");

  const [hideDeleteDialog, setHideDeleteDialog] = useState(true);
  const [selectedUser, setSelectedUser] = useState(-1);
  const [toastId, setToastId] = useState<Id>(-1);

  const [hideAddDialog, setHideAddDialog] = useState(true);

  const [hideUpdateDialog, setHideUpdateDialog] = useState(true);
  const [selectedUserUpdate, setSelectedUserUpdate] = useState(-1);

  useEffect(() => {
    // za dohvatanje korisnika
    fetchUsers()
      .then((response) => {
        setAllUsers(response.data);
        return response;
      })
      .then((response) => {
        const types: string[] = response.data.reduce(
          (prev: string[], curr: User) => {
            if (!prev.includes(curr.UserType)) {
              return prev.concat([curr.UserType]);
            }
            return prev;
          },
          [""]
        );
        setAllTypes(types);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const changeFilterParams = (e: {
    target: { name: string; value: string };
  }) => {
    //menjanje parametara za filter
    switch (e.target.name) {
      case "filterIme":
        setName(e.target.value);
        break;
      case "odabranTip":
        setType(e.target.value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    //za filtriranje
    const timeoutId = setTimeout(() => {
      fetchUsers()
        .then((response) => {
          const filteredUsers = response.data.filter(
            (elem: User) =>
              elem.Name.toLocaleLowerCase().startsWith(
                name.toLocaleLowerCase()
              ) &&
              (!type || elem.UserType == type)
          );
          setAllUsers(filteredUsers);
          if (filteredUsers.length == 0) {
            if (toastId == -1) {
              const newToastId = toast.info(
                "Nema korisnika koji zadovoljavaju kriterijum pretrage",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: false,
                }
              );
              setToastId(newToastId);
            }
          } else {
            toast.dismiss(toastId);
            setToastId(-1);
          }
        })
        .catch((err) => console.log(err));
    }, 400);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [name, type]);

  /* UPDATE USER DIALOG */

  const handleOpenUpdateDialog = (userId: number) => {
    setSelectedUserUpdate(userId);
    setHideUpdateDialog(false);
  };

  const handleCloseUpdateDialog = () => {
    setHideUpdateDialog(true);
  };

  const handleUpdateUser = () =>{
    setHideUpdateDialog(true);
    fetchUsers()
      .then((response) => {
        setAllUsers(response.data);
        return response;
      })
      .then((response) => {
        const types: string[] = response.data.reduce(
          (prev: string[], curr: User) => {
            if (!prev.includes(curr.UserType)) {
              return prev.concat([curr.UserType]);
            }
            return prev;
          },
          [""]
        );
        setAllTypes(types);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* END UPDATE USER DIALOG */

  /* DELETE DIALOG */

  const handleOpenDeleteDialog = (userId: number) => {
    setSelectedUser(userId);
    setHideDeleteDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setHideDeleteDialog(true);
  };

  const deleteDialogContentProps = {
    type: DialogType.normal,
    title: "Obrisi korisnika",
    closeButtonAriaLabel: "Close",
    subText: "Da li ste sigurni da zelite da obrisete korisnika?",
  };

  const handleDeleteUser = () => {
    deleteUser(selectedUser)
      .then((response) => {
        toast.success("Uspesno ste obrisali korisnika", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        fetchUsers().then((response) => {
          setAllUsers(response.data);
          let types: string[] = response.data.reduce(
            (prev: string[], curr: User) => {
              if (!prev.includes(curr.UserType)) {
                return prev.concat([curr.UserType]);
              }
              return prev;
            },
            [""]
          );
          setAllTypes(types);
          setHideDeleteDialog(true);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* END DELETE DIALOG */

  /* ADD USER DIALOG */

  const handleOpenAddDialog = () => {
    setHideAddDialog(false);
  };

  const handleCloseAddDialog = () => {
    setHideAddDialog(true);
  };

  const handleAddUser = () =>{
    setHideAddDialog(true);
    fetchUsers()
      .then((response) => {
        setAllUsers(response.data);
        return response;
      })
      .then((response) => {
        const types: string[] = response.data.reduce(
          (prev: string[], curr: User) => {
            if (!prev.includes(curr.UserType)) {
              return prev.concat([curr.UserType]);
            }
            return prev;
          },
          [""]
        );
        setAllTypes(types);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* END ADD USER DIALOG */

  const tabela = // HTML tabela korisnika
    (
      <>
        <DetailsList
          items={allUsers}
          columns={[
            {
              key: "Ime",
              name: "Ime",
              minWidth: 180,
              maxWidth: 180,
              onRender: (items: User) => items.Name,
            },
            {
              key: "Prezime",
              name: "Prezime",
              minWidth: 180,
              maxWidth: 180,
              onRender: (items: User) => items.Surname,
            },
            {
              key: "Tip",
              name: "Tip",
              minWidth: 180,
              maxWidth: 180,
              onRender: (items: User) => items.UserType,
            },
            {
              key: "Datum",
              name: "Datum",
              minWidth: 180,
              maxWidth: 180,
              onRender: (item: User) =>
                DateToString(new Date(item.DateCreated)),
            },
            {
              key: "Grad",
              name: "Grad",
              minWidth: 180,
              maxWidth: 180,
              onRender: (items: User) => items.City,
            },
            {
              key: "Adresa",
              name: "Adresa",
              minWidth: 180,
              maxWidth: 180,
              onRender: (items: User) => items.Address,
            },
            {
              key: "Akcije",
              name: "Akcije",
              minWidth: 180,
              maxWidth: 180,
              onRender: (user: User) => (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => handleOpenUpdateDialog(user.id)}
                  >
                    Azuriraj
                  </button>{" "}
                  &nbsp;
                  <button
                    className="btn btn-danger"
                    onClick={() => handleOpenDeleteDialog(user.id)}
                  >
                    Obrisi
                  </button>
                </>
              ),
            },
          ]}
          checkboxVisibility={CheckboxVisibility.hidden}
          selectionMode={SelectionMode.none}
        />
        <Dialog
          hidden={hideDeleteDialog}
          onDismiss={handleCloseDeleteDialog}
          dialogContentProps={deleteDialogContentProps}
        >
          <DialogFooter>
            <PrimaryButton onClick={handleCloseDeleteDialog} text="Otkazi" />
            <DefaultButton onClick={handleDeleteUser} text="Obrisi" />
          </DialogFooter>
        </Dialog>
      </>
    );

  let imaKorisnika;
  if (allUsers.length) imaKorisnika = tabela;
  else imaKorisnika = null;

  return (
    <>
      <div className="content-filter">
        <h2>Svi korisnici</h2>
        <div className="content-filter-wrapper">
          <div className="content-filter-fields">
            <span>Filtriraj po imenu:</span>
            <input
              type="text"
              name="filterIme"
              id="filterIme"
              onChange={changeFilterParams}
            />{" "}
            <span>Odaberi tip korisnika:</span>
            <select
              name="odabranTip"
              id="odabranTip"
              onChange={changeFilterParams}
            >
              {allTypes.map((elem, index) => {
                return (
                  <option key={index} value={elem}>
                    {elem}
                  </option>
                );
              })}
            </select>
            {/*
            <Dropdown
              placeholder="Odaberite tip korisnika"
              options={allTypes.map(elem=>{return {
                key: elem,
                text: elem
              }})}
              styles = {{dropdown: { width: 200 }}}
              onChange={(e) => changeFilterParams(e)}
            />
            */}
          </div>
          <div className="content-filter-action">
            <button className="btn btn-success" onClick={handleOpenAddDialog}>
              Dodaj novog korisnika
            </button>
            <Dialog
              hidden={hideAddDialog}
              onDismiss={handleCloseAddDialog}
            >
              <AddUser handleDialog={handleAddUser}></AddUser>
            </Dialog>
             <Dialog
              hidden={hideUpdateDialog}
              onDismiss={handleCloseUpdateDialog}
            >
              <UpdateUser userId={selectedUserUpdate} handleDialog={handleUpdateUser}></UpdateUser>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="content-table">{imaKorisnika}</div>
      <ToastContainer />
    </>
  );
};
