import { useEffect, useState } from "react";
import { User } from "../models/user";
import "../index.css";
import { DateToString, deleteUser, fetchUsers } from "../service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Id } from "react-toastify/dist/types";
import {
  DetailsList,
  CheckboxVisibility,
  SelectionMode,
  DefaultButton,
  Dialog,
  DialogFooter,
  PrimaryButton,
  DialogType,
  SearchBox,
  Dropdown,
  IDropdownOption,
} from "@fluentui/react";
import { AddUser } from "../addUser";
import { UpdateUser } from "../updateUser";

export const AllUsers = () => {
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

  const fetchAllUsers = () => {
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
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

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

  const handleUpdateUser = () => {
    setHideUpdateDialog(true);
    fetchAllUsers();
  };

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
        fetchAllUsers();
        handleCloseDeleteDialog();
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

  const handleAddUser = () => {
    setHideAddDialog(true);
    fetchAllUsers();
  };

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
                  <PrimaryButton
                    text="Azuriraj"
                    onClick={() => handleOpenUpdateDialog(user.id)}
                  />
                  &nbsp;
                  <DefaultButton
                    text="Obrisi"
                    onClick={() => handleOpenDeleteDialog(user.id)}
                  />
                </>
              ),
            },
          ]}
          checkboxVisibility={CheckboxVisibility.hidden}
          selectionMode={SelectionMode.none}
        />
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
            <SearchBox
              placeholder="Filtriraj po imenu"
              styles={{ root: { maxWidth: 250, minWidth: 250 } }}
              onChange={(_, newValue?: string) => setName(newValue!)}
              iconProps={{iconName: 'Filter'}}
            />
            <Dropdown
              placeholder="Filtriraj po tipu korisnika"
              options={allTypes.map((elem: string) => {
                return { key: elem, text: elem };
              })}
              styles={{ dropdown: { width: 250 } }}
              onChange={(_, option?: IDropdownOption) =>
                setType(option?.text ?? "")
              }
            />
          </div>
          <div className="content-filter-action">
            <PrimaryButton
              text="Dodaj novog korisnika"
              onClick={handleOpenAddDialog}
            />
            <Dialog hidden={hideAddDialog} onDismiss={handleCloseAddDialog}>
              <AddUser handleDialog={handleAddUser}></AddUser>
            </Dialog>
            <Dialog
              hidden={hideUpdateDialog}
              onDismiss={handleCloseUpdateDialog}
            >
              <UpdateUser
                userId={selectedUserUpdate}
                handleDialog={handleUpdateUser}
              ></UpdateUser>
            </Dialog>
            <Dialog
              hidden={hideDeleteDialog}
              onDismiss={handleCloseDeleteDialog}
              dialogContentProps={deleteDialogContentProps}
            >
              <DialogFooter>
                <PrimaryButton
                  onClick={handleCloseDeleteDialog}
                  text="Otkazi"
                />
                <DefaultButton onClick={handleDeleteUser} text="Obrisi" />
              </DialogFooter>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="content-table">{imaKorisnika}</div>
      <ToastContainer />
    </>
  );
};
