import http from "../http-common";

class ToDoService {
    getAll() {
        return http.get("/todos");
    }

    getById(id) {
        return http.get(`/todos/${id}`);
    }

    getByusername(username){
        return http.get(`/todos/username/${username}`);
    }

    create(todo) {
        return http.post("/todos", {
            todo: todo.todo,
            category: {
                id: todo.category_id
            },
            uname: todo.uname
        });
    }

    update(id, todo) {
        return http.put(`/todos/${id}`, {
            todo: todo.todo,
            category: {
                id: todo.category_id
            },
            uname: todo.uname
        });
    }

    delete(id) {
        return http.delete(`/todos/${id}`);
    }
}

export default new ToDoService();
