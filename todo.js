class ToDo {
  constructor(todo) {
    this.id = generateUniqueId();
    this.name = todo.name;
  }
}