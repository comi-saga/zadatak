import axios from "axios";
import { User } from "./models/user";

const uri = "http://localhost:3004";

export const fetchUsers = () => axios.get<User[]>(`${uri}/users`);

export const fetchUserById = (userId: number) =>
  axios.get<User>(`${uri}/users/${userId}`);

export const deleteUser = (selectedUser: number) =>
  axios.delete(`${uri}/users/${selectedUser}`);

export const updateUserService = (userId: number, body: {}) =>
  axios.put(`${uri}/users/${userId}`, body);

export const addUserService = (body: {}) => axios.post(`${uri}/users`, body);

export const DateToString = (date: Date) => {
  return (
    (date.getDate() < 10 ? "0" : "") +
    date.getDate() +
    "/" +
    (date.getMonth() < 9 ? "0" : "") +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " " +
    (date.getHours() < 10 ? "0" : "") +
    date.getHours() +
    ":" +
    (date.getMinutes() < 10 ? 0 : "") +
    date.getMinutes() +
    ":" +
    (date.getSeconds() < 10 ? 0 : "") +
    date.getSeconds()
  );
};
