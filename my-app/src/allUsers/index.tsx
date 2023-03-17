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
  PrimaryButton,
  SearchBox,
  Dropdown,
  IDropdownOption,
  initializeIcons,
  Stack,
  Text,
  Selection,
} from "@fluentui/react";
import { AddUser } from "../addUser";
import { UpdateUser } from "../updateUser";
import { DeleteUser } from "../views/deleteUser";
import { AddIcon, EditIcon, DeleteIcon } from "@fluentui/react-icons-mdl2";

export const AllUsers = () => {
  initializeIcons();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");

  const [hideDeleteDialog, setHideDeleteDialog] = useState(true);
  const [selectedUserDelete, setSelectedUserDelete] = useState(-1);
  const [toastId, setToastId] = useState<Id>(-1);

  const [hideAddDialog, setHideAddDialog] = useState(true);

  const [hideUpdateDialog, setHideUpdateDialog] = useState(true);
  const [selectedUserUpdate, setSelectedUserUpdate] = useState(-1);

  const [selectedUserFromTable, setSelectedUserFromTable] = useState<
    number | null
  >(null);

  const fetchFilteredUsers = () => {
    fetchUsers()
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
        const filteredUsers = response.data.filter(
          (elem: User) =>
            elem.Name.toLocaleLowerCase().startsWith(
              name.toLocaleLowerCase()
            ) &&
            (!type || elem.UserType === type)
        );
        setAllUsers(filteredUsers);
        if (filteredUsers.length === 0) {
          if (toastId === -1) {
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
  };

  useEffect(() => {
    fetchFilteredUsers();
  }, []);

  const filterData = () => {
    fetchFilteredUsers();
  };

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
    fetchFilteredUsers();
  };

  /* END UPDATE USER DIALOG */

  /* DELETE DIALOG */

  const handleOpenDeleteDialog = (userId: number) => {
    setSelectedUserDelete(userId);
    setHideDeleteDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setHideDeleteDialog(true);
  };

  const handleDeleteUser = () => {
    deleteUser(selectedUserDelete)
      .then((response) => {
        toast.success("Uspesno ste obrisali korisnika", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        fetchFilteredUsers();
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
    fetchFilteredUsers();
  };

  /* END ADD USER DIALOG */

  let selection = new Selection({
    onSelectionChanged: () => {
      if (!selection.getSelection().length) setSelectedUserFromTable(null);
      else setSelectedUserFromTable((selection.getSelection()[0] as User).id);
    },
  });

  const tabela = // HTML tabela korisnika
    (
      <>
        <DetailsList
          items={allUsers}
          columns={[
            {
              key: "Ime",
              name: "Ime",
              minWidth: 20,
              maxWidth: 160,
              onRender: (items: User) => items.Name,
            },
            {
              key: "Prezime",
              name: "Prezime",
              minWidth: 20,
              maxWidth: 160,
              onRender: (items: User) => items.Surname,
            },
            {
              key: "Tip",
              name: "Tip",
              minWidth: 20,
              maxWidth: 160,
              onRender: (items: User) => items.UserType,
            },
            {
              key: "Datum",
              name: "Datum",
              minWidth: 20,
              maxWidth: 160,
              onRender: (item: User) =>
                DateToString(new Date(item.DateCreated)),
            },
            {
              key: "Grad",
              name: "Grad",
              minWidth: 20,
              maxWidth: 160,
              onRender: (items: User) => items.City,
            },
            {
              key: "Adresa",
              name: "Adresa",
              minWidth: 20,
              maxWidth: 160,
              onRender: (items: User) => items.Address,
            },
          ]}
          checkboxVisibility={CheckboxVisibility.onHover}
          selectionMode={SelectionMode.single}
          selection={selection}
        />
      </>
    );

  let imaDugmad;
  if (selectedUserFromTable != null) {
    imaDugmad = (
      <>
        <EditIcon
          onClick={() => handleOpenUpdateDialog(selectedUserFromTable)}
          style={{
            fontSize: 30,
            marginRight: 20,
          }}
        />
        <DeleteIcon
          onClick={() => handleOpenDeleteDialog(selectedUserFromTable)}
          style={{
            fontSize: 30,
            marginRight: 20,
          }}
        />
      </>
    );
  } else imaDugmad = null;

  let imaKorisnika;
  if (allUsers.length) imaKorisnika = tabela;
  else imaKorisnika = null;

  return (
    <>
      <Stack
        grow={1}
        styles={{ root: { padding: 20 } }}
        tokens={{ childrenGap: 20 }}
      >
        <Stack
          grow={1}
          horizontal={true}
          horizontalAlign="space-between"
          verticalAlign="center"
        >
          <Text styles={{ root: { fontSize: 30, fontWeight: 600 } }}>
            Svi korisnici
          </Text>
          <Stack
            horizontal={true}
            verticalAlign="center"
            tokens={{ childrenGap: 10 }}
          >
            <SearchBox
              placeholder="Filtriraj po imenu"
              styles={{ root: { maxWidth: 250, minWidth: 250 } }}
              onChange={(_, newValue?: string) => setName(newValue!)}
              iconProps={{ iconName: "Filter" }}
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
            <DefaultButton text="Filtriraj podatke" onClick={filterData} />
          </Stack>
        </Stack>
        <Stack horizontalAlign="end" horizontal>
          {imaDugmad}
          <AddIcon
            onClick={handleOpenAddDialog}
            style={{
              fontSize: 30,
              marginRight: 20,
            }}
          />
          <AddUser
            handleDialog={handleAddUser}
            hideAddDialog={hideAddDialog}
            handleCloseAddDialog={handleCloseAddDialog}
          />
          <UpdateUser
            userId={selectedUserUpdate}
            handleDialog={handleUpdateUser}
            hideUpdateDialog={hideUpdateDialog}
            handleCloseUpdateDialog={handleCloseUpdateDialog}
          />
          <DeleteUser
            userId={selectedUserDelete}
            hidden={hideDeleteDialog}
            onDismiss={handleCloseDeleteDialog}
            handleOnClose={handleCloseDeleteDialog}
            handleOnDelete={handleDeleteUser}
          />
        </Stack>
      </Stack>
      <Stack tokens={{ padding: 20 }}>{imaKorisnika}</Stack>
      <ToastContainer />
    </>
  );
};
