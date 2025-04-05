<template>
  <div>
    <!-- ユーザー名を表示 -->
    <h1>{{ newTodo.uname }}のToDolist</h1>
    <div>
      <!-- ログアウトボタン -->
      <button @click="logout()" class="logout">ログアウト</button>
    </div>
    <!-- カテゴリ選択ドロップダウン -->
    <select v-model="selectedCategory" class="select-category">
      <option value="">全て</option>
      <!-- カテゴリをループして表示 -->
      <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.category }}</option>
    </select>
    <div class="todo-list">
      <!-- ToDoリストを表示 -->
      <ul style="list-style-type: none;">
        <li v-for="todo in filteredTodos" :key="todo.id" :class="{ completed: todo.completed }" class="todo-item">
          <label class="todo-label">
            <!-- 完了済みタスクのチェックボックス -->
            <input type="checkbox" v-model="todo.completed"/>
            <!-- タスク名とカテゴリ名を表示 -->
            <span>{{ todo.todo }} - {{ todo.category.category }}</span>
            <!-- 編集ボタン -->
            <button @click="editTodo(todo)">編集</button>
            <!-- 削除ボタン -->
            <button @click="deleteTodo(todo.id)">削除</button>
          </label>
        </li>
      </ul>
    </div>
    <!-- 新しいToDoを追加するフォーム -->
    <form @submit.prevent="addTodo" v-if="!editingTodo">
      <input v-model="newTodo.todo" placeholder="todo" />
      <select v-model="newTodo.category_id">
        <!-- カテゴリをループして選択肢を表示 -->
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.category }}</option>
      </select>
      <button type="submit">追加</button>
    </form>
    <!-- ToDoを編集するフォーム -->
    <form @submit.prevent="updateTodo" v-else>
      <input v-model="editingTodo.todo" placeholder="edit todo" />
      <select v-model="editingTodo.category_id">
        <!-- カテゴリをループして選択肢を表示 -->
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.category }}</option>
      </select>
      <button type="submit">更新</button>
      <!-- 編集をキャンセルするボタン -->
      <button type="button" @click="cancelEdit" style="margin-left: 10px;">取り消し</button>
    </form>
  </div>
</template>

<script>
import CategoryService from '@/services/CategoryService';
import ToDoService from '@/services/ToDoService';

export default {
  data() {
    return {
      todos: [], // ToDoリストのデータ
      categories: [], // カテゴリのデータ
      newTodo: { // 新しいToDoを追加するためのデータ
        todo: '',
        completed: false,
        category_id: 1,
        uname: this.$route.params.username, // ルートパラメータからユーザー名を取得
      },
      editingTodo: null, // 編集中のToDoデータ
      selectedCategory: '', // 選択されたカテゴリID
    };
  },
  created() {
    // コンポーネントが作成されたときにToDoとカテゴリを取得
    this.fetchTodos();
    this.fetchCategories();
  },
  computed: {
    // 選択されたカテゴリに基づいてToDoリストをフィルタリング
    filteredTodos() {
      if (!this.selectedCategory) {
        return this.todos;
      }
      return this.todos.filter(todo => todo.category.id === this.selectedCategory);
    }
  },
  methods: {
    // サーバーからToDoリストを取得
    async fetchTodos() {
      try {
        if (this.newTodo.uname === undefined) {
          // ユーザー名がない場合はログイン画面にリダイレクト
          this.$router.push({ name: 'login' });
        }
        const response = await ToDoService.getByusername(this.newTodo.uname);
        this.todos = response.data;
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    },
    // サーバーからカテゴリリストを取得
    async fetchCategories() {
      try {
        const response = await CategoryService.getAll();
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    // 新しいToDoを追加
    async addTodo() {
      try {
        const response = await ToDoService.create(this.newTodo);
        this.todos.push(response.data); // リストに追加
        this.newTodo.todo = ''; // 入力フィールドをリセット
        this.newTodo.category_id = 1;
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    },
    // ToDoを削除
    async deleteTodo(id) {
      try {
        await ToDoService.delete(id);
        this.todos = this.todos.filter(todo => todo.id !== id); // リストから削除
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    },
    // 編集モードに切り替え
    editTodo(todo) {
      this.editingTodo = { ...todo, category_id: todo.category.id };
    },
    // ToDoを更新
    async updateTodo() {
      try {
        const response = await ToDoService.update(this.editingTodo.id, this.editingTodo);
        const index = this.todos.findIndex(todo => todo.id === this.editingTodo.id);
        this.todos.splice(index, 1, response.data); // リストを更新
        this.editingTodo = null; // 編集モードを終了
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    },
    // 編集をキャンセル
    cancelEdit() {
      this.editingTodo = null;
    },
    // ログアウトしてログイン画面にリダイレクト
    logout() {
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style>
/* ToDoリストのスタイル */
/* 全体のスタイル */
body {
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

/* 見出しのスタイル */
h1 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

/* ToDoリスト全体のスタイル */
div {
  font-size: 20px;
  color: #333;
}

/* カテゴリ選択のスタイル */
.select-category {
  margin: 0 auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  color: #333;
  font-size: 16px;
  width: 100px;
}

/* ログアウトボタンのスタイル */
.logout {
  font-size: 14px;
  margin: 5px;
  margin-left: 250px;
  background-color: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout:hover {
  background-color: #ff4c4c;
}

/* ToDoリストのスタイル */
.todo-list {
  display: flex;
  justify-content: center;
}

ul {
  padding: 0;
  list-style-type: none;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 完了済みのタスクのスタイル */
.completed span {
  text-decoration: line-through;
  color: #aaa;
}

.todo-label {
  display: flex;
  align-items: center; /* 縦方向の中央揃え */
  justify-content: space-between;
  width: 100%;
}

.todo-label button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  height: 40px; /* ボタンの高さを統一 */
  display: flex;
  align-items: center; /* ボタン内のテキストを中央揃え */
}

.todo-label button:hover {
  background-color: #45a049;
}

.todo-label span {
  flex-grow: 1;
  text-align: left; /* テキストを左揃え */
  margin-right: 10px; /* ボタンとの間隔を調整 */
}

/* 入力フォームのスタイル */
form input,
form select {
  padding: 5px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

form button {
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

form button:hover {
  background-color: #0056b3;
}
</style>
