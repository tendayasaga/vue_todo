<template>
    <div class="login-container">
      <h2>ログイン</h2>
      <form @submit.prevent="login">
        <div>
          <label for="username">ユーザー名</label>
          <input type="text" v-model="username" required />
        </div>
        <div>
          <label for="password">パスワード</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">ログイン</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import UserService from '@/services/UserService';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        error: null,
      };
    },
    methods: {
      async login() {
      try{
        const response = await UserService.getPasswordByUsername(this.username);
        if(this.password === response.data){
          this.$router.push({ name: 'todo', params: { username: this.username } });
        }else{
          this.error = '誤ったログイン情報です。';
        }
      } catch(error){
        console.error('Error fetching login:', error);
        this.error = 'ログインに失敗しました。';
      }
      },
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .login-container label {
    display: block;
    margin-bottom: 5px;
  }
  .login-container input {
    margin-bottom: 10px;
  }
  .login-container button {
    margin-top: 10px;
  }
  .error {
    color: red;
  }
  </style>
  