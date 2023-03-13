import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../models/user";
import "../index.css";
import DeleteUserModal from "../deleteUserModal";
import { deleteUser, fetchUsers } from "../service";

export const AllUsers = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(-1);
  const [message, setMessage] = useState("");

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
          setAllUsers(
            response.data.filter(
              (elem: User) =>
                elem.Name.toLocaleLowerCase().startsWith(
                  name.toLocaleLowerCase()
                ) &&
                (!type || elem.UserType == type)
            )
          );
        })
        .catch((err) => console.log(err));
    }, 400);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [name, type]);

  const navigateOnUpdateUser = (userId: number) => {
    navigate(`/updateUser/${userId}`);
  };

  const handleOpenDeleteModal = (userId: number) => {
    setSelectedUser(userId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteUser = () => {
    deleteUser(selectedUser)
      .then((response) => {
        setMessage("Uspesno ste obrisali korisnika");
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
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const users = allUsers.map((user: User) => {
    const date: Date = new Date(user.DateCreated);
    return (
      <tr key={user.id}>
        <td>{user.Name}</td>
        <td>{user.Surname}</td>
        <td>{user.UserType}</td>
        <td>
          {date.getDate() < 10 ? 0 : ""}
          {date.getDate()}/{date.getMonth() < 9 ? 0 : ""}
          {date.getMonth() + 1}/{date.getFullYear()} -{" "}
          {date.getHours() < 10 ? 0 : ""}
          {date.getHours()} : {date.getMinutes() < 10 ? 0 : ""}
          {date.getMinutes()} : {date.getSeconds() < 10 ? 0 : ""}
          {date.getSeconds()}
        </td>
        <td>{user.City}</td>
        <td>{user.Address}</td>
        <td>
          <button
            className="btn btn-success"
            onClick={() => navigateOnUpdateUser(user.id)}
          >
            Azuriraj
          </button>{" "}
          &nbsp;
          <button
            className="btn btn-danger"
            onClick={() => handleOpenDeleteModal(user.id)}
          >
            Obrisi
          </button>
        </td>
      </tr>
    );
  });

  const tabela = // HTML tabela korisnika
    (
      <table className="table table-striped table-light">
        <thead className="thead-dark">
          <tr>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Tip</th>
            <th>Datum kreiranja</th>
            <th>Grad</th>
            <th>Adresa</th>
            <th>Azuriraj</th>
          </tr>
        </thead>
        <tbody>{users}</tbody>
        {selectedUser && (
          <DeleteUserModal
            isOpen={showDeleteModal}
            onRequestClose={handleCloseDeleteModal}
            onDelete={handleDeleteUser}
          />
        )}
      </table>
    );

  const navigateOnAddUser = () => {
    navigate("/addUser");
  };

  let imaKorisnika;
  if (allUsers.length) imaKorisnika = tabela;
  else imaKorisnika = "Nema korisnika koji zadovoljavaju kriterijum pretrage";

  let imaPoruke;
  if (message)
    imaPoruke = (
      <>
        <span style={{ color: "green" }}>{message}</span>
        <br /> <br />
      </>
    );
  else imaPoruke = null;

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
          </div>
          <div className="content-filter-action">
            <button className="btn btn-success" onClick={navigateOnAddUser}>
              Dodaj novog korisnika
            </button>
          </div>
        </div>
      </div>
      <div className="content-table">
        {imaPoruke}
        {imaKorisnika}
      </div>
    </>
  );
};
