import http from "../http-common";

class UserService {
    getAllUsers() {
        return http.get("/users");
    }

    getUserById(id) {
        return http.get(`/users/${id}`);
    }

    getPasswordByUsername(user){
        return http.get(`/users/login/${user}`);
    }

    updateUser(id, user) {
        return http.put(`/users/${id}`, user);
    }

    deleteUser(id) {
        return http.delete(`/users/${id}`);
    }

    getUserByUsername(username) {
        return http.get(`/users/username/${username}`);
    }
}

export default new UserService();
