# BDD & TDD :

- Compréhension générale et partagée du projet
- Lecture simple des features d'un projet, avec exemples :
  - permet d'avoir une living documentation
  - onboarding simplifié
- Les tests doivent être écrits avec le langage du domaine, en testant un comportement (en gros, tester un scernario d'une feature)
  - unitaire = unité de comportement, pas de code
  - ne doivent être modifiés que si la feature sous-jacente change
  - toutes les dépendances doivent être injectées
- La même suite de tests doit pouvoir être lancée avec des dépendances différentes :
  - TDD : stockage en mémoire
  - Intégration : injection des vrais adapters
  - UI On veut à la fois pouvoir lancer les tests avec des adapters en mémoire, ou des "vrais" tests avec les adapters réellement utilisés en prod
- Les tests sont lancés par un test driver qui fait office de mapping entre les actions utilisateurs et les useCases de l'application
- test unit & inté = juste l'instanciation des use cases avec les adapters souhaités
- test UI = startup de l'application avec les adapters souhaités + mapping ui-driver <> actions utilisateurs
- test browser = startup de l'application avec les adapters souhaités + mapping web-driver <> actions utilisateurs

## Méthodologie :

- Feature file (gherkin)
- Implémentation des steps via le test-driver fourni en dépendance
- Implémentation TDD de la feature en calquant les exemples
  - Quid des asserts trop "haut" niveau pour un réel feedback loop ?

## Test Driver :

- divisé en 3 parties ?
  - l'initialisation d'un état voulu de l'application = redondance entre steps et TU ?
  - l'execution de use case = mapping intention utilisateur <> code
  - l'assertion du résultat obtenu = mapping assertion visuelle utilisateur <> code

## Example

- Ajouter un item dans une todo list

  - Given la todolist "todos" contient "acheter du lait", "promener le chien"
  - When l'utilisateur ajoute l'élément "coder !" à la todolist "todos"
  - Alors la todolist "todos" doit contenir "acheter du lait", "promener le chien", "coder !"

- Cette feature sert de documentation des fonctionnalités du projet
- En tant que développeur "back" je veux pouvoir implémenter ce comportement en TDD, sans me soucier des choix techniques (UI, db, etc.)
- En tant que développeur "front" je veux pouvoir implémenter l'ui qui va supporter ce comportement

- Logique de l'UI : pas de logique métier
- TDD UI : test "d'affichage" = read models

```
const AddItem = ({ addItemInTodoList }) => ({ name, targetTodoListName }) => {
  const createAddItem = AddItem({ addItemInTodoList });
  return Object.freeze({
    named(itemName) {
      return createAddItem({ name: itemName, targetTodoListName });
    },
    inTheTodoList(listName) {
      return createAddItem({ name, targetTodoListName: listName });
    },
    execute() {
      return addItemInTodoList({ name, targetTodoListName });
    }
  });
}

const TodoList = ({ saveTodoList }) => ({ name, items }) => {
  const createTodoList = TodoList({ saveTodoList });
  return Object.freeze({
    named(listName) {
      return createTodoList({ name: listName, items });
    },
    containing(itemsInList) {
      return createTodoList({ name, items: itemsInList });
    },
    shouldContain(callback) {
      return callback(items);
    }
    execute() {
      return saveTodoList({ name, items });
    }
  });
};

const World = ({ TodoList, AddItem }) => {
  const CurrentUser = () => ({
    attemptsTo(...tasks) {
      return Promise.all(tasks.map(t => t.execute()));
    }
  });

  return function() {
    this.currentUser = CurrentUser();
    this.TodoList = TodoList;
    this.AddItem = AddItem;
    this.startWith = (...setupTasks) => {
      return Promise.all(setupTasks.map(t => t.execute()));
    }
  }
}

const InMemoryWorld = World({
  TodoList: TodoList({ saveTodoList: saveTodoListInMemory }),
  AddItem: AddItem({ addItemInTodoList: addInItemInTodoListInMemory })
});

const ReactWorld = World({
  TodoList: TodoList({ saveTodoList: saveTodoListInMemory }),
  AddItem: AddItem({ addItemInTodoList: addItemInTodoListFromReact(addInItemInTodoListInMemory) })
})

const addItemInTodoListFromReact = ({ name, targetTodoListName }) => {
  // mount react
  // simulate click on the "add" button next to "targetTodoListName"
  // simulate "enter" with the value
}

Given('la todolist {listName} contient {task1}, {task2}', function(listName, task1, task2) {
  this.startWith(this.TodoList.named(listName).containing(task1, task2));
});

When("l'utilisateur ajoute l'élément {task} à la todolist {listName}", function(task, listName) {
  this.currentUser.attemptsTo(this.AddItem.named(task).inTheTodoList(listName));
});

Then('la todolist {listName} doit contenir {task1}, {task2}, {task3}', function(listName, task1, task2, task3) {
  this.TodoList.named(listName).shouldContain(actualItems => expect(actualItems).toEqual([task1, task2, task3])):
});
```

## Point de vue front !

- En tant que dev front je veux commencer à développer l'interface selon la maquette graphique, je ne veux avoir à m'occuper de détails technique, je veux :
  - pouvoir intégrer l'UI avec de fausses données
  - pouvoir définir les dépendances aux données (read models)
