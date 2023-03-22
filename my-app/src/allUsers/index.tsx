import React, { useEffect, useState } from "react";
import { User } from "../models/user";
import "../index.css";
import { DateToString, fetchUsers } from "../service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DetailsList,
  CheckboxVisibility,
  SelectionMode,
  DefaultButton,
  SearchBox,
  Dropdown,
  IDropdownOption,
  initializeIcons,
  Stack,
  Text,
  Selection,
  TooltipHost,
  DetailsListLayoutMode,
  IColumn,
  PrimaryButton,
} from "@fluentui/react";
import { AddUser } from "../addUser";
import { UpdateUser } from "../updateUser";
import { DeleteUser } from "../views/deleteUser";
import { AddIcon, EditIcon, DeleteIcon } from "@fluentui/react-icons-mdl2";

type SortInfo = {
  columnIndex: number;
  isDescending: boolean;
};

export const AllUsers = () => {
  initializeIcons();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");

  const [hideDeleteDialog, setHideDeleteDialog] = useState(true);
  const [selectedUserDelete, setSelectedUserDelete] = useState(-1);

  const [hideAddDialog, setHideAddDialog] = useState(true);

  const [hideUpdateDialog, setHideUpdateDialog] = useState(true);
  const [selectedUserUpdate, setSelectedUserUpdate] = useState(-1);

  const [selectedUserFromTable, setSelectedUserFromTable] = useState<
    number | null
  >(null);

  const [sortInfo, setSortInfo] = useState<SortInfo>({
    columnIndex: -1,
    isDescending: false,
  });

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

        let filteredUsers: User[];

        if (type && !types.includes(type)) {
          //ako smo obrisali poslednjeg korisnika nekog tipa
          setType("");
          setSelectedUserFromTable(null);
        }

        if (name === "" && (type === "" || (type && !types.includes(type))))
          filteredUsers = response.data;
        else
          filteredUsers = response.data.filter(
            (elem: User) =>
              elem.Name.toLocaleLowerCase().startsWith(
                name.toLocaleLowerCase()
              ) &&
              (!type || elem.UserType === type)
          );

        setAllUsers(filteredUsers);
        if (filteredUsers.length === 0) {
          toast.info("Nema korisnika koji zadovoljavaju kriterijum pretrage", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }

        switch (sortInfo.columnIndex) {
          case 0:
            sortData(filteredUsers, "Ime", sortInfo.isDescending);
            break;
          case 1:
            sortData(filteredUsers, "Prezime", sortInfo.isDescending);
            break;
          case 2:
            sortData(filteredUsers, "Tip", sortInfo.isDescending);
            break;
          case 3:
            sortData(filteredUsers, "Datum", sortInfo.isDescending);
            break;
          case 4:
            sortData(filteredUsers, "Grad", sortInfo.isDescending);
            break;
          case 5:
            sortData(filteredUsers, "Adresa", sortInfo.isDescending);
            break;
          default:
            break;
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

  useEffect(() => {
    if (name === "" && type === "") filterData();
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
    handleCloseUpdateDialog();
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
    handleCloseDeleteDialog();
    fetchFilteredUsers();
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
    handleCloseAddDialog();
    fetchFilteredUsers();
  };

  /* END ADD USER DIALOG */

  let selection = new Selection({
    onSelectionChanged: () => {
      if (!selection.getSelection().length) setSelectedUserFromTable(null);
      else setSelectedUserFromTable((selection.getSelection()[0] as User).id);
    },
  });

  const sortData = (filtered: User[], name: string, descending: boolean) => {
    switch (name) {
      case "Ime":
        setAllUsers(
          [...filtered].sort((a: User, b: User) => {
            return (
              a.Name.toLowerCase().localeCompare(b.Name.toLowerCase(), "en") *
              (descending ? -1 : 1)
            );
          })
        );
        break;
      case "Prezime":
        setAllUsers(
          filtered.sort((a: User, b: User) => {
            return (
              a.Surname.toLowerCase().localeCompare(
                b.Surname.toLowerCase(),
                "en"
              ) * (descending ? -1 : 1)
            );
          })
        );
        break;
      case "Tip":
        setAllUsers(
          filtered.sort((a: User, b: User) => {
            return (
              a.UserType.toLowerCase().localeCompare(
                b.UserType.toLowerCase(),
                "en"
              ) * (descending ? -1 : 1)
            );
          })
        );
        break;
      case "Datum":
        if (!descending)
          setAllUsers(
            filtered.sort((a: User, b: User) => {
              if (
                new Date(a.DateCreated).getTime() >
                new Date(b.DateCreated).getTime()
              )
                return 1;
              else return -1;
            })
          );
        else
          setAllUsers(
            filtered.sort((a: User, b: User) => {
              if (
                new Date(a.DateCreated).getTime() >
                new Date(b.DateCreated).getTime()
              )
                return -1;
              else return 1;
            })
          );
        break;
      case "Grad":
        setAllUsers(
          filtered.sort((a: User, b: User) => {
            return (
              a.City.toLowerCase().localeCompare(b.City.toLowerCase(), "en") *
              (descending ? -1 : 1)
            );
          })
        );
        break;
      case "Adresa":
        setAllUsers(
          filtered.sort((a: User, b: User) => {
            return (
              a.Address.toLowerCase().localeCompare(
                b.Address.toLowerCase(),
                "en"
              ) * (descending ? -1 : 1)
            );
          })
        );
        break;
      default:
        break;
    }
  };

  const onColumnClick = (
    ev: React.MouseEvent<HTMLElement>,
    column: IColumn
  ): void => {
    const reversed: boolean = !sortInfo.isDescending;
    let changed: boolean = false;
    switch (column.name) {
      case "Ime":
        if (sortInfo.columnIndex != 0) {
          setSortInfo({ columnIndex: 0, isDescending: false });
          changed = true;
        } else setSortInfo({ columnIndex: 0, isDescending: reversed });
        break;
      case "Prezime":
        if (sortInfo.columnIndex != 1) {
          setSortInfo({ columnIndex: 1, isDescending: false });
          changed = true;
        } else setSortInfo({ columnIndex: 1, isDescending: reversed });
        break;
      case "Tip":
        if (sortInfo.columnIndex != 2) {
          setSortInfo({ columnIndex: 2, isDescending: false });
          changed = true;
        } else setSortInfo({ columnIndex: 2, isDescending: reversed });
        break;
      case "Datum":
        if (sortInfo.columnIndex != 3) {
          setSortInfo({ columnIndex: 3, isDescending: false });
          changed = true;
        } else setSortInfo({ columnIndex: 3, isDescending: reversed });
        break;
      case "Grad":
        if (sortInfo.columnIndex != 4) {
          setSortInfo({ columnIndex: 4, isDescending: false });
          changed = true;
        } else setSortInfo({ columnIndex: 4, isDescending: reversed });
        break;
      case "Adresa":
        if (sortInfo.columnIndex != 5) {
          setSortInfo({ columnIndex: 5, isDescending: false });
          changed = true;
        } else setSortInfo({ columnIndex: 5, isDescending: reversed });
        break;
      default:
        setSortInfo({ columnIndex: -1, isDescending: false });
        break;
    }
    if (changed) sortData(allUsers, column.name, false);
    else sortData(allUsers, column.name, reversed);
  };

  const tabela = // HTML tabela korisnika
    (
      <>
        <DetailsList
          items={allUsers}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          columns={[
            {
              key: "Ime",
              name: "Ime",
              minWidth: 20,
              flexGrow: 1,
              onRender: (item: User) => item.Name,
              onColumnClick: onColumnClick,
              isSorted: sortInfo.columnIndex === 0 ? true : false,
              isSortedDescending: sortInfo.isDescending === true ? true : false,
            },
            {
              key: "Prezime",
              name: "Prezime",
              minWidth: 20,
              flexGrow: 1,
              onRender: (item: User) => item.Surname,
              onColumnClick: onColumnClick,
              isSorted: sortInfo.columnIndex === 1 ? true : false,
              isSortedDescending: sortInfo.isDescending === true ? true : false,
            },
            {
              key: "Tip",
              name: "Tip",
              minWidth: 20,
              flexGrow: 1,
              onRender: (item: User) => item.UserType,
              onColumnClick: onColumnClick,
              isSorted: sortInfo.columnIndex === 2 ? true : false,
              isSortedDescending: sortInfo.isDescending === true ? true : false,
            },
            {
              key: "Datum",
              name: "Datum",
              minWidth: 20,
              flexGrow: 1,
              onRender: (item: User) =>
                DateToString(new Date(item.DateCreated)),
              onColumnClick: onColumnClick,
              isSorted: sortInfo.columnIndex === 3 ? true : false,
              isSortedDescending: sortInfo.isDescending === true ? true : false,
            },
            {
              key: "Grad",
              name: "Grad",
              minWidth: 20,
              flexGrow: 1,
              onRender: (item: User) => item.City,
              onColumnClick: onColumnClick,
              isSorted: sortInfo.columnIndex === 4 ? true : false,
              isSortedDescending: sortInfo.isDescending === true ? true : false,
            },
            {
              key: "Adresa",
              name: "Adresa",
              minWidth: 20,
              flexGrow: 1,
              onRender: (item: User) => item.Address,
              onColumnClick: onColumnClick,
              isSorted: sortInfo.columnIndex === 5 ? true : false,
              isSortedDescending: sortInfo.isDescending === true ? true : false,
            },
          ]}
          checkboxVisibility={CheckboxVisibility.onHover}
          selectionMode={SelectionMode.single}
          selection={selection}
          selectionPreservedOnEmptyClick={true}
          compact={true}
        />
      </>
    );

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
              value={name}
            />
            <Dropdown
              id="dropdown"
              placeholder="Filtriraj po tipu korisnika"
              options={allTypes.map((elem: string) => {
                return { key: elem, text: elem };
              })}
              styles={{ dropdown: { width: 250 } }}
              onChange={(_, option?: IDropdownOption) =>
                setType(option?.text ?? "")
              }
              selectedKey={type}
            />
            <PrimaryButton
              text="Filtriraj podatke"
              onClick={filterData}
              disabled={name === "" && type === ""}
            />
            <DefaultButton
              text="Resetuj filter"
              onClick={()=>{setType(""); setName("");}}
              disabled={name === "" && type === ""}
            />
          </Stack>
        </Stack>
        <Stack
          horizontalAlign="end"
          horizontal={true}
          tokens={{ childrenGap: 20 }}
        >
          {selectedUserFromTable && (
            <TooltipHost content="Ažuriraj korisnika">
              <EditIcon
                onClick={() => handleOpenUpdateDialog(selectedUserFromTable)}
                style={{
                  fontSize: 20,
                }}
              />
            </TooltipHost>
          )}
          {selectedUserFromTable && (
            <TooltipHost content="Obriši korisnika">
              <DeleteIcon
                onClick={() => handleOpenDeleteDialog(selectedUserFromTable)}
                style={{
                  fontSize: 20,
                }}
              />
            </TooltipHost>
          )}
          <TooltipHost content="Dodaj korisnika">
            <AddIcon
              onClick={handleOpenAddDialog}
              style={{
                fontSize: 20,
              }}
            />
          </TooltipHost>
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
      <Stack tokens={{ padding: 20 }}>
        <Stack.Item align="auto">{imaKorisnika}</Stack.Item>
      </Stack>
      <ToastContainer />
    </>
  );
};
