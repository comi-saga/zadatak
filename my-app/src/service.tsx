import axios from "axios";
import { User } from "./models/user";

const uri = "http://localhost:3004";

export const fetchUsers = () => axios.get<User[]>(`${uri}/users`);

export const fetchUserById = (userId: number) => axios.get<User>(`http://localhost:3004/users/${userId}`)

export const deleteUser = (selectedUser: number) => axios.delete(`http://localhost:3004/users/${selectedUser}`)

export const updateUserService = (userId: number, body: {}) => axios.put(`http://localhost:3004/users/${userId}`, body)

export const addUserService = (body: {}) => axios.post('http://localhost:3004/users',body)

